// ... existing imports ...
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Design/MainContent.css';
import { useTranslation } from './src/hooks/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ... BannerSpot component remains the same ...

const MainContent = () => {
  const t = useTranslation();
  const [adCategories, setAdCategories] = useState([]);
  const [directoryCategories, setDirectoryCategories] = useState([]);
  const [blogs, setBlogs] = useState([]); // New state for blogs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adResponse, dirResponse, blogsResponse] = await Promise.all([
          axios.get('/ad/category/icons'),
          axios.get('/directory/category/icons'),
          axios.get('/blogs') // New endpoint for fetching blogs
        ]);
        
        setAdCategories(adResponse.data.data);
        setDirectoryCategories(dirResponse.data.data);
        setBlogs(blogsResponse.data); // Set blogs data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... existing sections ...

  return (
    <div className="container">
      {/* ... existing sections ... */}
      
      {/* Blog Section */}
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

          <div className="col-md-2">
            <BannerSpot spotNumber={5} />
          </div>
        </div>
      </section>

      {/* ... existing sections ... */}
    </div>
  );
};

export default MainContent;