// src/components/BannerCreation/CreateBannerForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BannerPreview from './BannerPreview';
import './CreateBannerForm.css';

const STORAGE_KEY = 'bannerFormState';

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
  const [bannerCountMessage, setBannerCountMessage] = useState('');

   const calculateTotal = () => {
    // Calculate based on banner category and duration
    let baseRate = 0;
    switch(formData.banner_category) {
      case '1': baseRate = 50; break;
      case '2': baseRate = 45; break;
      // ... other cases ...
      default: baseRate = 40;
    }

    // Apply duration multiplier
    let multiplier = 1;
    switch(formData.expire_date) {
      case '60': multiplier = 1.8; break;
      case '90': multiplier = 2.5; break;
      case '36500': multiplier = 10; break;
      default: multiplier = 1;
    }

    return baseRate * multiplier;
  };

  // Fetch banner categories on component mount
  useEffect(() => {
    const fetchBannerCategories = async () => {
      try {
        const response = await axios.get('/banner-categories');
        setBannerCategories(response.data);
      } catch (error) {
        console.error('Error fetching banner categories:', error);
      }
    };

    fetchBannerCategories();
  }, []);

  // Load saved state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setFormData(parsedState.formData);
      setStep(parsedState.step);
    }
    
    // Clear state when navigating away
    return () => {
      if (window.location.pathname !== '/create-banner') {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      formData,
      step
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, step]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear errors when input changes
    setErrors({
      ...errors,
      [name]: ''
    });

    // Handle banner category change
    if (name === 'banner_category') {
      const selectedCategory = bannerCategories.find(cat => cat.id === value);
      setBannerSize(selectedCategory?.size || '');
      setBannerCountMessage('');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!allowedExtensions.includes(fileExtension)) {
      setErrors({
        ...errors,
        banner_images: 'Only JPG, PNG, and GIF images are allowed'
      });
      return;
    }

    // Check file size (max 2MB)
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

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Clear any previous errors
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

    if (!formData.banner_images) {
      newErrors.banner_images = 'Please upload an image';
    }

    if (!formData.customer_email && !formData.override) {
      newErrors.customer_email = 'Please enter a customer email';
    }

    if (!formData.expire_date) {
      newErrors.expire_date = 'Please select a display period';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate and move to preview
  const handlePreview = () => {
    // Simple validation - expand as needed
    if (!formData.banner_category) {
      alert('Please select a banner spot');
      return;
    }
    if (!formData.banner_images) {
      alert('Please upload an image');
      return;
    }
    if (!formData.customer_email && !formData.override) {
      alert('Please enter customer email');
      return;
    }
    
    setStep('preview');
  };

//  const handlePreview = () => {
//     if (validateForm()) {
//       // Convert image to base64 for payment page
//       const reader = new FileReader();
//       reader.onload = () => {
//         const bannerData = {
//           ...formData,
//           banner_images: reader.result,
//           totalAmount: calculateTotal()
//         };

//         navigate('/payment', {
//           state: {
//             draftData: {
//               type: 'banner',
//               bannerData,
//               rate: calculateTotal(),
//               email: formData.customer_email
//             }
//           }
//         });
//       };

//       if (formData.banner_images) {
//         reader.readAsDataURL(formData.banner_images);
//       } else {
//         navigate('/payment', {
//           state: {
//             draftData: {
//               type: 'banner',
//               bannerData: { ...formData, banner_images: null },
//               totalAmount: calculateTotal(),
//               email: formData.customer_email
//             }
//           }
//         });
//       }
//     }
//   };


  // Handle final form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('banner_category', formData.banner_category);
      formPayload.append('banner_images', formData.banner_images);
      formPayload.append('external_link', formData.external_link);
      formPayload.append('customer_email', formData.customer_email);
      formPayload.append('override', formData.override);
      formPayload.append('expire_date', formData.expire_date);

      const response = await axios.post('/api/banners', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Handle success
      alert('Banner created successfully!');
      resetForm();
      setStep('form');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  


  const handleProceedToPayment = () => {
    // Convert image to base64 for payment page
    const reader = new FileReader();
    reader.onload = () => {
      const bannerData = {
        ...formData,
        banner_images: reader.result,
        totalAmount: calculateTotal()
      };

      navigate('/payment', {
        state: {
          draftData: {
            type: 'banner',
            bannerData: formData,
            rate: calculateTotal(),
            email: formData.customer_email
          }
        }
      });
    };

    if (formData.banner_images) {
      reader.readAsDataURL(formData.banner_images);
    } else {
      navigate('/payment', {
        state: {
          draftData: {
            type: 'banner',
            bannerData: { ...formData, banner_images: null },
            totalAmount: calculateTotal(),
            email: formData.customer_email
          }
        }
      });
    }
  };

  const resetForm = () => {
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
    localStorage.removeItem(STORAGE_KEY);
  };

  // Go back to form from preview
  const handleEdit = () => {
    setStep('form');
  };

  return (
    <div className="banner-creation-container">
      <div className="banner-header">
        <h2>{step === 'form' ? 'Create New Banner' : 'Review Your Banner'}</h2>
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
                  {category.name} - #{category.id}
                </option>
              ))}
            </select>
            {errors.banner_category && (
              <div className="error-message">{errors.banner_category}</div>
            )}
            {bannerCountMessage && (
              <div className="error-message">{bannerCountMessage}</div>
            )}
          </div>

          <div className="form-group">
            <label>
              Upload Image <span className="required">*</span>
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
              <label htmlFor="banner_images" className="file-label">
                <span>{formData.banner_images ? formData.banner_images.name : 'Choose file'}</span>
                <button type="button" className="browse-btn">
                  Browse
                </button>
              </label>
            </div>
            {errors.banner_images && (
              <div className="error-message">{errors.banner_images}</div>
            )}

            {/* Image Preview */}
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Banner preview" />
                <button type="button" onClick={removePreviewImage} className="remove-btn">
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>External Link (Optional)</label>
            <input
              type="text"
              name="external_link"
              value={formData.external_link}
              onChange={handleInputChange}
              placeholder="Enter link"
            />
            {errors.external_link && (
              <div className="error-message">{errors.external_link}</div>
            )}
          </div>

          <div className="form-group">
            <label className="email-label">
              Customer Email
              {!formData.override && <span className="required"> *</span>}
              <div className="override-container">
                <input
                  type="checkbox"
                  name="override"
                  checked={formData.override}
                  onChange={handleInputChange}
                  id="override-checkbox"
                />
                <label htmlFor="override-checkbox">Override</label>
              </div>
            </label>
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
                <label htmlFor="30days">30 Days</label>
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
                <label htmlFor="60days">60 Days</label>
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
                <label htmlFor="90days">90 Days</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="expire_date"
                  value="36500"
                  checked={formData.expire_date === '36500'}
                  onChange={handleInputChange}
                  id="unlimited"
                />
                <label htmlFor="unlimited">Unlimited</label>
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
          // onEdit={handleEdit}
          onEdit={() => setStep('form')}
          onProceed={handleProceedToPayment}
          isSubmitting={isSubmitting}
          onSubmit={handlePreview}
        />
      )}
    </div>
  );
};

export default CreateBannerForm;
