import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Design/Index.css';
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';

const BannerRates = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editing, setEditing] = useState({ id: null, field: '' });
    const [editValue, setEditValue] = useState('');

    const fieldMap = {
        'rate': 'rate',
        'feature-rate': 'feature_rate',
        'social-rate': 'social_share_rate'
    };

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/admin/ad-subcategories', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setSubcategories(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError('Failed to connect to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleEdit = (subcategory, field) => {
        setEditing({ id: subcategory.id, field });
        setEditValue(subcategory[field] === 'free' ? 'free' : subcategory[field].toString());
    };

    const handleCancel = () => {
        setEditing({ id: null, field: '' });
        setEditValue('');
    };

    const handleSave = async (id, field) => {
        try {
            const inputValue = editValue.trim().toLowerCase();

            if (!inputValue) throw new Error('Please enter a value');
            if (inputValue !== 'free' && isNaN(inputValue)) {
                throw new Error('Invalid value - must be number or "free"');
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/admin/update-subcategories/${field}/${id}`,
                { value: inputValue },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: (status) => status < 500
                }
            );

            if (response.data.success) {
                setSubcategories(subcategories.map(subcat =>
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
        <div className="ad-rate-container">
            <div className="header-section">
                <h1 className="page-title">
                    <FaEdit className="header-icon" />
                    Manage Ad Rates
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

            <div className="rates-table-wrapper">
                <table className="rates-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Regular</th>
                            <th>Featured</th>
                            <th>Social</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(subcat => (
                            <tr key={subcat.id} className={editing.id === subcat.id ? 'editing-row' : ''}>
                                <td className="category-name">{subcat.name}</td>

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

                                {/* Feature Rate */}
                                <td>
                                    {editing.id === subcat.id && editing.field === 'feature_rate' ? (
                                        <RateEditor
                                            value={editValue}
                                            onChange={setEditValue}
                                            onSave={() => handleSave(subcat.id, 'feature-rate')}
                                            onCancel={handleCancel}
                                        />
                                    ) : (
                                        <div className="rate-display">
                                            {formatRate(subcat.feature_rate)}
                                            <button
                                                onClick={() => handleEdit(subcat, 'feature_rate')}
                                                className="icon-button"
                                                title="Edit Featured Rate"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>

                                {/* Social Rate */}
                                <td>
                                    {editing.id === subcat.id && editing.field === 'social_share_rate' ? (
                                        <RateEditor
                                            value={editValue}
                                            onChange={setEditValue}
                                            onSave={() => handleSave(subcat.id, 'social-rate')}
                                            onCancel={handleCancel}
                                        />
                                    ) : (
                                        <div className="rate-display">
                                            {formatRate(subcat.social_share_rate)}
                                            <button
                                                onClick={() => handleEdit(subcat, 'social_share_rate')}
                                                className="icon-button"
                                                title="Edit Social Rate"
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

const RateEditor = ({ value, onChange, onSave, onCancel }) => (
    <div className="rate-editor">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rate-input"
            placeholder="Amount or 'free'"
        />
        <div className="editor-actions">
            <button
                onClick={onSave}
                className="action-button outlined-button save-outline"
                title="Save"
            >
                <FaSave size={14} />
            </button>
            <button
                onClick={onCancel}
                className="action-button outlined-button cancel-outline"
                title="Cancel"
            >
                <FaTimes size={14} />
            </button>
        </div>
    </div>
);

export default BannerRates;
