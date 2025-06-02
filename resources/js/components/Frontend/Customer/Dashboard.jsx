import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiHome, FiCheck, FiCamera, FiFileText, 
  FiUser, FiShoppingBag, FiSettings, FiX, 
  FiEdit, FiLock, FiImage, FiEye, FiEyeOff 
} from 'react-icons/fi';
import '../Design/CustomerDashboard.css';
import ProfileSection from '../Customer/dashboard/ProfileSection';
import PasswordSection from '../Customer/dashboard/PasswordSection';
import AdsSection from '../Customer/dashboard/AdsSection';
import DirectoriesSection from '../Customer/dashboard/DirectoriesSection';
import BannersSection from '../Customer/dashboard/BannersSection';
import ProfileImage from '../Customer/dashboard/ProfileImage';
// import savePasswordAnimation from './savePasswordSuccess.json';

const Dashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('ads');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    profileImage: null
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    profileImage: null
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/profile');
        const avatarUrl = response.data.avatar_url 
          ? `${response.data.avatar_url}?ts=${Date.now()}`
          : null;
        
        setUserData({
          name: response.data.name,
          email: response.data.email,
          joinDate: new Date(response.data.created_at).toLocaleDateString(),
          profileImage: response.data.avatar_url
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

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (activeTab !== 'ads') return;
      
      try {
        const response = await axios.get('/user/posts');
        setPosts(response.data?.posts || []);
        // console.log(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [activeTab]);

  // Profile handlers
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

  // Password handlers
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordChangeError('');
    
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }
    
    try {
      const response = await axios.post('/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        newPassword_confirmation: passwordForm.confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setPasswordChangeSuccess(true);
        // Reset form
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setPasswordChangeSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordChangeError(
        error.response?.data?.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setIsChangingPassword(false);
    }
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

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Profile':
        return (
          <ProfileSection
            userData={userData}
            profileForm={profileForm}
            handleProfileChange={handleProfileChange}
            handleProfileUpdate={handleProfileUpdate}
            isSaving={isSaving}
          />
        );
      case 'changePassword':
        return (
          <PasswordSection
            passwordForm={passwordForm}
            passwordChangeError={passwordChangeError}
            passwordChangeSuccess={passwordChangeSuccess}
            isChangingPassword={isChangingPassword}
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
          />
        );
      case 'ads':
        return (
          <AdsSection
            posts={posts}
            loading={loading}
            error={error}
            fetchPostForEditing={fetchPostForEditing}
            handleUpdatePost={handleUpdatePost}
          />
        );
      case 'directory':
        return <DirectoriesSection />;
      case 'banner':
        return <BannersSection />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="profile-summary d-flex my-3 position-relative">
        <div 
          className="profile-image-small mr-3"
          onClick={() => document.getElementById('avatarInput').click()}
        >
          {userData.profileImage ? (
            <ProfileImage src={userData.profileImage} />
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
          {/* ... navigation tabs ... */}
          <button 
            className={activeTab === 'Profile' ? 'active' : ''}
            onClick={() => setActiveTab('Profile')}
          >
            <FiUser className="nav-icon" />
            <span>Profile</span>
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