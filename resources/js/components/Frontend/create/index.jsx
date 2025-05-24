// PostVerification.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PostVerification.css';

const PostVerification = () => {
    // ... [Keep all the existing state and logic unchanged] ...

    return (
        <div className="verification-container">
            <div className="verification-header">
                <button 
                    className="back-button" 
                    onClick={() => navigate(-1)}
                    aria-label="Go back to posts list"
                >
                    <FaArrowLeft aria-hidden="true" /> 
                    <span className="button-text">Back to List</span>
                </button>
                
                <div className="header-controls">
                    <h1 className="verification-title">Post Verification - #{post.id}</h1>
                    <div className="action-buttons">
                        <button
                            className={`approve-button ${verifying ? 'verifying' : ''}`}
                            onClick={handleVerify}
                            disabled={verifying}
                            aria-label={verifying ? "Approving post" : "Approve post"}
                        >
                            {verifying ? (
                                <>
                                    <FaSpinner className="spinner" aria-hidden="true" />
                                    <span className="button-text">Approving...</span>
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle aria-hidden="true" />
                                    <span className="button-text">Approve Post</span>
                                </>
                            )}
                        </button>

                        <div className="contact-dropdown">
                            <button 
                                className="contact-button"
                                aria-haspopup="true"
                                aria-expanded="false"
                                aria-label="Contact seller options"
                            >
                                <FaCheckCircle aria-hidden="true" />
                                <span className="button-text">Contact Seller</span>
                            </button>
                            <div 
                                className="contact-options" 
                                role="menu"
                                aria-hidden="true"
                            >
                                {post.telNo && (
                                    <a 
                                        href={`tel:${post.telNo}`} 
                                        className="contact-option"
                                        role="menuitem"
                                    >
                                        <FaPhone className="contact-icon" />
                                        <div className="contact-info">
                                            <span className="contact-method">Call:</span>
                                            <span className="contact-value">{post.telNo}</span>
                                        </div>
                                    </a>
                                )}
                                {post.email && (
                                    <a 
                                        href={`mailto:${post.email}`} 
                                        className="contact-option"
                                        role="menuitem"
                                    >
                                        <FaEnvelope className="contact-icon" />
                                        <div className="contact-info">
                                            <span className="contact-method">Email:</span>
                                            <span className="contact-value">{post.email}</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="verification-content">
                <section className="post-details-section" aria-labelledby="post-details-heading">
                    <h2 id="post-details-heading" className="visually-hidden">Post Details</h2>
                    <div className="detail-section">
                        <h3 className="post-title">{post.title}</h3>
                        <div className="detail-grid">
                            {/* Keep existing detail items render */}
                        </div>
                    </div>

                    {post.description && (
                        <section className="description-section" aria-labelledby="description-heading">
                            <h4 id="description-heading">Description</h4>
                            <p className="description-content">{post.description}</p>
                        </section>
                    )}
                </section>

                {renderImageSlider()}
                {renderImageModal()}
            </main>
        </div>
    );
};

export default PostVerification;