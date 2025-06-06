import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Index.css';

const BlogManagement = () => {
    const navigate = useNavigate();
    const showToast = (message, type = 'success') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        image: null
    });
    const [editMode, setEditMode] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [videoThumbnailPreview, setVideoThumbnailPreview] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [existingThumbnail, setExistingThumbnail] = useState(null);
    const [existingVideoThumbnail, setExistingVideoThumbnail] = useState(null);
    const [newThumbnailSelected, setNewThumbnailSelected] = useState(false);
    const [newVideoThumbnailSelected, setNewVideoThumbnailSelected] = useState(false);
    const videoThumbnailRef = useRef(null);
    const thumbnailRef = useRef(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/admin/blogs', {
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
        setNewVideoThumbnailSelected(true);
        
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

    const handlethumbnailChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, thumbnail: file });
        setNewThumbnailSelected(true);
        
        // Create preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(null);
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
            await axios.post(editMode ? `/admin/blog/edit/${currentBlog.id}` : '/admin/blog/store', formDataToSend, { headers: { Authorization: `Bearer ${token}` } });
            showToast(
                editMode 
                    ? 'Blog updated successfully!' 
                    : 'Blog created successfully!'
            );
            fetchBlogs();
            closeModal();
        } catch (error) {
            console.error('Error saving blog:', error);
            showToast('Failed to save blog', 'error');
        }
    };

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentBlog(null);
        setVideoThumbnailPreview(null);
        setThumbnailPreview(null);
        setExistingThumbnail(null);
        setExistingVideoThumbnail(null);
        setNewThumbnailSelected(false);
        setNewVideoThumbnailSelected(false);
        setFormData({
            title: '',
            category: '',
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
        setNewThumbnailSelected(false);
        setNewVideoThumbnailSelected(false);
        
        // Store existing URLs
        if (blog.thumbnail) {
            setExistingThumbnail(`http://localhost:8000/uploads/blogs/thumbnail/${blog.thumbnail}`);
        }
        
        if (blog.video_thumbnail) {
            setExistingVideoThumbnail(`http://localhost:8000/uploads/blogs/video_thumbnail/${blog.video_thumbnail}`);
        }
        
        setFormData({
            title: blog.title,
            category: blog.category,
            description: blog.description,
            image: null,
            video_link: blog.video_link || '',
            video_thumbnail: null,
            thumbnail: null,
        });
        
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        // Reset preview when closing modal
        setVideoThumbnailPreview(null);
        setThumbnailPreview(null);
        setExistingThumbnail(null);
        setExistingVideoThumbnail(null);
        setNewThumbnailSelected(false);
        setNewVideoThumbnailSelected(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await axios.delete(`/admin/blog/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                showToast('Blog deleted successfully!');
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error);
                showToast('Failed to delete blog', 'error');
            }
        }
    };

    return (
        <div className="blog-management">
            <ToastContainer />
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
                                {/* Add View button */}
                                <button 
                                    className="action-btn view-btn"
                                    onClick={() => navigate(`/home/blog/${blog.id}`)}
                                >
                                    View
                                </button>
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
                    <div className="blog-modal tomato-theme">
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
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="News">News</option>
                                    <option value="News & Culture">Arts & Culture</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Thumbnail *</label>
                                <div className="thumbnail-upload">
                                    <input
                                        type="file"
                                        ref={thumbnailRef}
                                        onChange={handlethumbnailChange}
                                        accept="image/*"
                                        hidden
                                    />
                                    <button 
                                        type="button"
                                        className="upload-btn"
                                        onClick={() => thumbnailRef.current.click()}
                                    >
                                        Choose File
                                    </button>
                                    <span>{formData.thumbnail?.name || 'No file chosen'}</span>
                                </div>
                                <small>JPG, PNG or GIF (Max 5MB)</small>
                                
                                <div className="thumbnail-preview">
                                    {thumbnailPreview ? (
                                        <img 
                                            style={{
                                                width: '100px', 
                                                height: '100px', 
                                                borderRadius: '5px', 
                                                objectFit: 'cover', 
                                                border: '1px solid #ddd', 
                                                padding: '5px'
                                            }}
                                            src={thumbnailPreview} 
                                            alt="Thumbnail preview" 
                                        />
                                    ) : (
                                        editMode && existingThumbnail && !newThumbnailSelected && (
                                            <img 
                                                style={{
                                                    width: '100px', 
                                                    height: '100px', 
                                                    borderRadius: '5px', 
                                                    objectFit: 'cover', 
                                                    border: '1px solid #ddd', 
                                                    padding: '5px'
                                                }}
                                                src={existingThumbnail} 
                                                alt="Existing thumbnail" 
                                            />
                                        )
                                    )}
                                </div>
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
                                <label>Video Thumbnail</label>
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
                                
                                <div className="thumbnail-preview">
                                    {videoThumbnailPreview ? (
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
                                    ) : (
                                        editMode && existingVideoThumbnail && !newVideoThumbnailSelected && (
                                            <img 
                                                style={{
                                                    width: '100px', 
                                                    height: '100px', 
                                                    borderRadius: '5px', 
                                                    objectFit: 'cover', 
                                                    border: '1px solid #ddd', 
                                                    padding: '5px'
                                                }}
                                                src={existingVideoThumbnail} 
                                                alt="Existing video thumbnail" 
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                    type="button"
                                    className="cancel-btn tomato-btn"
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