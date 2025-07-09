// src/components/BannerCreation/CreateBannerForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BannerPreview from './BannerPreview';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './CreateBannerForm.css';

// Helper function to convert data URL to File object
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const CreateBannerForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [bannerCategories, setBannerCategories] = useState([]);
  const [formData, setFormData] = useState({
    banner_category: '',
    banner_images: null,
    external_link: '',
    customer_email: '',
    override: false,
    expire_date: '30',
  });
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [bannerSize, setBannerSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerRate, setBannerRate] = useState(0);
  const [displayPrice, setDisplayPrice] = useState('Select Spot');
  const [instructions, setInstructions] = useState('');
  const [isVideoBanner, setIsVideoBanner] = useState(false);
  const [prevIsVideo, setPrevIsVideo] = useState(false);
  
  // Refs for transition groups
  const imageUploadRef = useRef(null);
  const videoFieldsRef = useRef(null);
  const linkFieldRef = useRef(null);

  // Calculate total based on banner category and duration
  const calculateTotal = () => {
    if (!formData.banner_category) return 0;
    
    const selectedCategory = bannerCategories.find(
        cat => cat.id == formData.banner_category
    );
    
    if (!selectedCategory) return 0;
    
    // Clean numeric value (remove commas and non-numeric characters)
    const cleanNumeric = (value) => {
        if (typeof value === 'number') return value;
        return parseFloat(String(value).replace(/[^\d.]/g, '')) || 0;
    };

    let baseRate = cleanNumeric(selectedCategory.rate);
    
    let multiplier = 1;
    switch(formData.expire_date) {
        case '60': 
        multiplier = 1.8;
        break;
        case '90': 
        multiplier = 2.5;
        break;
        default: 
        multiplier = 1;
    }
    
    return (baseRate * multiplier).toFixed(2);
  };

  // Save preview data to sessionStorage
  const savePreviewData = () => {
    const previewData = {
      formData: {
        banner_category: formData.banner_category,
        external_link: formData.external_link,
        customer_email: formData.customer_email,
        override: formData.override,
        expire_date: formData.expire_date,
      },
      previewImage,
      bannerRate,
      instructions,
      isVideoBanner,
      bannerSize,
    };
    sessionStorage.setItem('bannerPreviewData', JSON.stringify(previewData));
  };

  // Load preview data from sessionStorage
  const loadPreviewData = () => {
    const savedData = sessionStorage.getItem('bannerPreviewData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        // Convert base64 back to File if exists
        let bannerImageFile = null;
        if (data.previewImage) {
          bannerImageFile = dataURLtoFile(
            data.previewImage, 
            isVideoBanner ? 'video_thumbnail.jpg' : 'banner_image.jpg'
          );
        }

        setFormData(prev => ({
          ...prev,
          ...data.formData,
          banner_images: bannerImageFile
        }));
        setPreviewImage(data.previewImage);
        setBannerRate(data.bannerRate);
        setInstructions(data.instructions);
        setIsVideoBanner(data.isVideoBanner);
        setBannerSize(data.bannerSize);
        setStep('preview');
      } catch (e) {
        console.error('Failed to parse preview data', e);
        sessionStorage.removeItem('bannerPreviewData');
      }
    }
  };

  // Clear preview data from sessionStorage
  const clearPreviewData = () => {
    sessionStorage.removeItem('bannerPreviewData');
  };

  // Clear preview data when navigating away
  useEffect(() => {

    return () => {
      clearPreviewData();
    };
  }, [navigate]);

  // Update instructions when banner category changes
  const updateInstructions = (categoryId) => {
    if (!categoryId) {
      setInstructions('');
      setIsVideoBanner(false);
      return;
    }
    
    const selectedCategory = bannerCategories.find(cat => cat.id == categoryId);
    const isVideo = selectedCategory && selectedCategory.name.toLowerCase().includes('video');
    
    // Reset external link when switching between video and graphic
    if (isVideo !== isVideoBanner) {
      setFormData(prev => ({ ...prev, external_link: '' }));
    }
    
    setIsVideoBanner(isVideo);
    
    if (isVideo) {
      setInstructions(
        "Please upload the video thumbnail image (if available) and paste the YouTube embed code into the video link field. " +
        "Your video ad will be displayed within 3 business days after submission."
      );
    } else {
      setInstructions(
        "Choose a spot and upload your graphic image in the same orientation and pixel size dimensions as your selection. " +
        "For instance, if you select the vertical 276x485 banner, your image should also be vertical and match those dimensions. " +
        "Alternatively, you can request a custom banner design—please see instructions for more details. " +
        "After you submit your graphic image or video ad, it will be displayed in your selected spot within 3 business days."
      );
    }
  };

  // Update display price whenever form data changes
  useEffect(() => {
    if (!formData.banner_category) {
      setDisplayPrice('Select Spot');
      setBannerRate(0);
      return;
    }
    
    const total = calculateTotal();
    setBannerRate(total);
    
    let durationText = '';
    switch(formData.expire_date) {
      case '30': durationText = '30 Days'; break;
      case '60': durationText = '60 Days'; break;
      case '90': durationText = '90 Days'; break;
    }
    
    // Format large numbers with commas
    setDisplayPrice(`$${Number(total).toLocaleString('en-US')} - ${durationText}`);
  }, [formData.banner_category, formData.expire_date, bannerCategories]);

  // Fetch banner categories on component mount and load preview data
  useEffect(() => {
    const fetchBannerCategories = async () => {
      try {
        const response = await axios.get('/banner-categories');
        setBannerCategories(response.data);
        
        // Load preview data after categories are fetched
        loadPreviewData();
      } catch (error) {
        console.error('Error fetching banner categories:', error);
      }
    };

    fetchBannerCategories();

    // Clear preview data when unmounting (except for refresh)
    return () => {
      clearPreviewData();
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    setFormData(newFormData);

    setErrors({
      ...errors,
      [name]: ''
    });

    if (name === 'banner_category') {
      const selectedCategory = bannerCategories.find(cat => cat.id === value);
      setBannerSize(selectedCategory?.size || '');
      updateInstructions(value);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!allowedExtensions.includes(fileExtension)) {
      setErrors({
        ...errors,
        banner_images: 'Only JPG, PNG, and GIF images are allowed'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        banner_images: 'File size exceeds 2MB limit'
      });
      return;
    }

    setFormData({
      ...formData,
      banner_images: file
    });

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setErrors({
      ...errors,
      banner_images: ''
    });
  };

  // Remove preview image
  const removePreviewImage = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      banner_images: null
    });
    document.getElementById('banner_images').value = '';
  };

  // Validate form before preview
  const validateForm = () => {
    const newErrors = {};

    if (!formData.banner_category) {
      newErrors.banner_category = 'Please select a banner spot';
    }

    if (!isVideoBanner && !formData.banner_images) {
      newErrors.banner_images = 'Please upload an image';
    }

    if (!formData.customer_email && !formData.override) {
      newErrors.customer_email = 'Please enter a customer email';
    }

    if (!formData.expire_date) {
      newErrors.expire_date = 'Please select a display period';
    }

    if (isVideoBanner && !formData.external_link) {
      newErrors.external_link = 'Please enter YouTube embed code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      savePreviewData();
      setStep('preview');
    }
  };
  
  const handleProceedToPayment = () => {
    clearPreviewData();
    
    const bannerData = {
      ...formData,
      isVideo: isVideoBanner,
      totalAmount: bannerRate
    };

    navigate('/payment', {
      state: {
        draftData: {
          type: 'banner',
          bannerData,
          rate: bannerRate,
          email: formData.customer_email
        }
      }
    });
  };

  // Reset form
  const resetForm = () => {
    clearPreviewData();
    
    setFormData({
      banner_category: '',
      banner_images: null,
      external_link: '',
      customer_email: '',
      override: false,
      expire_date: '30',
    });
    setPreviewImage(null);
    setBannerSize('');
    setErrors({});
    setDisplayPrice('Select Spot');
    setBannerRate(0);
    setInstructions('');
    setIsVideoBanner(false);
  };

  // Go back to form from preview
  const handleEdit = () => {
    clearPreviewData();
    setStep('form');
  };

  // Track previous video state for transitions
  useEffect(() => {
    if (isVideoBanner !== prevIsVideo) {
      setPrevIsVideo(isVideoBanner);
    }
  }, [isVideoBanner]);

  return (
    <div className="banner-creation-container">
      {/* Instructions Section - Always at the top */}
      {step === 'form' && (
        <div className="instructions-section">
          <div className="how-it-works">
            <h4>How It Works</h4>
            {instructions ? (
              <p>{instructions}</p>
            ) : (
              <p>Select a banner spot to see specific instructions for that placement.</p>
            )}
          </div>
        </div>
      )}

      <div className="banner-header">
        <div className='banner-header-title d-flex justify-content-between'>
          <h3>{step === 'form' ? 'Advertise Your Business' : 'Review Banner'}</h3>
          <span className="price-display">{displayPrice}</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-step ${step === 'form' ? 'active' : ''}`}>
            <span>1</span>
            <p>Create Banner</p>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'preview' ? 'active' : ''}`}>
            <span>2</span>
            <p>Preview</p>
          </div>
        </div>
      </div>

      {step === 'form' ? (
        <div className="banner-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label>
              Banner Spot <span className="required">*</span>
            </label>
            <select
              name="banner_category"
              value={formData.banner_category}
              onChange={handleInputChange}
              className={errors.banner_category ? 'error' : ''}
            >
              <option value="" disabled>Select a banner spot</option>
              {bannerCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - ${category.rate} (30 Days)
                </option>
              ))}
            </select>
            {errors.banner_category && (
              <div className="error-message">{errors.banner_category}</div>
            )}
          </div>

          {/* Banner Type Fields with Transition */}
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={isVideoBanner ? 'video' : 'image'}
              timeout={300}
              classNames="fade-slide"
              nodeRef={isVideoBanner ? videoFieldsRef : imageUploadRef}
            >
              <div ref={isVideoBanner ? videoFieldsRef : imageUploadRef}>
                {!isVideoBanner ? (
                  <div className="form-group">
                    <label>
                      Upload Banner Image <span className="required">*</span>
                      <span className="file-info">(JPG, PNG, GIF, max 2 MB)</span>
                      {bannerSize && (
                        <span className="size-info">({bannerSize})</span>
                      )}
                    </label>
                    <div className="file-upload">
                      <input
                        id="banner_images"
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/jpeg,image/png,image/gif"
                      />
                      <label htmlFor="banner_images" className="file-label full-width-file-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        <span className="file-name">{formData.banner_images ? formData.banner_images.name : 'Choose a banner image'}</span>
                      </label>
                    </div>
                    {errors.banner_images && (
                      <div className="error-message">{errors.banner_images}</div>
                    )}

                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Banner preview" />
                        <button type="button" onClick={removePreviewImage} className="remove-btn">
                          x
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>
                        Upload Video Thumbnail (Optional)
                        <span className="file-info">(JPG, PNG, GIF, max 2 MB)</span>
                      </label>
                      <div className="file-upload">
                        <input
                          id="banner_images"
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/jpeg,image/png,image/gif"
                        />
                        <label htmlFor="banner_images" className="file-label full-width-file-label">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                          </svg>
                          <span className="file-name">{formData.banner_images ? formData.banner_images.name : 'Choose a thumbnail image'}</span>
                        </label>
                      </div>
                      {previewImage && (
                        <div className="image-preview">
                          <img src={previewImage} alt="Thumbnail preview" />
                          <button type="button" onClick={removePreviewImage} className="remove-btn">
                            x
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        YouTube Embed Code <span className="required">*</span>
                      </label>
                      <textarea
                        name="external_link"
                        value={formData.external_link}
                        onChange={handleInputChange}
                        placeholder="Paste YouTube embed code here"
                        rows="4"
                        className={errors.external_link ? 'error' : ''}
                      ></textarea>
                      {errors.external_link && (
                        <div className="error-message">{errors.external_link}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>

          {/* External Link Field with Transition */}
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={isVideoBanner ? 'hidden' : 'visible'}
              timeout={300}
              classNames="fade"
              nodeRef={linkFieldRef}
            >
              <div ref={linkFieldRef}>
                {!isVideoBanner && (
                  <div className="form-group">
                    <label>External Link (Optional)</label>
                    <input
                      type="text"
                      name="external_link"
                      value={formData.external_link}
                      onChange={handleInputChange}
                      placeholder="Enter destination URL"
                    />
                  </div>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>

          <div className="form-group">
            <div className="email-label-container">
              <div className="main-label-container">
                <label className="email-label">
                  Customer Email
                  {!formData.override && <span className="required"> *</span>}
                </label>
              </div>
            </div>
            
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleInputChange}
              placeholder="Customer email"
              disabled={formData.override}
              className={errors.customer_email ? 'error' : ''}
            />
            {errors.customer_email && (
              <div className="error-message">{errors.customer_email}</div>
            )}
          </div>

          <div className="form-group">
            <label>
              Display Period <span className="required">*</span>
            </label>
            <div className="radio-group-container">
              <div className="radio-group">
                <input
                  type="radio"
                  name="expire_date"
                  value="30"
                  checked={formData.expire_date === '30'}
                  onChange={handleInputChange}
                  id="30days"
                />
                <label htmlFor="30days">30 Days (Base Rate)</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="expire_date"
                  value="60"
                  checked={formData.expire_date === '60'}
                  onChange={handleInputChange}
                  id="60days"
                />
                <label htmlFor="60days">60 Days (20% Discount)</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="expire_date"
                  value="90"
                  checked={formData.expire_date === '90'}
                  onChange={handleInputChange}
                  id="90days"
                />
                <label htmlFor="90days">90 Days (30% Discount)</label>
              </div>
            </div>
            {errors.expire_date && (
              <div className="error-message">{errors.expire_date}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Reset
            </button>
            <button type="button" onClick={handlePreview} className="btn btn-primary">
              Preview Banner
            </button>
          </div>
        </div>
      ) : (
        <BannerPreview
          formData={formData}
          previewImage={previewImage}
          bannerCategories={bannerCategories}
          onEdit={handleEdit}
          onProceed={handleProceedToPayment}
          isSubmitting={isSubmitting}
          bannerRate={bannerRate}
          displayPeriod={formData.expire_date}
          isVideoBanner={isVideoBanner}
        />
      )}
    </div>
  );
};

export default CreateBannerForm;