import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const VideoRightSection = () => {
  const [iframeSrc, setIframeSrc] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [selectedSign, setSelectedSign] = useState(null);
  // Dummy data with working image URLs
  const dummyBanners = [
    { id: 1, image: 'http://localhost:8001/uploads/categoryIcons/jobs.png' },
    { id: 2, image: 'http://localhost:8001/uploads/categoryIcons/rent.png' },
    { id: 3, image: 'http://localhost:8001/uploads/categoryIcons/jobs.png' }
  ];

  const zodiacSigns = [
    'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
    'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
  ];

  // Slider settings
  const bannerSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  useEffect(() => {
    // Simulate banner loading
    setTimeout(() => {
      setBanners(dummyBanners);
      setLoading(false);
    }, 1000);
  }, []);

  const handleHoroscopeClick = async (sign, e) => {
    e.preventDefault();
    setSelectedSign(sign);
    setIsHoroscopeLoading(true);
    
    try {
      const baseUrl = `https://mydailyhoroscope.org/widget.php?sign=${sign}&bc=000000&fc=ffffff&fs=12&h=`;
      const modifiedSrc = baseUrl.replace('https:', '');
      
      const response = await axios.get('/checkHoroscope', {
        params: { src: modifiedSrc },
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
      });
      
      setIframeSrc(response.data.session);
      setShowIframe(true);
    } catch (error) {
      console.error('Error fetching horoscope:', error);
    } finally {
      setIsHoroscopeLoading(false);
    }
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
    setSelectedSign(null);
  };
  return (
    <div className="col-lg-5">
      {/* Search Section */}
      <form action="/" onSubmit={(e) => e.preventDefault()} method="get">
        <div className="row mt-1 g-1">
          <div className="col-md pe-1">
            <input
              type="text"
              className="form-control search-field business-field px-2 py-1"
              name="title"
              placeholder="Business name or category"
            />
          </div>
          <div className="col-md-4 px-0">
            <input
              type="text"
              className="form-control search-field location-field px-2 py-1"
              name="city"
              placeholder="Location"
            />
          </div>
          <div className="col-md-auto ps-1">
            <button
            //   type="submit" 
              className="btn btn-primary search-btn w-100 py-1"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Banner Slider Section */}
      <div className="mt-3" style={{ position: 'relative' }}>
        {loading ? (
          <div className="text-center py-4">Loading banners...</div>
        ) : (
          <Slider {...bannerSliderSettings}>
            {banners.map(banner => (
              <div key={banner.id} className="banner-slide">
                <div className="ratio ratio-16x9">
                  <img
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    className="img-fluid rounded-3"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Zodiac Section */}
      <div className="mt-4 p-3 bg-light rounded-3 position-relative">
        {!showIframe ? (
          <>
            <div className="text-center mb-3">
              <h5 className="mb-1">Daily Horoscope</h5>
              <small className="text-muted">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div>

            <div className="row g-2">
              {zodiacSigns.map((sign, index) => (
                <div key={index} className="col-4 col-sm-3 col-lg-2">
                  <button
                    className={`btn btn-outline-light w-100 p-1 bg-white ${
                      isHoroscopeLoading && selectedSign === sign ? 'loading-active' : ''
                    }`}
                    onClick={(e) => handleHoroscopeClick(sign, e)}
                    disabled={isHoroscopeLoading}
                  >
                    <div className="ratio ratio-1x1 position-relative">
                      {isHoroscopeLoading && selectedSign === sign && (
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                      <img
                        src={`https://placehold.co/100x100/4a7b93/fff?text=${encodeURIComponent(sign.slice(0, 3))}`}
                        alt={sign}
                        className={`img-fluid rounded-circle ${
                          isHoroscopeLoading && selectedSign === sign ? 'opacity-25' : ''
                        }`}
                      />
                    </div>
                    <small className="d-block mt-1 text-dark fw-medium">{sign}</small>
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="position-relative">
            <button
              className="btn btn-danger btn-sm position-absolute"
              style={{ right: 15, top: -10, zIndex: 1 }}
              onClick={handleCloseIframe}
            >
              &times;
            </button>
            <iframe
              className="w-100 rounded-2"
              style={{ height: '250px', border: 'none' }}
              src={iframeSrc}
              title="Horoscope"
            />
          </div>
        )}
      </div>

      <style>{`
        .loading-active {
          opacity: 0.7;
          cursor: not-allowed;
          position: relative;
          margin-top: 25px;
        }
        .spinner-border {
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default VideoRightSection;