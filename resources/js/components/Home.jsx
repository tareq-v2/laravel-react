import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaUsers, FaChartLine, FaSignOutAlt, FaPlus, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './AdminDashboard.css';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          axios.get('/products'),
          // axios.get('/admin/stats')
        ]);

        setProducts(productsRes.data);
        setStats({
          totalProducts: statsRes.data.total_products,
          totalOrders: statsRes.data.total_orders,
          totalUsers: statsRes.data.total_users,
          // totalRevenue: statsRes.data.total_revenue
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
            <h2>{isSidebarExpanded ? 'Admin Panel' : 'D'}</h2>
            <button className="toggle-btn" onClick={toggleSidebar}>
              {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
          
          <nav className="nav-menu">
            <Link to="/admin-dashboard" className="nav-item">
              <FaChartLine className="nav-icon" />
              {isSidebarExpanded && 'Dashboard'}
            </Link>
            <Link to="/admin/products" className="nav-item">
              <FaBox className="nav-icon" />
              {isSidebarExpanded && 'Products'}
            </Link>
            <Link to="/admin/orders" className="nav-item">
              <FaList className="nav-icon" />
              {isSidebarExpanded && 'Orders'}
            </Link>
            <Link to="/admin/users" className="nav-item">
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
              <h1>Welcome, Admin</h1>
            </div>
            <div className="quick-actions">
              <Link to="/admin/add-product" className="action-btn">
                <FaPlus /> {isSidebarExpanded && 'Add Product'}
              </Link>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <FaBox className="stat-icon" />
              <h3>Total Products</h3>
              {/* <p>{stats.totalProducts}</p> */}
            </div>
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

          <section className="recent-activity">
            <h2>Recent Products</h2>
            <div className="products-grid">
              {products.slice(0, 4).map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
    </div>
    
  );
};

export default Home;