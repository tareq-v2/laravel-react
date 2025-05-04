import React, { useState, useEffect, useRef } from 'react';
import VideoSection from './VideoSection';
import MainContent from './MainContent';
import {CompectHeader, DefaultHeader } from './StickyNav';

const Front = () => {
  // const [products, setProducts] = useState([]);

   const [isSticky, setIsSticky] = useState(false);
   const stickyRef = useRef(null);
   const sentinelRef = useRef(null);

  // useEffect(() => {
  //   // Fetch products from the backend
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get('/products');
  //       const transformedProducts = response.data.map((product) => ({
  //         ...product,
  //         discountedPrice: product.price * 0.9,
  //       }));
  //       setProducts(transformedProducts);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  return (
    <>
    <div style={{ position: 'relative' }}>
       <div className="container mt-1 bg-light">
        <VideoSection/>
        <MainContent/>
       </div>
     </div>
    </>
  );
};

export default Front;