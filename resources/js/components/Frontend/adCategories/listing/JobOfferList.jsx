import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import './css/JobOfferList.css';
// Add this CSS (could be in a separate CSS file)


const JobOfferList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
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
                <Link to="/create-job-offer" className="btn btn-primary">
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
                              <button className="btn btn-link text-decoration-none p-0 text-primary catSearch">
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
            {/* Add your job listings component here */}
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobOfferList;