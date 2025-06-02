import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaPlus, 
  FaArrowLeft, 
  FaArrowRight, 
  FaHeart, 
  FaRegHeart, 
  FaShareAlt,
  FaTimes,
  FaFacebook,
  FaWhatsapp,
  FaLink,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import './css/JobOfferList.css';

const JobOfferList = () => {
  // Existing states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(15);
  
  // New states for features
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [banners, setBanners] = useState([]);

  const fetchJobOffers = useCallback(async () => {
    try {
      const response = await axios.get(`/job-offers-list?page=${currentPage}`);
      const offersWithImages = response.data.data.map(offer => ({
        ...offer,
        imageUrl: offer.attachments?.length > 0 
          ? `http://localhost:8000/jobOffers/attachments/${offer.attachments[0].image_path}`
          : 'http://localhost:8000/default/defaultLogo.png'
      }));
      
      setJobOffers(offersWithImages);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Error fetching job offers:', err);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchJobOffers();
  }, [fetchJobOffers]);


  // Fetch banners for job list
  const fetchBanners = useCallback(async () => {
    try {
      const response = await axios.get('/banners/spot-6');
      if (response.data.success) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  }, []);

  useEffect(() => {
    fetchJobOffers();
    fetchBanners();
  }, [fetchJobOffers, fetchBanners]);

  useEffect(() => {
    if (jobOffers.length > 0) {
      window.scrollTo({ top: 730, behavior: 'smooth' });
    }
  }, [jobOffers]);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShareClick = (offer) => {
    setCurrentOffer(offer);
    setShowShareModal(true);
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `http://armenianAd.com/job-offers/${currentOffer.id}`
    );
    alert('Link copied to clipboard!');
  };

  // Image gallery functions
  const openImageGallery = (offer, index = 0) => {
    if (offer.attachments?.length > 0) {
      setCurrentOffer(offer);
      setCurrentImageIndex(index);
      setShowImageGallery(true);
    }
  };

  const navigateImage = (direction) => {
    const totalImages = currentOffer.attachments.length;
    let newIndex = currentImageIndex + direction;
    
    if (newIndex < 0) newIndex = totalImages - 1;
    if (newIndex >= totalImages) newIndex = 0;
    
    setCurrentImageIndex(newIndex);
  };

  // banner sliders
  const BannerSlider = () => {
    if (banners.length === 0) return null;
    
    return (
      <div className="col-12 my-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="banner-slider"
        >
          {banners.map(banner => (
            <SwiperSlide key={banner.id}>
              <a 
                href={banner.url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="d-block"
              >
                <img
                  src={`http://localhost:8000/storage/banners/${banner.images}`}
                  alt={`Banner ${banner.id}`}
                  className="img-fluid rounded"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };

  // Render share modal
  const renderShareModal = () => {
    if (!showShareModal) return null;
    
    const shareUrl = `http://armenianAd.com/job-offers/${currentOffer?.id}`;
    const shareText = `Check out this job: ${currentOffer?.title}`;
    
    // Handle click outside modal
    const handleBackdropClick = (e) => {
      if (e.target.classList.contains('custom-modal-backdrop')) {
        setShowShareModal(false);
      }
    };
    
    return (
      <div 
        className="custom-modal-backdrop"
        onClick={handleBackdropClick}
      >
        <div 
          className="custom-modal" 
          style={{ 
            background: '#fff5f3',
            borderRadius: '5px',
            boxShadow: '0 10px 30px rgba(255, 99, 71, 0.3)'
          }}
        >
          <div 
            className="custom-modal-header"
            style={{ 
              background: 'tomato', 
              color: 'white',
              padding: '15px 20px',
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px'
            }}
          >
            <h3 className="mb-0" style={{ fontWeight: 600 }}>Share With Friends</h3>
            <button 
              className="close-modal-btn"
              onClick={() => setShowShareModal(false)}
              style={{ 
                color: 'white',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem'
              }}
            >
              <FaTimes style={{ fontSize: '1.2rem', fontWeight: 200 }} />
            </button>
          </div>
          
          <div 
            className="custom-modal-body" 
            style={{ padding: '25px' }}
          >
            <h5 
              className="text-center mb-4" 
              style={{ 
                color: '#333',
                fontWeight: 600,
                fontSize: '1.25rem'
              }}
            >
              {currentOffer?.title}
            </h5>
            
            <div 
              className="share-buttons-container" 
              style={{ 
                background: 'white', 
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
            >
              <div 
                className="share-buttons" 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                {/* Facebook */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                  style={{ 
                    backgroundColor: '#3b5998',
                    flex: '1',
                    minWidth: '80px'
                  }}
                >
                  <FaFacebook style={{ fontSize: '1.5rem' }} />
                  <span style={{ marginTop: '3px' }}>Facebook</span>
                </a>
                
                {/* WhatsApp */}
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                  style={{ 
                    backgroundColor: '#25d366',
                    flex: '1',
                    minWidth: '80px'
                  }}
                >
                  <FaWhatsapp style={{ fontSize: '1.5rem' }} />
                  <span style={{ marginTop: '3px' }}>WhatsApp</span>
                </a>
                
                {/* Twitter */}
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                  style={{ 
                    backgroundColor: '#1da1f2',
                    flex: '1',
                    minWidth: '80px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span style={{ marginTop: '3px' }}>Twitter</span>
                </a>
                
                {/* Instagram */}
                <a 
                  href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                  style={{ 
                    background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                    flex: '1',
                    minWidth: '80px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span style={{ marginTop: '3px' }}>Instagram</span>
                </a>
                
                {/* TikTok */}
                <a 
                  href={`https://www.tiktok.com/share?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn"
                  style={{ 
                    backgroundColor: '#000000',
                    flex: '1',
                    minWidth: '80px'
                  }}
                >
                  <SiTiktok style={{ fontSize: '1.5rem' }} />
                  <span style={{ marginTop: '3px' }}>TikTok</span>
                </a>
              </div>
            </div>
            
            <div 
              className="link-copy-container mt-4"
              style={{ 
                background: 'white', 
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
            >
              <div className="d-flex align-items-center">
                <input 
                  type="text" 
                  value={shareUrl}
                  readOnly
                  className="w-100"
                  style={{ 
                    border: '1px solid tomato',
                    borderRight: 'none',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    padding: '10px',
                    fontSize: '0.9rem'
                  }}
                />
                <button 
                  className="copy-btn d-flex align-items-center justify-content-center"
                  onClick={copyToClipboard}
                  style={{ 
                    background: 'tomato', 
                    color: 'white',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    border: 'none',
                    padding: '10px 15px',
                    fontWeight: 500,
                    minHeight: '100%',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaLink style={{ marginRight: '5px' }} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render image gallery modal
  const renderImageGallery = () => {
    if (!showImageGallery || !currentOffer?.attachments?.length) return null;
    
    const currentImage = currentOffer.attachments[currentImageIndex];
    const imageUrl = `http://localhost:8000/jobOffers/attachments/${currentImage.image_path}`;
    
    return (
      <div className="image-gallery-backdrop">
        <div className="image-gallery">
          <button 
            className="close-gallery-btn"
            onClick={() => setShowImageGallery(false)}
          >
            <FaTimes />
          </button>
          
          <div className="gallery-content">
            <button 
              className="nav-btn prev-btn"
              onClick={() => navigateImage(-1)}
            >
              <FaChevronLeft />
            </button>
            
            <img 
              src={imageUrl} 
              alt={`${currentOffer.title} - ${currentImageIndex + 1}`}
              className="gallery-image"
            />
            
            <button 
              className="nav-btn next-btn"
              onClick={() => navigateImage(1)}
            >
              <FaChevronRight />
            </button>
          </div>
          
          <div className="image-counter">
            {currentImageIndex + 1} / {currentOffer.attachments.length}
          </div>
        </div>
      </div>
    );
  };

  // Existing category fetching
  useEffect(() => {
    const fetchCategories = async () => {
      localStorage.removeItem('jobOfferFormState');
      try {
        const response = await axios.get('/job-offer-categories');
        setCategories(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Render job offers with banners inserted every 10 posts
  const renderJobOffers = () => {
    const validOffers = jobOffers.filter(offer => !offer.is_expired);
    
    if (validOffers.length === 0) {
      return (
        <div className="col-12 text-center">
          No verified job offers available
        </div>
      );
    }

    // Group offers in chunks of 10
    const chunks = [];
    for (let i = 0; i < validOffers.length; i += 10) {
      chunks.push(validOffers.slice(i, i + 10));
    }

    return chunks.map((chunk, chunkIndex) => (
      <React.Fragment key={`chunk-${chunkIndex}`}>
        {chunk.map(offer => (
          <div key={offer.id} className="col-12 mb-4">
            {/* Job offer card - same as before */}
            <div className="card h-100">
              <div className="row g-0">
                {/* Image Column */}
                <div className="col-md-4 position-relative">
                  <div 
                    className={`image-container ${offer.attachments?.length > 0 ? 'clickable' : ''}`}
                    onClick={() => openImageGallery(offer)}
                  >
                    <img 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="job-image"
                      onError={(e) => {
                        e.target.src = 'http://localhost:8000/default/defaultLogo.png';
                      }}
                    />
                  </div>
                  <div className="position-absolute top-0 end-0 p-2">
                    <button 
                      className="btn btn-sm btn-light rounded-circle me-1"
                      onClick={() => toggleFavorite(offer.id)}
                    >
                      {favorites[offer.id] ? 
                        <FaHeart className="text-danger" /> : 
                        <FaRegHeart />
                      }
                    </button>
                    <button 
                      className="btn btn-sm btn-light rounded-circle mt-2"
                      onClick={() => handleShareClick(offer)}
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title">{offer.title}</h5>
                        {offer.is_featured && (
                          <span className="badge bg-danger me-2">Featured</span>
                        )}
                      </div>
                    </div>
                    <p className="card-text text-muted">{offer.description}</p>
                    <div className="job-meta">
                      <small className="text-muted">
                        Posted: {new Date(offer.created_at).toLocaleDateString()}
                      </small>
                      <small className="text-muted ms-2">
                        Expires: {new Date(offer.expiration_date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <Link 
                      to={`/job-offers/${offer.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Insert banner after each chunk except the last one */}
        {chunkIndex < chunks.length - 1 && <BannerSlider />}
      </React.Fragment>
    ));
  };
  
  if (loading) return <div className="text-center my-5">Loading categories...</div>;
  if (error) return <div className="text-center text-danger my-5">Error: {error}</div>;

  return (
    <div className="directory-grid">
      {renderShareModal()}
      {renderImageGallery()}
      
      <section className="sptb">
        <div className="container">
          <div className="container w-85">
            {/* Categories Card */}
            <div className="card my-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">Categories</h3>
                <Link to="/create-job-offer" className="btn post-btn">
                  <FaPlus className="me-2" />Post Your Ad
                </Link>
              </div>
              
              <div className="card-body">
                <div className="row g-4">
                  {categories.length > 0 ? (
                    categories.map((column, index) => (
                      <div key={index} className="col-md-3 col-6">
                        <ul className="list-unstyled">
                          {column.map(category => (
                            <li key={category.id}>
                              <button className="btn btn-link text-decoration-none p-0 catSearch">
                                <span className="d-inline-block">{category.name}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center">No categories found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Listings Section */}
            <div className="card mt-4">
              <div className="card-header">
                <h3 className="card-title text-center">Current Offers</h3>
              </div>
              <div className="card-body">
                <div className="row post-card-listing">
                  {renderJobOffers()}
                </div>
                
                {/* Pagination */}
                {jobOffers.length > 0 && totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-1">
                    <nav>
                      <ul className="pagination pagination-custom">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="Previous"
                          >
                            <FaArrowLeft />
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Next"
                          >
                            <FaArrowRight />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobOfferList;