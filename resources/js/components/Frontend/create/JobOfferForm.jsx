    import React, { useState, useEffect, useRef } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { FaFileAlt, FaRedo } from 'react-icons/fa';
    import VirtualKeyboard from './Frontend/VirtualKeyboard';
    import './Frontend/JobOfferForm.css';

    const JobOfferForm = () => {
        const [formData, setFormData] = useState({
            title: '',
            city: '',
            category: '',
            description: '',
            businessName: '',
            address: '',
            salary: '$',
            name: '',
            telNo: '',
            telExt: '',
            altTelNo: '',
            altTelExt: '',
            email: '',
            website: '',
            keywords: '',
            captcha: '',
            attachments: [],
            featured: 'No',
            model: 'JobOffer',
            socialShare: ''
        });
        
        const [errors, setErrors] = useState({});
        const [titleCheckbox, setTitleCheckbox] = useState(false);
        const [showKeyboard, setShowKeyboard] = useState(false);
        const [keyboardTarget, setKeyboardTarget] = useState(null);
        const titleInputRef = useRef(null);
        const descInputRef = useRef(null);
        const [showPreview, setShowPreview] = useState(false);
        const [categories] = useState(
            `Accountant/Bookkeeper Appliance Technician Auto Body Auto Mechanic Auto Sales Babysitter/Nanny Bakery/Pastry Beauty Salon Car Wash Caregiver Cashier Child Care Cleaning Services Construction Delivery Jobs Dental Assistant/Office Dispatcher Driver Dry Cleaning Electrician Financial Services Florist Government Jobs Grocery/Market Housekeeper/Maid In-Home Care Jewelry Sales/Repair Legal/Paralegal Medical/Healthcare Medical Office/Billing Nail Salon No Experience Required Office/Admin Parking Attendant Pet Grooming Pharmacy Pool Cleaning Receptionist/Front Desk Restaurant Jobs Mall Jobs Sales/Marketing Security Guard Smoke Shop Tailor/Alteration Teacher/Education Telemarketing Truck Driver UBER Driver Web/IT Developer Work From Home Other Jobs`
                .split(' ')
                .map(line => line.trim())
                .filter(Boolean)
            );
            
        const [captchaText, setCaptchaText] = useState('');
        const [captchaInput, setCaptchaInput] = useState('');
        const [captchaError, setCaptchaError] = useState('');
        const [descCheckbox, setDescCheckbox] = useState(false);
        const [isReturningFromPreview, setIsReturningFromPreview] = useState(false);
        const [filePreviews, setFilePreviews] = useState([]);
        const [showFeatureSelection, setShowFeatureSelection] = useState(false);
        const [showAuthModal, setShowAuthModal] = useState(false);
        const [getRate, setRate] = useState();
        const navigate = useNavigate();
        const [socialMediaPromotion, setSocialMediaPromotion] = useState(false);
        // const [socialImage, setSocialImage] = useState(null);
        // const [socialPreview, setSocialPreview] = useState('');
        const fileInputRef = useRef(null);
          
        // Handle checkbox changes
        const handleTitleCheckbox = (e) => {
          const isChecked = e.target.checked;
          setTitleCheckbox(isChecked);
          setDescCheckbox(false);
          setShowKeyboard(isChecked);
          setKeyboardTarget(isChecked ? titleInputRef.current : null);
          if (isChecked) titleInputRef.current.focus();
        };

        const handleInputChange = (event) => {
          const { name, value } = event.target;

          // Clear error for this field
          if (errors[name]) {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[name];
              return newErrors;
            });
          }

          // Add phone number validation for specific fields
          if (name === 'telNo' || name === 'altTelNo') {
            const isValid = /^[()+\d\s.-]*$/.test(value);
            if (!isValid) return; // Don't update state if invalid
          }

          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        };

        const handleDescCheckbox = (e) => {
          const isChecked = e.target.checked;
          setDescCheckbox(isChecked);
          setTitleCheckbox(false);
          setShowKeyboard(isChecked);
          setKeyboardTarget(isChecked ? descInputRef.current : null);
          if (isChecked) descInputRef.current.focus();
        };

        const handleKeyboardInput = (value) => {
          setFormData(prev => ({
            ...prev,
            [keyboardTarget.name]: value
          }));
        };

        const handleKeyboardToggle = (inputRef) => {
          const newState = !showKeyboard;
          setShowKeyboard(newState);
          setKeyboardTarget(newState ? inputRef.current : null);
          if (newState && inputRef.current) inputRef.current.focus();
        };

        useEffect(() => {
          const rate = async () => {
            const response = await axios.get('job/offer/rate');
            
            setRate(response.data.rate);
          };
          rate();
        }, []);

        // Function to handle file upload
        const handleSocialPromotionChange = (e) => {
          setSocialMediaPromotion(e.target.checked);
        };

        //  Handle social file change
        const handleSocialFileChange = (e) => {
          const file = e.target.files[0];
          if (file) {
            setFormData(prev => ({
              ...prev,
              socialShare: file
            }));
          }
          console.log(formData);
        };

        // Update removeSocialImage
        const removeSocialImage = () => {
          setFormData(prev => ({
            ...prev,
            socialShare: null
          }));
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          console.log(formData);
        };

        // Caret handling
        useEffect(() => {
          if (keyboardTarget && showKeyboard) {
            keyboardTarget.focus();
            const length = keyboardTarget.value.length;
            keyboardTarget.setSelectionRange(length, length);
          }
        }, [keyboardTarget, showKeyboard]);

        const generateCaptcha = () => {
          setTimeout(() => {
            // const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
            const chars = '1234567890';
            let captcha = '';
            for(let i = 0; i < 5; i++) {
              captcha += chars[Math.floor(Math.random() * chars.length)];
            }
            setCaptchaText(captcha);
            setCaptchaInput('');
            setCaptchaError('');
          }, 1000);
        };

        // Initialize CAPTCHA
        useEffect(() => {
          generateCaptcha();
        }, []);

        // Updated file handling for multiple files
        const handleFileChange = (e) => {
          const files = Array.from(e.target.files);
          if (files.length > 5) { // Limit to 5 files
            alert('Maximum 5 files allowed');
            return;
          }

          const validFiles = files.filter(file => 
            ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
          );

          const newPreviews = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type
          }));

          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...validFiles]
          }));
          setFilePreviews(prev => [...prev, ...newPreviews]);
        };

        const handleRemoveFile = (index) => {
          setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
          }));
          setFilePreviews(prev => prev.filter((_, i) => i !== index));
        };

        useEffect(() => {
          const handleKeyEvents = (e) => {
            if (showKeyboard && keyboardTarget) {
              const allowedKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
              if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }
          };

          document.addEventListener('keydown', handleKeyEvents);
          return () => document.removeEventListener('keydown', handleKeyEvents);
        }, [showKeyboard, keyboardTarget]);

        const handleInputFocus = (inputRef, checkboxState) => {
          if (checkboxState) {
            setKeyboardTarget(inputRef.current);
            setShowKeyboard(true);
          }
          if (showKeyboard) {
            setKeyboardTarget(inputRef.current);
            inputRef.current.focus();
          }
        }; 

        // Block physical keyboard when Armenian keyboard is active
        useEffect(() => {
          const handleKeyDown = (e) => {
            if (showKeyboard) {
              const allowedKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
              if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }
          };

          document.addEventListener('keydown', handleKeyDown);
          return () => document.removeEventListener('keydown', handleKeyDown);
        }, [showKeyboard]);
        
        useEffect(() => {
          const loadDraft = async () => {
            if (location.state?.draftData) {
              setFormData(location.state.draftData);
              setShowPreview(true);
            }
          };
          loadDraft();
        }, [location.state]);

        const handleTelInputChange = (event) => {
          const { name, value } = event.target;
          
          // Add phone number validation for specific fields
          if (name === 'telNo' || name === 'altTelNo') {
            const isValid = /^[()+\d\s.-]*$/.test(value);
            if (!isValid) return; // Don't update state if invalid
          }

          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        };

        const formatUsNumber = (numStr) => {
          if (!numStr) return '';
          const num = numStr.replace(/,/g, '');
          return Number(num).toLocaleString('en-IN');
        };

        const saveDraftData = async () => {
          try {
            const response = await axios.post('/save-draft',
              {
                formData,
                ip: await getClientIP()
              },
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                }
              }
            
            );
            console.log('Draft saved:', response.data);
          } catch (error) {
            console.error('Draft save failed:', error);
          }
        };

        const getClientIP = async () => {
          try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
          } catch (error) {
            console.error('Error fetching IP:', error);
            return 'unknown';
          }
        };

        const handleKeyDown = (e) => {
          const key = e.key;
          const value = e.target.value; 

          // Allow navigation and control keys
          if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'].includes(key)) return;

          // Prevent invalid characters
          if (!/\d|\./.test(key)) {
            e.preventDefault();
            return;
          }

          // Check decimal limitations
          if (value.includes('.') && key === '.') {
            e.preventDefault();
            return;
          }

          // Limit to 2 decimal places
          if (value.includes('.')) {
            const decimalPart = value.split('.')[1];
            if (decimalPart && decimalPart.length >= 2) {
              e.preventDefault();
            }
          }
        };

        const handleSalaryChange = (e) => {
          let value = e.target.value;
          
          // Ensure $ at start and clean invalid characters
          let cleanedValue = value.startsWith('$') 
            ? '$' + value.slice(1).replace(/[^\d.]/g, '')
            : '$' + value.replace(/[^\d.]/g, '');

          // Handle multiple decimals
          const parts = cleanedValue.split('.');
          if (parts.length > 2) {
            cleanedValue = `${parts[0]}.${parts[1]}`;
          }

          // Split into components
          const [integerPart, decimalPart] = cleanedValue.slice(1).split('.');

          // Format integer part
          const formattedInteger = integerPart 
            ? formatUsNumber(integerPart.replace(/,/g, ''))
            : '';

          // Limit decimal part
          const limitedDecimal = decimalPart 
            ? decimalPart.slice(0, 2)
            : '';

          // Construct new value
          let newValue = `$${formattedInteger}`;
          if (limitedDecimal) newValue += `.${limitedDecimal}`;

          // Ensure only one decimal point
          if ((cleanedValue.match(/\./g) || []).length > 1) {
            const firstDotIndex = newValue.indexOf('.');
            newValue = newValue.substring(0, firstDotIndex + 1) + 
                      newValue.substring(firstDotIndex + 1).replace(/\./g, '');
          }

          setFormData(prev => ({
            ...prev,
            salary: newValue
          }));
        };

        const handleSubmit = async (e) => {
          e.preventDefault();
          setErrors({});
          setCaptchaError('');
          // Basic validation
          const newErrors = {};
          if (!formData.title) newErrors.title = 'Title is required';
          if (!formData.city) newErrors.city = 'Location is required';
          if (!formData.category) newErrors.category = 'Category is required';
          if (!formData.description) newErrors.description = 'Description is required';
          

          // Telephone validation
          if (formData.telExt && !formData.telNo) {
            newErrors.telNo = 'Tel No. is required when Ext. is provided';
          }
          if (formData.altTelExt && !formData.altTelNo) {
            newErrors.altTelNo = 'Alt Tel No. is required when Ext. is provided';
          }


          if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
          }

          // CAPTCHA validation
          if (!isReturningFromPreview && captchaInput !== captchaText) {
            setCaptchaError('Invalid CAPTCHA code');
            generateCaptcha();
            return;
          }
          setShowPreview(true);
          
        };

        const handleGuestSubmit = async () => {
          try {
            // Close modal
            setShowAuthModal(false);
            
            // Proceed with guest submission
            const formPayload = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
              if (key !== 'attachments' && value) {
                formPayload.append(key, value);
              }
            });

            formData.attachments.forEach(file => {
              formPayload.append('attachments[]', file);
            });

            const response = await axios.post('/api/job-offers/guest', formPayload, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Guest submission successful:', response.data);
            navigate('/payment', { state: { draftData: formData } });
            // Handle successful guest submission
          } catch (error) {
            console.error('Guest submission error:', error);
          }
        };

        const handleFeaturedSubmit = async () => {
          try {
            // Check authentication
            const isAuthenticated = localStorage.getItem('token') !== null;

            if (!isAuthenticated) {
              setShowAuthModal(true);
              return;
            }

            const formPayload = new FormData();

            // Append all form fields including featured
            Object.entries(formData).forEach(([key, value]) => {
              if (key !== 'attachments' && value) {
                formPayload.append(key, value);
              }
            });

            // if (socialMediaPromotion && socialImage) {
            //   formPayload.append('socialShare', socialImage);
            // }

            console.log(formData);
            formData.attachments.forEach(file => {
              formPayload.append('attachments[]', file);
            });

            // const response = await axios.post('/api/job-offers', formPayload, {
            //   headers: { 'Content-Type': 'multipart/form-data' }
            // });

            navigate('/payment', { state: { draftData: formData } });
            // Redirect or show success message
          } catch (error) {
            console.error('Submission error:', error);
          }
        };

        const handleFinalSubmit = async () => {
          try {
            const formPayload = new FormData();
            setShowFeatureSelection(true);
            setShowPreview(false);
            // Append all form fields
            Object.entries(formData).forEach(([key, value]) => {
              if (key !== 'attachments' && value) {
                formPayload.append(key, value);
              }
            });

            // Append all files
            formData.attachments.forEach(file => {
              formPayload.append('attachments[]', file);
            });

            const response = await axios.post('/api/job-offers', formPayload, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Submission successful:', response.data);
            // Redirect to next page
          } catch (error) {
            console.error('Submission error:', error);
            setShowPreview(false);
          }
        };

      return (
        <section className="sptb pt-5">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-8" style={{ position: 'relative' }}>

                {showFeatureSelection ? (
                  <div className="card feature-card">
                  <div className="card-header">
                    <h4 className="mb-0">
                      <strong className='ml-5'>Boost Your Post Visibility</strong>
                    </h4>
                  </div>
                  
                  <div className="card-body">
                    <div className="feature-option active">
                      <div className="option-header">
                        <h5>Featured Post Duration</h5>
                        <span className="price-bubble">$49.99</span>
                      </div>
                      
                      <div className="duration-selector">
                        {[24, 48].map((hours) => (
                          <label 
                            key={hours}
                            className={`duration-card ${
                              formData.duration === hours ? 'selected' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={hours}
                              checked={formData.duration === hours}
                              onChange={() => setFormData(prev => ({
                                ...prev,
                                duration: hours,
                                featured: 'Yes'
                              }))}
                            />
                            <div className="card-content">
                              <div className="top-section">
                                <span className="hours">{hours}h</span>
                                <span className="badge">🔥 Hot Deal</span>
                              </div>
                              <div className="price-section">
                                <span className="price">${(49.99 * (hours/24)).toFixed(2)}</span>
                                <span className="per-hour">${(49.99/24).toFixed(2)}/hour</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                    </div>  

                    <div className="social-promotion-section mt-4">
                      <div className="form-check">
                        <input
                          className="form-check-input single-checkbox2"
                          type="checkbox"
                          id="social_media"
                          checked={socialMediaPromotion}
                          onChange={handleSocialPromotionChange}
                        />
                        <label className="form-check-label package_label" htmlFor="social_media">
                          <strong>Promote your ad on our social media platforms - ${getRate}</strong>
                        </label>
                      </div>

                      {socialMediaPromotion && (
                        <div className="social-image-upload mt-3">
                          <div className="file-upload-wrapper">
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={handleSocialFileChange}
                              style={{ display: 'none' }}
                              id="socialImageUpload"
                            />
                            <label 
                              htmlFor="socialImageUpload" 
                              className="btn btn-outline-primary btn-sm"
                            >
                              Upload Social Media Image
                            </label>
                            {formData.socialShare && (
                              <div className="image-preview mt-2">
                                <img 
                                  src={URL.createObjectURL(formData.socialShare)} 
                                  alt="Social preview" 
                                  className="img-thumbnail"
                                  style={{ width: '100px', height: '100px' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm ms-2"
                                  onClick={removeSocialImage}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                          <small className="text-muted">
                            (JPG, PNG, GIF, max 2 MB) - This image will be used for social media promotion
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="action-buttons mt-3">
                      <button 
                        className="btn-back"
                        onClick={() => {
                          setShowFeatureSelection(false);
                          setShowPreview(true);
                        }}
                      >
                        ← Back to Preview
                      </button>
                      
                      <button 
                        className="btn-confirm"
                        onClick={handleFeaturedSubmit}
                        disabled={!formData.featured}
                      >
                        Confirm & Submit
                      </button>
                    </div>
                  </div>
                </div>
                ) : showPreview ? (
                  // Preview Component
                  <Preview
                    formData={formData}
                    filePreviews={filePreviews}
                    onEdit={() => {
                      setShowPreview(false);
                      setIsReturningFromPreview(true);
                    }}
                    onSubmit={() => setShowFeatureSelection(true)}
                  />
                ) : (
                  // Main Form
                 <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="card">
                      <div className="card-header mb-1 d-md-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-muted"><strong>Create Ad</strong></h6>
                        <h6 className="mb-0 text-muted">
                          <strong>${getRate} for 30 days</strong>
                        </h6>
                      </div>

                      <div className="card-body">

                        {/* Title Input */}
                        <div className="form-group">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label text-dark fw-semibold">
                              Ad Title <span className="text-danger">*</span>
                            </label>
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                id="titleCheckbox"
                                className="form-check-input keyboard-toggle"
                                checked={showKeyboard && keyboardTarget === titleInputRef.current || titleCheckbox}
                                onChange={() => {
                                    handleKeyboardToggle(titleInputRef); handleTitleCheckbox
                                  }
                                }
                              />
                              <label 
                                className="form-check-label text-dark fw-semibold"
                                htmlFor="titleCheckbox"
                              >
                                Հայերեն Ստեղնաշար
                              </label>
                            </div>
                          </div>
                          <input
                            ref={titleInputRef}
                            type="text"
                            name="title"
                            data-armenian-input 
                            value={formData.title}
                            onChange={(e) => {
                              handleTitleCheckbox;
                              handleInputChange(e);
                              if (titleCheckbox) {
                                setFormData(prev => ({ ...prev, title: e.target.value }));
                              }
                            }}
                            onFocus={() => {
                              setKeyboardTarget(titleInputRef.current);
                              // setShowKeyboard(true);
                              handleInputFocus(titleInputRef, titleCheckbox);
                            }}
                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          />
                          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                          <p className="mb-1 text-muted">
                            <strong className="text-danger">Note:</strong> Enter a general title description, e.g., Bakery Needs Workers, Dental Assistant Needed, etc. Do not include address or location in title.
                          </p>
                        </div>

                        {/* Location Input */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">
                            Location <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          />
                          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>

                        {/* Category Select */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">
                            Job Category <span className="text-danger">*</span>
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                        </div>

                        {/* Description Input */}
                        <div className="form-group mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label text-dark fw-semibold mb-0">
                              Job Description/Requirements <span className="text-danger">*</span>
                            </label>
                            
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                id='descCheckbox'
                                className="form-check-input keyboard-toggle"
                                checked={showKeyboard && keyboardTarget === descInputRef.current}
                                onChange={(e) => {
                                  handleKeyboardToggle(descInputRef);
                                  handleDescCheckbox(e);
                                }}
                              />
                              <label className="form-check-label text-dark fw-semibold" htmlFor="descCheckbox">
                                Հայերեն Ստեղնաշար
                              </label>
                            </div>
                          </div>
                          <textarea
                            ref={descInputRef}
                            name="description"
                            data-armenian-input
                            value={formData.description}
                            onChange={handleInputChange}
                            onFocus={() => {
                              setKeyboardTarget(descInputRef.current);
                              // setShowKeyboard(false);
                              handleInputFocus(descInputRef, descCheckbox);
                            }}
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            rows="7"
                          />
                          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>

                        {/* Business Name Input */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        {/* Address Input */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Salary/Compensation</label>
                          <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleSalaryChange}
                            onKeyDown={handleKeyDown}
                            className="form-control"
                            placeholder="$"
                          />
                        </div>

                        {/* Contact Info Section */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Contact Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        {/* Telephone Inputs */}
                        <div className="form-group mt-3">
                          <div className="row">
                            <div className="col-8">
                              <label className="form-label text-dark fw-semibold">Tel No.</label>
                              <input
                                type="text"
                                name="telNo"
                                value={formData.telNo}
                                onChange={handleTelInputChange}
                                className={`form-control ${errors.telNo ? 'is-invalid' : ''}`}
                                pattern="[()+\d\s.-]*"
                              />
                              {errors.telNo && <div className="invalid-feedback">{errors.telNo}</div>}
                            </div>
                            <div className="col-4">
                              <label className="form-label text-dark fw-semibold">Ext.</label>
                              <input
                                type="number"
                                name="telExt"
                                value={formData.telExt}
                                onChange={handleTelInputChange}
                                className="form-control"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Alt Telephone Inputs */}
                        <div className="form-group mt-3">
                          <div className="row">
                            <div className="col-8">
                              <label className="form-label text-dark fw-semibold">Alt Tel No.</label>
                              <input
                                type="text"
                                name="altTelNo"
                                value={formData.altTelNo}
                                onChange={handleTelInputChange}
                                className={`form-control ${errors.altTelNo ? 'is-invalid' : ''}`}
                                pattern="[()+\d\s.-]*"
                              />
                              {errors.altTelNo && <div className="invalid-feedback">{errors.altTelNo}</div>}
                            </div>
                            <div className="col-4">
                              <label className="form-label text-dark fw-semibold">Alt Ext.</label>
                              <input
                                type="number"
                                name="altTelExt"
                                value={formData.altTelExt}
                                onChange={handleTelInputChange}
                                className="form-control"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Email Section */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        {/* Website Section */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Website</label>
                          <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>

                        {/* Keyword Section */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Keywords</label>
                          <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </div>


                        {/* File Upload */}
                        <div className="form-group mt-3">
                          <label className="form-label text-dark fw-semibold">Attachments (max 5)</label>
                          <div className="custom-file">
                              <input
                                type="file"
                                multiple
                                name="attachments"
                                onChange={handleFileChange}
                                className="form-control w-100 custom-file-input"
                                id="offerPost"
                                // ref={fileInputRef}
                                accept="image/*,.pdf"
                              />
                              <label className="custom-file-label" htmlFor="offerPost">
                                {filePreviews.length > 0 
                                  ? `${filePreviews.length} files selected` 
                                  : ''}
                              </label>
                            </div>
                          
                          {filePreviews.length > 0 && (
                            <div className="row mt-3">
                              {filePreviews.map((preview, index) => (
                                <div key={index} className="col-2 position-relative">
                                  {preview.type.startsWith('image') ? (
                                    <img 
                                      src={preview.url} 
                                      alt="preview" 
                                      className="img-thumbnail" 
                                      style={{ height: '100px', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="file-preview-icon">
                                      {/* <FaFileAlt size={40} className="text-muted" /> */}
                                      <small className="d-block text-truncate">{preview.name}</small>
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm rounded-circle position-absolute"
                                    style={{ top: '-10px', right: '-10px' }}
                                    onClick={() => handleRemoveFile(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {!isReturningFromPreview && (
                          <div className="form-group mt-3">
                            <div className="d-flex flex-nowrap align-items-center gap-2">
                              {/* CAPTCHA Display */}
                              <div 
                                className="captcha-display flex-shrink-0" 
                                style={{
                                  userSelect: 'none',
                                  pointerEvents: 'none',
                                  cursor: 'not-allowed',
                                  width: '120px'
                                }}
                              >
                                {captchaText}
                              </div>

                              {/* Refresh Button */}
                              <button
                                type="button"
                                className="btn btn-outline-dark flex-shrink-0"
                                onClick={generateCaptcha}
                                aria-label="Refresh CAPTCHA"
                                style={{ 
                                  width: '38px', 
                                  height: '38px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <FaRedo className="refresh-icon" />
                              </button>

                              {/* CAPTCHA Input */}
                              <input
                                type="text"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                className={`form-control flex-grow-1 ${captchaError ? 'is-invalid' : ''}`}
                                placeholder="Enter CAPTCHA code"
                                onCopy={(e) => e.preventDefault()}
                                onCut={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                                style={{ minWidth: '180px' }}
                              />
                            </div>
                            <div className="text-danger">{captchaError}</div>

                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="form-group mt-4">
                          <button type="submit" className="btn btn-primary w-100">
                            Continue
                          </button>

                          <p style={{ margin: '0.5rem 0 0.5rem 0' }}>
                                By posting your ad on ArmenianAd.com, you agree to be bound by our {' '}
                              <a 
                                  href="/terms/and/conditions" 
                                  className="fw-semibold" 
                                  style={{ color: '#2450a0', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                Terms of Service
                              </a>
                              {' '}and our{' '}
                              <a 
                                  href="/privacy/policy"
                                  className="fw-semibold" 
                                  style={{ color: '#2450a0', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                Privacy Policy
                              </a>. You agree we may moderate ArmenianAd.com access/use in our sole discretion. See our list of{' '}
                              <a 
                                  href="/"
                                  className="fw-semibold" 
                                  style={{ color: '#2450a0', textDecoration: 'underline' }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                Prohibited Items.
                              </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          {/* Authentication Modal */}
          {showAuthModal && (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Authentication Required</h5>
                    <button 
                      type="button" 
                      className="close" 
                      onClick={() => setShowAuthModal(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body text-center">
                    <div className="d-flex flex-column gap-3">
                      <Link 
                        to="/login" 
                        className="btn btn-success btn-lg"
                        onClick={async () => {
                          // Save draft before redirect
                          await saveDraftData();
                          setShowAuthModal(false);
                        }}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        className="btn btn-primary btn-lg"
                        onClick={() => setShowAuthModal(false)}
                      >
                        Register
                      </Link>
                      <button 
                        className="btn btn-secondary btn-lg"
                        onClick={handleGuestSubmit}
                      >
                        Checkout as Guest
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
            <VirtualKeyboard
              isVisible={showKeyboard}
              onClose={() => {
                setShowKeyboard(false);
                setTitleCheckbox(false);
                setDescCheckbox(false);
                setKeyboardTarget(null);
              }}
              onKeyPress={handleKeyboardInput}
              targetInput={keyboardTarget}
            />

        </section>
      );
    };

// Preview component
const Preview = ({ formData, filePreviews, onEdit, onSubmit }) => {
  const hasBusinessInfo = formData.businessName || formData.address || formData.salary?.length > 1;
  const hasContactInfo = formData.name || formData.telNo || formData.altTelNo || formData.email || formData.website || formData.keywords;

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0"><strong>Preview Your Job Post</strong></h4>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-4">
              <h5>{formData.title}</h5>
              <p className="text-muted">
                {formData.city && <><strong>Location:</strong> {formData.city}<br /></>}
                {formData.category && <><strong>Category:</strong> {formData.category}<br /></>}
              </p>
            </div>

            {formData.description && (
              <div className="mb-4">
                <h6>Description</h6>
                <p style={{ whiteSpace: 'pre-wrap' }}>{formData.description}</p>
              </div>
            )}

            {hasBusinessInfo && (
              <div className="mb-4">
                <h6>Business Information</h6>
                <p>
                  {formData.businessName && <><strong>Name:</strong> {formData.businessName}<br /></>}
                  {formData.address && <><strong>Address:</strong> {formData.address}<br /></>}
                  {formData.salary?.length > 1 && <><strong>Salary:</strong> {formData.salary}</>}
                </p>
              </div>
            )}

            {hasContactInfo && (
              <div className="mb-4">
                <h6>Contact Information</h6>
                <p>
                  {formData.name && <><strong>Contact Name:</strong> {formData.name}<br /></>}
                  {formData.telNo && (
                    <><strong>Phone:</strong> {formData.telNo}
                    {formData.telExt && ` ext.${formData.telExt}`}<br /></>
                  )}
                  {formData.altTelNo && (
                    <><strong>Alt Phone:</strong> {formData.altTelNo}
                    {formData.altTelExt && ` ext.${formData.altTelExt}`}<br /></>
                  )}
                  {formData.email && <><strong>Email:</strong> {formData.email}<br /></>}
                  {formData.website && <><strong>Website:</strong> {formData.website}<br /></>}
                  {formData.keywords && <><strong>Keywords:</strong> {formData.keywords}</>}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            {filePreviews.length > 0 && (
              <div className="mb-4">
                <h6>Attachments ({filePreviews.length})</h6>
                <div className="row">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="col-4 mb-3 position-relative">
                      {preview.type.startsWith('image') ? (
                        <img 
                          src={preview.url} 
                          alt={`Attachment ${index + 1}`}
                          className="img-thumbnail"
                          style={{ height: '100px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="file-preview-icon">
                          <FaFileAlt size={40} className="text-muted" />
                          <small className="d-block text-truncate">{preview.name}</small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button 
            type="button" 
            className="btn-edit"
            onClick={onEdit}
          >
            <span className="button-content">
              <i className="fas fa-edit mr-2"></i>
              Edit
            </span>
          </button>
          
          <button 
            type="button" 
            className="btn-submit"
            onClick={onSubmit}
          >
            <span className="button-content">
              <i className="fas fa-paper-plane mr-2"></i>
              Submit
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};



export default JobOfferForm;