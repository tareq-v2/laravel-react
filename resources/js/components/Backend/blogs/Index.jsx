import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Index.css';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        description: '',
        image: null
    });
    const [editMode, setEditMode] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [videoThumbnailPreview, setVideoThumbnailPreview] = useState(null);
    const videoThumbnailRef = useRef(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/blogs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

     const handleVideoThumbnailChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, video_thumbnail: file });
        
        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setVideoThumbnailPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append all fields including video_thumbnail
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
            formDataToSend.append(key, value);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const url = editMode ? `/blogs/${currentBlog.id}` : '/blogs';
            const method = editMode ? 'put' : 'post';

            await axios[method](url, formDataToSend, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Content-Type header is automatically set by FormData
            }
            });
            
            fetchBlogs();
            closeModal();
        } catch (error) {
            console.error('Error saving blog:', error);
        }
        };

    const openCreateModal = () => {
  setEditMode(false);
  setCurrentBlog(null);
  setVideoThumbnailPreview(null);
  setFormData({
    title: '',
    category_id: '',
    description: '',
    image: null,
    video_link: '',
    video_thumbnail: null
  });
  setShowModal(true);
    };

    const openEditModal = (blog) => {
        setEditMode(true);
        setCurrentBlog(blog);
        
        // Set existing thumbnail preview if available
        if (blog.video_thumbnail) {
            // Assuming blog.video_thumbnail is a URL string
            setVideoThumbnailPreview(blog.video_thumbnail);
        } else {
            setVideoThumbnailPreview(null);
        }
        
        setFormData({
            title: blog.title,
            category_id: blog.category_id,
            description: blog.description,
            image: null,
            video_link: blog.video_link || '',
            video_thumbnail: null // Reset file input
        });
        
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        // Reset preview when closing modal
        setVideoThumbnailPreview(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    return (
        <div className="blog-management">
            <div className="header">
                <h1 className="title">Blog Management</h1>
                <button 
                    className="create-btn"
                    onClick={openCreateModal}
                >
                    + Create New Blog
                </button>
            </div>

            <div className="blog-list">
                {blogs.length === 0 ? (
                    <div className="empty-state">
                        <p>No blogs found. Create your first blog!</p>
                    </div>
                ) : (
                    blogs.map(blog => (
                        <div key={blog.id} className="blog-card">
                            <div className="blog-info">
                                <h3 className="blog-title">{blog.title}</h3>
                                <p className="blog-desc">{blog.description.substring(0, 100)}...</p>
                            </div>
                            <div className="blog-actions">
                                <button 
                                    className="action-btn edit-btn"
                                    onClick={() => openEditModal(blog)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="action-btn delete-btn"
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        <div className="blog-modal-header">
                            <h2>{editMode ? 'Edit Blog' : 'Create New Blog'}</h2>
                            <button 
                                className="blog-modal-close-btn"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="blog-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="1">Category 1</option>
                                    <option value="2">Category 2</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label>YouTube Video Link</label>
                                <input
                                    type="url"
                                    name="video_link"
                                    value={formData.video_link}
                                    onChange={handleInputChange}
                                    placeholder="https://www.youtube.com/embed/..."
                                />
                                <small>Embed URL (e.g., https://www.youtube.com/embed/video_id)</small>
                            </div>
                            
                            <div className="form-group">
                                <label>Video Thumbnail *</label>
                                <div className="thumbnail-upload">
                                    <input
                                        type="file"
                                        ref={videoThumbnailRef}
                                        onChange={handleVideoThumbnailChange}
                                        accept="image/*"
                                        hidden
                                    />
                                    <button 
                                        type="button"
                                        className="upload-btn"
                                        onClick={() => videoThumbnailRef.current.click()}
                                    >
                                        Choose File
                                    </button>
                                    <span>{formData.video_thumbnail?.name || 'No file chosen'}</span>
                                </div>
                                <small>JPG, PNG or GIF (Max 5MB)</small>
                                
                                { videoThumbnailPreview && (
                                <div className="thumbnail-preview">
                                    <img 
                                    style={{
                                        width: '100px', 
                                        height: '100px', 
                                        borderRadius: '5px', 
                                        objectFit: 'cover', 
                                        border: '1px solid #ddd', 
                                        padding: '5px'
                                    }}
                                    src={videoThumbnailPreview} 
                                    alt="Video thumbnail preview" 
                                    />
                                </div>
                                )}
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="submit-btn"
                                >
                                    {editMode ? 'Update Blog' : 'Create Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;