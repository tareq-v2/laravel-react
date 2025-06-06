// src/components/BlogDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Design/BlogDetails.css';
import '@fortawesome/fontawesome-free/css/all.css';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [prevBlog, setPrevBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const commentsRes = await axios.get(`/blogs/${id}/comments?page=${commentsPage}`);
        setComments(commentsRes.data.data); // Paginated comments
        setCommentsTotalPages(commentsRes.data.last_page);
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id, commentsPage]);

  useEffect(() => {
    const fetchBlogData = async () => {
        try {
        setLoading(true);
        const [blogRes, commentsRes, adjacentRes] = await Promise.all([
            axios.get(`/user/blogs/${id}`, { withCredentials: true }), // Add credentials
            axios.get(`/blogs/${id}/comments`),
            axios.get(`/blogs/${id}/adjacent`)
        ]);
        
        setBlog(blogRes.data);
        // setComments(commentsRes.data);
        setPrevBlog(adjacentRes.data.prev);
        setNextBlog(adjacentRes.data.next);
        setLikes(blogRes.data.likes_count || 0); // Use correct property
        setLiked(blogRes.data.user_liked || false); // Use correct property
        setLoading(false);
        } catch (err) {
        setError(err.response?.data?.message || 'Error loading blog');
        setLoading(false);
        }
    };

    fetchBlogData();
  }, [id]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= commentsTotalPages) {
      setCommentsPage(newPage);
    }
  };
  const handleLike = async () => {
    try {
      const res = await axios.post(`/blogs/${id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginModalOpen(true);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/blogs/${id}/comments`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginModalOpen(true);
      }
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-9">
          <div className="blog-detail-card">
            {/* Video or Image */}
            {blog.video_link ? (
              <div className="video-container mb-4">
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe 
                    className="embed-responsive-item" 
                    src={`https://www.youtube.com/embed/${getYouTubeId(blog.video_link)}`}
                    title={blog.title}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              blog.thumbnail && (
                <div className="blog-thumbnail-container mb-4">
                  <img 
                    src={`http://localhost:8000/uploads/blogs/thumbnail/${blog.thumbnail}`} 
                    alt={blog.title} 
                    className="img-fluid rounded"
                  />
                </div>
              )
            )}

            {/* Blog Content */}
            <div className="blog-content">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="blog-meta">
                    <span className="badge bg-primary me-2">{blog.category || "Uncategorized"}</span>
                    <span className="blog-date">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    </div>
                    
                    <div className="d-flex">
                    <button 
                        className={`btn btn-sm me-2 ${liked ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={handleLike}
                    >
                        <i className={`fas fa-heart ${liked ? 'text-white' : ''}`}></i> {likes}
                    </button>
                    
                    <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setShareModalOpen(true)}
                    >
                        <i className="fas fa-share-alt"></i> Share
                    </button>
                    </div>
                </div>
              
                <h1 className="mb-3">{blog.title}</h1>
              
                <div className="blog-description mb-2">
                    {blog.description}
                </div>
            </div>

            {/* Blog Navigation */}
            <div className="blog-navigation d-flex justify-content-between border-top pt-4">
              {prevBlog ? (
                <Link to={`/blog/details/${prevBlog.id}`} className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  {prevBlog.title.substring(0, 30)}...
                </Link>
              ) : <div></div>}
              
              {nextBlog && (
                <Link to={`/blog/details/${nextBlog.id}`} className="btn btn-outline-primary">
                  {nextBlog.title.substring(0, 30)}...
                  <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              )}
            </div>

            {/* Comments Section */}
            <div className="comments-section mt-4">
                <form onSubmit={handleCommentSubmit} className="mb-4">
                    <div className="form-group">
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Add your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary mt-2">
                            Comment
                        </button>
                        {comments.length > 0 && (
                            <h3 className="mb-4">Comments ({comments.length})</h3>
                        )}
                        
                    </div>
                </form>
                
                <div className="comments-list">
                    {comments.length === 0 ? (
                    <p className="text-muted">No comments yet. Be the first to comment!</p>
                    ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="card mb-3">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                            <h5 className="card-title">{comment.user.name}</h5>
                            <small className="text-muted">
                                {new Date(comment.created_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </small>
                            </div>
                            <p className="card-text">{comment.text}</p>
                        </div>
                        </div>
                    ))
                    )}
                </div>
                {/* Pagination Controls - Only show if needed */}
                {commentsTotalPages > 1 && (
                <div className="comment-pagination mt-4">
                    <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${commentsPage === 1 ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageChange(commentsPage - 1)}
                        >
                            &laquo; Previous
                        </button>
                        </li>
                        
                        {[...Array(commentsTotalPages).keys()].map(page => (
                        <li 
                            key={page + 1} 
                            className={`page-item ${commentsPage === page + 1 ? 'active' : ''}`}
                        >
                            <button 
                            className="page-link" 
                            onClick={() => handlePageChange(page + 1)}
                            >
                            {page + 1}
                            </button>
                        </li>
                        ))}
                        
                        <li className={`page-item ${commentsPage === commentsTotalPages ? 'disabled' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageChange(commentsPage + 1)}
                        >
                            Next &raquo;
                        </button>
                        </li>
                    </ul>
                    </nav>
                </div>
                )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-lg-3">
          <BannerSpot spotNumber={6} />
          <BannerSpot spotNumber={6} styles={{marginTop: '2rem'}} />
        </div>
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <ShareModal blog={blog} onClose={() => setShareModalOpen(false)} />
      )}
      
      {/* Login Modal */}
      {loginModalOpen && (
        <LoginModal onClose={() => setLoginModalOpen(false)} navigate={navigate} />
      )}
    </div>
  );
};

const ShareModal = ({ blog, onClose }) => {
  const shareOnSocial = (platform) => {
    const url = `http://localhost:3000/blog/${blog.id}`;
    const title = blog.title || "Check out this blog post";

    switch(platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Share this post</h5>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="social-icons">
            <div className="icon" onClick={() => shareOnSocial('facebook')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>
              <span>Facebook</span>
            </div>
            <div className="icon" onClick={() => shareOnSocial('twitter')}>
              {/* <i className="fab fa-twitter"></i> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
              <span>X</span>
            </div>
            <div className="icon" onClick={() => shareOnSocial('linkedin')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
              <span>LinkedIn</span>
            </div>
            <div className="icon" onClick={() => shareOnSocial('whatsapp')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              <span>WhatsApp</span>
            </div>
            {/* <div className="icon copy" onClick={() => shareOnSocial('copy')}>
              <i className="fas fa-link"></i>
              <span>Copy Link</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginModal = ({ onClose, navigate }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5>Login Required</h5>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>You need to be logged in to perform this action.</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default BlogDetails;