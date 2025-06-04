import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Index.css';

const BlogManagement = () => {
    // ... existing state and ref declarations ...

    // Toast notification function
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

    // ... existing useEffect and fetchBlogs ...

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value);
            }
        });

        try {
            await axios.post(
                editMode ? `/admin/blog/edit/${currentBlog.id}` : '/admin/blog/store', 
                formDataToSend, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await axios.delete(`/admin/blog/delete/${id}`, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
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
            
            {/* ... existing header and blog list code ... */}
            
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
                            {/* ... existing form fields ... */}
                            
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
                                    className="submit-btn tomato-btn"
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