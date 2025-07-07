import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaImage,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaPlus,
  FaComments,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaFolder
} from 'react-icons/fa';
import './AdminDashboard.css';
import { useTheme } from './Frontend/src/context/ThemeContext';
import { Outlet, useLocation } from 'react-router-dom';
import NotificationBell from './Backend/Notification';

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

  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleMenu = (menu) => {
    setExpandedMenu(prev => prev === menu ? null : menu);
  };

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
          {/* Dashboard Link */}
          <div className='nav-item' data-tooltip="Analytics">
            <FaChartLine className="nav-icon" />
            {isSidebarExpanded && <span className='menu-title'>Dashboard</span>}
          </div>

          {/* Collapsible Ads Section */}
          <div className="nav-parent">
            <div
              className="nav-item"
              onClick={() => toggleMenu('ads')}
              data-tooltip="Ads"
            >
            <FaBox className="nav-icon" />
            {isSidebarExpanded && (
              <>
                <span className='menu-title'>Ads</span>
                <span className="chevron">
                  {expandedMenu === 'ads' ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </>
            )}
          </div>

          {expandedMenu === 'ads' && isSidebarExpanded && (
            <div className="nav-children open">
              <Link to="/home/ads/history" className="nav-item child">
                <FaList className="nav-icon" />
                <span className="menu-title">History</span>
              </Link>
              <Link to="/home/ads/categories" className="nav-item child">
                <FaList className="nav-icon" />
                <span className="menu-title">Categories</span>
              </Link>
              <Link to="/home/ads/subcategories" className="nav-item child">
                <FaList className="nav-icon" />
                <span className="menu-title">Sub Categories</span>
              </Link>
              <Link to="/home/ads/rates" className="nav-item child">
                <FaList className="nav-icon" />
                <span className="menu-title">Rates</span>
              </Link>
            </div>
          )}
          </div>

          {/* Directory Section */}
          <div className="nav-parent">
            <div
              className="nav-item"
              onClick={() => toggleMenu('directory')}
              data-tooltip="Directory Management"
            >
              <FaFolder className="nav-icon" />
              {isSidebarExpanded && (
                <>
                  <span className='menu-title'>Directory</span>
                  <span className="chevron">
                    {expandedMenu === 'directory' ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </>
              )}
            </div>

            {expandedMenu === 'directory' && isSidebarExpanded && (
              <div className="nav-children open">
                <Link to="/home/directory/history" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className='menu-title'>History</span>
                </Link>
                <Link to="/home/directory/category/status" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className='menu-title'>Category Status</span>
                </Link>
                <Link to="/home/directory/rates" className="nav-item child">
                  <FaList className="nav-icon" />
                  <span className="menu-title">Rates</span>
                </Link>
              </div>
            )}
          </div>

            {/* Banner Section */}
            <div className="nav-parent">
                <div
                    className="nav-item"
                    onClick={() => toggleMenu('banners')}
                    data-tooltip="Banners"
                >
                    <FaImage className="nav-icon" />
                    {isSidebarExpanded && (
                    <>
                        <span className='menu-title'>Banners</span>
                        <span className="chevron">
                        {expandedMenu === 'banners' ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                    </>
                    )}
                </div>

                {expandedMenu === 'banners' && isSidebarExpanded && (
                    <div className="nav-children open">
                    <Link to="/home/banner/history" className="nav-item child">
                        <FaList className="nav-icon" />
                        <span className="menu-title">Banner History</span>
                    </Link>
                    <Link to="/home/banner/categories" className="nav-item child">
                        <FaList className="nav-icon" />
                        <span className="menu-title">Categories</span>
                    </Link>
                    <Link to="/create/banner" className="nav-item child">
                        <FaPlus className="nav-icon" />
                        <span className="menu-title">Create Banner</span>
                    </Link>
                    <Link to="/home/banner/rates" className="nav-item child">
                        <FaList className="nav-icon" />
                        <span className="menu-title">Rates</span>
                    </Link>
                    </div>
                )}
            </div>

          {/* Other Menu Items */}
          <Link to="/home/blogs" className="nav-item" data-tooltip="Chat">
            <FaComments className="nav-icon" />
            {isSidebarExpanded && <span className='menu-title'>Manage Blogs</span>}
          </Link>
          <Link to="/home/users" className="nav-item" data-tooltip="Users">
            <FaUsers className="nav-icon" />
            {isSidebarExpanded && <span className='menu-title'>Users</span>}
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
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </header>

        {location.pathname === '/home' ? (
          // Dashboard content
          <div className='admin-analytics'>
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
          </div>
        ) : (
          // Nested route content
          <div className="content-container">
            <Outlet /> {/* This renders nested routes */}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
