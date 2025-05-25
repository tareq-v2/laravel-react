import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Design/VideoRightSection.css';

const VideoRightSection = () => {
  // ... other state variables
  const [spot2Banners, setSpot2Banners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    const fetchSpot2Banners = async () => {
      try {
        const response = await axios.get('/get/spot-2-banners');
        if (response.data.success && response.data.banners.length > 0) {
          setSpot2Banners(response.data.banners);
          // Initialize with random banner
          setCurrentBannerIndex(Math.floor(Math.random() * response.data.banners.length));
        }
      } catch (error) {
        console.error('Error fetching spot 2 banners:', error);
      } finally {
        setBannersLoading(false);
      }
    };
    
    fetchSpot2Banners();
  }, []);

  useEffect(() => {
    if (spot2Banners.length > 1) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * spot2Banners.length);
          } while (newIndex === currentBannerIndex);
          setCurrentBannerIndex(newIndex);
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [spot2Banners, currentBannerIndex]);

  // ... rest of your existing code

  return (
    <div className="col-lg-5">
      {/* Search Section */}

      {/* Banner Section */}
      <div className="mt-3 banner-container-spot2">
        {bannersLoading ? (
          <div className="text-center py-4">Loading banners...</div>
        ) : spot2Banners.length > 0 ? (
          <div className={`banner-slide-spot2 ${fade ? 'fade-in' : 'fade-out'}`}>
            <a 
              href={spot2Banners[currentBannerIndex]?.url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img
                src={`http://localhost:8000/storage/banners/${spot2Banners[currentBannerIndex]?.images}`}
                alt={spot2Banners[currentBannerIndex]?.alt_text || `Banner ${currentBannerIndex + 1}`}
                className="spot2-banner-img"
              />
            </a>
          </div>
        ) : (
          <div className="text-center py-4">No active banners available</div>
        )}
      </div>

      {/* Zodiac Section */}
      {/* ... rest of your zodiac section code ... */}
    </div>
  );
};

export default VideoRightSection;