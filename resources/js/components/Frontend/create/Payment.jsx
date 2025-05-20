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
  const subtotal = 
    (Number(rates.baseRate) || 0) + 
    (Number(rates.featureRate) || 0) + 
    (Number(rates.socialMediaRate) || 0);

  const totalAmount = subtotal - (Number(promoDiscount) || 0);

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

  const getClientIP = async () => {
    try {
      // Try multiple services for redundancy
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

      const formPayload = {
        ...paymentDetails,
        ...rates,
        promoCode,
        promoDiscount,
        totalAmount,
        paymentMethodId: paymentMethod?.id,
        postId: draftData.id,
        clientIP,
        type: 'jobOffer'
      };

      const response = await axios.post('/ads/final/post', formPayload);
      
      if (response.data.success) {
      // Clear ALL related data
      localStorage.removeItem('jobOfferFormState');
      setPaymentDetails(initialState);
      setDraftData(null);

      // Navigate with history replacement
      navigate(`/post-confirmation/${response.data.post_id}`, { 
        replace: true,
        state: { paymentCompleted: true }
      });
    }
      
    } catch (error) {
      if (error.response?.status === 409) {
        navigate('/', { replace: true });
        alert('This payment was already processed');
      } else if (error.response?.status === 410) {
        navigate('', { replace: true });
        alert('Session expired. Please start over.');
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
                  {/* <div className="col-12">
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
                  </div> */}

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
                    <label className="form-label">Country*</label>
                    <select 
                      name="country"
                      className={`form-select form-select-lg ${errors.country ? 'is-invalid' : ''}`}
                      value={paymentDetails.country}
                      onChange={handlePaymentChange}
                    >
                      <option value="">Select Country</option>
                      <option value="AF">Afghanistan</option>
                      <option value="AX">Åland Islands</option>
                      <option value="AL">Albania</option>
                      <option value="DZ">Algeria</option>
                      <option value="AS">American Samoa</option>
                      <option value="AD">Andorra</option>
                      <option value="AO">Angola</option>
                      <option value="AI">Anguilla</option>
                      <option value="AQ">Antarctica</option>
                      <option value="AG">Antigua and Barbuda</option>
                      <option value="AR">Argentina</option>
                      <option value="AM">Armenia</option>
                      <option value="AW">Aruba</option>
                      <option value="AU">Australia</option>
                      <option value="AT">Austria</option>
                      <option value="AZ">Azerbaijan</option>
                      <option value="BS">Bahamas</option>
                      <option value="BH">Bahrain</option>
                      <option value="BD">Bangladesh</option>
                      <option value="BB">Barbados</option>
                      <option value="BY">Belarus</option>
                      <option value="BE">Belgium</option>
                      <option value="BZ">Belize</option>
                      <option value="BJ">Benin</option>
                      <option value="BM">Bermuda</option>
                      <option value="BT">Bhutan</option>
                      <option value="BO">Bolivia</option>
                      <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                      <option value="BA">Bosnia and Herzegovina</option>
                      <option value="BW">Botswana</option>
                      <option value="BV">Bouvet Island</option>
                      <option value="BR">Brazil</option>
                      <option value="IO">British Indian Ocean Territory</option>
                      <option value="BN">Brunei Darussalam</option>
                      <option value="BG">Bulgaria</option>
                      <option value="BF">Burkina Faso</option>
                      <option value="BI">Burundi</option>
                      <option value="CV">Cabo Verde</option>
                      <option value="KH">Cambodia</option>
                      <option value="CM">Cameroon</option>
                      <option value="CA">Canada</option>
                      <option value="KY">Cayman Islands</option>
                      <option value="CF">Central African Republic</option>
                      <option value="TD">Chad</option>
                      <option value="CL">Chile</option>
                      <option value="CN">China</option>
                      <option value="CX">Christmas Island</option>
                      <option value="CC">Cocos (Keeling) Islands</option>
                      <option value="CO">Colombia</option>
                      <option value="KM">Comoros</option>
                      <option value="CD">Congo (the Democratic Republic of the)</option>
                      <option value="CG">Congo</option>
                      <option value="CK">Cook Islands</option>
                      <option value="CR">Costa Rica</option>
                      <option value="CI">Côte d'Ivoire</option>
                      <option value="HR">Croatia</option>
                      <option value="CU">Cuba</option>
                      <option value="CW">Curaçao</option>
                      <option value="CY">Cyprus</option>
                      <option value="CZ">Czechia</option>
                      <option value="DK">Denmark</option>
                      <option value="DJ">Djibouti</option>
                      <option value="DM">Dominica</option>
                      <option value="DO">Dominican Republic</option>
                      <option value="EC">Ecuador</option>
                      <option value="EG">Egypt</option>
                      <option value="SV">El Salvador</option>
                      <option value="GQ">Equatorial Guinea</option>
                      <option value="ER">Eritrea</option>
                      <option value="EE">Estonia</option>
                      <option value="SZ">Eswatini</option>
                      <option value="ET">Ethiopia</option>
                      <option value="FK">Falkland Islands [Malvinas]</option>
                      <option value="FO">Faroe Islands</option>
                      <option value="FJ">Fiji</option>
                      <option value="FI">Finland</option>
                      <option value="FR">France</option>
                      <option value="GF">French Guiana</option>
                      <option value="PF">French Polynesia</option>
                      <option value="TF">French Southern Territories</option>
                      <option value="GA">Gabon</option>
                      <option value="GM">Gambia</option>
                      <option value="GE">Georgia</option>
                      <option value="DE">Germany</option>
                      <option value="GH">Ghana</option>
                      <option value="GI">Gibraltar</option>
                      <option value="GR">Greece</option>
                      <option value="GL">Greenland</option>
                      <option value="GD">Grenada</option>
                      <option value="GP">Guadeloupe</option>
                      <option value="GU">Guam</option>
                      <option value="GT">Guatemala</option>
                      <option value="GG">Guernsey</option>
                      <option value="GN">Guinea</option>
                      <option value="GW">Guinea-Bissau</option>
                      <option value="GY">Guyana</option>
                      <option value="HT">Haiti</option>
                      <option value="HM">Heard Island and McDonald Islands</option>
                      <option value="VA">Holy See</option>
                      <option value="HN">Honduras</option>
                      <option value="HK">Hong Kong</option>
                      <option value="HU">Hungary</option>
                      <option value="IS">Iceland</option>
                      <option value="IN">India</option>
                      <option value="ID">Indonesia</option>
                      <option value="IR">Iran (Islamic Republic of)</option>
                      <option value="IQ">Iraq</option>
                      <option value="IE">Ireland</option>
                      <option value="IM">Isle of Man</option>
                      <option value="IL">Israel</option>
                      <option value="IT">Italy</option>
                      <option value="JM">Jamaica</option>
                      <option value="JP">Japan</option>
                      <option value="JE">Jersey</option>
                      <option value="JO">Jordan</option>
                      <option value="KZ">Kazakhstan</option>
                      <option value="KE">Kenya</option>
                      <option value="KI">Kiribati</option>
                      <option value="KP">Korea (the Democratic People's Republic of)</option>
                      <option value="KR">Korea (the Republic of)</option>
                      <option value="KW">Kuwait</option>
                      <option value="KG">Kyrgyzstan</option>
                      <option value="LA">Lao People's Democratic Republic</option>
                      <option value="LV">Latvia</option>
                      <option value="LB">Lebanon</option>
                      <option value="LS">Lesotho</option>
                      <option value="LR">Liberia</option>
                      <option value="LY">Libya</option>
                      <option value="LI">Liechtenstein</option>
                      <option value="LT">Lithuania</option>
                      <option value="LU">Luxembourg</option>
                      <option value="MO">Macao</option>
                      <option value="MG">Madagascar</option>
                      <option value="MW">Malawi</option>
                      <option value="MY">Malaysia</option>
                      <option value="MV">Maldives</option>
                      <option value="ML">Mali</option>
                      <option value="MT">Malta</option>
                      <option value="MH">Marshall Islands</option>
                      <option value="MQ">Martinique</option>
                      <option value="MR">Mauritania</option>
                      <option value="MU">Mauritius</option>
                      <option value="YT">Mayotte</option>
                      <option value="MX">Mexico</option>
                      <option value="FM">Micronesia (Federated States of)</option>
                      <option value="MD">Moldova (the Republic of)</option>
                      <option value="MC">Monaco</option>
                      <option value="MN">Mongolia</option>
                      <option value="ME">Montenegro</option>
                      <option value="MS">Montserrat</option>
                      <option value="MA">Morocco</option>
                      <option value="MZ">Mozambique</option>
                      <option value="MM">Myanmar</option>
                      <option value="NA">Namibia</option>
                      <option value="NR">Nauru</option>
                      <option value="NP">Nepal</option>
                      <option value="NL">Netherlands</option>
                      <option value="NC">New Caledonia</option>
                      <option value="NZ">New Zealand</option>
                      <option value="NI">Nicaragua</option>
                      <option value="NE">Niger</option>
                      <option value="NG">Nigeria</option>
                      <option value="NU">Niue</option>
                      <option value="NF">Norfolk Island</option>
                      <option value="MP">Northern Mariana Islands</option>
                      <option value="NO">Norway</option>
                      <option value="OM">Oman</option>
                      <option value="PK">Pakistan</option>
                      <option value="PW">Palau</option>
                      <option value="PS">Palestine, State of</option>
                      <option value="PA">Panama</option>
                      <option value="PG">Papua New Guinea</option>
                      <option value="PY">Paraguay</option>
                      <option value="PE">Peru</option>
                      <option value="PH">Philippines</option>
                      <option value="PN">Pitcairn</option>
                      <option value="PL">Poland</option>
                      <option value="PT">Portugal</option>
                      <option value="PR">Puerto Rico</option>
                      <option value="QA">Qatar</option>
                      <option value="MK">Republic of North Macedonia</option>
                      <option value="RO">Romania</option>
                      <option value="RU">Russian Federation</option>
                      <option value="RW">Rwanda</option>
                      <option value="RE">Réunion</option>
                      <option value="BL">Saint Barthélemy</option>
                      <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                      <option value="KN">Saint Kitts and Nevis</option>
                      <option value="LC">Saint Lucia</option>
                      <option value="MF">Saint Martin (French part)</option>
                      <option value="PM">Saint Pierre and Miquelon</option>
                      <option value="VC">Saint Vincent and the Grenadines</option>
                      <option value="WS">Samoa</option>
                      <option value="SM">San Marino</option>
                      <option value="ST">Sao Tome and Principe</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="SN">Senegal</option>
                      <option value="RS">Serbia</option>
                      <option value="SC">Seychelles</option>
                      <option value="SL">Sierra Leone</option>
                      <option value="SG">Singapore</option>
                      <option value="SX">Sint Maarten (Dutch part)</option>
                      <option value="SK">Slovakia</option>
                      <option value="SI">Slovenia</option>
                      <option value="SB">Solomon Islands</option>
                      <option value="SO">Somalia</option>
                      <option value="ZA">South Africa</option>
                      <option value="GS">South Georgia and the South Sandwich Islands</option>
                      <option value="SS">South Sudan</option>
                      <option value="ES">Spain</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="SD">Sudan</option>
                      <option value="SR">Suriname</option>
                      <option value="SJ">Svalbard and Jan Mayen</option>
                      <option value="SE">Sweden</option>
                      <option value="CH">Switzerland</option>
                      <option value="SY">Syrian Arab Republic</option>
                      <option value="TW">Taiwan (Province of China)</option>
                      <option value="TJ">Tajikistan</option>
                      <option value="TZ">Tanzania, United Republic of</option>
                      <option value="TH">Thailand</option>
                      <option value="TL">Timor-Leste</option>
                      <option value="TG">Togo</option>
                      <option value="TK">Tokelau</option>
                      <option value="TO">Tonga</option>
                      <option value="TT">Trinidad and Tobago</option>
                      <option value="TN">Tunisia</option>
                      <option value="TR">Turkey</option>
                      <option value="TM">Turkmenistan</option>
                      <option value="TC">Turks and Caicos Islands</option>
                      <option value="TV">Tuvalu</option>
                      <option value="UG">Uganda</option>
                      <option value="UA">Ukraine</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="GB">United Kingdom</option>
                      <option value="UM">United States Minor Outlying Islands</option>
                      <option value="US">United States of America</option>
                      <option value="UY">Uruguay</option>
                      <option value="UZ">Uzbekistan</option>
                      <option value="VU">Vanuatu</option>
                      <option value="VE">Venezuela (Bolivarian Republic of)</option>
                      <option value="VN">Viet Nam</option>
                      <option value="VG">Virgin Islands (British)</option>
                      <option value="VI">Virgin Islands (U.S.)</option>
                      <option value="WF">Wallis and Futuna</option>
                      <option value="EH">Western Sahara</option>
                      <option value="YE">Yemen</option>
                      <option value="ZM">Zambia</option>
                      <option value="ZW">Zimbabwe</option>
                    </select>
                    {errors.country && 
                      <div className="invalid-feedback">{errors.country}</div>}
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
                    <label className="form-label">City*</label>
                     <input
                      type="text"
                      name="city"
                      className={`form-control form-control-lg ${errors.city ? 'is-invalid' : ''}`}
                      value={paymentDetails.city}
                      onChange={handlePaymentChange}
                      placeholder="City"
                    />
                    {errors.city && 
                      <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  
                  <div className="col-md-6">
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

                        {/* Promo Code Section */}
                        <div className="promo-code-section mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                              />
                              <button 
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={applyPromoCode}
                                disabled={!promoCode.trim()}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                          
                          {promoCodeMsg.text && (
                            <div className={`text-small ${promoCodeMsg.type === 'success' ? 'text-success' : 'text-danger'}`}>
                              {promoCodeMsg.text}
                            </div>
                          )}

                          {promoDiscount > 0 && (
                            <div className="d-flex justify-content-between mt-2">
                              <span className="text-muted">Promo Discount:</span>
                              <span className="fw-bold text-success">
                                -${promoDiscount.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* End Promo Code Section */}

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