import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const draftData = location.state?.draftData || {};
  const stripe = useStripe();
  const elements = useElements();

  // Existing state remains the same
  const [rates, setRates] = useState({
    baseRate: draftData.rate || 0,
    featureRate: draftData.featureRate || 0,
    socialMediaRate: draftData.socialMediaRate || 0
  });

    useEffect(() => {
      const fetchRates = async () => {
        try {
          const response = await axios.get('/job/offer/rate');
          const base = parseFloat(response.data?.base_rate) || 0;
          const feature = draftData.featured === 'Yes' 
            ? parseFloat(response.data?.feature_rate) || 0 
            : 0;
          const social = draftData.socialShare 
            ? parseFloat(response.data?.social_share_rate) || 0 
            : 0;

          setRates({
            baseRate: base,
            featureRate: feature,
            socialMediaRate: social
          });
        } catch (error) {
          console.error('Error fetching rates:', error);
          // Set default rates if API fails
          setRates({
            baseRate: 50, // Default fallback value
            featureRate: 25,
            socialMediaRate: 15
          });
        } finally {
          setLoadingRates(false);
        }
      };

      // Always fetch rates if no draft data
      if (!draftData.rate && !draftData.featureRate && !draftData.socialMediaRate) {
        fetchRates();
      } else {
        // Use draft data if available
        setRates({
          baseRate: draftData.rate || 0,
          featureRate: draftData.featureRate || 0,
          socialMediaRate: draftData.socialMediaRate || 0
        });
        setLoadingRates(false);
      }
    }, [draftData]);

  const [paymentDetails, setPaymentDetails] = useState({
    card_holder_name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    email: draftData.email || '',
  });

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeMsg({ text: 'Please enter a promo code', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('/api/validate-promo', { 
        code: promoCode,
        subtotal: subtotal
      });
      
      if (response.data.valid) {
        setPromoDiscount(response.data.discount);
        setPromoCodeMsg({ 
          text: response.data.message || 'Promo code applied successfully!',
          type: 'success'
        });
      } else {
        setPromoDiscount(0);
        setPromoCodeMsg({ 
          text: response.data.message || 'Invalid promo code',
          type: 'error'
        });
      }
    } catch (error) {
      setPromoCodeMsg({ 
        text: 'Error applying promo code. Please try again.',
        type: 'error'
      });
    }
  };

  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeMsg, setPromoCodeMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState('');
  const [loadingRates, setLoadingRates] = useState(true);
  const currentYear = new Date().getFullYear();
  // const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  // const years = Array.from({ length: 40 }, (_, i) => currentYear + i);
  const subtotal = rates.baseRate + rates.featureRate + rates.socialMediaRate;
  const totalAmount = subtotal - promoDiscount;

  // Card Element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#495057',
        '::placeholder': {
          color: '#6c757d',
        },
        padding: '10px',
      },
      invalid: {
        color: '#dc3545',
        iconColor: '#dc3545'
      }
    },
    hidePostalCode: true
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'card_holder_name', 'street', 'city', 'state',
      'zip', 'country', 'phone', 'email'
    ];

    requiredFields.forEach(field => {
      if (!paymentDetails[field]) newErrors[field] = 'This field is required';
    });

    if (!/\S+@\S+\.\S+/.test(paymentDetails.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Payment submission
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    if (!stripe || !elements) {
      setErrors(prev => ({ ...prev, form: 'Payment system not available' }));
      setIsSubmitting(false);
      return;
    }

    try {
      let paymentMethod = null;
      if (totalAmount > 0) {
        const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            name: paymentDetails.card_holder_name,
            email: paymentDetails.email,
            phone: paymentDetails.phone,
            address: {
              line1: paymentDetails.street,
              city: paymentDetails.city,
              state: paymentDetails.state,
              postal_code: paymentDetails.zip,
              country: paymentDetails.country
            }
          }
        });

        if (error) {
          setCardError(error.message);
          throw error;
        }
        paymentMethod = pm;
      }

      const formPayload = {
        ...paymentDetails,
        ...rates,
        promoCode,
        promoDiscount,
        totalAmount,
        paymentMethodId: paymentMethod?.id,
        postId: draftData.id,
        type: 'jobOffer'
      };

      const response = await axios.post('/ads/final/post', formPayload);
      
      if (response.data.success) {
        // Handle successful payment
        alert('Payment successful!');
        // Redirect or clear form
      } else {
        throw new Error('Payment failed');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setErrors(prev => ({
        ...prev, 
        form: error.response?.data?.error || 'Payment failed'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRates) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading rates...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="payment-section py-5">
       <div className="container">
        <div className="payment-card shadow-lg">
          <div className="row g-0">
            {/* Billing Info Column */}
            <div className="col-lg-6 billing-col">
              <div className="office-use-note p-4 bg-light border-bottom">
                <h5 className="text-center text-muted mb-2">
                  <i className="bi bi-lock-fill me-2"></i>
                  For Office Use Only
                </h5>
                <p className="text-center text-muted small mb-0">
                  Personal information will not be published publicly
                </p>
              </div>

              <div className="p-4">
                <h3 className="mb-4 fw-bold text-primary">
                  <i className="bi bi-credit-card me-2"></i>
                  Billing Information
                </h3>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Name on Card*</label>
                    <input
                      type="text"
                      name="card_holder_name"
                      className={`form-control form-control-lg ${errors.card_holder_name ? 'is-invalid' : ''}`}
                      value={paymentDetails.card_holder_name}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                    />
                    {errors.card_holder_name && 
                      <div className="invalid-feedback">{errors.card_holder_name}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Billing Address*</label>
                    <input
                      type="text"
                      name="street"
                      className={`form-control form-control-lg ${errors.street ? 'is-invalid' : ''}`}
                      value={paymentDetails.street}
                      onChange={handlePaymentChange}
                      placeholder="123 Main Street"
                    />
                    {errors.street && 
                      <div className="invalid-feedback">{errors.street}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">City*</label>
                    <input
                      type="text"
                      name="city"
                      className={`form-control form-control-lg ${errors.city ? 'is-invalid' : ''}`}
                      value={paymentDetails.city}
                      onChange={handlePaymentChange}
                      placeholder="New York"
                    />
                    {errors.city && 
                      <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">State*</label>
                    <select 
                      name="state"
                      className={`form-select form-select-lg ${errors.state ? 'is-invalid' : ''}`}
                      value={paymentDetails.state}
                      onChange={handlePaymentChange}
                    >
                      <option value="">Select State</option>
                      {/* Add actual state options here */}
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                    </select>
                    {errors.state && 
                      <div className="invalid-feedback">{errors.state}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">ZIP Code*</label>
                    <input
                      type="text"
                      name="zip"
                      className={`form-control form-control-lg ${errors.zip ? 'is-invalid' : ''}`}
                      value={paymentDetails.zip}
                      onChange={handlePaymentChange}
                      placeholder="10001"
                    />
                    {errors.zip && 
                      <div className="invalid-feedback">{errors.zip}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Country*</label>
                    <select 
                      name="country"
                      className={`form-select form-select-lg ${errors.country ? 'is-invalid' : ''}`}
                      value={paymentDetails.country}
                      onChange={handlePaymentChange}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      {/* Add more country options */}
                    </select>
                    {errors.country && 
                      <div className="invalid-feedback">{errors.country}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                      value={paymentDetails.phone}
                      onChange={handlePaymentChange}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && 
                      <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                      value={paymentDetails.email}
                      onChange={handlePaymentChange}
                      placeholder="john@example.com"
                    />
                    {errors.email && 
                      <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 payment-summary-col bg-light">
              <div className="p-4 h-100">
                <div className="sticky-summary">
                  <h3 className="mb-4 fw-bold text-danger">
                    <i className="bi bi-receipt me-2"></i>
                    Order Summary
                  </h3>

                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <div className="price-breakdown">
                        <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Base Job Posting:</span>
                              <span className="fw-bold">${rates.baseRate.toFixed(2)}</span>
                          </div>
                          
                          {rates.featureRate > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                  <span className="text-muted">Featured Upgrade:</span>
                                  <span className="fw-bold">+${rates.featureRate.toFixed(2)}</span>
                              </div>
                          )}

                          {rates.socialMediaRate > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                  <span className="text-muted">Social Media Promotion:</span>
                                  <span className="fw-bold">+${rates.socialMediaRate.toFixed(2)}</span>
                              </div>
                          )}

                        {/* Promo Code Section */}
                        <div className="promo-code-section mt-3 pt-3 border-top">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter promo code"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button 
                              className="btn btn-outline-danger"
                              type="button"
                              onClick={applyPromoCode}
                            >
                              Apply
                            </button>
                          </div>
                          {promoCodeMsg.text && (
                            <div className={`small ${promoCodeMsg.type === 'success' ? 'text-success' : 'text-danger'}`}>
                              {promoCodeMsg.text}
                            </div>
                          )}
                        </div>

                        {promoDiscount > 0 && (
                          <div className="d-flex justify-content-between mt-2">
                            <span className="text-muted">Promo Discount:</span>
                            <span className="fw-bold text-success">-${promoDiscount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      <hr className="my-3" />

                      <div className="d-flex justify-content-between fs-5">
                        <span className="text-muted">Total:</span>
                        <span className="fw-bold text-danger">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="payment-details">
                    <h5 className="mb-3 fw-bold text-danger">
                      <i className="bi bi-credit-card-2-front me-2"></i>
                      Payment Details
                    </h5>

                    <form onSubmit={handleSubmitPayment}>
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          {/* Card Holder Name remains same */}
                          <div className="mb-4">
                            <label className="form-label">Card Holder Name*</label>
                            <input
                              type="text"
                              name="card_holder_name"
                              className={`form-control form-control-lg ${errors.card_holder_name ? 'is-invalid' : ''}`}
                              value={paymentDetails.card_holder_name}
                              onChange={handlePaymentChange}
                              placeholder="John Doe"
                            />
                            {errors.card_holder_name && 
                              <div className="invalid-feedback">{errors.card_holder_name}</div>}
                          </div>

                          {/* Stripe Card Element */}
                          <div className="mb-4">
                            <label className="form-label">Card Details*</label>
                            <div className={`stripe-card-element ${cardError ? 'is-invalid' : ''}`}>
                              <CardElement 
                                options={cardElementOptions}
                                onChange={(e) => {
                                  setCardError(e.error?.message || '');
                                }}
                              />
                            </div>
                            {cardError && (
                              <div className="invalid-feedback d-block">{cardError}</div>
                            )}
                          </div>

                          {errors.form && (
                            <div className="alert alert-danger mt-3">
                              {errors.form}
                            </div>
                          )}
                          
                          <button 
                            type="submit" 
                            className="btn btn-primary btn-lg w-100 mt-2"
                            disabled={isSubmitting || (totalAmount > 0 && !stripe)}
                          >
                            {isSubmitting ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;