import React from 'react';
import { 
  FaShieldAlt,
  FaInfoCircle,
  FaChartLine,
  FaEnvelope,
  FaChild,
  FaGlobe,
  FaExchangeAlt,
  FaCreditCard,
  FaDatabase
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Design/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FaShieldAlt />,
      title: "Information We Collect",
      content: "Personal information is information that can be used to identify, locate or contact an individual..."
    },
    {
      icon: <FaInfoCircle />,
      title: "How We Use the Information",
      content: "The information that you provide to us helps ArmenianAd.com create a better experience..."
    },
    {
      icon: <FaChartLine />,
      title: "Automated Information Collection",
      content: "This section refers to data collection from your devices. For reporting and analysis purposes..."
    },
    {
      icon: <FaDatabase />,
      title: "Use of Aggregated Anonymous Data",
      content: "ArmenianAd.com may obtain and use certain types of combined non-personal data..."
    },
    {
      icon: <FaEnvelope />,
      title: "User Email Address",
      content: "ArmenianAd.com is committed to keeping your email address confidential..."
    },
    {
      icon: <FaChild />,
      title: "Children & Minors",
      content: "ArmenianAd.com and its services are intended for adults (18 years of age and older)..."
    },
    {
      icon: <FaGlobe />,
      title: "International Users",
      content: "We maintain information in the United States of America and in accordance with the laws..."
    },
    {
      icon: <FaExchangeAlt />,
      title: "Sale or Transfer",
      content: "In the event we are involved in a sale, merger, or transfer of all or some of our business assets..."
    },
    {
      icon: <FaCreditCard />,
      title: "Electronic Commerce & Processing",
      content: "For services that require payment, such as placing classified ads electronically..."
    }
  ];

  return (
    <div className="privacy-container container py-5">
      <div className="text-center mb-5">
        <h1 className="privacy-title mb-3">
          <FaShieldAlt className="me-3" />
          Privacy Policy
        </h1>
        <p className="text-muted">Effective Date: June 1, 2023</p>
      </div>

      <div className="privacy-content">
        <p className="lead mb-5">
          ArmenianAd.com takes your privacy very seriously... (intro text from PDF)
        </p>

        {sections.map((section, index) => (
          <div key={index} className="privacy-section mb-5">
            <div className="row align-items-start">
              <div className="col-md-2 text-center mb-3 mb-md-0">
                <div className="privacy-icon">
                  {React.cloneElement(section.icon, { size: 40 })}
                </div>
              </div>
              <div className="col-md-10">
                <h3 className="section-title mb-3">{section.title}</h3>
                <p className="section-content">{section.content}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="contact-section mt-5 pt-4">
          <h4 className="mb-3">Contact</h4>
          <p>
            If you have any questions or comments about our policies:<br />
            <a href="mailto:support@armenianad.com" className="contact-link">
              support@armenianad.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;