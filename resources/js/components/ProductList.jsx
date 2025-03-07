import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate();

  // ... existing states
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock updater
  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  // Format time function
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

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


  // Add this delete handler function inside your component
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        let token = localStorage.getItem('token');
        await axios.delete(`api/delete/products/${productId}`, 
          {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
          }
        }
      );
        // Remove deleted product from state
        setProducts(prev => prev.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

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
  // if(products){
  //   return (
  //     <div>
  //       <h1 style={{color: "red", background: "tomato", textAlign: "center", padding: "25px"}}>Hi product ache, kintu tumi pabena</h1>
  //     </div>
  //   );
  // }
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

  return (
    <div className="container p-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <span className="display-4 mb-3 mb-md-0 d-inline">Newly Created data... . ..</span>
        <div className="text-white" style={{ fontSize: '1.2rem' }}>
            {formatTime(currentTime)}
          </div>
        <Link 
          to="/admin-dashboard" 
          className="btn btn-primary btn-lg px-4"
        >
          Add Product
        </Link>
      </div>
  
      {/* Product List Section */}
      <div className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
          <h5 className="m-0 fw-bold">Products List</h5>
          <span className="badge bg-dark">{products.length} items</span>
        </div>
        
        {/* Responsive Grid Layout */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-secondary text-white p-5 text-center" style={{ height: '200px' }}>
                    No Image
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted flex-grow-1">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="h5">${product.price}</span>
                    <div className="btn-group">
                      <button 
                        className="btn btn-info text-white"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-danger text-white ms-2"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;








// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './ProductList.css';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const navigate = useNavigate();

//   // Fetch products with pagination
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`/products?page=${page}`);
//         const newProducts = response.data.data;
        
//         setProducts(prev => [...prev, ...newProducts]);
//         setHasMore(response.data.current_page < response.data.last_page);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error:', error);
//         setError('Failed to fetch products');
//         setLoading(false);
//       }
//     };

//     if (hasMore) {
//       fetchProducts();
//     }
//   }, [page]);

//   // Infinite scroll handler
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 1 >= 
//         document.documentElement.offsetHeight &&
//         !loading && hasMore
//       ) {
//         setPage(prev => prev + 1);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loading, hasMore]);

//   // Sticky header styles
//   const stickyHeaderStyle = {
//     position: 'sticky',
//     top: 0,
//     zIndex: 1000,
//     background: 'white',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     padding: '1rem 0'
//   };

//   // Loading/error states remain the same...

//   return (
//     <div className="container p-4">
//       {/* Sticky Header Section */}
//       <div 
//         className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4"
//         style={stickyHeaderStyle}
//       >
//         <span className="display-4 mb-3 mb-md-0 d-inline">Admin Dashboard</span>
//         <Link 
//           to="/admin-dashboard" 
//           className="btn btn-primary btn-lg px-4"
//         >
//           Add Product
//         </Link>
//       </div>

//       {/* Product List */}
//       <div className="d-flex flex-column gap-3" style={{ marginTop: '80px' }}>
//         <div 
//           className="d-flex justify-content-between align-items-center bg-light p-3 rounded"
//           style={stickyHeaderStyle}
//         >
//           <h5 className="m-0 fw-bold">Products List</h5>
//           <span className="badge bg-dark">{products.length} items</span>
//         </div>

//         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
//           {products.map((product) => (
//             // Your existing product card JSX
//           ))}
//         </div>

//         {loading && <div className="text-center my-4">Loading more products...</div>}
//         {!hasMore && <div className="text-center my-4">No more products to load</div>}
//       </div>
//     </div>
//   );
// };

// export default ProductList;