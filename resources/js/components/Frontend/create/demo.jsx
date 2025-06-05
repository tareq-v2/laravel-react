import React, { useState, useEffect, useRef } from 'react';
// ... other imports remain the same ...

const BlogManagement = () => {
    // ... existing states and functions ...

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

    // ... other functions ...

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
            category: '', // Changed from category_id
            description: '',
            thumbnail: null,
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
            category: blog.category, // Changed from category_id
            description: blog.description,
            thumbnail: null,
            video_link: blog.video_link || '',
            video_thumbnail: null,
        });
        
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append all fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value);
            }
        });

        try {
            // Use correct endpoint for update
            const endpoint = editMode 
                ? `/admin/blog/update/${currentBlog.id}` 
                : '/admin/blog/store';
                
            await axios.post(endpoint, formDataToSend, { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                } 
            });
            
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

    // ... return statement ...

    return (
        <div className="blog-management">
            {/* ... existing JSX ... */}
            
            {showModal && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal tomato-theme">
                        {/* ... modal header ... */}
                        
                        <form onSubmit={handleSubmit} className="blog-form">
                            {/* ... title field ... */}
                            
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category" // Changed to category
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="News">News</option>
                                    <option value="Arts & Culture">Arts & Culture</option>
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
                                    {/* Preview logic remains the same */}
                                </div>
                            </div>

                            {/* ... description field ... */}
                            
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
                                <label>Video Thumbnail {formData.video_link ? '*' : ''}</label>
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
                                    {/* Preview logic remains the same */}
                                </div>
                            </div>
                            
                            {/* ... form actions ... */}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;