import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ProductList products={products} />
    </div>
  );
};

export default Home;