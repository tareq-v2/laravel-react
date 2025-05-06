import React from 'react';
import { 
  FaUser, 
  FaPlus, 
  FaBullhorn, 
  FaSearch,
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaThumbsUp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Main Content */}
      <main className="container my-5">
        {/* About Section */}
        <section className="mb-5">
          <h2 className="text-center mb-4">About Armenia Advertiser</h2>
          <p className="lead text-center mb-4">
            <strong>Diaspora’s #1 Advertising Resource!</strong>
          </p>
          <p className="text-muted text-center">
            ArmenianAd.com is the leading platform for business and classified advertising...
            {/* Include full description from PDF */}
          </p>
        </section>

        {/* How It Works Section */}
        <section className="process-section py-5 mb-5">
          <h3 className="text-center mb-5">How It Works?</h3>
          <div className="row text-center">
            <div className="col-md-3">
              <div className="process-step">
                <FaUser className="process-icon" />
                <h5>Join</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step">
                <FaPlus className="process-icon" />
                <h5>Create Ad</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step">
                <FaBullhorn className="process-icon" />
                <h5>Post Ad</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="process-step">
                <FaSearch className="process-icon" />
                <h5>Find Customers</h5>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section text-center py-5 mb-5">
          <h3 className="mb-4">Best Rates – Better Presentation – Optimal Results</h3>
          <p className="lead mb-4">Don’t Delay, Post Today!</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary btn-lg">
              <FaPlus className="me-2" />
              Post Your Ad
            </button>
            <button className="btn btn-outline-primary btn-lg">
              <FaUsers className="me-2" />
              List Your Business
            </button>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="features-section py-5">
          <h3 className="text-center mb-5">Why Choose Us?</h3>
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <FaThumbsUp className="feature-icon" />
                <h5>User Friendly</h5>
                <p>Our easy-to-use interface makes it fast and easy to post and view your ad.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <FaChartLine className="feature-icon" />
                <h5>Wide Audience</h5>
                <p>Expand your reach with our broad and diverse audience.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <FaDollarSign className="feature-icon" />
                <h5>Best Rates</h5>
                <p>Take advantage of our competitive rates to enhance your visibility.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default AboutUs;