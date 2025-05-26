import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './css/JobOfferList.css';

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
            {/* Categories card remains same */}

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
                        {/* Job offer card remains same */}
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center">
                      No verified job offers available
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(currentPage - 1)}
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