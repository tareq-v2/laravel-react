import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/AdSubCategories.css';
import { useTranslation } from './src/hooks/useTranslation';

const AdSubCategories = () => {
  const t = useTranslation();
  const [adSubCategories, setAdSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Changed from array to null

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ad/sub/category/icons');
        
        if (response.data?.data) {
          setAdSubCategories(response.data.data);
        } else {
          throw new Error('Invalid data structure');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, []);

  return (
    <div className="container">
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-2">
            <div className="side-banner">
              <img src="http://localhost:8001/uploads/banner/side-banner.png" alt="Left banner" />
            </div>
          </div>

          <div className="col-md-8">
            <div className='ad-categories'>
              <div className="section-header d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <div className="text-center">
                  <h1 className="mb-3">{t('Classified Ads')}</h1>
                  <p className="lead">{t('Select Category To View Listings')}</p>
                </div>
                <div>
                  <Link to="/post-ad" className="btn btn-primary">
                    <i className="fa fa-plus me-2"></i>
                    {t('Post Your Ad')}
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">{error}</div>
              ) : adSubCategories.length > 0 ? (
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                  {adSubCategories.map((subCategory) => (
                    <div key={subCategory.id} className="col">
                      <Link 
                        to={`/ad/categories/${subCategory.id}`} 
                        className="subCategory-card card h-100 border-0 shadow-sm text-decoration-none"
                      >
                        <div className="card-body text-center d-flex flex-column justify-content-center p-3">
                          <img
                            src={`http://localhost:8001/uploads/${subCategory.icon}`} // Fixed port to 8001
                            alt={subCategory.name}
                            className="img-fluid mb-3 mx-auto"
                            style={{ maxWidth: '80px', height: '80px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = '/default-icon.png';
                            }}
                          />
                          <h6 className="mb-0 text-dark fw-semibold">
                            {subCategory.name || 'Unnamed Category'}
                          </h6>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted">No subcategories found</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-2">
            <div className="side-banner">
              <img src="http://localhost:8001/uploads/banner/side-banner1.png" alt="Right banner" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdSubCategories;