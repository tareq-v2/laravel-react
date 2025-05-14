import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Design/Index.css';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AdRates = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

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

    const handleEdit = (subcategory) => {
        setEditingId(subcategory.id);
        setEditValue(subcategory.rate === 'free' ? 'free' : subcategory.rate.toString());
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

   const handleSave = async (id) => {
    try {
        // Trim and lowercase the input
        const inputValue = editValue.trim().toLowerCase();
        
        // Validate input
        if (inputValue === '') {
            throw new Error('Please enter a value');
        }

        // Determine if the input is 'free' or a numeric value
        let rateValue = inputValue === 'free' ? 'free' : inputValue;
        
        // If it's not 'free', validate it's a number
        if (rateValue !== 'free') {
            const parsedValue = parseFloat(rateValue);
            if (isNaN(parsedValue)) {
                throw new Error('Please enter a valid number or "free"');
            }
            rateValue = parsedValue.toString();
        }

        const token = localStorage.getItem('token');
        const response = await axios.put(
            `/admin/update-subcategories/rate/${id}`,
            { rate: rateValue },
            { 
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: (status) => status < 500 // Don't throw for 422
            }
        );

        if (response.data.success) {
            setSubcategories(subcategories.map(subcat => 
                subcat.id === id ? { ...subcat, rate: rateValue } : subcat
            ));
            setEditingId(null);
            setError('');
        } else {
            setError(response.data.message || 'Failed to update rate');
        }
    } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to update rate. Please try again.');
    }
};

    const formatRate = (rate) => {
        if (!rate && rate !== 0) return 'N/A';
        if (rate.toString().toLowerCase() === 'free') return 'Free';
        return `$${parseFloat(rate).toFixed(2)}`;
    };

    if (loading) return <div className="loading">Loading rates...</div>;
    {error && (
    <div className="error-message">
        {error}
        <button onClick={() => setError('')} className="close-error">
            &times;
        </button>
    </div>
)}
    return (
        <div className="ad-rate-container">
            <h1 className="text-success">Manage Ad Rates</h1>
            <div className="rates-table-container">
                <table className="rates-table">
                    <thead>
                        <tr>
                            <th>Sub Category</th>
                            <th>Current Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(subcat => (
                            <tr key={subcat.id}>
                                <td>{subcat.name}</td>
                                <td>
                                    {editingId === subcat.id ? (
                                        <div className="rate-edit-container">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="rate-input"
                                                placeholder="Enter amount or 'free'"
                                            />
                                            <small className="rate-hint">
                                                Enter numeric value or "free"
                                            </small>
                                        </div>
                                    ) : (
                                        formatRate(subcat.rate)
                                    )}
                                </td>
                                <td className="actions-cell">
                                    {editingId === subcat.id ? (
                                        <>
                                            <button 
                                                onClick={() => handleSave(subcat.id)}
                                                className="btn-save"
                                            >
                                                <FaSave /> Save
                                            </button>
                                            <button 
                                                onClick={handleCancel}
                                                className="btn-cancel"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleEdit(subcat)}
                                            className="btn-edit"
                                        >
                                            <FaEdit /> Edit
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

export default AdRates;