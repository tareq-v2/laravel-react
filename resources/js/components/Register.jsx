import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleRegistrationSuccess = async () => {
  //   try {
  //     // Get client IP
  //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //     const clientIP = ipResponse.data.ip;

  //     // Check for existing drafts using the IP
  //     const draftResponse = await axios.get(`/get-draft/${clientIP}`);
      
  //     if (draftResponse.data.exists) {
  //       // Redirect to payment page with draft data
  //       navigate('/payment', {
  //         state: { 
  //           draftData: draftResponse.data.data,
  //           draftId: draftResponse.data.draft_id
  //         }
  //       });
  //     } else {
  //       // Regular role-based navigation
  //       const role = localStorage.getItem('role');
  //       const redirectPath = role === 'admin' ? '/home' :
  //                         role === 'super_admin' ? '/admin/dashboard' :
  //                         '/user/dashboard';
  //       navigate(redirectPath);
  //     }
  //   } catch (error) {
  //     console.error('Draft handling error:', error);
  //     navigate('/user/dashboard'); // Fallback navigation
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', formData);
      
      if (response.status === 201) {
        // Store token and role from response
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role || 'customer');

        // Get client IP for draft check
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const clientIP = ipResponse.data.ip;

        // Check for existing drafts
        try {
          const draftResponse = await axios.get(`/get-draft/${clientIP}`);
          if (draftResponse.data.exists) {
            navigate('/payment', {
              state: { 
                draftData: draftResponse.data.data,
                draftId: draftResponse.data.draft_id
              }
            });
          } else {
            navigate('/user/dashboard');
          }
        } catch (draftError) {
          console.error('Draft check failed:', draftError);
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError('User already registered. Please log in.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="input-group flex-column">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              className="position-relative"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <span
              type="button"
              className="password-toggle position-absolute bottom-0 end-0 translate-middle-y me-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login Here</Link>
      </p>
    </div>
  );
}