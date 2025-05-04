import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import AuthAndLang from "./AuthAndLang";
import VideoSection from './VideoSection';
import MainContent from './MainContent';


const StickyNav = () => {

    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef(null);
    const sentinelRef = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsSticky(!entry.isIntersecting);
        },
        { threshold: [1] }
      );
  
      if (sentinelRef.current) {
        observer.observe(sentinelRef.current);
      }
  
      return () => {
        if (sentinelRef.current) {
          observer.unobserve(sentinelRef.current);
        }
      };
    }, []);

    return (
      <div style={{ position: 'relative' }}>
      {/* Sentinel element to detect when header becomes sticky */}
      <div
      ref={sentinelRef}
      style={{
        position: 'absolute',
        top: '0px',  // Changed from -1px
        width: '100%',
        height: '1px',
        pointerEvents: 'none'  // Add this
      }}
      />

      {/* Sticky header container */}
      <div
        ref={stickyRef}
        style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            backgroundColor: isSticky ? '#000000' : 'transparent',
            boxShadow: isSticky ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {isSticky ? (
          <CompectHeader /> // Your alternative component when sticky
        ) : (
          <DefaultHeader /> // Your default component
        )}
      </div>

      {/* Rest of your content */}
      <div style={{ position: 'relative' }}>
        <VideoSection/>
        <MainContent/>
      </div>
    </div>
    )
}

export default StickyNav;

const DefaultHeader = () => {
    return (
        <header className="p-3 mt-0" style={{ width: "100%", backgroundColor: "#2450a0"}}>
            <div className="d-flex justify-content-center align-items-center gap-4" >
              <li className="list-unstyled"> 
                <Link to="/" className="footer-link">About Us</Link>
              </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Advertise With Us</Link>
             </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Classified Ads</Link>
             </li>
             <li className="text-secondary">
               <Link to="/" className="footer-link">Business Directory</Link>
             </li>
        </div>
    </header>
    )
}

const CompectHeader = () => {
    return (
        <header  className="p-3 mt-0 d-flex justify-content-between align-items-center gap-4 px-5" style={{ width: "100%", backgroundColor: "#2450a0", color: "#fff"}}>
            <div className="d-flex justify-content-center align-items-center gap-4" >
              <li className="list-unstyled"> 
                <Link to="/" className="footer-link">About Us</Link>
              </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Advertise With Us</Link>
             </li>
             <li className="text-secondary">
                <Link to="/" className="footer-link">Classified Ads</Link>
             </li>
             <li className="text-secondary">
               <Link to="/" className="footer-link">Business Directory</Link>
             </li>
          </div>
          <div >
            <AuthAndLang />
          </div>
       </header>
    )
}