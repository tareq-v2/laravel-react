import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Layout.css'; // Assuming you have a CSS file for styling
import Footer from './Frontend/Footer';
import Header from './Frontend/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = async () => {
    console.log('loging out');
    try {
      await axios.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="layout-container">
      <Header/>
      
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}