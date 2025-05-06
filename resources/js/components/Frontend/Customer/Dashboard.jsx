import { useState } from 'react';
import '../Design/CustomerDashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Recent Orders</h3>
                <p>5 new orders</p>
              </div>
              <div className="stat-card">
                <h3>Messages</h3>
                <p>2 unread messages</p>
              </div>
              <div className="stat-card">
                <h3>Account Status</h3>
                <p>Verified ✓</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="profile-content">
            <h2>Profile Settings</h2>
            <form className="profile-form">
              <label>Name:</label>
              <input type="text" defaultValue="John Doe" />
              <label>Email:</label>
              <input type="email" defaultValue="john@example.com" />
              <button type="submit">Update Profile</button>
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="orders-content">
            <h2>Order History</h2>
            <div className="order-list">
              <div className="order-item">
                <p>Order #12345 - $99.99 - Shipped</p>
              </div>
              <div className="order-item">
                <p>Order #12346 - $149.99 - Delivered</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-content">
            <h2>Account Settings</h2>
            <div className="security-settings">
              <h3>Security</h3>
              <button>Change Password</button>
              <button>Two-Factor Authentication</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <nav className="tab-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>
      
      <div className="dashboard-main">
        <h1>Welcome to Your Dashboard</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

