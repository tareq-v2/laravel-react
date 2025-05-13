
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Router, Route } from 'react-router-dom';
import { LanguageProvider } from './components/Frontend/src/context/LanguageContext';
import { ThemeProvider } from './components/Frontend/src/context/ThemeContext';
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
import CustomerDashboard from './components/Frontend/Customer/Dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AdvertiseWithUs from './components/Frontend/AdvertiseWithUs';
import TermsAndConditions from './components/Frontend/TermsAndCondition';
import ContactForm from './components/Frontend/ContactUs';
import AboutUs from './components/Frontend/AboutUs';
import PrivacyPolicy from './components/Frontend/PrivacyPolicy';
import AdSubCategories from './components/Frontend/AdSubCategories';
import AdSubCategoriesListing from './components/Frontend/AdSubCategoriesListing';
import CreateJobOfferForm from './components/Frontend/create/JobOfferForm';
import JobOfferList from './components/Frontend/adCategories/listing/JobOfferList';
import JobWantedResume from './components/Frontend/adCategories/listing/JobWantedResume';
import LocalServicesLosAngeles from './components/Frontend/adCategories/listing/LocalServicesLosAngeles';
import LocalServicesArmenia from './components/Frontend/adCategories/listing/LocalServicesArmenia';

import HousingApartmentHouseRent from './components/Frontend/adCategories/listing/HousingApartmentHouseRent';
import HousingWanted from './components/Frontend/adCategories/listing/HousingWanted';
import HousingRoommatesShared from './components/Frontend/adCategories/listing/HousingRoommatesShared';
import HousingOfficeCommercialRent from './components/Frontend/adCategories/listing/HousingOfficeCommercialRent';
import HousingVacationRentals from './components/Frontend/adCategories/listing/HousingVacationRentals';
import HousingArmeniaRentals from './components/Frontend/adCategories/listing/HousingArmeniaRentals';
import HousingInternationalRentals from './components/Frontend/adCategories/listing/HousingInternationalRentals';
import HousingOtherRentals from './components/Frontend/adCategories/listing/HousingOtherRentals';
import Payment from './components/Frontend/create/Payment';
import UserManagement from './components/Backend/users/Index';

function App() {
  const googleClientId = '725102962027-hbrvvh2u965in4g86qis5nt6a6te3s2p.apps.googleusercontent.com';

  return (
    <LanguageProvider>
      <BrowserRouter>
      
      <GoogleOAuthProvider clientId={googleClientId}>
        <Routes>
          <Route
              path="/user/dashboard"
              element={
                  <ProtectedRoute allowedRoles={['customer', 'admin']}>
                    <Layout><CustomerDashboard /></Layout>
                  </ProtectedRoute>
              }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <Layout><Payment /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
              path="/admin/dashboard"
              element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
              }
          />
          <Route
              path="/ad/sub/categories/:id"
              element={<Layout><AdSubCategories /></Layout>}
          />
          <Route
              path="/ad/sub/categories/:subCategoryId"
              element={<Layout><AdSubCategoriesListing /></Layout>}
          />

          <Route
              path="/job/offer/list"
              element={<Layout><JobOfferList /></Layout>}
          />

          <Route
              path="/create-job-offer"
              element={<Layout><CreateJobOfferForm /></Layout>}
          />

          <Route
              path="/job/wanted/resume"
              element={<Layout><JobWantedResume /></Layout>}
          />

          <Route
              path="/housing/apartment-house-rent"
              element={<Layout><HousingApartmentHouseRent /></Layout>}
          />

          <Route
              path="/housing/wanted"
              element={<Layout><HousingWanted /></Layout>}
          />

          <Route
              path="/housing/roommates-shared"
              element={<Layout><HousingRoommatesShared /></Layout>}
          />

          <Route
              path="/housing/office-commercial-rent"
              element={<Layout><HousingOfficeCommercialRent /></Layout>}
          />

          <Route
              path="/housing/vacation-rentals"
              element={<Layout><HousingVacationRentals /></Layout>}
          />

          <Route
              path="/housing/armenia-rentals"
              element={<Layout><HousingArmeniaRentals /></Layout>}
          />

          <Route
              path="/housing/international-rentals"
              element={<Layout><HousingInternationalRentals /></Layout>}
          />

          <Route
              path="/housing/other-rentals"
              element={<Layout><HousingOtherRentals /></Layout>}
          />

          <Route
              path="/local-services/los-angeles"
              element={<Layout><LocalServicesLosAngeles /></Layout>}
          />

          <Route
              path="/local-services/armenia"
              element={<Layout><LocalServicesArmenia /></Layout>}
          />

          <Route
              path="/advertise/with/us"
              element={<Layout><AdvertiseWithUs /></Layout>}
          />
          <Route
              path="/terms/and/conditions"
              element={<Layout><TermsAndConditions /></Layout>}
          />
          <Route
              path="/contact/us"
              element={<Layout><ContactForm /></Layout>}
          />
          <Route
              path="/about/us"
              element={<Layout><AboutUs /></Layout>}
          />
          <Route
              path="/privacy/policy"
              element={<Layout><PrivacyPolicy /></Layout>}
          />
          <Route path="/" element={<Layout><Front /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />

          {/* Protected Routes */}
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                    <ThemeProvider>
                      <Home />
                    </ThemeProvider>
                </Layout>
              </ProtectedRoute>
            }
          /> */}
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
                <ThemeProvider>
                  <Home/>
                </ThemeProvider>
              </ProtectedRoute>
            }
          >
          <Route
            path="/home/users"
            element={
              <ProtectedRoute>
                <UserManagement/>
              </ProtectedRoute>
            }
          />
          </Route>
          
        </Routes>
      </GoogleOAuthProvider>
      
    </BrowserRouter>
    </LanguageProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);