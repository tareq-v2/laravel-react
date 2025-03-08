// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
// // import FacebookLogin from 'react-oauth/facebook';


// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [error, setError] = useState(null); // For showing error messages
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/login', formData);
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token); // Store token in localStorage
//         navigate('/home'); // Redirect to admin dashboard
//       }
//     } catch (error) {
//       setError('Invalid email or password. Please try again.'); // Show error message
//     }
//   };

//   const handleSuccess = async (credentialResponse, provider) => {
//     try {
//       const response = await axios.post(`/auth/${provider}`, {
//         token: credentialResponse.credential
//       });
      
//       // Handle successful login
//       localStorage.setItem('token', response.data.token);
//       window.location.href = '/admin-dashboard';
      
//     } catch (error) {
//       console.error('Social login failed:', error);
//     }
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
//         <button type="submit" className="login-button">Login</button>
//         <div className="social-login mt-2">
//           <GoogleLogin
//             onSuccess={(response) => handleSuccess(response, 'google')}
//             onError={() => console.log('Google login failed')}
//           />
          
//           {/* <FacebookLogin
//             appId={process.env.REACT_APP_FACEBOOK_APP_ID}
//             onSuccess={(response) => handleSuccess(response, 'facebook')}
//             onFailure={() => console.log('Facebook login failed')}
//             render={({ onClick }) => (
//               <button onClick={onClick} className="facebook-btn">
//                 Continue with Facebook
//               </button>
//             )}
//           /> */}
//         </div>
//       </form>
//       <p>
//         Don't have an account? <Link to="/register">Register here</Link> 
//       </p>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
// import { fetchCsrfToken } from './utils/api';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [error, setError] = useState(null); // For showing error messages
//   const navigate = useNavigate();

//   // Handle regular login (email/password)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/login', formData);
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token); // Store token in localStorage
//         navigate('/home'); // Redirect to home page
//       }
//     } catch (error) {
//       setError('Invalid email or password. Please try again.'); // Show error message
//     }
//   };

//   const getCsrfToken = () => {
//     console.log('here');
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('XSRF-TOKEN='))
//       ?.split('=')[1];
//   };

//   // Handle social login (Google OAuth)
//   const handleSocialLogin = async (authToken, provider) => {
//     try {
//       const csrfToken = getCsrfToken();
//       const response = await axios.post(`/auth/${provider}`, {
//         token: authToken, // Pass the authToken to the backend
//       }, {
//         headers: {
//           'X-XSRF-TOKEN': csrfToken,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log(response);
      
//       // Handle successful login
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token); // Store the token
//         navigate('/admin-dashboard'); // Redirect to admin dashboard
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
//     // console.log(credentialResponse)
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



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  console.log(document.cookie)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null); // For showing error messages
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(parts)
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  // useEffect(() => {
  //   axios.get('/sanctum/csrf-cookie', {
  //     withCredentials: true // Required for cookies
  //   });
  // }, []);
  // Handle regular login (email/password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData, {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies in the request
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/home'); // Redirect to home page
      }
    } catch (error) {
      setError('Invalid email or password. Please try again.'); // Show error message
    }
  };

  // Handle social login (Google OAuth)
  const handleSocialLogin = async (authToken, provider) => {
    try {

      // Make the POST request with the CSRF token
      const response = await axios.post(`/auth/${provider}`, {
        token: authToken, // Pass the authToken to the backend
      }, {
        headers: {
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Include CSRF token in headers
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies in the request
      });
      // Handle successful login
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
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <div className="social-login mt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}