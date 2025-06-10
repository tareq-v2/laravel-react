

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null); // For showing error messages
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie', {
      withCredentials: true // Required for cookies
    })
    .then(() => {
      console.log('CSRF Cookie fetched:', document.cookie);
    })
    .catch((error) => {
      console.error('Error fetching CSRF cookie:', error);
    });
  }, []);

  const location = useLocation();

  // Get intended redirect path or default
  const fromPath = location.state?.from?.pathname || '/user/dashboard';
  const preserveDrafts = location.state?.preserveDrafts || false;
  
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  }, []);

 const handleLoginSuccess = async () => {
  try {
    // Get client IP
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const clientIP = ipResponse.data.ip;
    
    // Get draft session ID from localStorage if exists
    const sessionId = localStorage.getItem('draft_session');
    
    // Prepare request data
    const requestData = { ip: clientIP };
    if (sessionId) {
      requestData.session_id = sessionId;
    }
    
    console.log(requestData);
    // Check for existing drafts using IP and/or session ID
    const draftResponse = await axios.post('/get-draft', requestData);
    
    if (draftResponse.data.exists) {
      // Redirect to payment page with draft data
      navigate('/payment', {
        state: { 
          draftData: draftResponse.data.data,
          draftId: draftResponse.data.draft_id
        }
      });
    } else {
      // Regular role-based navigation
      const role = localStorage.getItem('role');
      const redirectPath = role === 'admin' ? '/home' :
                        role === 'super_admin' ? '/admin/dashboard' :
                        fromPath;
      navigate(redirectPath);
    }
  } catch (error) {
    console.error('Draft handling error:', error);
    navigate(fromPath); // Fallback navigation
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData, {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        
        // Handle post-login logic including draft check
        await handleLoginSuccess();
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  // Updated handleSocialLogin function
  // const handleSocialLogin = async (provider) => {
  //   try {
  //     const response = await axios.post(
  //       `api/auth/${provider}/callback`, // Full backend URL
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //         }
  //       }
  //     );

  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token);
  //       navigate('/admin-dashboard');
  //     }
  //   } catch (error) {
  //     console.error('Login failed:', error.response?.data);
  //     setError(error.response?.data?.error || 'Login failed');
  //   }
  // };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.get('/auth/google', {
        token: credentialResponse.credential
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard');
      }
    } catch (error) {
      setError('Google login failed');
    }
  };
  // Handle Google OAuth success
  // const handleGoogleSuccess = (credentialResponse) => {
  //   const authToken = credentialResponse.credential; // Extract the authToken
  //   handleSocialLogin(authToken, 'google'); // Pass the authToken to the social login handler
  // };

  // Handle Google OAuth error
  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  // Redirect to your backend's Google OAuth redirect endpoint
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>} {/* Show error message */}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            value={formData.password}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <span
            type="button"
            className="password-toggle position-absolute bottom-0 end-0 translate-middle-y me-2"
            style={{ top: '68%'}}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
    </div>
        

        <button type="submit" className="login-button">
          Login
        </button>
        <div className="social-login mt-2">
          <GoogleLogin
            // onClick={handleGoogleLogin}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register Here</Link>
      </p>
    </div>
  );
}



