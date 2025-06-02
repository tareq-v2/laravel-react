import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye } from 'react-icons/fi';
import EditModal from './EditModal';

const AdsSection = ({ 
  posts, 
  loading, 
  error,
  fetchPostForEditing,
  handleUpdatePost
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

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

  return (
    <div className="posts-content">
      {/* Header with create button on right side */}
      <div className="posts-header d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Your Recent Posts</h2>
        <Link to="/create-job-offer" className="tomato-button">
          Create New Post
        </Link>
      </div>
      
      {/* Post listing */}
      <div className="post-list">
        {loading ? (
          <div className="loading-posts">Loading posts...</div>
        ) : error ? (
          <div className="error alert alert-danger">{error}</div>
        ) : posts.length > 0 ? posts.map(post => (
          <div key={post.id} className="post-item rounded p-3 mb-3">
            <div className="post-info d-flex justify-content-between align-items-center mb-2">
              <h4 className="m-0">{post.title}</h4>
              <span className={`status-badge ${post.is_verified ? 'published' : 'in-progress'}`}>
                {post.is_verified ? 'Published' : 'In Progress'}
              </span>
            </div>
            
            <div className="post-meta d-flex justify-content-between align-items-center">
              <span className="post-date text-muted">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              
              <div className="post-actions d-flex">
                {post.is_verified && (
                  <button 
                    className="tomato-button-outline mr-2"
                    onClick={() => {
                      setEditingPost(post);
                      initializeEditForm(post);
                    }}
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                )}
                
                <button
                  className={`tomato-button ${post.is_verified ? '' : 'preview-button'}`}
                >
                  <FiEye className="mr-1" />
                  {post.is_verified ? 'Manage' : 'Preview'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="no-posts alert alert-info">No posts found</div>
        )}
      </div>
      
      {/* Edit Modal */}
      <EditModal 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingPost={editingPost}
        editFormData={editFormData}
        handleUpdatePost={handleUpdatePost}
      />
    </div>
  );
};

export default AdsSection;