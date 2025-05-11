

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Login() {

  // const urlParams = new URLSearchParams(window.location.search);
  // const code = urlParams.get('code');

  // // Send code to your backend API
  // fetch('auth/google/callback', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify({ code })
  // })
  // .then(response => response.json())
  // .then(data => {
  //   // Handle token and user data
  // });


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

  // const handleLoginSuccess = async () => {
  //   try {
  //     // Check for existing drafts
  //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
  //     const draftResponse = await axios.get(`/get-draft/${ipResponse.data.ip}`);
      
  //     if (draftResponse.data.exists) {
  //       // Navigate to job creation with draft data
  //       navigate('/create-job-offer', {
  //         state: { 
  //           draftData: draftResponse.data.data,
  //           draftId: draftResponse.data.draft_id
  //         }
  //       });
  //     } else {
  //       // Regular role-based navigation
  //       const role = localStorage.getItem('role');
  //       if (role === 'admin') navigate('/home');
  //       else if (role === 'super_admin') navigate('/admin/dashboard');
  //       else navigate(fromPath);
  //     }
  //   } catch (error) {
  //     console.error('Draft handling error:', error);
  //     navigate(fromPath); // Fallback navigation
  //   }
  // };

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

        // await handleLoginSuccess();
        // Check for draft data
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const draftCheck = await axios.get(`/get-draft/${ipResponse.data.ip}`);
        if (draftCheck.data.exists) {
          return navigate('/payment', {
            state: { draftData: draftCheck.data.data }
          });
        } else {
          // Existing role-based navigation
          if (response.data.role === 'admin') navigate('/home');
          else if (response.data.role === 'super_admin') navigate('/admin/dashboard');
          else navigate(fromPath);
        }
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const ip = await getClientIP();
        const response = await axios.get(`/api/get-draft/${ip}`);
        
        if (response.data.exists) {
          navigate('/create-job-offer', {
            state: { draftData: response.data.data }
          });
        }
      } catch (error) {
        console.error('Draft check failed:', error);
      }
    };

    if (localStorage.getItem('token')) {
      checkDraft();
    }
  }, [navigate]);

  const getClientIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'unknown';
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/login', formData, {
  //       headers: {
  //         'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
  //         'Content-Type': 'application/json',
  //       },
  //       withCredentials: true,
  //     });

  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token); // Store token in localStorage
  //       localStorage.setItem('role', response.data.role); // Store role
  //       if (response.data.role === 'admin') {
  //         navigate('/home');
  //       } else if (response.data.role === 'super_admin') {
  //         navigate('/admin/dashboard');
  //       }else {
  //         navigate('/user/dashboard');
  //       }
  //     }
  //   } catch (error) {
  //     setError('Invalid email or password. Please try again.'); // Show error message
  //   }
  // };

  // Handle social login (Google OAuth)
  // const handleSocialLogin = async (authToken, provider) => {
  //   try {
      
  //     console.log(authToken);
  //     const response = await axios.post(`/auth/${provider}/callback`, {
  //       token: authToken,
  //     }, {
  //       headers: {
  //         'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
  //         'Content-Type': 'application/json',
  //       },
  //       withCredentials: true,
        
  //     });
      
  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token); // Store the token
  //       navigate('/admin-dashboard'); // Redirect to admin dashboard
  //     } else {
  //       throw new Error('No token received from the server.');
  //     }
  //   } catch (error) {
  //     console.error('Social login failed:', error);
  //     setError('Social login failed. Please try again.'); // Show error message
  //   }
  // };

  // Updated handleSocialLogin function
  const handleSocialLogin = async (provider) => {
    try {
      const response = await axios.post(
        `api/auth/${provider}/callback`, // Full backend URL
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = (credentialResponse) => {
    const authToken = credentialResponse.credential; // Extract the authToken
    handleSocialLogin(authToken, 'google'); // Pass the authToken to the social login handler
  };

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