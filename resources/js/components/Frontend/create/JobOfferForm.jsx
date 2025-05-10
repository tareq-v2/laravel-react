    import React, { useState, useEffect, useRef } from 'react';
    import { Link } from 'react-router-dom';
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
            salary: '',
            name: '',
            telNo: '',
            telExt: '',
            altTelNo: '',
            altTelExt: '',
            email: '',
            website: '',
            keywords: '',
            captcha: '',
            attachments: []
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
        // Handle checkbox changes
        const handleTitleCheckbox = (e) => {
          const isChecked = e.target.checked;
          setTitleCheckbox(isChecked);
          setDescCheckbox(false);
          setShowKeyboard(isChecked);
          setKeyboardTarget(isChecked ? titleInputRef.current : null);
          if (isChecked) titleInputRef.current.focus();
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

        // Caret handling
        useEffect(() => {
          if (keyboardTarget && showKeyboard) {
            keyboardTarget.focus();
            const length = keyboardTarget.value.length;
            keyboardTarget.setSelectionRange(length, length);
          }
        }, [keyboardTarget, showKeyboard]);

        const generateCaptcha = () => {
          // Generate 5-character alphanumeric string with special characters
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
          let captcha = '';
          for(let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
          }
          setCaptchaText(captcha);
          setCaptchaInput('');
          setCaptchaError('');
        };
        // Initialize CAPTCHA
        useEffect(() => {
          generateCaptcha();
        }, []);

        const [filePreviews, setFilePreviews] = useState([]);

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

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e) => {
          e.preventDefault();
          
          // Basic validation
          const newErrors = {};
          if (!formData.title) newErrors.title = 'Title is required';
          if (!formData.city) newErrors.city = 'Location is required';
          if (!formData.category) newErrors.category = 'Category is required';
          if (!formData.description) newErrors.description = 'Description is required';
          
          if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
          }

          // CAPTCHA validation
          if (!isReturningFromPreview && captchaInput !== captchaText) {
            setCaptchaError('Invalid CAPTCHA code');
            return;
          }
          setShowPreview(true);
          // try {
          //   const formPayload = new FormData();
          //   for (const key in formData) {
          //       if (key !== 'attachment' && formData[key] !== null) {
          //       formPayload.append(key, formData[key]);
          //       }
          //   }
          //   if (formData.attachment) {
          //       formPayload.append('attachment', formData.attachment);
          //   }

          //   const response = await axios.post('/job-offers-post', formPayload, {
          //       headers: { 'Content-Type': 'multipart/form-data' }
          //   });

          //   console.log('Submission successful:', response.data);
          //   // Reset form
          //   setFormData({
          //       title: '',
          //       city: '',
          //       category: '',
          //       description: '',
          //       businessName: '',
          //       address: '',
          //       salary: '',
          //       name: '',
          //       telNo: '',
          //       telExt: '',
          //       altTelNo: '',
          //       altTelExt: '',
          //       email: '',
          //       website: '',
          //       keywords: '',
          //       captcha: '',
          //       attachment: null
          //   });
                
          // } catch (error) {
          //   console.error('Submission error:', error);
          //   if (error.response?.data?.errors) {
          //       setErrors(error.response.data.errors);
          //   }
          // }
        };

        const handleFinalSubmit = async () => {
          try {
            const formPayload = new FormData();
            
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
                {showPreview ? (
                <Preview
                  formData={formData}
                  filePreviews={filePreviews}
                  onEdit={() => {
                      setShowPreview(false);
                      setIsReturningFromPreview(true);
                    }
                  }
                  onSubmit={handleFinalSubmit}
                />
              ) : (
                
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="card">
                    <div className="card-header mb-1 d-md-flex justify-content-between align-items-center">
                      <h6 className="mb-0 text-muted"><strong>Create Ad</strong></h6>
                      <h6 className="mb-0 text-muted">
                        <strong>Free for 30 days</strong>
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
                            <label className="form-check-label text-dark fw-semibold" htmlFor="titleCheckbox">
                              Armenian Keyboard (Հայերեն Ստեղնաշար)
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
                              Armenian Keyboard (Հայերեն Ստեղնաշար)
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

                      {/* Salary Input */}
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Salary/Compensation</label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
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
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label text-dark fw-semibold">Ext.</label>
                            <input
                              type="number"
                              name="telExt"
                              value={formData.telExt}
                              onChange={handleInputChange}
                              className="form-control"
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
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-4">
                            <label className="form-label text-dark fw-semibold">Alt Ext.</label>
                            <input
                              type="number"
                              name="altTelExt"
                              value={formData.altTelExt}
                              onChange={handleInputChange}
                              className="form-control"
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
                          value={formData.email}
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
                              className={`form-control flex-grow-1 ${errors.captcha ? 'is-invalid' : ''}`}
                              placeholder="Enter CAPTCHA code"
                              onCopy={(e) => e.preventDefault()}
                              onCut={(e) => e.preventDefault()}
                              onPaste={(e) => e.preventDefault()}
                              style={{ minWidth: '180px' }}
                            />
                          </div>
                          {errors.captcha && <div className="invalid-feedback">{errors.captcha}</div>}
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
                <strong>Location:</strong> {formData.city}<br />
                <strong>Category:</strong> {formData.category}
              </p>
            </div>

            <div className="mb-4">
              <h6>Description</h6>
              <p style={{ whiteSpace: 'pre-wrap' }}>{formData.description}</p>
            </div>

            {formData.businessName && (
              <div className="mb-4">
                <h6>Business Information</h6>
                <p>
                  <strong>Name:</strong> {formData.businessName}<br />
                  <strong>Address:</strong> {formData.address}<br />
                  <strong>Salary:</strong> {formData.salary}
                </p>
              </div>
            )}

            <div className="mb-4">
              <h6>Contact Information</h6>
              <p>
                <strong>Contact Name:</strong> {formData.name}<br />
                <strong>Phone:</strong> {formData.telNo} ext.{formData.telExt}<br />
                {formData.altTelNo && (
                  <><strong>Alt Phone:</strong> {formData.altTelNo} ext.{formData.altTelExt}<br /></>
                )}
                <strong>Email:</strong> {formData.email}<br />
                {formData.website && <><strong>Website:</strong> {formData.website}<br /></>}
                {formData.keywords && <><strong>Keywords:</strong> {formData.keywords}</>}
              </p>
            </div>
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

        <div className="mt-4">
          <button 
            type="button" 
            className="btn btn-secondary mr-2"
            onClick={onEdit}
          >
            Edit Post
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobOfferForm;