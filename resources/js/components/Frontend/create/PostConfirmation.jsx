import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostConfirmation.css';

const PostConfirmation = () => {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(post_id);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/job-offers/${post_id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [post_id]);

  return (
    <div className="confirmation-container">
      {/* Success Header */}
      <div className="confirmation-header">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24">
            <path fill="#198754" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h1 className="confirmation-title">Payment Successful!</h1>
        <p className="confirmation-subtitle">Thank you for submitting your post</p>
      </div>

      {/* Content Container */}
      <div className="confirmation-content">
        {/* Status Card */}
        <div className="status-card">
          <div className="status-header">
            <svg width="24" height="24" viewBox="0 0 24 24" className="status-icon">
              <path fill="#ffc107" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24.21-.34.1-.79-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72z"/>
            </svg>
            <h3>Post Status</h3>
          </div>
          <div className="status-alert">
            <p className="status-title">Your post is under review</p>
            <p className="status-description">
              We're verifying your submission. This usually takes 10-15 minutes.
              You'll receive a confirmation email once approved.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading post details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-alert">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="confirmation-footer">
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="home-icon">
            <path fill="#fff" d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm-2 15v-5h4v5h-4z"/>
          </svg>
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default PostConfirmation;