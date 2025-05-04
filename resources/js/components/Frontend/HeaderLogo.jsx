import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo = ({ logoUrl, title, siteUrl = "/" }) => {
  return (
    <div className="header-logo-sec">
        <div className="logo">
          <Link to={siteUrl}>
            <img 
              src={logoUrl || "/ar.png"} 
              alt="logo" 
            />
          </Link>
        </div>
        <div className="logo-title mb-2">
          <Link 
            to={siteUrl} 
            className="btn font-weight-semibold navbar-semi-title w-100 text-center p-0" 
          >
            <div style={{FontSize: "0.4rem", color: "#fff"}} className="pb-0 mb-0 bg-danger d-flex justify-content-center align-items-center">
              <span>Diaspora's #1 Advertising Resource</span>
            </div>
          </Link>
        </div>
      </div>
  );
};

export default HeaderLogo;