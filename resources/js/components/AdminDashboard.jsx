import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import  './AdminDashboard.css';

export default function AdminDashboard() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  const [error, setError] = useState(''); // Add error state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the authentication token from storage
    const token = localStorage.getItem('authToken'); // or your token storage key
    // alert(token)
    try {
      const response = await axios.post('/add/products', product, {
        headers: {
          Authorization: `Bearer ${token}`  // Add Bearer token to headers
        }
      });
  
      if (response.status === 201) {
        // Navigate to the success view with product data
        navigate('/products', { state: { product: response.data.data } });
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Session expired. Please login again.');
            break;
          case 422:
            setError('Validation failed: ' + JSON.stringify(error.response.data.errors));
            break;
          default:
            setError('Product addition failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  
    // Reset the form
    setProduct({
      name: '',
      description: '',
      price: '',
      imageUrl: ''
    });
  };

  return (
    <div className="admin-dashboard">
      <h2>Add a New Product</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}