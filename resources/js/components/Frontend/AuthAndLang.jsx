import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios"; // Added axios import
import CountryLanguageSelector from "./countryLanguageSelector";

const AuthAndLang = (props) => {
  const navigate = useNavigate(); // Uncommented navigate
  const isAuthenticated = !!localStorage.getItem('token');
  
  const link = localStorage.getItem('role') === 'customer' 
    ? <Link to="/user/dashboard" className="nav-link">Dashboard</Link>
    : <Link to="/home" className="nav-link">Dashboard</Link>;

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      // Clear all auth-related storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Redirect to root URL
      navigate('/');
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear storage and redirect even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  return (
    <div className="navbar-links">
      <div className="d-flex justify-content-between align-items-center gap-2">
        {isAuthenticated ? (
          <>
            {link}
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
      <div>
        <CountryLanguageSelector />
      </div>
    </div>
  );
};

export default AuthAndLang;