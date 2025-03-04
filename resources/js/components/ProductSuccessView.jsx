import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductSuccessView.css'; // Import the CSS file

const ProductSuccessView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // Get the product data from navigation state

  if (!product) {
    return (
      <div className="error-message">
        <p>No product data found. Please add a product.</p>
        <button onClick={() => navigate('/admin-dashboard')}>Go to Add Product</button>
        <button onClick={() => navigate('/home')}>View All Products</button>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="card-header">
          <h2>🎉 Product Added Successfully!</h2>
          <p>Your product has been added to the inventory.</p>
        </div>
        <div className="product-details">
          <div className="product-image-container">
            <img src={product.image_url} alt={product.name} className="product-image" />
          </div>
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">${product.price}</p>
          </div>
        </div>
        <button className="view-products-btn" onClick={() => navigate('/products')}>
          View All Products
        </button>
      </div>
    </div>
  );
};

export default ProductSuccessView;