import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Front = () => {
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
    <div className="container mt-5 bg-light">
      <h1 className="text-center">Welcome to Armenian Advertiser.</h1>
    </div>
  );
};

export default Front;