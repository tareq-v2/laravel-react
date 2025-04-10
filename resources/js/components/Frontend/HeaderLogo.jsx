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
            className="btn font-weight-semibold navbar-semi-title w-100" 
          >
            <h6 className="text-white pb-0 mb-0 bg-danger">Diaspora's #1 Advertising Resource</h6>
          </Link>
        </div>
      </div>
  );
};

export default HeaderLogo;