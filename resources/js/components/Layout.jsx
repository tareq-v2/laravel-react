import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
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