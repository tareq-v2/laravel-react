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
  FaTimes
} from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PostVerification.css';

const PostVerification = () => {
    const { model, id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Slider configuration
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: false
                }
            }
        ]
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/admin/get/un-verified/post/${model}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                setPost(response.data.data);
                setImages(response.data.images || []);
                setError(null);
            } catch (err) {
                setError('Failed to load post details');
                console.error('Fetch post error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [model, id]);

    const handleVerify = async () => {
        setVerifying(true);
        try {
            await axios.post(`/posts/${post.id}/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/home/ads/history', {
                state: { 
                    message: 'Post approved successfully',
                    variant: 'success'
                }
            });
        } catch (err) {
            console.error('Verification error:', err);
            setError('Failed to verify post. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    // Image modal handlers
    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeImageModal = () => setIsModalOpen(false);

    const navigateImage = (direction) => {
        const newIndex = direction === 'next' 
            ? (currentImageIndex + 1) % images.length
            : (currentImageIndex - 1 + images.length) % images.length;
        
        setCurrentImageIndex(newIndex);
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (isModalOpen) {
            if (e.key === 'Escape') closeImageModal();
            if (e.key === 'ArrowLeft') navigateImage('prev');
            if (e.key === 'ArrowRight') navigateImage('next');
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, currentImageIndex]);

    const renderDetailItem = (label, value) => {
        if (!value) return null;
        return (
            <div className="detail-item">
                <span className="label">{label}:</span>
                <span className="value">{value}</span>
            </div>
        );
    };

    const renderImageSlider = () => {
        if (images.length === 0) return null;
        
        return (
            <div className="image-slider-section">
                <h3>Attachments ({images.length})</h3>
                <Slider {...sliderSettings}>
                    {images.map((image, index) => (
                        <div 
                            key={index} 
                            className="slider-item"
                            onClick={() => openImageModal(index)}
                        >
                            <img
                                src={image.url}
                                alt={`Attachment ${index + 1}`}
                                className="post-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                }}
                            />
                            <div className="image-caption">
                                ({index + 1}/{images.length})
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    };

    const renderImageModal = () => {
        if (!isModalOpen || !images.length) return null;
        
        return (
            <div className="image-modal-overlay">
                <div className="image-modal">
                    <button className="modal-close" onClick={closeImageModal}>
                        <FaTimes />
                    </button>
                    
                    <div className="modal-image-container">
                        <img
                            src={images[currentImageIndex].url}
                            alt={`Attachment ${currentImageIndex + 1}`}
                            className="modal-image"
                        />
                        
                        {images.length > 1 && (
                            <>
                                <button 
                                    className="modal-nav prev"
                                    onClick={() => navigateImage('prev')}
                                >
                                    <FaChevronLeft />
                                </button>
                                <button 
                                    className="modal-nav next"
                                    onClick={() => navigateImage('next')}
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                        
                        <div className="image-counter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <FaSpinner className="spinner" />
                <p>Loading post details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-overlay">
                <FaTimesCircle className="error-icon" />
                <p>{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="verification-container">
             <div className="verification-header">
            <button className="back-button" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back to List
            </button>
            
            <div className="header-content">
                <div className="header-right-section">
                    <h1>Post Verification - #{post.id}</h1>
                    <div className="action-buttons">
                        {/* Approve Button */}
                        <button
                            className={`approve-button ${verifying ? 'verifying' : ''}`}
                            onClick={handleVerify}
                            disabled={verifying}
                        >
                            {verifying ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="button-icon" />
                                    Approve Post
                                </>
                            )}
                        </button>

                        {/* Contact Seller Dropdown */}
                        <div className="contact-dropdown">
                            <button className="contact-button">
                                <FaCheckCircle className="button-icon" />
                                Contact Seller
                            </button>
                            <div className="contact-options">
                                {post.telNo && (
                                    <a href={`tel:${post.telNo}`} className="contact-option">
                                        <span className="contact-method">Call:</span>
                                        <span className="contact-value">{post.telNo}</span>
                                    </a>
                                )}
                                {post.email && (
                                    <a href={`mailto:${post.email}`} className="contact-option">
                                        <span className="contact-method">Email:</span>
                                        <span className="contact-value">{post.email}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <div className="verification-content">
                <div className="post-details-section">
                    <div className="detail-section">
                        <h2>{post.title}</h2>
                        <div className="detail-grid">
                            {renderDetailItem('Category', post.category)}
                            {renderDetailItem('Location', post.city)}
                            {renderDetailItem('Salary', post.salary)}
                            {renderDetailItem('Business Name', post.businessName)}
                            {renderDetailItem('Contact Name', post.contactName)}
                            {renderDetailItem('Email', post.email)}
                            {renderDetailItem('Phone', 
                                post.telNo && post.tel_ext 
                                    ? `${post.telNo} (Ext. ${post.tel_ext})`
                                    : post.telNo
                            )}
                        </div>
                    </div>

                    {post.description && (
                        <div className="description-section">
                            <h3>Description</h3>
                            <p className="description-content">{post.description}</p>
                        </div>
                    )}
                </div>

                {renderImageSlider()}
                {renderImageModal()}

                {/* <div className="verification-actions">
                    <button
                        className={`verify-button ${verifying ? 'verifying' : ''}`}
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
                                <FaCheckCircle className="contact-icon" />
                                Approve
                            </>
                        )}
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default PostVerification;