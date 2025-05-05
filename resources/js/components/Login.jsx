

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [error, setError] = useState(null); // For showing error messages
//   const navigate = useNavigate();

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//   };

//   // useEffect(() => {
//   //   axios.get('/sanctum/csrf-cookie', {
//   //     withCredentials: true // Required for cookies
//   //   });
//   // }, []);

//   const handleSubmit = async (e) => {
    
//     e.preventDefault();
//     try {
//       const response = await axios.post('/login', formData, {
//         headers: {
//           // 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
//       console.log('here');
      
//       if (response.data.token) {
//         console.log(response.data.token);
        
//         localStorage.setItem('token', response.data.token); // Store token in localStorage
//         navigate('/home'); // Redirect to home page
//       }
//     } catch (error) {
//       setError('Invalid email or password. Please try again.'); // Show error message
//     }
//   };

//   // Handle social login (Google OAuth)
//   const handleSocialLogin = async (authToken, provider) => {
//     // console.log(GoogleLogin)
//     // console.log(authToken, provider)
//     try {

//       // Make the POST request with the CSRF token
//       const response = await axios.get(`/auth/${provider}`, {
//         token: authToken,
//         withCredentials: true
//       }, {
//         headers: {
//           'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true, // Include cookies in the request
//       });
//       // console.log(response)
//       // Handle successful login
//       if (response.data.token) {
//         console.log("here")
//         localStorage.setItem('token', response.data.token); // Store the token
//         navigate('/products'); // Redirect to admin dashboard
//       } else {
//         throw new Error('No token received from the server.');
//       }
//     } catch (error) {
//       console.error('Social login failed:', error);
//       setError('Social login failed. Please try again.'); // Show error message
//     }
//   };

//   // Handle Google OAuth success
//   const handleGoogleSuccess = (credentialResponse) => {
//     const authToken = credentialResponse.credential; // Extract the authToken
//     handleSocialLogin(authToken, 'google'); // Pass the authToken to the social login handler
//   };

//   // Handle Google OAuth error
//   const handleGoogleError = () => {
//     setError('Google login failed. Please try again.');
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <div className="error-message">{error}</div>} {/* Show error message */}
//       <form onSubmit={handleSubmit}>
//         <div className="input-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             required
//           />
//         </div>
//         <button type="submit" className="login-button">
//           Login
//         </button>
//         <div className="social-login mt-2">
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={handleGoogleError}
//           />
//         </div>
//       </form>
//       <p>
//         Don't have an account? <Link to="/register">Register here</Link>
//       </p>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    axios.get('/sanctum/csrf-cookie', {
      withCredentials: true // Required for cookies
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData, {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        localStorage.setItem('role', response.data.role); // Store role
        if (response.data.role === 'admin') {
          navigate('/admin-dashboard');
      } else if (response.data.role === 'admin') {
          navigate('/home');
      } else {
          navigate('/notFound');
      }
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.'); // Show error message
    }
  };

  // Handle social login (Google OAuth)
  const handleSocialLogin = async (authToken, provider) => {
    try {
      
      console.log(authToken);
      const response = await axios.post(`/auth/${provider}/callback`, {
        token: authToken,
      }, {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      } else {
        throw new Error('No token received from the server.');
      }
    } catch (error) {
      console.error('Social login failed:', error);
      setError('Social login failed. Please try again.'); // Show error message
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
        Don't have an account? <Link to="/register">Login here</Link>
      </p>
    </div>
  );
}