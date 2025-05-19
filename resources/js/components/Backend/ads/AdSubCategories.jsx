import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Design/Index.css';
import { FaEdit, FaTrash, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const AdSubCategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/admin/ad-subcategories?page=${currentPage}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setSubcategories(response.data.data);
                    setTotalPages(response.data.pagination.last_page);
                } else {
                    setError(response.data.message || 'Failed to fetch data');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to connect to the server');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-container">
            <h1 className='text-success'>Ad Sub Categories</h1>

            {/* Subcategories Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rate</th>
                            <th>Icon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(subcat => (
                            <tr key={subcat.id}>
                                <td>{subcat.name}</td>
                                <td>{subcat.rate == 'free' ? 'Free' : `$${subcat.rate}`}</td>
                                <td>
                                    {subcat.icon && (
                                        <img 
                                            src={`http://127.0.0.1:8001/storage/${subcat.icon}`}
                                            alt="icon" 
                                            className="icon-preview"
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaAngleLeft />
                </button>
                
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                
                <button
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaAngleRight />
                </button>
            </div>
        </div>
    );
};

export default AdSubCategories;