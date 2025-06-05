import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Design/MainContent.css';
import { useTranslation } from './src/hooks/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BannerSpot = ({ spotNumber }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`/banners/spot-${spotNumber}`);
        if (response.data.success) {
          setBanners(response.data.banners);
          setCurrentIndex(Math.floor(Math.random() * response.data.banners.length));
        }
      } catch (error) {
        console.error(`Error fetching spot ${spotNumber} banners:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [spotNumber]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * banners.length);
          } while (newIndex === currentIndex);
          setCurrentIndex(newIndex);
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners, currentIndex]);

  if (loading) return <div className="banner-loading">Loading...</div>;

  return (
    <div className="side-banner">
      {banners.length > 0 ? (
        <div className={`banner-slide ${fade ? 'fade-in' : 'fade-out'}`}>
          <a href={banners[currentIndex]?.url || '#'} target="_blank" rel="noopener noreferrer">
            <img
              src={`http://localhost:8000/storage/banners/${banners[currentIndex]?.images}`}
              alt={`Spot ${spotNumber} Banner`}
            />
          </a>
        </div>
      ) : (
        <div className="banner-placeholder">
          <img src="/default-banner.jpg" alt="Default banner" />
        </div>
      )}
    </div>
  );
};

const MainContent = () => {
  const t = useTranslation();
  const [adCategories, setAdCategories] = useState([]);
  const [directoryCategories, setDirectoryCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const sections = {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adResponse, dirResponse] = await Promise.all([
          axios.get('/ad/category/icons'),
          axios.get('/directory/category/icons'),
          axios.get('/blogs')
        ]);
        
        setAdCategories(adResponse.data.data);
        setDirectoryCategories(dirResponse.data.data);
        setBlogs(blogsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCategories = (categories, routePrefix) => (
    <div className="row g-4">
      {categories.map(category => (
        <div key={category.id} className="col-md-3">
          <Link to={`${routePrefix}/${category.id}`} className="text-decoration-none">
            <div className="category-card h-100 p-3">
              <img src={category.icon} alt={category.name} className="img-fluid" />
              <h6 className="font-weight-semibold mb-0 mt-2">{category.name}</h6>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      {/* Ad Categories Section */}
      <section className="section-spacing mt-0 pt-0">
        <div className="row">
          <div className="col-md-2">
            <BannerSpot spotNumber={3} />
          </div>
          
          <div className="col-md-8">
            <div className="ad-categories">
              <div className="section-header">
                <div></div>
                <div>
                  <h1>{t('Classified Ads')}</h1>
                  <p>{t('Select Category To View Listings')}</p>
                </div>
                <div>
                  <Link to="/post-ad" className="btn post-btn">
                    <i className="fa fa-plus me-2"></i>
                    {t('Post Your Ad')}
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center">Loading categories...</div>
              ) : error ? (
                <div className="text-center text-danger">Error: {error}</div>
              ) : (
                renderCategories(adCategories, '/ad/sub/categories')
              )}
            </div>
          </div>

          <div className="col-md-2">
            <BannerSpot spotNumber={5} />
          </div>
        </div>
      </section>

      {/* Directory Categories Section */}
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-2">
            <BannerSpot spotNumber={3} />
            <br className='mt-2' />
            <BannerSpot spotNumber={3} />
          </div>
          
          <div className="col-md-8">
            <div className="ad-categories">
              <div className="section-header">
                <div></div>
                <div>
                  <h1>{t('Business Directory')}</h1>
                  <p>{t('Select Category To View Listings')}</p>
                </div>
                <div>
                  <Link to="/add-business" className="btn post-btn">
                    <i className="fa fa-plus me-2"></i>
                    {t('Add Your Business')}
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center">Loading categories...</div>
              ) : error ? (
                <div className="text-center text-danger">Error: {error}</div>
              ) : (
                renderCategories(directoryCategories, '/directory/sub/categories')
              )}
            </div>
          </div>

          <div className="col-md-2">
            <BannerSpot spotNumber={5} />
            <br className='mt-2' />
            <BannerSpot spotNumber={5} />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-spacing">
        <div className="row">
          <div className="col-md-3">
            <BannerSpot spotNumber={4} />
          </div>
          <div className="col-md-7">
            <div className="section-header">
              <div></div>
              <div>
                <h1>Latest Blog Posts</h1>
                <p>Stay updated with our latest articles and insights</p>
              </div>
              <div>
                <Link to="/blogs" className="btn view-all-btn">
                  View All
                </Link>
              </div>
            </div>
            
            <Swiper
              className="blog-carousel"
              spaceBetween={20}
              slidesPerView={3}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              modules={[Navigation, Pagination, Autoplay]}
              breakpoints={{
                320: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
            >
              {blogs.map(blog => (
                <SwiperSlide key={blog.id} className="blog-card">
                  <Link to={`/blog/${blog.id}`} className="blog-link">
                    {blog.thumbnail ? (
                      <div className="blog-thumbnail">
                        <img 
                          src={`http://localhost:8000/uploads/blogs/thumbnail/${blog.thumbnail}`} 
                          alt={blog.title} 
                        />
                      </div>
                    ) : (
                      <div className="blog-thumbnail placeholder">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-category">{blog.category}</span>
                        <span className="blog-date">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="blog-title">{blog.title}</h4>
                      <p className="blog-excerpt">
                        {blog.description.substring(0, 100)}...
                      </p>
                      <div className="read-more">Read More →</div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* <div className="col-md-7">
            <div className="section-header">
                 <h1>Latest News</h1>
             </div>
             <Swiper
                className="news-carousel"
                spaceBetween={10}
                slidesPerView={2}
                navigation={true}
                pagination={{ clickable: true }} 
                autoplay={{ delay: 3000 }}
                modules={[Navigation, Pagination, Autoplay]}  // Load modules
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
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
          </div> */}

          <div className="col-md-2">
            <BannerSpot spotNumber={5} />
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="section-spacing mt-0 pt-0">
        <div className="row">
          <div className="col-md-3">
            <BannerSpot spotNumber={4} />
          </div>
          
          <div className="col-md-7">
            {/* Featured businesses content */}
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

          <div className="col-md-2">
            <BannerSpot spotNumber={5} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainContent;