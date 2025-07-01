
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaRegBell, FaCheck } from 'react-icons/fa';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/admin/notifications', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // console.log(response.data.notifications);
            setNotifications(response.data.notifications);
            setError(null);
        } catch (err) {
            setError('Failed to load notifications');
            console.error('Notification error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.post(
                `/admin/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNotifications(prev =>
                prev.filter(n => n.id !== notificationId)
            );
        } catch (err) {
            console.error('Mark read error:', err);
        }
    };

    const handleNotificationClick = (notification) => {
        console.log('Notification clicked:', notification);
        try {
            handleMarkAsRead(notification.id);
        
            // Parse the JSON data string
            const notificationData = JSON.parse(notification.data);
            
            // Get the post_id from the parsed data
            const postId = notificationData.post_id;
            
            // Use either the direct post_id from notification or from parsed data
            const targetPostId = notification.post_id || postId;
            
            if (targetPostId) {
                navigate(`admin/post/verify/${notification.post_type}/${targetPostId}`);
            }
        } catch (err) {
            console.error('Mark read error:', err);
        }
        
        setIsOpen(false);
    };

    return (
        <div className="notification-container">
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
            >
                {notifications.length > 0 ? (
                    <FaBell className="bell-icon" />
                ) : (
                    <FaRegBell className="bell-icon" />
                )}
                {notifications.length > 0 && (
                    <span className="badge">{notifications.length}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        <button
                            className="clear-all"
                            onClick={() => setNotifications([])}
                        >
                            Clear All
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : notifications.length === 0 ? (
                        <div className="empty-state">No new notifications</div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className="notification-item"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="notification-content">
                                    <div className="message">
                                        {JSON.parse(notification.data).message}
                                    </div>
                                    <div className="meta">
                                        <span className="time">
                                            {new Date(notification.created_at).toLocaleTimeString()}
                                        </span>
                                        <span className="date">
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <FaCheck className="read-indicator" />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;