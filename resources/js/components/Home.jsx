import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaUsers, FaChartLine, FaSignOutAlt, FaPlus, FaList, FaChevronLeft, FaChevronRight, FaMoon, FaSun } from 'react-icons/fa';
import './AdminDashboard.css';
import { useTheme } from './Frontend/src/context/ThemeContext';
import { Outlet, useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/currentUser', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(response.data.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    
    fetchCurrentUser();
  }, []);
  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (

    <div className="admin-dashboard">
        <aside className={`sidebar ${!isSidebarExpanded ? 'collapsed' : ''}`}>
          <div className="brand">
            <h2>
              <Link to='/home'>
                {isSidebarExpanded ? 'Admin Panel' : 'D'}
              </Link>
            </h2>
            <button className="toggle-btn" onClick={toggleSidebar}>
              {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
          
          <nav className="nav-menu">
            <Link to="/admin-dashboard" className="nav-item">
              <FaChartLine className="nav-icon" />
              {isSidebarExpanded && 'Dashboard'}
            </Link>
            <Link to="/admin/orders" className="nav-item">
              <FaList className="nav-icon" />
              {isSidebarExpanded && 'Orders'}
            </Link>
            <Link to="/home/users" className="nav-item">
              <FaUsers className="nav-icon" />
              {isSidebarExpanded && 'Users'}
            </Link>
          </nav>

          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> {isSidebarExpanded && 'Logout'}
          </button>
        </aside>

        <main className={`main-content ${!isSidebarExpanded ? 'expanded' : ''}`}>

          <header className="dashboard-header">
              <div className="header-left">
                <h3>
                  Welcome, {currentUser?.name || 'Admin'}
                </h3>
              </div>
              <div className="quick-actions">
              <button 
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              {/* <Link to="/admin/add-product" className="action-btn">
                <FaPlus /> {isSidebarExpanded && 'Add Product'}
              </Link> */}
            </div>
          </header>
          
          {location.pathname === '/home' ? (
          // Dashboard content
          <>
            
            <div className="stats-grid">
            <div className="stat-card">
              <FaList className="stat-icon" />
              <h3>Total Orders</h3>
              {/* <p>{stats.totalOrders}</p> */}
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h3>Total Users</h3>
              {/* <p>{stats.totalUsers}</p> */}
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <h3>Total Revenue</h3>
              {/* <p>${stats.totalRevenue.toLocaleString()}</p> */}
            </div>
          </div>
          </>
        ) : (
          // Nested route content
          <div className="content-container">
            <header>{/* Header with title based on route */}</header>
            <Outlet /> {/* This renders nested routes */}
          </div>
        )}
        </main>
    </div>
    
  );
};

export default Home;