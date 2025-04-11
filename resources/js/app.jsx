// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Router, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

// import Layout from './components/Layout';
// import Home from './components/Home';
// import Login from './components/Login';
// import Register from './components/Register';
// import AdminDashboard from './components/AdminDashboard';
// import ProductSuccessView from './components/ProductSuccessView';
// import ProductList from './components/ProductList';
// import ProductDetails from './components/ProductDetails';
// import ProtectedRoute from './components/ProtectedRoute';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// function App() {
//   const googleClientId = process.env.GOOGLE_CLIENT_ID;
//   return (
//     <BrowserRouter>
//         <GoogleOAuthProvider clientId={googleClientId}>
//           <Routes>
//               <Route path="/login" element={<Layout><Login /></Layout>} />
//           </Routes>
//         </GoogleOAuthProvider>
//       <Routes>
//         <Route path="/" element={<Layout><Home /></Layout>} />
//         <Route path="/register" element={<Layout><Register /></Layout>} />
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoute>
//               <Layout><AdminDashboard /></Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <Layout><ProductList /></Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/product/:id"
//           element={
//             <ProtectedRoute>
//               <Layout><ProductDetails /></Layout>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Layout><Home /></Layout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import Layout from './components/Layout';
// import Login from './components/Login';
// import Home from './components/Home';
// import Register from './components/Register';
// import AdminDashboard from './components/AdminDashboard';
// import ProductList from './components/ProductList';
// import ProductDetails from './components/ProductDetails';
// import ProtectedRoute from './components/ProtectedRoute';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ProductSuccessView from './components/ProductSuccessView';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Front from './components/Frontend/Front';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const googleClientId = '725102962027-hbrvvh2u965in4g86qis5nt6a6te3s2p.apps.googleusercontent.com';

  return (
    <BrowserRouter>
      
      <GoogleOAuthProvider clientId={googleClientId}>
        <Routes>
          
          <Route path="/" element={<Layout><Front /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout><Home /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);