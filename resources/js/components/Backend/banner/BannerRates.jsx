// src/components/BannerRates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Design/BannerRates.css';
import { FaEdit, FaSave, FaTimes, FaCheckCircle, FaDollarSign, FaStar, FaShareAlt } from 'react-icons/fa';

const BannerRates = () => {
  const [bannerCategories, setBannerCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editing, setEditing] = useState({ id: null, field: '' });
  const [editValue, setEditValue] = useState('');

  // Field mapping for API calls
  const fieldMap = {
    'rate': 'rate',
  };

  // Fetch banner categories from backend
  useEffect(() => {
    const fetchBannerCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/admin/banner/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setBannerCategories(response.data.banner_categories);
        } else {
          setError(response.data.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBannerCategories();
  }, []);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Start editing a rate
  const handleEdit = (subcategory, field) => {
    setEditing({ id: subcategory.id, field });
    setEditValue(subcategory[field] === 'free' ? 'free' : subcategory[field].toString());
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing({ id: null, field: '' });
    setEditValue('');
  };

  // Save updated rate
  const handleSave = async (id, field) => {
    try {
      const inputValue = editValue.trim().toLowerCase();

      if (!inputValue) throw new Error('Please enter a value');
      if (inputValue !== 'free' && isNaN(inputValue)) {
        throw new Error('Invalid value - must be number or "free"');
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/admin/update-bannerCategories/${field}/${id}`,
        { value: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setBannerCategories(bannerCategories.map(subcat =>
          subcat.id === id ? {
            ...subcat,
            [fieldMap[field]]: inputValue === 'free' ? 'free' : parseFloat(inputValue).toFixed(2)
          } : subcat
        ));
        setSuccessMessage('Rate updated successfully!');
        setEditing({ id: null, field: '' });
        setError('');
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update error');
    }
  };

  // Format rate display
  const formatRate = (rate) => {
    if (!rate) return <span className="text-muted">-</span>;
    if (rate.toString().toLowerCase() === 'free') return <span className="text-success">Free</span>;
    return <span className="text-primary">${parseFloat(rate).toFixed(2)}</span>;
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading rates...</p>
    </div>
  );

  return (
    <div className="banner-rates-container">
      <div className="header-section">
        <h1 className="page-title">
          <FaEdit className="header-icon" />
          Manage Banner Rates
        </h1>

        {successMessage && (
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            {error}
            <button onClick={() => setError('')} className="close-button">
              &times;
            </button>
          </div>
        )}
      </div>

      <div className="rates-table-container">
        <table className="rates-table">
          <thead>
            <tr>
              <th>Category</th>
              <th className="rate-column">
                <FaDollarSign className="rate-icon" />Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {bannerCategories.map(subcat => (
              <tr key={subcat.id} className={editing.id === subcat.id ? 'editing-row' : ''}>
                <td className="category-name">
                  <div className="category-info">
                    <span className="category-title">{subcat.name}</span>
                    <span className="category-size">{subcat.size}</span>
                  </div>
                </td>

                {/* Regular Rate */}
                <td>
                  {editing.id === subcat.id && editing.field === 'rate' ? (
                    <RateEditor
                      value={editValue}
                      onChange={setEditValue}
                      onSave={() => handleSave(subcat.id, 'rate')}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <div className="rate-display">
                      {formatRate(subcat.rate)}
                      <button
                        onClick={() => handleEdit(subcat, 'rate')}
                        className="icon-button"
                        title="Edit Regular Rate"
                      >
                        <FaEdit size={16} />
                      </button>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Rate Editor Component
const RateEditor = ({ value, onChange, onSave, onCancel }) => (
  <div className="rate-editor">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rate-input"
      placeholder="Amount or 'free'"
      autoFocus
    />
    <div className="editor-actions">
      <button
        onClick={onSave}
        className="action-button save-button"
        title="Save"
      >
        <FaSave size={14} />
      </button>
      <button
        onClick={onCancel}
        className="action-button cancel-button"
        title="Cancel"
      >
        <FaTimes size={14} />
      </button>
    </div>
  </div>
);

export default BannerRates;
