import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Index.css';

const BlogManagement = () => {
    // ... existing states ...
    const [videoThumbnailPreview, setVideoThumbnailPreview] = useState(null);
    const videoThumbnailRef = useRef(null);

    // ... existing functions ...

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
        setVideoThumbnailPreview(null);
        setFormData({
            title: blog.title,
            category_id: blog.category_id,
            description: blog.description,
            image: null,
            video_link: blog.video_link || '',
            video_thumbnail: null
        });
        setShowModal(true);
    };

    // ... existing return statement ...

    return (
        <div className="blog-management">
            {/* ... existing header and blog list ... */}
            
            {showModal && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        {/* ... existing modal header ... */}
                        
                        <form onSubmit={handleSubmit} className="blog-form">
                            {/* ... existing form fields ... */}
                            
                            {/* New YouTube Video Section */}
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
                                
                                {videoThumbnailPreview && (
                                    <div className="thumbnail-preview">
                                        <img 
                                            src={videoThumbnailPreview} 
                                            alt="Video thumbnail preview" 
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* ... existing form actions ... */}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;