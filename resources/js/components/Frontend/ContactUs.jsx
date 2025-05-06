import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successAnimation from './Design/bird.json'; // Get from LottieFiles.com

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post('/contact', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide animation after 3sec
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Contact Us</h1>
      
      <div className="row">
        {/* Contact Form */}
        <div className="col-md-6">
          {success ? (
            <div className="text-center">
              <Lottie 
                animationData={successAnimation} 
                style={{ height: 200 }} 
                loop={false}
              />
              <h4 className="text-success">Message Sent Successfully!</h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="alert alert-danger">{errors.submit}</div>
              )}

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email*</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Message*</label>
                <textarea
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" />
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="col-md-5 offset-md-1 mt-4 mt-md-0">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title mb-4">Contact Information</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-telephone me-2"></i>
                  (818) 434-4039
                </li>
                <li className="mb-3">
                  <i className="bi bi-clock me-2"></i>
                  Mon-Fri 10:00 am - 5:00 pm
                </li>
                <li>
                  <i className="bi bi-envelope me-2"></i>
                  <a href="mailto:support@armenianad.com">support@armenianad.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      {/* <div className="mt-5 pt-4 border-top text-center">
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-3">
          <a href="/about">About Us</a>
          <a href="/advertise">Advertise With Us</a>
          <a href="/classifieds">Classified Ads</a>
          <a href="/directory">Business Directory</a>
          <a href="/terms">Terms Of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="text-muted">
          © {new Date().getFullYear()} Armenian Advertiser. All Rights Reserved.
        </div>
      </div> */}
    </div>
  );
};

export default ContactForm;