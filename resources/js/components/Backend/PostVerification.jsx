// PostVerification.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './PostVerification.css'; // Create this CSS file

const PostVerification = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/admin/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPost(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load post details');
                console.error('Fetch post error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleVerify = async () => {
        setVerifying(true);
        try {
            await axios.post(
                `/posts/${post.id}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            navigate('/admin/posts', {
                state: { message: 'Post approved successfully' }
            });
        } catch (err) {
            console.error('Verification error:', err);
            setError('Failed to verify post');
        } finally {
            setVerifying(false);
        }
    };

    const renderPostDetails = () => {
        if (!post) return null;

        return (
            <div className="post-details">
                <h2>{post.title}</h2>
                <div className="detail-section">
                    <h3>Basic Information</h3>
                    <div className="detail-item">
                        <span className="label">Category:</span>
                        <span className="value">{post.category}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Location:</span>
                        <span className="value">{post.city}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Salary:</span>
                        <span className="value">{post.salary}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Description</h3>
                    <p className="description">{post.description}</p>
                </div>

                <div className="detail-section">
                    <h3>Contact Information</h3>
                    <div className="detail-item">
                        <span className="label">Contact Name:</span>
                        <span className="value">{post.contactName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Email:</span>
                        <span className="value">{post.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Phone:</span>
                        <span className="value">
                            {post.telNo} {post.tel_ext && `Ext. ${post.tel_ext}`}
                        </span>
                    </div>
                </div>

                {post.images?.length > 0 && (
                    <div className="detail-section">
                        <h3>Attachments</h3>
                        <div className="image-grid">
                            {post.images.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img
                                        src={image.url}
                                        alt={`Attachment ${index + 1}`}
                                        className="post-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="post-verification-container">
            <div className="verification-header">
                <h1>Post Verification</h1>
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    Back to List
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    Loading post details...
                </div>
            ) : error ? (
                <div className="error-state">
                    <FaTimesCircle className="error-icon" />
                    {error}
                </div>
            ) : (
                <>
                    {renderPostDetails()}
                    <div className="verification-actions">
                        <button
                            className="verify-button"
                            onClick={handleVerify}
                            disabled={verifying}
                        >
                            {verifying ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="verify-icon" />
                                    Approve Post
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PostVerification;