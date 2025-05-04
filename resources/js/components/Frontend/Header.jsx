import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Design/Footer.css';
import HeaderLogo from './HeaderLogo';
import SubHeader from './SubHeader';
import CountryLanguageSelector from './countryLanguageSelector';
import StickyNav from './StickyNav';
import AuthAndLang from './AuthAndLang';

const Header = () => {

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
        <StickyNav />
    </>
  );
};

export default Header;


