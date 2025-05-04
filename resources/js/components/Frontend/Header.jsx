import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Design/Footer.css';
import HeaderLogo from './HeaderLogo';
import SubHeader from './SubHeader';
import CountryLanguageSelector from './countryLanguageSelector';
import  { CompectHeader, DefaultHeader } from './StickyNav';
import AuthAndLang from './AuthAndLang';

const Header = () => {

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsSticky(scrollTop > 100); 
      };
  
      const throttledScroll = throttle(handleScroll, 100);
      window.addEventListener('scroll', throttledScroll);
      return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

  return (
    <>
        <nav className="navbar">
            <div className="container d-flex justify-content-between align-items-start">
                <div className="navbar-brand">
                    <Link to="/" className="nav-link">
                        <HeaderLogo 
                            logoUrl="/ar.png" 
                            title="Diaspora's #1 Advertising Resource"
                            siteUrl="/"
                        />
                    </Link>
                </div>
                <div className="prod-code-sec">
                    <div className="clearfix">
                        <h4 className="mb-0"
                            style={{
                                fontWeight: "bold !important",
                                fontSize: "17pt",
                                color: "#1b2122",
                            }}
                        >
                            Post Your Free Classified Ad
                        </h4>
                        <h4 className="text-center mb-0"
                        style={{
                            fontWeight: "bold !important",
                            fontSize: "14pt",
                            color: "#1b2122",
                        }}
                        >
                            Use Promo Code
                        </h4>
                    </div>
                </div>
                <AuthAndLang />
            </div>
        </nav>
        <nav className="navbar">
            <div className="container">
                <SubHeader/>
            </div>
        </nav>
        <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backgroundColor: isSticky ? '#000000' : 'transparent',
          boxShadow: isSticky ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {isSticky ? <CompectHeader /> : <DefaultHeader />}
      </div>
    </>
  );
};

// Throttle function to optimize scroll handling
function throttle(func, limit) {
    let inThrottle = false;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

export default Header;


