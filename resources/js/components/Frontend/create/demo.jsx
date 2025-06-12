import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
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
  FaFolderTree // New icon for Directory Management
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

  const [expandedMenus, setExpandedMenus] = useState({
    ads: false,
    directory: false // Added new state for directory management
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
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
            {isSidebarExpanded && 'Dashboard'}
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
                  <span>Ads</span>
                  <span className="chevron">
                    {expandedMenus.ads ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </>
              )}
            </div>
            
            {expandedMenus.ads && isSidebarExpanded && (
              <div className="nav-children open">
                <Link to="/home/ads/history" className="nav-item child">
                  <FaList className="nav-icon" />
                  History
                </Link>
                <Link to="/home/ads/categories" className="nav-item child">
                  <FaList className="nav-icon" />
                  Categories
                </Link>
                <Link to="/home/ads/subcategories" className="nav-item child">
                  <FaList className="nav-icon" />
                  Sub Categories
                </Link>
                <Link to="/home/ads/rates" className="nav-item child">
                  <FaList className="nav-icon" />
                  Rates
                </Link>
              </div>
            )}
          </div>

          {/* New Directory Management Section */}
          <div className="nav-parent">
            <div 
              className="nav-item" 
              onClick={() => toggleMenu('directory')}
              data-tooltip="Directory Management"
            >
              <FaFolderTree className="nav-icon" />
              {isSidebarExpanded && (
                <>
                  <span>Directory</span>
                  <span className="chevron">
                    {expandedMenus.directory ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </>
              )}
            </div>
            
            {expandedMenus.directory && isSidebarExpanded && (
              <div className="nav-children open">
                <Link to="/home/directory/categories" className="nav-item child">
                  <FaList className="nav-icon" />
                  Categories
                </Link>
                <Link to="/home/directory/subcategories" className="nav-item child">
                  <FaList className="nav-icon" />
                  Sub Categories
                </Link>
                <Link to="/home/directory/cities" className="nav-item child">
                  <FaList className="nav-icon" />
                  Cities
                </Link>
                <Link to="/home/directory/localities" className="nav-item child">
                  <FaList className="nav-icon" />
                  Localities
                </Link>
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          <Link to="/home/blogs" className="nav-item" data-tooltip="Chat">
            <FaComments className="nav-icon" />
            {isSidebarExpanded && 'Manage Blogs'}
          </Link>
          <Link to="/home/users" className="nav-item" data-tooltip="Users">
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