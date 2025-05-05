import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/MainContent.css'; // Assuming you have a CSS file for styling

// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MainContent = () => {
  const [adCategories, setAdCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch categories from Laravel backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('category/icons');
        
        setAdCategories(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const sections = {
    directoryCategories: [
      { id: 1, name: 'Automotive', icon: '/icons/automotive.png' },
      { id: 2, name: 'Beauty & Salon', icon: '/icons/beauty.png' },
      // Add more categories
    ],
    news: [
      { 
        id: 1, 
        title: 'Latest Industry News', 
        date: 'March 18, 2025',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
      },
      { 
        id: 2, 
        title: 'Latest Industry News', 
        date: 'March 18, 2025',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
      },
      { 
        id: 3, 
        title: 'Latest Industry News', 
        date: 'March 18, 2025',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
      },
      { 
        id: 4, 
        title: 'Latest Industry News', 
        date: 'March 18, 2025',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
      },
      // Add more news
    ],
    businesses: [
      {
        id: 1,
        name: 'Premium Business',
        address: '123 Main St, Yerevan',
        logo: '/businesses/logo1.png',
        description: 'Lorem ipsum dolor sit amet consectetur...'
      },
      // Add more businesses
    ]
  };

  return (
    
    <div className="container">
      {/* Ad Categories Section */}
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-2">
            <div className="side-banner">
              <img src="http://localhost:8001/uploads/banner/side-banner.png" alt="Left banner" />
            </div>
          </div>
          
          <div className="col-md-8">
            <div className='ad-categories'>
            <div className="section-header">
              <div>
                 {/* Empthy */}
              </div>
              <div>
                <h1>Classified Ads</h1>
                <p>Select Category To View Listings</p>
              </div>
              <div>
              <Link to="/post-ad" className="btn btn-primary">
                <i className="fa fa-plus me-2"></i>Post Your Ad
              </Link>
              </div>
            </div>
            
            {loading ? (
                <div className="text-center">Loading categories...</div>
              ) : error ? (
                <div className="text-center text-danger">Error: {error}</div>
              ) : (
                <div className="category-grid">
                  {adCategories.map(category => (
                    <div key={category.id} className="category-card">
                      <img 
                        src={`${category.icon}`} 
                        alt={category.name} 
                        onError={(e) => {
                          e.target.src = 'fallback-icon.png'; // Add fallback image
                        }}
                      />
                      <h4>{category.name}</h4>
                    </div>
                  ))}
                </div>
              )}
            {/* <div className="category-grid">
              {sections.adCategories.map(category => (
                <div key={category.id} className="category-card">
                  <img src={category.icon} alt={category.name} />
                  <h4>{category.name}</h4>
                  <span className="badge">{category.count}+</span>
                </div>
              ))}
            </div> */}
            </div>
          </div>

          <div className="col-md-2">
            <div className="side-banner">
              <img src="http://localhost:8001/uploads/banner/side-banner1.png" alt="Right banner" />
            </div>
          </div>
        </div>
      </section>

      {/* Directory Categories Section */}
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-2">
            {/* Side banners similar to ad categories */}
          </div>
          
          <div className="col-md-8">
            <div className="section-header">
              <h1>Business Directory</h1>
              <p>Select Category To View Listings</p>
              <Link to="/add-business" className="btn btn-primary">
                <i className="fa fa-plus me-2"></i>Add Your Business
              </Link>
            </div>
            
            <div className="directory-grid">
              {sections.directoryCategories.map(category => (
                <div key={category.id} className="directory-card">
                  <img src={category.icon} alt={category.name} />
                  <h4>{category.name}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-2">
            {/* Side banners similar to ad categories */}
          </div>
        </div>
      </section>


      {/* News Section */}
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-3">
            <div className="news-banner">
              <img src="/banners/news-left.jpg" alt="News banner" />
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="section-header">
                <h1>Latest News</h1>
            </div>
            <Swiper
                className="news-carousel"
                spaceBetween={10}
                slidesPerView={2}  // Show 2 slides at once
                navigation={true}  // Enable arrow navigation
                pagination={{ clickable: true }}  // Enable dots pagination
                autoplay={{ delay: 3000 }}  // Auto-slide every 3 seconds
                modules={[Navigation, Pagination, Autoplay]}  // Load modules
                breakpoints={{
                // Responsive breakpoints
                320: { slidesPerView: 1 },  // 1 slide on mobile
                768: { slidesPerView: 2 },  // 2 slides on tablet/desktop
                }}
            >
                {sections.news.map(article => 
                <SwiperSlide key={article.id} className="news-card">
                    <img src={article.icon} alt={article.title} />
                    <div className="news-content">
                    <small>{article.date}</small>
                    <h5>{article.title}</h5>
                    <p>{article.excerpt}</p>
                    </div>
                </SwiperSlide>)}
            </Swiper>
            </div>

          <div className="col-md-3">
            <div className="news-banner">
              <img src="/banners/news-right.jpg" alt="News banner" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="section-spacing">
        <div className="section-header">
          <h1>Featured Businesses</h1>
        </div>
        <div className="business-grid">
          {sections.businesses.map(business => (
            <div key={business.id} className="business-card">
              <img src={business.logo} alt={business.name} />
              <h4>{business.name}</h4>
              <p>{business.address}</p>
              <p className="description">{business.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;