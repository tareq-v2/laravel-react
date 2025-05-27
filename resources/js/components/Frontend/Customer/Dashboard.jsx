import { useRef, useState, useEffect } from 'react';
import '../Design/CustomerDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHome, FiFileText, FiUser, FiShoppingBag, FiSettings, FiX, FiEdit, FiLock, FiImage } from 'react-icons/fi';
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
   const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: 'January 2023',
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
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: null
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e) => {
    if (e.target.name === 'profileImage') {
      setProfileForm({
        ...profileForm,
        profileImage: URL.createObjectURL(e.target.files[0])
      });
    } else {
      setProfileForm({
        ...profileForm,
        [e.target.name]: e.target.value
      });
    }
  };

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

    // Profile Section JSX
  const renderProfileInfo = () => (
    <div className="profile-section">
      <div className="profile-header">
        <div className="profile-image">
          {profileForm.profileImage ? (
            <img src={profileForm.profileImage} alt="Profile" />
          ) : (
            <div className="profile-initials">
              {userData.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-meta">
          <h2>{userData.name}</h2>
          <p>Member since {userData.joinDate}</p>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-item">
          <label>Full Name:</label>
          <p>{userData.name}</p>
        </div>
        <div className="detail-item">
          <label>Email Address:</label>
          <p>{userData.email}</p>
        </div>
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
      <form className="edit-profile-form">
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
    <div className="profile-summary tomato-border d-flex my-3 positon-relative">
          <div className="profile-image-small mr-3">
            {profileForm.profileImage ? (
              <ProfileImage src={profileForm.profileImage} />
            ) : (
              <div className="profile-initials-small">
                {/* {userData.name.charAt(0)} */}
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
          className={activeTab === 'profile' ? 'active tomato-button' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </button>
        
        <button 
          className={activeTab === 'editProfile' ? 'active' : ''}
          onClick={() => setActiveTab('editProfile')}
        >
          <FiFileText className="nav-icon" />
          <span>Edit Profile</span>
        </button>
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