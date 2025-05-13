import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Index.css';

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
            console.log('fsdf')
            const response = await axios.get('users');
            console.log(response.data);
            setUsers(response.data);
        } catch (err) {
            handleError(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`users/${formData.id}`, formData);
            } else {
                await axios.post('users', formData);
            }
            setSuccess('User saved successfully');
            fetchUsers();
            handleClose();
        } catch (err) {
            handleError(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/users/${id}`);
                setSuccess('User deleted successfully');
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
            {success && <div className="success-message">{success}</div>}

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
                        {/* {users.map(user => (
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
                        ))} */}
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