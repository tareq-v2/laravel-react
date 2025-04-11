import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token');
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

  const handleLogout = async () => {
    console.log('loging out');
    try {
      await axios.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <div className="navbar-links">
          {isAuthenticated ? (
              <>
              <Link to="/home" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-link">Logout</button>
              </>
          ) : (
              <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
              </>
          )}
      </div>
      <h1>Admin Dashboard</h1>
      <Link to="/admin-dashboard" className="nav-link">Add Product</Link>
      <ProductList products={products} />
    </div>
  );
};

export default Home;