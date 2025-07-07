import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Design/BannerHistory.css';
import Lottie from 'lottie-react';

const BannerHistory = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchAds = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('/admin/ads/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAds(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load ads history');
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ad.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
                            (filter === 'verified' ? ad.is_verified : !ad.is_verified);
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your ads history...</p>
        </div>
    );

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="ad-history-container">
            <div className="controls-header">
                <h2>Ads History</h2>
                <div className="interactive-controls">
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Ads</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="ads-grid">
                {filteredAds.map(ad => (
                    <div key={ad.id} className="ad-card">
                        <div className="ad-card-header">
                            <h6>
                                <Link to={`/posts/${ad.id}`} className="ad-title-link">
                                    {ad.title}
                                </Link>
                            </h6>
                            <span className={`status-badge ${ad.is_verified ? 'verified' : 'pending'}`}>
                                {ad.is_verified ? '✓ Published' : '⏳ Under Review'}
                            </span>
                        </div>

                        <p className="ad-excerpt">{ad.description.substring(0, 100)}...</p>

                        <div className="ad-meta">
                            <div className="meta-item">
                                <span className="meta-label">Created:</span>
                                <span className="meta-value">
                                    {new Date(ad.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {ad.updated_at && (
                                <div className="meta-item">
                                    <span className="meta-label">Last Updated:</span>
                                    <span className="meta-value">
                                        {new Date(ad.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                       <div className="ad-actions">
                        <Link
                            to={`/posts/${ad.id}`}
                            className="public-link-button"
                        >
                            <svg className="button-icon" viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                            </svg>
                            View Ad
                        </Link>
                        <button
                            className="stats-button"
                            onClick={() => {/* Add analytics modal implementation */}}
                        >
                            <svg className="button-icon" viewBox="0 0 24 24" width="18" height="18">
                                <path fill="currentColor" d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>
                            </svg>
                            Statistics
                        </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannerHistory;
