// src/components/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const draftData = location.state?.draftData || {};
  const stripe = useStripe();
  const elements = useElements();

  // Determine payment type
  const paymentType = draftData?.type || 'jobOffer';

  // State initialization
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

  const [rates, setRates] = useState({
    baseRate: draftData.rate || 0,
    featureRate: draftData.featureRate || 0,
    socialMediaRate: draftData.socialMediaRate || 0
  });

  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCodeMsg, setPromoCodeMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardError, setCardError] = useState('');
  const [loadingRates, setLoadingRates] = useState(true);

  // Calculate amounts
  const subtotal =
    (Number(rates.baseRate) || 0) +
    (Number(rates.featureRate) || 0) +
    (Number(rates.socialMediaRate) || 0);

  const totalAmount = Math.max(0, subtotal - (Number(promoDiscount) || 0));

  // Card Element options
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#495057',
        '::placeholder': { color: '#6c757d' },
        padding: '10px',
      },
      invalid: { color: '#dc3545', iconColor: '#dc3545' }
    },
    hidePostalCode: true
  };

  // Fetch rates based on payment type
  useEffect(() => {
    const fetchRates = async () => {
      try {
        let response;

        if (paymentType === 'jobOffer') {
          response = await axios.get('/job/offer/rate');
          const base = parseFloat(response.data?.base_rate) || 0;
          const feature = draftData.featured === 'Yes'
            ? parseFloat(response.data?.feature_rate) || 0
            : 0;
          const social = draftData.socialShare
            ? parseFloat(response.data?.social_share_rate) || 0
            : 0;

          setRates({ baseRate: base, featureRate: feature, socialMediaRate: social });
        }
        else if (paymentType === 'banner') {
          response = await axios.get('/banner/rates');
          setRates({
            baseRate: response.data.base_rate || 0,
            featureRate: 0,
            socialMediaRate: 0
          });
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
        // Set default rates
        setRates({
          baseRate: paymentType === 'banner' ? 50 : 50,
          featureRate: 0,
          socialMediaRate: 0
        });
      } finally {
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, [draftData, paymentType]);

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeMsg({ text: 'Please enter a promo code', type: 'error' });
      return;
    }

    try {
      const response = await axios.post('/api/validate-promo', {
        code: promoCode,
        subtotal: subtotal,
        type: paymentType
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

  // Handle input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Form validation
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

  // Get client IP
  const getClientIP = async () => {
    try {
      const responses = await Promise.any([
        axios.get('https://api.ipify.org?format=json'),
        axios.get('https://ipapi.co/json'),
        axios.get('https://ipinfo.io/json')
      ]);
      return responses.data.ip;
    } catch (error) {
      console.error('All IP services failed:', error);
      return 'unknown';
    }
  };

  // Payment submission
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
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

    const clientIP = await getClientIP();

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

      const sessionId = localStorage.getItem('draft_session');
      const formPayload = {
        ...paymentDetails,
        ...rates,
        promoCode,
        promoDiscount,
        totalAmount,
        paymentMethodId: paymentMethod?.id,
        postId: draftData.id,
        clientIP,
        type: paymentType,
        sessionId: sessionId,
        bannerData: draftData.bannerData || null
      };

      let endpoint = '/ads/final/post';
      if (paymentType === 'banner') {
        endpoint = '/banner/final/post';
      }

      const response = await axios.post(endpoint, formPayload);
      if (response.data && response.data.success) {
        // Clear ALL related data
        localStorage.removeItem('jobOfferFormState');
        localStorage.removeItem('bannerFormState');
        localStorage.removeItem('draft_session');
        setPaymentDetails(initialState);

        // Navigate with history replacement
        navigate(`/post-confirmation/${response.data.post_id}`, {
          replace: true,
          state: {
            paymentCompleted: true,
            type: paymentType
          }
        });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        navigate('/', { replace: true });
        alert('This payment was already processed');
      } else if (error.response?.status === 410) {
        navigate('/', { replace: true });
        alert('Session expired. Please start over.');
      } else {
        console.error('Payment error:', error);
        setErrors(prev => ({
          ...prev,
          form: error.response?.data?.message || 'Payment processing failed'
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!draftData || Object.keys(draftData).length === 0) {
      navigate('/', { replace: true });
    }
  }, [draftData, navigate]);

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
              {/* ... existing billing form ... */}
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
                        {paymentType === 'jobOffer' ? (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Base Job Posting:</span>
                              <span className="fw-bold">
                                {(rates.baseRate || 0) === 0 ? 'Free' : `$${Number(rates.baseRate).toFixed(2)}`}
                              </span>
                            </div>
                            {(rates.featureRate || 0) > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Featured Upgrade:</span>
                                <span className="fw-bold">
                                  +${Number(rates.featureRate).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {(rates.socialMediaRate || 0) > 0 && (
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Social Media Promotion:</span>
                                <span className="fw-bold">
                                  +${Number(rates.socialMediaRate).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Banner Advertising:</span>
                            <span className="fw-bold">
                              ${Number(rates.baseRate).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Promo Code Section */}
                        <div className="promo-code-section mt-3">
                          {/* ... existing promo code UI ... */}
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
                  </div>

                  {/* Payment details */}
                  <div className="payment-details">
                    {/* ... existing payment form ... */}
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
