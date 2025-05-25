// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Design/MainContent.css'; // Assuming you have a CSS file for styling

// // Import Swiper styles
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { useTranslation } from './src/hooks/useTranslation';

// const MainContent = () => {
//   const t = useTranslation();
//   const [adCategories, setAdCategories] = useState([]);
//   const [directoryCategories, setDirectoryCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch ad categories from Laravel backend
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get('ad/category/icons');
//         console.log(response.data.data);
//         setAdCategories(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch directory categories from Laravel backend
//   useEffect(() => {
//     const fetchDirectoryCategories = async () => {
//       try {
//         const response = await axios.get('directory/category/icons');
//         console.log(response.data.data);
//         setDirectoryCategories(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchDirectoryCategories();
//   }, []);
  // const sections = {
  //   news: [
  //     { 
  //       id: 1, 
  //       title: 'Latest Industry News', 
  //       date: 'March 18, 2025',
  //       excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //       image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
  //     },
  //     { 
  //       id: 2, 
  //       title: 'Latest Industry News', 
  //       date: 'March 18, 2025',
  //       excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //       image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
  //     },
  //     { 
  //       id: 3, 
  //       title: 'Latest Industry News', 
  //       date: 'March 18, 2025',
  //       excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //       image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
  //     },
  //     { 
  //       id: 4, 
  //       title: 'Latest Industry News', 
  //       date: 'March 18, 2025',
  //       excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  //       image: 'http://localhost:8001/uploads/categoryIcons/jobs.png'
  //     },
  //     // Add more news
  //   ],
  //   businesses: [
  //     {
  //       id: 1,
  //       name: 'Premium Business',
  //       address: '123 Main St, Yerevan',
  //       logo: '/businesses/logo1.png',
  //       description: 'Lorem ipsum dolor sit amet consectetur...'
  //     },
  //     // Add more businesses
  //   ]
  // };

//   return (
    
//     <div className="container">
//       {/* Ad Categories Section */}
//       <section className="section-spacing">
//         <div className="row">
//           <div className="col-md-2">
//             <div className="side-banner">
//               <img src="http://localhost:8001/uploads/banner/side-banner.png" alt="Left banner" />
//             </div>
//           </div>
          
//           <div className="col-md-8">
//             <div className='ad-categories'>
//               <div className="section-header">
//                 <div>
//                   {/* Empty */}
//                 </div>
//                 <div>
//                   <h1>Classified Ads</h1>
//                   <p>{t('Select Category To View Listings')}</p>
//                 </div>
//                 <div>
//                 <Link to="/post-ad" className="btn btn-primary">
//                   <i className="fa fa-plus me-2"></i>
//                   Post Your Ad
//                 </Link>
//                 </div>
//               </div>
              
//               {loading ? (
//                   <div className="text-center">Loading categories...</div>
//                 ) : error ? (
//                   <div className="text-center text-danger">Error: {error}</div>
//                 ) : (
//                   <div className="container">
//                     <div className="row g-4">
//                       {adCategories.map(category => (
//                         <div key={category.id} className="col-md-3">
//                           <Link to={`/ad/sub/categories/${category.id}`} className="text-decoration-none">
//                             <div className="category-card h-100 p-3"> {/* Add padding inside card */}
//                               <img
//                                 src={category.icon}
//                                 alt={category.name}
//                                 className="img-fluid"
//                               />
//                               <h6 className="font-weight-semibold mb-0 mt-2">{category.name}</h6>
//                             </div>
//                           </Link>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//             </div>
//           </div>

//           <div className="col-md-2">
//             <div className="side-banner">
//               <img src="http://localhost:8001/uploads/banner/side-banner1.png" alt="Right banner" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Directory Categories Section */}
//       <section className="section-spacing">
//         <div className="row">
//           <div className="col-md-2">
//             {/* Side banners similar to ad categories */}
//           </div>
          
//           <div className="col-md-8">
//             <div className="ad-categories">
//             <div className="section-header">
//               <div>
//                  {/* Empty */}
//               </div>
//               <div>
//               <h1>Business Directory</h1>
//                 <p>Select Category To View Listings</p>
//               </div>
//               <div>
//               <Link to="/add-business" className="btn btn-primary">
//                 <i className="fa fa-plus me-2"></i>
//                 Add Your Business
//               </Link>
//               </div>
//             </div>
            
//             <div className="directory-grid">
//               {loading ? (
//                 <div className="text-center">Loading categories...</div>
//               ) : error ? (
//                 <div className="text-center text-danger">Error: {error}</div>
//               ) : (
//                 <div className="container">
//                   <div className="row g-4">
//                     {directoryCategories.map(category => (
//                       <div key={category.id} className="col-md-3 col-6">
//                         <Link to={`/your-route/${category.id}`} className="text-decoration-none">
//                           <div className="category-card h-100 p-3">
//                             <img
//                               src={category.icon}
//                               alt={category.name}
//                               className="img-fluid"
//                             />
//                             <h6 className="font-weight-semibold mb-0 mt-2 text-center">
//                               {category.name}
//                             </h6>
//                           </div>
//                         </Link>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//             </div>
//           </div>

//           <div className="col-md-2">
//             {/* Side banners similar to ad categories */}
//           </div>
//         </div>
//       </section>


//       {/* News Section */}
//       <section className="section-spacing">
//         <div className="row">
//           <div className="col-md-3">
//             <div className="news-banner">
//               <img src="/banners/news-left.jpg" alt="News banner" />
//             </div>
//           </div>
          
//           <div className="col-md-6">
//             <div className="section-header">
//                 <h1>Latest News</h1>
//             </div>
//             <Swiper
//                 className="news-carousel"
//                 spaceBetween={10}
//                 slidesPerView={2}  // Show 2 slides at once
//                 navigation={true}  // Enable arrow navigation
//                 pagination={{ clickable: true }}  // Enable dots pagination
//                 autoplay={{ delay: 3000 }}  // Auto-slide every 3 seconds
//                 modules={[Navigation, Pagination, Autoplay]}  // Load modules
//                 breakpoints={{
//                 // Responsive breakpoints
//                 320: { slidesPerView: 1 },  // 1 slide on mobile
//                 768: { slidesPerView: 2 },  // 2 slides on tablet/desktop
//                 }}
//             >
//                 {sections.news.map(article => 
//                 <SwiperSlide key={article.id} className="news-card">
//                     <img src={article.icon} alt={article.title} />
//                     <div className="news-content">
//                     <small>{article.date}</small>
//                     <h5>{article.title}</h5>
//                     <p>{article.excerpt}</p>
//                     </div>
//                 </SwiperSlide>)}
//             </Swiper>
//             </div>

//           <div className="col-md-3">
//             <div className="news-banner">
//               <img src="/banners/news-right.jpg" alt="News banner" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Businesses Section */}
      // <section className="section-spacing">
      //   <div className="section-header">
      //     <h1>Featured Businesses</h1>
      //   </div>
      //   <div className="business-grid">
      //     {sections.businesses.map(business => (
      //       <div key={business.id} className="business-card">
      //         <img src={business.logo} alt={business.name} />
      //         <h4>{business.name}</h4>
      //         <p>{business.address}</p>
      //         <p className="description">{business.description}</p>
      //       </div>
      //     ))}
      //   </div>
      // </section>
//     </div>
//   );
// };

// export default MainContent;


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
          axios.get('/directory/category/icons')
        ]);
        
        setAdCategories(adResponse.data.data);
        setDirectoryCategories(dirResponse.data.data);
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
          </div>

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