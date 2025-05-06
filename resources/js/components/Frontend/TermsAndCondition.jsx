import React from 'react';
import './Design/TermsAndCondition.css';

const TermsAndConditions = () => {
  return (
    <div className="container terms-container">
      {/* Main Heading */}
      <h1 className="main-heading mb-4">Terms of Service</h1>
      <p className="text-muted mb-5">Effective Date: June 1, 2023</p>

      {/* Welcome Section */}
      <section className="mb-5">
        <h2 className="section-heading">Welcome to ArmenianAd.com</h2>
        <p className="text-justify">
          Please read these Terms of Service ("Terms", "Agreement") carefully before using ArmenianAd.com...
          {/* Include full text from first paragraph */}
        </p>
      </section>

      {/* Privacy Policy Section */}
      <section className="mb-5">
        <h3 className="sub-section-heading">Privacy Policy</h3>
        <p className="text-justify">
          Before you continue using ArmenianAd.com, we advise you to read our Privacy Policy...
        </p>
      </section>

      {/* Age Restriction */}
      <section className="mb-5">
        <h3 className="sub-section-heading">Age Restriction</h3>
        <p className="text-justify">
          This website is offered and available to users who are at least 18 (eighteen) years of age...
        </p>
      </section>

      {/* User Account Section */}
      <section className="mb-5">
        <h3 className="sub-section-heading">User Account</h3>
        <p className="text-justify">
          As a user of this website, you may be asked to register with us...
        </p>
        <div className="highlight-box p-4 mb-4">
          ArmenianAd.com <strong>reserves the right to refuse service</strong>, terminate accounts...
        </div>
      </section>

      {/* Copyright Section */}
      <section className="mb-5">
        <h3 className="sub-section-heading">Copyright & Intellectual Property Rights</h3>
        <p className="text-justify">
          All published materials on ArmenianAd.com...
        </p>
        <div className="rules-list">
          <h5>Additional Rules:</h5>
          <ol>
            <li>You will not in any way violate, infringe or misappropriate...</li>
            <li>You will not reuse, republish, transmit or otherwise distribute...</li>
            {/* Add all 5 rules */}
          </ol>
        </div>
      </section>

      {/* User-Submitted Content */}
      <section className="mb-5">
        <h3 className="sub-section-heading">User-Submitted Content</h3>
        <p className="text-justify">
          Users of ArmenianAd.com may be able to submit or to otherwise make available...
        </p>
        <ul className="warning-list">
          <li>You automatically grant ArmenianAd.com a nonexclusive, royalty-free license...</li>
          <li>You warrant and represent that you are the sole owner...</li>
        </ul>
      </section>

      {/* Online Conduct Section */}
      <section className="mb-5">
        <h3 className="sub-section-heading">Online Conduct & Rules</h3>
        <p className="text-justify">
          ArmenianAd.com welcomes the free and open exchange of ideas...
        </p>
        <ol className="conduct-rules">
          <li>Users shall not use ArmenianAd.com to provide false information...</li>
          <li>Users shall not misrepresent their identity...</li>
          {/* Add all 9 rules */}
        </ol>
      </section>

      {/* Disclaimer Section */}
      <section className="mb-5">
        <h3 className="sub-section-heading">Disclaimer</h3>
        <p className="text-justify">
          Although ArmenianAd.com aims to provide the most accurate information...
        </p>
        <p className="text-justify">
          ArmenianAd.com does not ensure or guarantee that files available for download...
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact-section mt-5 pt-4">
        <h4 className="mb-3">Contact</h4>
        <p>
          If you have any questions or comments about our policies, you may reach us at<br />
          <a href="mailto:support@armenianad.com" className="contact-email">
            support@armenianad.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;