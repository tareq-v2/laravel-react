import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Fetching product details...'); // Debugging
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        console.log('Product data:', response.data); // Debugging
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error); // Debugging
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  console.log('Rendering ProductDetails:', { product, loading, error }); // Debugging

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-message">
        <p>Product not found.</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-image-container">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300'; // Fallback image
            }}
          />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>
          <button className="back-button" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;