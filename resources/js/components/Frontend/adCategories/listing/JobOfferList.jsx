import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './css/JobOfferList.css';
// Add this CSS (could be in a separate CSS file)


const JobOfferList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(15);

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get(`/job-offers-list?page=${currentPage}`);
        setJobOffers(response.data.data);
        setTotalPages(response.data.last_page);
      } catch (err) {
        console.error('Error fetching job offers:', err);
      }
    };
    
    fetchJobOffers();
  }, [currentPage]);

  useEffect(() => {
    if (jobOffers.length > 0) {
      // Scroll to top smoothly when results are available
      window.scrollTo({
        top: 730,
        behavior: 'smooth'
      });
    }
  }, [jobOffers]);

  useEffect(() => {
    const fetchCategories = async () => {
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      localStorage.removeItem('jobOfferFormState');
      try {
        const response = await axios.get('/job-offer-categories');
        // Ensure data is always an array
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-danger my-5">Error: {error}</div>;
  }


  return (
    <div className="directory-grid">
      
      <section className="sptb">
        <div className="container">
          <div className="container w-85">
            <div className="card mb-4">
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
                    <div className="col-12 text-center">
                      No categories found
                    </div>
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
                    <div key={offer.id} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title">{offer.title}</h5>
                              {offer.is_featured && (
                                <span className="badge me-2">Featured</span>
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
                          {/* {offer.is_featured && (
                            <span className="ms-2 text-warning small">
                              <i className="fas fa-star"></i> Featured
                            </span>
                          )} */}
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
              {/* Pagination Controls */}
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
                    
                    {/* Dynamic page numbers with ellipsis */}
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