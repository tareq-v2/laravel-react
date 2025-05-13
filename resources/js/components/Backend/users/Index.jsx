import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Index.css';
import Lottie from 'lottie-react';
import successAnimation from './Design/bird.json';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`  // Add Bearer token to headers
                    }
                }
            );
            console.log(response.data.data);
            setUsers(response.data.data);
        } catch (err) {
            handleError(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('token');
            if (editMode) {
                await axios.post(`/user/edit/${formData.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            } else {
                await axios.post('/user/create', formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2500)
            fetchUsers();
            handleClose();
        } catch (err) {
            handleError(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const authToken = localStorage.getItem('token');
                await axios.delete(`/user/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2500)
                fetchUsers();
            } catch (err) {
                handleError(err);
            }
        }
    };

    const handleEdit = (user) => {
        setFormData(user);
        setEditMode(true);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        setEditMode(false);
        setError('');
    };

    const handleError = (err) => {
        setError(err.response?.data?.message || 'Something went wrong');
        setTimeout(() => setError(''), 5000);
    };

    return (
        
        <div className="user-management-container">
            <div className="header-section">
                <h2>User Management</h2>
                <button 
                    className="create-user-btn"
                    onClick={() => setShowModal(true)}
                >
                    Create New User
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {/* {success && <div className="success-message">{success}</div>} */}
            {success && (
                <div className="text-center lottie-success-container">
                <Lottie 
                    animationData={successAnimation} 
                    style={{ height: 200 }} 
                    loop={false}
                />
                </div>
            )}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="action-buttons">
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editMode ? 'Edit User' : 'Create User'}</h3>
                            <button 
                                className="close-btn"
                                onClick={handleClose}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editMode}
                                />
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                                <button 
                                    type="submit"
                                    className="submit-btn"
                                >
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;