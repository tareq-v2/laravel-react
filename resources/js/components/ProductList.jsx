import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products'); // Replace with your API endpoint
        console.log('Fetched products:', response.data); // Debugging
        setProducts(response.data); // Update state with fetched products
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error('Error fetching products:', error); // Debugging
        setError('Failed to fetch products. Please try again later.'); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Display loading message while fetching data
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  // Display error message if fetching fails
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  if(products){
    return (
      <div>
        <h1 style={{color: "red", background: "tomato", textAlign: "center", padding: "25px"}}>Hi product ache, kintu tumi pabena</h1>
      </div>
    );
  }
  // Display message if no products are available
  if (!products || products.length === 0) {
    return (
      <div>
        <Link to="/admin-dashboard" className="nav-link">
          Add Product
        </Link>
        <div className="no-products">No products available.</div>
      </div>
    );
  }

  // Render the product list
  return (
    <div className="product-list-container">
      <h1 style={{color: "red", background: "green"}}>What is destiny?</h1>
      {/* <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
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
              <button
                className="view-details-button"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ProductList;