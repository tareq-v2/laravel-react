import { useRef, useState, useEffect } from 'react';
import '../Design/CustomerDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHome, FiCamera, FiFileText, FiUser, FiShoppingBag, FiSettings, FiX, FiEdit, FiLock, FiImage } from 'react-icons/fi';
import JobOfferForm from '../../Frontend/create/JobOfferForm';
import ColorThief from 'colorthief';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    profileImage: null
  });

  const ProfileImage = ({ src }) => {
    const imgRef = useRef(null);
    const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.1)');
  
    useEffect(() => {
      if (imgRef.current && src) {
        const colorThief = new ColorThief();
        
        const updateShadow = () => {
          try {
            const dominantColor = colorThief.getColor(imgRef.current);
            const [r, g, b] = dominantColor;
            setShadowColor(`rgba(${r},${g},${b},0.4)`);
          } catch (error) {
            setShadowColor('rgba(255,99,71,0.4)'); // Fallback to tomato color
          }
        };
  
        if (imgRef.current.complete) {
          updateShadow();
        } else {
          imgRef.current.addEventListener('load', updateShadow);
        }
  
        return () => {
          imgRef.current?.removeEventListener('load', updateShadow);
        };
      }
    }, [src]);
  
    return (
      <img
        ref={imgRef}
        src={src}
        alt="Profile"
        className="profile-image-small"
        style={{ 
          boxShadow: `0 8px 20px ${shadowColor}`,
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      />
    );
  };

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email,
    profileImageFile: userData.avatar_url,   
    profileImage: userData.avatar_url
  });

  const handleProfileChange = (e) => {
    if (e.target.name === 'profileImage') {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      // Update both form state AND user data for immediate UI update
      setProfileForm(prev => ({
        ...prev,
        profileImageFile: file,
        profileImage: imageUrl
      }));
      
      setUserData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
    } else {
      const { name, value } = e.target;
      
      setProfileForm(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Also update userData for immediate UI update
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Store the current blob URL for cleanup
    const tempImageUrl = profileForm.profileImage;
    
    // Show loading state
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('email', profileForm.email);
    
    if (profileForm.profileImageFile instanceof File) {
      formData.append('avatar', profileForm.profileImageFile);
    }

    try {
      const response = await axios.post('/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle different response structures
      const userDataFromResponse = response.data.user || response.data;
      const name = userDataFromResponse.name || profileForm.name;
      const email = userDataFromResponse.email || profileForm.email;
      const avatarUrl = userDataFromResponse.avatar_url || userDataFromResponse.avatarUrl;

      // Create a fresh image URL with cache busting
      const newAvatarUrl = response.data?.avatar_url 
  ? `${response.data.avatar_url}${response.data.avatar_url.includes('?') ? '&' : '?'}ts=${Date.now()}`
  : response.data.avatar_url 
    ? `${response.data.avatar_url}${response.data.avatar_url.includes('?') ? '&' : '?'}ts=${Date.now()}`
    : null;

      // Update both userData and profileForm with the final URL
      setUserData(prev => ({
        ...prev,
        name,
        email,
        profileImage: newAvatarUrl
      }));

      setProfileForm(prev => ({
        ...prev,
        name,
        email,
        profileImageFile: null,
        profileImage: newAvatarUrl
      }));

      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.response?.data?.message || 'Update failed');
      
      // Revert to the blob URL if update fails
      setUserData(prev => ({
        ...prev,
        profileImage: tempImageUrl
      }));
    } finally {
      setIsSaving(false);
      
      // Revoke the blob URL only after new image is set
      if (tempImageUrl && tempImageUrl.startsWith('blob:')) {
        setTimeout(() => {
          URL.revokeObjectURL(tempImageUrl);
        }, 1000); // Give time for new image to load
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };



  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Add cache busting to initial image load
      const avatarUrl = response.data.avatar_url 
        ? `${response.data.avatar_url}?ts=${Date.now()}`
        : null;
      
      setUserData({
        name: response.data.name,
        email: response.data.email,
        joinDate: new Date(response.data.created_at).toLocaleDateString(),
        profileImage: response.data.avatar_url  // Should already be full URL
      });
      
      setProfileForm({
        name: response.data.name,
        email: response.data.email,
        profileImage: avatarUrl
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };
  
  fetchUserData();
}, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/user/posts', {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        console.log(response.data);
        // Ensure we always get an array
        setPosts(response.data?.posts || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'dashboard' || activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  const fetchPostForEditing = async (postId) => {
    try {
      const response = await axios.get(`/user/post/edit/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setEditingPost(response.data.post);
      initializeEditForm(response.data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post details');
    }
  };

  // Initialize edit form with existing data
  const initializeEditForm = (post) => {
    setEditFormData({
      title: post.title,
      city: post.city,
      category: post.category,
      description: post.description,
      businessName: post.businessName,
      address: post.address,
      salary: post.salary,
      name: post.contactName,
      telNo: post.telNo,
      telExt: post.tel_ext,
      altTelNo: post.altTelNo,
      altTelExt: post.alt_tel_ext,
      email: post.email,
      website: post.website,
      keywords: post.keywords,
      featured: post.feature,
      attachments: post.attachments || [],
      postId: post.id
    });
    setIsEditing(true);
  };

    // Handle post update
  const handleUpdatePost = async (formData) => {
    try {
      const payload = new FormData();
      
      // Append updated fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'attachments' && value !== undefined) {
          payload.append(key, value);
        }
      });

      // Handle file updates
      if (formData.attachments) {
        formData.attachments.forEach((file, index) => {
          if (file instanceof File) {
            payload.append(`attachments[${index}]`, file);
          }
        });
      }

      await axios.put(`/user/post/edit/submit/${formData.postId}`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // fetchPosts(); 
      setIsEditing(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post');
    }
  };

  // Edit modal component
  const EditModal = () => {
    if (!isEditing) return null;

    return (
      <div className="edit-modal-overlay">
        <div className="edit-modal-content">
          <div className="modal-header">
            <h3>Edit Post</h3>
            <button onClick={() => setIsEditing(false)}>
              <FiX />
            </button>
          </div>

          <div className="modal-body">
            <JobOfferForm 
              isEditMode={true}
              initialData={editFormData}
              onSubmit={handleUpdatePost}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   return () => {
  //     if (profileForm.profileImage && profileForm.profileImage.startsWith('blob:')) {
  //       URL.revokeObjectURL(profileForm.profileImage);
  //     }
  //   };
  // }, [profileForm.profileImage]);

    // Profile Section JSX
  // const renderProfileInfo = () => (
  // <div className="profile-section">
  //   <div className="profile-header">
  //     <div className="profile-image" onClick={() => isEditingProfile && document.getElementById('avatarInput').click()}>
  //       {userData.profileImage ? (
  //         <img 
  //           src={userData.profileImage} 
  //           alt="Profile" 
  //           className={isEditingProfile ? "editable" : ""}
  //         />
  //       ) : (
  //         <div className="profile-initials">
  //           {userData.name.charAt(0)}
  //         </div>
  //       )}
  //       {isEditingProfile && (
  //         <div className="edit-overlay">
  //           <FiEdit size={20} />
  //           <input
  //             id="avatarInput"
  //             type="file"
  //             name="profileImage"
  //             style={{ display: 'none' }}
  //             onChange={handleProfileChange}
  //             accept="image/*"
  //           />
  //         </div>
  //       )}
  //     </div>
  //     <div className="profile-meta">
  //       <h2>
  //         {isEditingProfile ? (
  //           <input
  //             type="text"
  //             name="name"
  //             value={profileForm.name}
  //             onChange={handleProfileChange}
  //             className="inline-edit"
  //           />
  //         ) : (
  //           userData.name
  //         )}
  //         {!isEditingProfile && (
  //           <button 
  //             className="edit-icon"
  //             onClick={() => setIsEditingProfile(true)}
  //           >
  //             <FiEdit size={16} />
  //           </button>
  //         )}
  //       </h2>
  //       <p>
  //         {isEditingProfile ? (
  //           <input
  //             type="email"
  //             name="email"
  //             value={profileForm.email}
  //             onChange={handleProfileChange}
  //             className="inline-edit"
  //           />
  //         ) : (
  //           userData.email
  //         )}
  //       </p>
  //       <p>Member since {userData.joinDate}</p>
  //     </div>
  //   </div>
    
  //   {isEditingProfile && (
  //     <div className="profile-actions">
  //       <button 
  //         className="tomato-button"
  //         onClick={handleProfileUpdate}
  //       >
  //         Save Changes
  //       </button>
  //       <button 
  //         className="cancel-button"
  //         onClick={() => setIsEditingProfile(false)}
  //       >
  //         Cancel
  //       </button>
  //     </div>
  //   )}
  // </div>
  // );

    const renderProfileInfo = () => (
      <div className="profile-section">
        <div className="profile-header">
          <div 
            className="profile-image-wrapper"
            onClick={() => document.getElementById('avatarInput').click()}
          >
            {userData.profileImage ? (
              <div className="profile-image-container">
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="profile-image"
                />
                <div className="edit-overlay">
                  <FiCamera size={20} />
                </div>
              </div>
            ) : (
              <div className="profile-initials">
                {userData.name.charAt(0)}
                <div className="edit-overlay">
                  <FiCamera size={20} />
                </div>
              </div>
            )}
            <input
              id="avatarInput"
              type="file"
              name="profileImage"
              style={{ display: 'none' }}
              onChange={handleProfileChange}
              accept="image/*"
            />
          </div>
          
          <div className="profile-meta">
            <div className="name-field">
              {isEditingName ? (
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="inline-edit"
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false)
                  }}
                />
              ) : (
                <h2 onClick={() => setIsEditingName(true)}>
                  {userData.name}
                  <FiEdit className="edit-icon" />
                </h2>
              )}
            </div>
            
            <div className="email-field">
              {isEditingEmail ? (
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="inline-edit"
                  autoFocus
                  onBlur={() => setIsEditingEmail(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingEmail(false)
                  }}
                />
              ) : (
                <p onClick={() => setIsEditingEmail(true)}>
                  {userData.email}
                  <FiEdit className="edit-icon" />
                </p>
              )}
            </div>
            
            <p>Member since {userData.joinDate}</p>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="tomato-button"
            onClick={handleProfileUpdate}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );

  // Change Password JSX
  const renderChangePassword = () => (
    <div className="password-section">
      <h2>Change Password</h2>
      <form className="password-form">
        <div className="form-group">
          <label>
            <FiLock /> Old Password
          </label>
          <input 
            type="password" 
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
          />
        </div>
        
        <div className="form-group">
          <label>
            <FiLock /> New Password
          </label>
          <input 
            type="password" 
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FiLock /> Confirm New Password
          </label>
          <input 
            type="password" 
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <button type="submit" className="tomato-button">
          Update Password
        </button>
      </form>
    </div>
  );

  // Edit Profile JSX
  const renderEditProfile = () => (
    <div className="edit-profile-section">
      <h2>Edit Profile</h2>
      <form className="edit-profile-form" onSubmit={handleProfileUpdate}>
        <div className="form-group">
          <label>
            <FiUser /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FiImage /> Profile Picture
          </label>
          <input
            type="file"
            name="profileImage"
            onChange={handleProfileChange}
            accept="image/*"
          />
          {/* {profileForm.profileImage && (
            <div className="image-preview">
              <img src={profileForm.profileImage} alt="Preview" />
            </div>
          )} */}
        </div>

        <div className="form-group">
          <label>
            <FiUser /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={profileForm.email}
            onChange={handleProfileChange}
          />
        </div>

        <button type="submit" className="tomato-button">
          Save Changes
        </button>
      </form>
    </div>
  );

  const renderPostsContent = () => (
      <div className="posts-content">
        <div className="posts-header">
          <h2>Your Recent Posts</h2>
          <Link to="/create-job-offer" className="new-post-button">
            Create New Post
          </Link>
        </div>
        <div className="post-list">
          {posts.length > 0 ? posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-info">
                <h4>{post.title}</h4>
                <span className={`status-badge ${post.is_verified}`}>
                  {post.is_verified == 0 ? 'In Progress' : 'Published'}
                </span>
              </div>
              <div className="post-meta">
                <span className="post-date">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <div className="post-actions">
                  {post.is_verified == 0 && (
                    <button 
                      className="post-action"
                      onClick={() => fetchPostForEditing(post.id)}
                    >
                      <FiEdit /> Edit
                    </button>
                  )}
                  <button className="post-action ml-3">
                    {post.is_verified == 1 ? 'Manage' : 'Preview'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="no-posts">No posts found</div>
          )}
        </div>
        <EditModal />
      </div>
    );

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading posts...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    const processingCount = posts.filter(post => post.is_verified == 0).length;
    const publishedCount = posts.filter(post => post.is_verified == 1).length;

    switch(activeTab) {
      case 'Profile':
        return renderProfileInfo();
      case 'editProfile':
        return renderEditProfile();
      case 'changePassword':
        return renderChangePassword();
      case 'ads':
        return renderPostsContent();
      case 'directory':
        return (
          <div className="dummy-section">
            <h2>Directories</h2>
            <p>Directory management coming soon</p>
            <div className="dummy-box tomato-border"></div>
          </div>
        );
      case 'banner':
        return (
          <div className="dummy-section">
            <h2>Banners</h2>
            <p>Banner management coming soon</p>
            <div className="dummy-box tomato-border"></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
     <div className="profile-summary tomato-border d-flex my-3 position-relative">
        <div 
          className="profile-image-small mr-3"
          onClick={() => document.getElementById('avatarInput').click()}
        >
          {userData.profileImage ? (
            <ProfileImage src={userData.profileImage} />
          ) : (
            <div className="profile-initials-small">
              {userData.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info-small position-absolute">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
        </div>
      </div>
    <div className="dashboard">
      <nav className="tab-nav tomato-nav">

        {/* Keep existing nav buttons with updated styling */}
        <button 
          className={activeTab === 'Profile' ? 'active tomato-button' : ''}
          onClick={() => setActiveTab('Profile')}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </button>
        
        {/* <button 
          className={activeTab === 'editProfile' ? 'active' : ''}
          onClick={() => setActiveTab('editProfile')}
        >
          <FiFileText className="nav-icon" />
          <span>Edit Profile</span>
        </button> */}
        <button 
          className={activeTab === 'changePassword' ? 'active' : ''}
          onClick={() => setActiveTab('changePassword')}
        >
          <FiFileText className="nav-icon" />
          <span>Change Password</span>
        </button>
        <button 
          className={activeTab === 'ads' ? 'active' : ''}
          onClick={() => setActiveTab('ads')}
        >
          <FiShoppingBag className="nav-icon" />
          <span>Ads</span>
        </button>
        <button 
          className={activeTab === 'directory' ? 'active' : ''}
          onClick={() => setActiveTab('directory')}
        >
          <FiShoppingBag className="nav-icon" />
          <span>Directories</span>
        </button>
        <button 
          className={activeTab === 'banner' ? 'active' : ''}
          onClick={() => setActiveTab('banner')}
        >
          <FiShoppingBag className="nav-icon" />
          <span>Banners</span>
        </button>
      </nav>

      <div className="dashboard-main">
        {renderContent()}
      </div>
    </div>
    </>
  );
};

export default Dashboard;