import { useState, useEffect } from 'react';
import '../Design/CustomerDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHome, FiFileText, FiUser, FiShoppingBag, FiSettings, FiX, FiEdit } from 'react-icons/fi';
import JobOfferForm from '../../Frontend/create/JobOfferForm';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

      fetchPosts(); // Refresh the posts list
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
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Recent Posts</h3>
                <p>{processingCount} in progress</p>
              </div>
              <div className="stat-card">
                <h3>Active Posts</h3>
                <p>{publishedCount} published</p>
              </div>
              <div className="stat-card">
                <h3>Account Status</h3>
                <p>Verified ✓</p>
              </div>
            </div>
            
            <div className="recent-posts">
              <h3>Recent Posts</h3>
              <div className="post-list">
                {posts.length > 0 ? (
                  posts.map(post => (
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
                        <button className="post-action">View Details</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-posts">No posts found</div>
                )}
              </div>
            </div>
          </div>
        );
      case 'posts':
        return renderPostsContent();
      case 'profile':
        return (
          <div className="profile-content">
            <h2>Profile Settings</h2>
            <form className="profile-form">
              <label>Name:</label>
              <input type="text" defaultValue="John Doe" />
              <label>Email:</label>
              <input type="email" defaultValue="john@example.com" />
              <button type="submit">Update Profile</button>
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="orders-content">
            <h2>Order History</h2>
            <div className="order-list">
              <div className="order-item">
                <p>Order #12345 - $99.99 - Shipped</p>
              </div>
              <div className="order-item">
                <p>Order #12346 - $149.99 - Delivered</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-content">
            <h2>Account Settings</h2>
            <div className="security-settings">
              <button>Change Password</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
       <nav className="tab-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          <FiFileText className="nav-icon" />
          <span>Posts</span>
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser className="nav-icon" />
          <span>Profile</span>
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingBag className="nav-icon" />
          <span>Orders</span>
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings className="nav-icon" />
          <span>Settings</span>
        </button>
      </nav>
      <div className="dashboard-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;