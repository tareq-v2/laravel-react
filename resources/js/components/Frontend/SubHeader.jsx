import React from 'react';
import './Design/SubHeader.css'; // Assuming you have a CSS file for styling
import RadioPlayer from './RadioPlayer';
import WeatherWidget from './WeatherWidget';
import NewsTicker from './Ticker';

const HeaderSection = () => {
  return (
    <>
        <div className="header-section">
        {/* Left Column - Social Icons & Audio Player */}
        <div className="header-left-col">
            <ul className="social-icons">
            <li>
                <a className="social-icon" href="http://localhost:8001">
                <img 
                    src="http://localhost:8001/uploads/generalSettings/home-button.png" 
                    alt="home"
                />
                </a>
            </li>
            <li>
                <a className="social-icon" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img 
                    src="http://localhost:8001/uploads/generalSettings/facebook.png" 
                    alt="facebook"
                />
                </a>
            </li>
            <li>
                <a className="social-icon" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img 
                    src="http://localhost:8001/uploads/generalSettings/instagram.png" 
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
            <div className="top-banner">
            <div className="banner-carousel">
                <div className="banner-slide active">
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                    <img src="http://localhost:8001/uploads/banner/add.jpeg" alt="Advertisement" />
                </a>
                </div>
                <div className="banner-slide">
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                    <img src="http://localhost:8001/uploads/banner/top-banner.jpg" alt="Advertisement" />
                </a>
                </div>
            </div>
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