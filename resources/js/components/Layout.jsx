import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = async () => {
    console.log('loging out');
    try {
      // Step 1: Log out from the backend
      await axios.post('/logout', {}, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include Sanctum token
        'Accept': 'application/json',
      },
        withCredentials: true,
      });

      // Step 2: Remove the token from localStorage
      localStorage.removeItem('token');

      // Step 3: Redirect to login
      navigate('/login');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">My App</div>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
}