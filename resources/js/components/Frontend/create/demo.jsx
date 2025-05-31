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
  const [banners, setBanners] = useState([]); // For banner slider

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

  // ... existing functions (toggleFavorite, handleShareClick, etc) ...

  // NEW: Banner slider component
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

  // ... rest of the component remains the same ...

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobOfferList;


{jobOffers.length > 0 ? (
  jobOffers.filter(offer => !offer.is_expired).map(offer => (
    <div key={offer.id} className="col-12 mb-4">
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
  ))
) : (
  <div className="col-12 text-center">
    No verified job offers available
  </div>
)}