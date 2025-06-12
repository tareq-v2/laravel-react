import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';

const DirectoryRates = () => {
    const [directoryRates, setDirectoryRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editing, setEditing] = useState({ id: null });
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchDirectoryRates = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/admin/directory/rates', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    // Sort rates by 'order' field
                    const sortedRates = response.data.data.sort((a, b) => a.order - b.order);
                    setDirectoryRates(sortedRates);
                } else {
                    setError(response.data.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError('Failed to connect to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchDirectoryRates();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleEdit = (rate) => {
        setEditing({ id: rate.id });
        setEditValue(rate.amount === 'free' ? 'free' : rate.amount.toString());
    };

    const handleCancel = () => {
        setEditing({ id: null });
        setEditValue('');
    };

    const handleSave = async (id) => {
        try {
            const inputValue = editValue.trim().toLowerCase();
            
            if (!inputValue) throw new Error('Please enter a value');
            if (inputValue !== 'free' && isNaN(inputValue)) {
                throw new Error('Invalid value - must be number or "free"');
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/admin/update-directory-rates/${id}`,
                { value: inputValue },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: (status) => status < 500
                }
            );

            if (response.data.success) {
                setDirectoryRates(directoryRates.map(rate => 
                    rate.id === id ? { 
                        ...rate, 
                        amount: inputValue === 'free' ? 'free' : parseFloat(inputValue).toFixed(2)
                    } : rate
                ));
                setSuccessMessage('Rate updated successfully!');
                setEditing({ id: null });
                setError('');
            } else {
                setError(response.data.message || 'Update failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update error');
        }
    };

    const formatAmount = (amount) => {
        if (!amount) return <span className="text-muted">-</span>;
        if (amount.toString().toLowerCase() === 'free') return <span className="text-success">Free</span>;
        return <span className="text-primary">${parseFloat(amount).toFixed(2)}</span>;
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
                    Manage Directory Rates
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
                            <th>Order</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {directoryRates.map(rate => (
                            <tr key={rate.id} className={editing.id === rate.id ? 'editing-row' : ''}>
                                <td className="category-name">{rate.category}</td>
                                <td className="order">{rate.order}</td>
                                
                                {/* Amount */}
                                <td>
                                    {editing.id === rate.id ? (
                                        <RateEditor
                                            value={editValue}
                                            onChange={setEditValue}
                                            onSave={() => handleSave(rate.id)}
                                            onCancel={handleCancel}
                                        />
                                    ) : (
                                        <div className="rate-display">
                                            {formatAmount(rate.amount)}
                                        </div>
                                    )}
                                </td>
                                
                                <td>
                                    {editing.id === rate.id ? (
                                        <div className="editor-actions">
                                            <button 
                                                onClick={() => handleSave(rate.id)}
                                                className="action-button outlined-button save-outline"
                                                title="Save"
                                            >
                                                <FaSave size={14} />
                                            </button>
                                            <button 
                                                onClick={handleCancel}
                                                className="action-button outlined-button cancel-outline"
                                                title="Cancel"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEdit(rate)}
                                            className="icon-button"
                                            title="Edit Amount"
                                        >
                                            <FaEdit size={16} />
                                        </button>
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

const RateEditor = ({ value, onChange }) => (
    <div className="rate-editor">
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rate-input"
            placeholder="Amount or 'free'"
        />
    </div>
);

export default DirectoryRates;