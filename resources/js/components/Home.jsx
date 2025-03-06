import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        const transformedProducts = response.data.map((product) => ({
          ...product,
          discountedPrice: product.price * 0.9,
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link to="/admin-dashboard" className="nav-link">Add Product</Link>
      <ProductList products={products} />
    </div>
  );
};

export default Home;