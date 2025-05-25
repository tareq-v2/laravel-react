import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import VideoRightSection from './VideoRightSection';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Design/VideoSection.css'; 

const VideoSection = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/home-videos');
        // Access the nested data array
        setVideos(response.data.data);
        if (response.data.data.length > 0) {
          // console.log(response.data.data[0]);
          setCurrentVideo(response.data.data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchVideos();
  }, []);

  const extractVideoId = (url) => {
    const match = url.match(/embed\/([^"?]+)/);
    return match ? match[1] : '';
  };

  const handleVideoChange = (video) => {
    setCurrentVideo(video);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: 2,
    slidesPerRow: 3,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true, 
    adaptiveHeight: true,
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          rows: 2,
          slidesPerRow: 2,
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          rows: 2,
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true
        }
      }
    ]
  };

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div className="text-danger">Error loading videos: {error}</div>;
  if (!videos.length) return <div className="text-danger">No videos available</div>;

  return (
    <>
     <div className="row">
        <div className="col-lg-7">
            <div className="banner-video-slider">
                <div className="banner-video-slide">
                  <div className="ratio ratio-16x9">
                      {currentVideo && (
                      <iframe
                          id="main-video-frame"
                          width="649"
                          height="365"
                          src={`https://www.youtube.com/embed/${extractVideoId(currentVideo.video_link)}?autoplay=1&mute=1`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentVideo.title}
                      />
                      )}
                  </div>
                </div>
            </div>

            {/* Thumbnail Slider */}
            <div className="banner-description-slider mt-2">
                <Slider {...sliderSettings}>
                {videos.map((video, index) => (
                    <div 
                      key={video.id} 
                      className="col-4 mb-4"   
                      style={{ 
                      width: "calc(33.33% - 20px)", // Account for horizontal gap
                      margin: "0 10px" 
                    }}>
                    <div
                        className="banner-description-slide cursor-pointer"
                        onClick={() => handleVideoChange(video)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleVideoChange(video)}
                    >
                        <div className="ratio ratio-21x9">
                        {video.video_thumbnail ? (
                            <img
                            className="object-fit-cover "
                            src={video.video_thumbnail}
                                style={{ height: '100%', width: '100%'}}
                            alt="video thumbnail"
                            loading="lazy"
                            />
                        ) : (
                            <div className="d-flex justify-content-center align-items-center">
                            <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/adImages/defaultLogo.png`}
                                alt="default"
                                style={{ height: '100px', width: '100px' }}
                            />
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                ))}
                </Slider>

              {/* Search Section */}
              <div className="search-section">
                <div className="search-container">
                  <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="row g-3 align-items-center">
                      <div className="col-md-4 position-relative">
                        <input
                          type="text"
                          className="name-input"
                          placeholder="Business name or category"
                          aria-label="businesses"
                        />
                        <svg className="search-icon" viewBox="0 0 24 24">
                          <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/>
                        </svg>
                      </div>
                      
                      <div className="col-md-4 position-relative">
                        <input
                          type="text"
                          className="location-input"
                          placeholder="Location"
                          aria-label="location"
                        />
                        <svg className="search-icon" viewBox="0 0 24 24">
                          <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"/>
                        </svg>
                      </div>

                      <div className='col-md-4'>
                        <button type="submit" className="search-btn">
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
        </div>
        <VideoRightSection/>
     </div>
    </>
  );
};

export default VideoSection;

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-slick-next`}
      onClick={onClick}
      aria-label="Next"
    >
     <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 51.388 51.388" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M9.169,51.388c-0.351,0-0.701-0.157-0.93-0.463c-0.388-0.514-0.288-1.243,0.227-1.634l31.066-23.598L8.461,2.098 C7.95,1.708,7.85,0.977,8.237,0.463c0.395-0.517,1.126-0.615,1.64-0.225l33.51,25.456L9.877,51.151 C9.664,51.31,9.415,51.388,9.169,51.388z"></path> </g> </g> </g></svg>
    </button>
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-slick-prev`}
      onClick={onClick}
      aria-label="Previous"
    >
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 4L8 12L16 20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    </button>
  );
};