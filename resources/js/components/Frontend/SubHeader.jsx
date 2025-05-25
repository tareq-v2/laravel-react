import React, { useState, useEffect} from 'react';
import './Design/SubHeader.css'; 
import axios from 'axios';
import RadioPlayer from './RadioPlayer';
import WeatherWidget from './WeatherWidget';
import NewsTicker from './Ticker';

const HeaderSection = () => {
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(null);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await axios.get('/get/top-header-banner');
                if (response.data.success && response.data.banner.length > 0) {
                    setBanners(response.data.banner);
                    // Set initial random banner
                    setCurrentBanner(response.data.banner[
                        Math.floor(Math.random() * response.data.banner.length)
                    ]);
                }
            } catch (err) {
                console.error('Error fetching banner:', err);
            }
        };
        fetchBanner();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                // Trigger fade out
                setFade(false);
                
                // After fade out duration, change banner and fade in
                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * banners.length);
                    setCurrentBanner(banners[randomIndex]);
                    setFade(true);
                }, 5000); // Matches CSS transition duration
            }, 5000); // Change banner every 5 seconds

            return () => clearInterval(interval);
        }
    }, [banners]);
  return (
    <>
        <div className="header-section">
        {/* Left Column - Social Icons & Audio Player */}
        <div className="header-left-col">
            <ul className="social-icons">
            <li>
                <a className="social-icon" href="http://localhost:8000">
                <img 
                    src="http://localhost:8000/storage/home-button.png" 
                    alt="home"
                />
                </a>
            </li>
            <li>
                <a className="social-icon" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img 
                    src="http://localhost:8000/storage/facebook.png" 
                    alt="facebook"
                />
                </a>
            </li>
            <li>
                <a className="social-icon" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img 
                    src="http://localhost:8000/storage/instagram.png" 
                    alt="instagram"
                />
                </a>
            </li>
            </ul>

            <div className="audio-player-container">
            <RadioPlayer/>
            </div>
        </div>

        {/* Middle Column - Banner */}
        <div className="header-center-col">
            <div className="banner-container">
                {currentBanner ? (
                    <div className={`banner-slide ${fade ? 'fade-in' : 'fade-out'}`}>
                        <a href={currentBanner.url || '#'} target="_blank" rel="noopener noreferrer">
                            <img 
                                src={`http://localhost:8000/storage/banners/${currentBanner.images}`} 
                                alt={currentBanner.alt_text || "Advertisement"}
                            />
                        </a>
                    </div>
                ) : (
                    <div className="banner-slide">
                        <img 
                            src="http://localhost:8001/uploads/banner/default-banner.jpg" 
                            alt="Default advertisement"
                        />
                    </div>
                )}
            </div>
        </div>

        {/* Right Column - Weather */}
        <div className="header-right-col">
            <WeatherWidget/>
        </div>
        </div>
        <NewsTicker />
    </>
  );
};

export default HeaderSection;