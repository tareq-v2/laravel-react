import React from 'react';
import { Link } from 'react-router-dom';
import './Design/Footer.css'; // Create this CSS file

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-links">
        <Link to="/about/us" className="footer-link">About Us</Link>
        <Link to="/advertise/with/us" className="footer-link">Advertise With Us</Link>
        <Link to="/" className="footer-link">Classified Ads</Link>
        <Link to="/" className="footer-link">Business Directory</Link>
        <Link to="/terms/and/conditions" className="footer-link">Terms Of Service</Link>
        <Link to="/privacy/policy" className="footer-link">Privacy Policy</Link>
        <Link to="/contact/us" className="footer-link">Contact Us</Link>
      </div>
      <div className="footer-copyright">
        © 2025 Armenian Advertiser. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;