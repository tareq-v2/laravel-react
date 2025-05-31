import React, { useState, useEffect } from 'react';
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
  FaLink
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
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
  const [currentOffer, setCurrentOffer] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get(`/job-offers-list?page=${currentPage}`);
        // Add image URLs to each offer
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
    };
    
    fetchJobOffers();
  }, [currentPage]);
  
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

  // Render share modal
  const renderShareModal = () => {
    if (!showShareModal) return null;
    
    return (
      <div className="custom-modal-backdrop">
        <div className="custom-modal">
          <div className="custom-modal-header">
            <h3>Share This Job</h3>
            <button 
              className="close-modal-btn"
              onClick={() => setShowShareModal(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="custom-modal-body">
            <h5>{currentOffer?.title}</h5>
            <div className="share-buttons">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=http://yourdomain.com/job-offers/${currentOffer?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
              >
                <FaFacebook />
                <span>Facebook</span>
              </a>
              <a 
                href={`https://wa.me/?text=Check%20this%20job:%20http://yourdomain.com/job-offers/${currentOffer?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn whatsapp"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a 
                href={`https://www.tiktok.com/share?url=http://yourdomain.com/job-offers/${currentOffer?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn tiktok"
              >
                <SiTiktok />
                <span>TikTok</span>
              </a>
            </div>
            <div className="link-copy">
              <input 
                type="text" 
                value={`http://yourdomain.com/job-offers/${currentOffer?.id}`}
                readOnly
              />
              <button 
                className="copy-btn"
                onClick={copyToClipboard}
              >
                <FaLink />
                <span>Copy</span>
              </button>
            </div>
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

  if (loading) return <div className="text-center my-5">Loading categories...</div>;
  if (error) return <div className="text-center text-danger my-5">Error: {error}</div>;

  return (
    <div className="directory-grid">
      {renderShareModal()}
      
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
                  {jobOffers.length > 0 ? (
                    jobOffers.filter(offer => !offer.is_expired).map(offer => (
                      <div key={offer.id} className="col-12 mb-4">
                        <div className="card h-100">
                          <div className="row g-0">
                            {/* Image Column */}
                            <div className="col-md-4 position-relative">
                              <img 
                                src={offer.imageUrl} 
                                alt={offer.title} 
                                className="img-fluid"
                                style={{ objectFit: 'cover', minHeight: '200px' }}
                              />
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
                                      <span className="badge bg-warning me-2">Featured</span>
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
                </div>
                
                {/* Pagination */}
                <div className="d-flex justify-content-center mt-5">
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