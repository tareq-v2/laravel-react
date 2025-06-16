import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Layout.css'; // Assuming you have a CSS file for styling
import Footer from './Frontend/Footer';
import Header from './Frontend/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ScrollToTop from './Frontend/ScrollToTop';
// import ChatWidget from './Frontend/ChatWidget';

export default function Layout({ children }) {

  return (
    <div className="layout-container">
      <Header/>
      <main className="main-content" style={{ marginLeft: '100px' }}>
        {children}
      </main>
      {/* <ChatWidget /> */}
      <ScrollToTop/>
      <Footer />
    </div>
  );
}