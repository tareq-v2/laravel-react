import { useState, useEffect } from 'react';
import '../Design/CustomerDashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHome, FiFileText, FiUser, FiShoppingBag, FiSettings, FiEdit, FiX } from 'react-icons/fi';
import JobOfferForm from './JobOfferForm'; // Import your existing form component

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch posts with extended data
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/user/posts', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
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

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  // Fetch single post data for editing
  const fetchPostForEditing = async (postId) => {
    try {
      const response = await axios.get(`/user/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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

      await axios.put(`/user/posts/${formData.postId}`, payload, {
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

  // Modified posts content with edit functionality
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
                <button className="post-action">
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

  // Update the switch statement
  const renderContent = () => {
    // ... keep existing loading/error checks ...

    switch(activeTab) {
      case 'posts':
        return renderPostsContent();
      // ... keep other cases the same ...
    }
  };

  return (
    <div className="dashboard">
      {/* Keep existing nav and main content */}
      {renderContent()}
    </div>
  );
};

export default Dashboard;