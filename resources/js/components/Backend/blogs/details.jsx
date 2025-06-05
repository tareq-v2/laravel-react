import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Index.css';

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const response = await axios.get(`/blog/${id}`);
                setBlog(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch blog details.');
                setLoading(false);
                console.error('Error fetching blog:', err);
            }
        };

        fetchBlogDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading blog details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <p>{error}</p>
                <button 
                    className="tomato-btn"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="blog-details">
            <div className="action-bar">
                <button 
                    onClick={() => navigate(-1)} 
                    className="back-btn tomato-btn"
                >
                    &larr; Back to Blogs
                </button>
            </div>
            
            <div className="blog-media-section">
                {blog.thumbnail && (
                    <div className="blog-thumbnail">
                        <img 
                            src={`http://localhost:8000/uploads/blogs/thumbnail/${blog.thumbnail}`} 
                            alt={blog.title} 
                            className="main-image"
                        />
                    </div>
                )}
                
                {blog.video_link && (
                    <div className="blog-video">
                        <div className="video-container">
                            <iframe 
                                src={blog.video_link}
                                title={blog.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="blog-content-container">
                <div className="blog-header">
                    <div className="category-date">
                        <span className="blog-category">{blog.category}</span>
                        <span className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="blog-title">{blog.title}</h1>
                </div>
                
                <div className="blog-content">
                    <p>{blog.description}</p>
                    
                    <div className="admin-info-section">
                        <h3>Blog Details</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">ID:</span>
                                <span className="info-value">{blog.id}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Slug:</span>
                                <span className="info-value">{blog.slug}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Created At:</span>
                                <span className="info-value">{new Date(blog.created_at).toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Updated At:</span>
                                <span className="info-value">{new Date(blog.updated_at).toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Video Link:</span>
                                <span className="info-value">
                                    {blog.video_link || <em>Not provided</em>}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="admin-actions">
                    {/* <button 
                        className="tomato-btn"
                        onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                    >
                        Edit Blog
                    </button> */}
                    
                    <button 
                        className="delete-btn"
                        onClick={() => window.confirm('Are you sure?') && navigate(-1)}
                    >
                        Delete Blog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;