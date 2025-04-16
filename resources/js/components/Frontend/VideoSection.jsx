import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import VideoRightSection from './VideoRightSection';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
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
                    <div key={video.id} className="col-4 mb-4">
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
                            className="object-fit-cover"
                            src="ar.png"
                                style={{ height: '100px', width: '100px' }}
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
            </div>
        </div>
        <VideoRightSection/>
     </div>
    </>
  );
};

export default VideoSection;