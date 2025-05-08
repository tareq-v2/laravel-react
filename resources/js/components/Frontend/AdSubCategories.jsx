import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/AdSubCategories.css';
import { useTranslation } from './src/hooks/useTranslation';
import AdSubCategoriesListing from './AdSubCategoriesListing';

const AdSubCategories = () => {
  const t = useTranslation();
  const { id } = useParams();
  const [adSubCategories, setAdSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Changed from array to null

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/ad/sub/category/icons/${id}`);
        console.log(response.data.data);
        if (response.data) {
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
          </div>

          <div className="col-md-8">
            <div className='ad-categories'>

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
                        to={`/${subCategory.route}`} 
                        className="subCategory-card card h-100 border-0 shadow-sm text-decoration-none"
                      >
                        <div className="card-body text-center d-flex flex-column justify-content-center p-3">
                          <img
                            src={`http://localhost:8000/uploads/${subCategory.icon}`} // Fixed port to 8001
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
                  <AdSubCategoriesListing subCategoryId={id}/>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-2">
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdSubCategories;