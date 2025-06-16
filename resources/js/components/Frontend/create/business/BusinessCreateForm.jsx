import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaRedo, FaCloudUploadAlt, FaTimes, FaClock } from 'react-icons/fa';
import VirtualKeyboard from '../Frontend/VirtualKeyboard';
import AuthModal from '../Frontend/AuthModal';
import '../Frontend/BusinessCreateForm.css';
import Preview from './Preview';
import FeatureSelection from './FeatureSelection';

const BusinessCreateForm = ({ 
    isEditMode = false, 
    initialData = null,
    onSubmit: externalSubmit,
    onCancel 
}) => {
const navigate = useNavigate();
// Days for working hours
const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
];

// formdata here
const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    suite: '',
    city: '',
    category: '',
    subCategories: [],
    description: '',
    workingHour: '',
    days: [],
    startTime: '',
    endTime: '',
    telNo: '',
    tel_ext: '',
    altTelNo: '',
    alt_tel_ext: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    yelp: '',
    youtube: '',
    logo: null,
    contactName: '',
    contactTelNo: '',
    contactEmail: '',
    featured: 'No',
    model: 'Directory',
    socialShare: '',
    rate: 0,
    featureRate: 0,
    socialMediaRate: 0,
    extendedRate: 0, // Added for extended subcategories
    sessionId: localStorage.getItem('draft_session'),
    monday: false,
    monday_startTime: '',
    monday_endTime: '',
    tuesday: false,
    tuesday_startTime: '',
    tuesday_endTime: '',
    wednesday: false,
    wednesday_startTime: '',
    wednesday_endTime: '',
    thursday: false,
    thursday_startTime: '',
    thursday_endTime: '',
    friday: false,
    friday_startTime: '',
    friday_endTime: '',
    saturday: false,
    saturday_startTime: '',
    saturday_endTime: '',
    sunday: false,
    sunday_startTime: '',
    sunday_endTime: '',
    hide_hour: false,
});

const [sessionId, setSessionId] = useState('');
const [errors, setErrors] = useState({});
const [businessNameCheckbox, setBusinessNameCheckbox] = useState(false);
const [showKeyboard, setShowKeyboard] = useState(false);
const [keyboardTarget, setKeyboardTarget] = useState(null);
const businessNameInputRef = useRef(null);
const descInputRef = useRef(null);
const [showPreview, setShowPreview] = useState(false);
const [captchaText, setCaptchaText] = useState('');
const [captchaInput, setCaptchaInput] = useState('');
const [captchaError, setCaptchaError] = useState('');
const [descCheckbox, setDescCheckbox] = useState(false);
const [isReturningFromPreview, setIsReturningFromPreview] = useState(false);
const [logoPreview, setLogoPreview] = useState(null);
const [showFeatureSelection, setShowFeatureSelection] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [getRate, setRate] = useState({ 
  base: 0, 
  feature: 0, 
  social: 0,
  extended: 0 // Added for extended subcategories
});
const [socialMediaPromotion, setSocialMediaPromotion] = useState(false);
const fileInputRef = useRef(null);
const [dragActive, setDragActive] = useState(false);
const [fileError, setFileError] = useState('');
const [locationSuggestions, setLocationSuggestions] = useState([]);
const [thumbnails, setThumbnails] = useState([]);
const [thumbnailPreviews, setThumbnailPreviews] = useState([]);
const fileInputThumbnails = useRef(null);
const [categories, setCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);

// Handle day checkbox change
const handleDayCheckboxChange = (dayId, checked) => {
    setFormData(prev => ({
        ...prev,
        [dayId]: checked,
        // Clear times when unchecking
        [`${dayId}_startTime`]: checked ? prev[`${dayId}_startTime`] : '',
        [`${dayId}_endTime`]: checked ? prev[`${dayId}_endTime`] : ''
    }));
};

// Handle time input change
const handleTimeChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
};

// Handle hide hours checkbox
const handleHideHoursChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
        // Reset all day fields when hiding hours
        const resetFields = {};
        daysOfWeek.forEach(day => {
            resetFields[day.id] = false;
            resetFields[`${day.id}_startTime`] = '';
            resetFields[`${day.id}_endTime`] = '';
        });
        
        setFormData(prev => ({
            ...prev,
            ...resetFields,
            hide_hour: checked
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            hide_hour: checked
        }));
    }
};

// Handle subcategory selection
const handleSubcategoryChange = (e, subcategory) => {
  const isChecked = e.target.checked;
  setFormData(prev => {
    let newSubs = [...prev.subCategories];
    
    if (isChecked) {
      newSubs.push(subcategory);
    } else {
      newSubs = newSubs.filter(id => id !== subcategory);
    }
    
    // Calculate extended rate
    const extendedCount = Math.max(0, newSubs.length - 2);
    const extendedRate = extendedCount * (getRate.extended || 0);
    
    return {
      ...prev,
      subCategories: newSubs,
      extendedRate
    };
  });
};

// Handle thumbnail upload
const handleThumbnailsChange = (e) => {
  const files = Array.from(e.target.files || e.dataTransfer.files);
  if (files.length === 0) return;

  const validFiles = files.filter(file => 
    ['image/jpeg', 'image/png'].includes(file.type) && 
    file.size <= 2 * 1024 * 1024
  );

  if (validFiles.length !== files.length) {
    setFileError('Only JPG/PNG images under 2MB are allowed');
  }

  const newPreviews = validFiles.map(file => URL.createObjectURL(file));
  setThumbnailPreviews(prev => [...prev, ...newPreviews]);
  setThumbnails(prev => [...prev, ...validFiles]);
};

// Remove thumbnail
const removeThumbnail = (index) => {
  setThumbnailPreviews(prev => prev.filter((_, i) => i !== index));
  setThumbnails(prev => prev.filter((_, i) => i !== index));
};

useEffect(() => {
  const fetchCateories = async () => {
      try {
          const response = await axios.get('/get/directory/categories');
          if (response.data.success && response.data.categories.length > 0) {
              setCategories(response.data.categories);
          }
      } catch (err) {
          console.error('Error fetching categories:', err);
      }
  };
  fetchCateories();
}, []);

useEffect(() => {
  if (isEditMode && initialData) {
    setFormData(prev => ({
      ...prev,
      ...initialData,
      postId: initialData.id
    }));

    // Handle existing logo preview
    if (initialData.logo) {
      setLogoPreview(initialData.logo);
    }
  }
}, [isEditMode, initialData]);

// Initialize session and restore form state
useEffect(() => {
  const initializeSession = async () => {
    try {
      const response = await axios.post('/session/init');
      const newSessionId = response.data.session_id;
      localStorage.setItem('draft_session', newSessionId);
      setSessionId(newSessionId);
      setFormData(prev => ({ ...prev, sessionId: newSessionId }));
    } catch (error) {
      console.error('Session initialization failed:', error);
    }
  };

  // Restore form state from localStorage
  const savedForm = localStorage.getItem('businessFormDraft');
  if (savedForm) {
    const parsed = JSON.parse(savedForm);
    
    if (!parsed.isReturningFromPreview) {
      setFormData(parsed.formData);
      setLogoPreview(parsed.logoPreview);
      setThumbnailPreviews(parsed.thumbnailPreviews || []);
      setThumbnails(parsed.thumbnails || []);
      setShowPreview(parsed.showPreview);
      setShowFeatureSelection(parsed.showFeatureSelection);
    }

  } 
  // Only initialize new session if no saved form exists
  else if (!localStorage.getItem('draft_session')) {
    initializeSession();
  } else {
    const existingSession = localStorage.getItem('draft_session');
    setSessionId(existingSession);
    setFormData(prev => ({ ...prev, sessionId: existingSession }));
  }
}, []);

useEffect(() => {
  if (isReturningFromPreview) {
    localStorage.removeItem('businessFormDraft');
    setIsReturningFromPreview(false);
  }
}, [isReturningFromPreview]);

// Save form state to localStorage
useEffect(() => {
  const saveFormState = () => {
    const formState = {
      formData,
      logoPreview,
      thumbnailPreviews,
      showPreview,
      thumbnails,
      showFeatureSelection,
      isReturningFromPreview
    };
    localStorage.setItem('businessFormDraft', JSON.stringify(formState));
    sessionStorage.setItem('inFormFlow', 'true');
  };

  // Save state when entering preview or feature selection
  if (showPreview || showFeatureSelection) {
    saveFormState();
  }
}, [formData, logoPreview, thumbnailPreviews, showPreview, thumbnails, showFeatureSelection]);

// Handle input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Clear error for this field
  if (errors[name]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }

  // Phone number validation
  if (name === 'telNo' || name === 'altTelNo' || name === 'contactTelNo') {
    const isValid = /^[()+\d\s.-]*$/.test(value);
    if (!isValid) return;
  }

  setFormData(prev => ({ ...prev, [name]: value }));
};

// Handle category input changes
const handleSubCategoryInputChange = (e) => {
  if (!e) return;
  axios.get(`/get/directory/sub/categories/${e.target.value}`)
    .then(response => {
      setSubCategories(response.data.subCategories);
    })
    .catch(error => {
      console.error('Error fetching sub categories:', error);
    });
};

// Handle logo upload
const handleLogoChange = (e) => {
  const file = e.target.files?.[0] || (e.dataTransfer && e.dataTransfer.files[0]);
  if (!file) return;

  setFileError('');
  
  // Validate file
  const validTypes = ['image/jpeg', 'image/png'];
  const isValidType = validTypes.includes(file.type);
  const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
  
  if (!isValidType) {
    setFileError('Only JPG and PNG images are allowed');
    return;
  }
  
  if (!isValidSize) {
    setFileError('File size must be less than 2MB');
    return;
  }
  
  // Set preview and form data
  setLogoPreview(URL.createObjectURL(file));
  setFormData(prev => ({ ...prev, logo: file }));
};

// Handle drag events for logo
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(e.type === 'dragenter' || e.type === 'dragover');
};

// Handle file drop for logo
const handleDrop = (e) => {
e.preventDefault();
e.stopPropagation();
setDragActive(false);
handleLogoChange(e);
};

// Trigger file input
const handleLogoClick = () => {
  fileInputRef.current.click();
};

// Remove logo
const handleRemoveLogo = () => {
  setLogoPreview(null);
  setFormData(prev => ({ ...prev, logo: null }));
  if (fileInputRef.current) fileInputRef.current.value = '';
};

const handleKeyboardInput = (value) => {
  setFormData(prev => ({
    ...prev,
    [keyboardTarget.name]: value
  }));
};

// CAPTCHA handling
const generateCaptcha = () => {
  const chars = '1234567890';
  let captcha = '';
  for(let i = 0; i < 5; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  setCaptchaText(captcha);
  setCaptchaInput('');
  setCaptchaError('');
};

useEffect(() => {
  generateCaptcha();
}, []);

// Fetch rates
useEffect(() => {
  const fetchRate = async () => {
    try {
      const response = await axios.get('/directory/rate');
      const base = parseFloat(response.data?.base_rate) || 0;
      const feature = parseFloat(response.data?.feature_rate) || 0;
      const social = parseFloat(response.data?.social_share_rate) || 0;
      const extended = parseFloat(response.data?.extended_rate) || 0; // Extended rate

      setRate({ base, feature, social, extended });
      setFormData(prev => ({
        ...prev,
        rate: base,
        featureRate: 0,
        socialMediaRate: 0,
        extendedRate: 0
      }));
    } catch (error) {
      console.error('Error fetching rates:', error);
      setRate({ base: 75, feature: 35, social: 25, extended: 10 });
      setFormData(prev => ({
        ...prev,
        rate: 75,
        featureRate: 0,
        socialMediaRate: 0,
        extendedRate: 0
      }));
    }
  };
  fetchRate();
}, []);

// Social media promotion
const handleSocialPromotionChange = (e) => {
  const isChecked = e.target.checked;
  setSocialMediaPromotion(isChecked);
  setFormData(prev => ({
    ...prev,
    socialMediaRate: isChecked ? getRate.social : 0
  }));
};

// Save draft
const saveDraftData = async () => {
  try {
    const formPayload = new FormData();
    
    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'logo' && value) {
        formPayload.append(key, value);
      }
    });
    
    // Append logo if exists
    if (formData.logo) {
      formPayload.append('logo', formData.logo);
    }

    // Append thumbnails
    thumbnails.forEach((file, index) => {
      formPayload.append(`thumbnails[${index}]`, file);
    });

    formPayload.append('ip', await getClientIP());
    
    const response = await axios.post('/save-draft', formPayload);
    return response.data.draftId;
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

// Form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setCaptchaError('');
  // Validation
  const newErrors = {};
  if (!formData.businessName) newErrors.businessName = 'Business name is required';
  if (!formData.address) newErrors.address = 'Address is required';
  if (!formData.city) newErrors.city = 'City is required';
  if (!formData.category) newErrors.category = 'Category is required';
  if (!formData.description) newErrors.description = 'Description is required';
  if (!formData.telNo) newErrors.telNo = 'Phone number is required';
  if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
  if (formData.tel_ext && !formData.telNo) {
    newErrors.telNo = 'Phone number is required when extension is provided';
  }
  if (formData.alt_tel_ext && !formData.altTelNo) {
    newErrors.altTelNo = 'Alternate phone is required when extension is provided';
  }
  daysOfWeek.forEach(day => {
    if (formData[day.id]) {
        const startField = `${day.id}_startTime`;
        const endField = `${day.id}_endTime`;
        
        if (!formData[startField]) {
            newErrors[startField] = `Start time is required for ${day.label}`;
        }
        
        if (!formData[endField]) {
            newErrors[endField] = `End time is required for ${day.label}`;
        }
        
        // CORRECTED: Use endField instead of endTime
        if (formData[startField] && formData[endField] && 
            formData[startField] >= formData[endField]) {
            newErrors[endField] = `End time must be after start time for ${day.label}`;
        }
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    console.log(newErrors);
    return;
  }

  // CAPTCHA validation
  if (!isEditMode && !isReturningFromPreview && captchaInput !== captchaText) {
    setCaptchaError('Invalid CAPTCHA code');
    generateCaptcha();
    return;
  }
  if (isEditMode) {
    // Handle edit submission
    const editPayload = {
      ...formData,
      logo: formData.logo
    };
    externalSubmit(editPayload);
  } else {
    setShowPreview(true);
  }
};

const handleFeaturedSubmit = async () => {
  try {
    // Check authentication
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    sessionStorage.removeItem('inFormFlow');
    sessionStorage.removeItem('fromHome');

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Calculate total amount
    const totalAmount = 
      formData.rate + 
      formData.featureRate + 
      formData.socialMediaRate +
      formData.extendedRate;
    
    navigate('/payment', { 
      state: { 
        draftData: {
          ...formData,
          totalAmount
        },
        model: 'Directory'
      } 
    });
    
    // Clear saved form state after successful submission
    localStorage.removeItem('businessFormDraft');
  } catch (error) {
    console.error('Submission error:', error);
  }
};

  return (
    <section className="sptb pt-5">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-xl-10" style={{ position: 'relative' }}>

            {showFeatureSelection ? (
                <FeatureSelection 
                    formData={formData}
                    getRate={getRate}
                    setFormData={setFormData}
                    setShowFeatureSelection={setShowFeatureSelection}
                    setShowPreview={setShowPreview}
                    handleFeaturedSubmit={handleFeaturedSubmit}
                    socialMediaPromotion={socialMediaPromotion}
                    setSocialMediaPromotion={setSocialMediaPromotion}
                />
            ) : showPreview ? (
              <Preview
                formData={formData}
                logoPreview={logoPreview}
                thumbnailPreviews={thumbnailPreviews}
                daysOfWeek={daysOfWeek}
                onEdit={() => {
                  setShowPreview(false);
                  setIsReturningFromPreview(true);
                  localStorage.removeItem('businessFormDraft');
                }}
                onSubmit={() => setShowFeatureSelection(true)}
              />
            ) : (
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="card">
                  <div className="card-header mb-1 d-md-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-muted"><strong>Create Business Listing</strong></h6>
                    <h6 className="mb-0 text-muted">
                      <strong>{getRate.base === 0 ? 'Free' : `$${getRate.base}`} per year</strong>
                    </h6>
                  </div>

                  <div className="card-body">
                    {/* Business Information Section */}
                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Business Information</h5>
                      
                      <div className="form-group">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label mb-0 text-dark fw-semibold">
                            Business Name <span className="text-danger">*</span>
                          </label>
                          <button
                            type="button"
                            className={`keyboard-toggle-btn mb-2 ${businessNameCheckbox ? 'active' : ''}`}
                            onClick={() => {
                              const newState = !businessNameCheckbox;
                              setBusinessNameCheckbox(newState);
                              setDescCheckbox(false);
                              setShowKeyboard(newState);
                              setKeyboardTarget(newState ? businessNameInputRef.current : null);
                              if (newState) businessNameInputRef.current.focus();
                            }}
                          >
                            Հայերեն Ստեղնաշար
                          </button>
                        </div>
                        <input
                          ref={businessNameInputRef}
                          type="text"
                          name="businessName"
                          data-armenian-input 
                          value={formData.businessName}
                          onChange={handleInputChange}
                          onFocus={() => setKeyboardTarget(businessNameInputRef.current)}
                          className={`form-control ${showKeyboard && keyboardTarget === businessNameInputRef.current ? 'keyboard-active' : ''} ${errors.businessName ? 'is-invalid' : ''}`}
                        />
                        {errors.businessName && <div className="invalid-feedback">{errors.businessName}</div>}
                      </div>

                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">
                          Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>

                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Suite/Apt</label>
                        <input
                          type="text"
                          name="suite"
                          value={formData.suite}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">
                          City <span className="text-danger">*</span>
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

                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={(e) => {
                            handleInputChange(e);
                            handleSubCategoryInputChange(e);
                          }}
                          className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                      </div>

                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Sub-Category</label>
                        <div className="subcategory-container">
                          {subCategories.length > 0 ? (
                            <div className="subcategory-grid">
                              {subCategories.map((subCategory) => (
                                <div 
                                  key={subCategory.id} 
                                  className={`subcategory-option ${formData.subCategories.includes(subCategory.id) ? 'selected' : ''}`}
                                  onClick={(e) => {
                                    const isChecked = !formData.subCategories.includes(subCategory.id);
                                    handleSubcategoryChange({
                                      target: { checked: isChecked }
                                    }, subCategory.id);
                                  }}
                                >
                                  <div className="subcategory-checkbox">
                                    {formData.subCategories.includes(subCategory.id) && (
                                      <div className="checkmark">✓</div>
                                    )}
                                  </div>
                                  <span className="subcategory-name">{subCategory.name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted p-2 border rounded">
                              Select a category first to see available sub-categories
                            </div>
                          )}
                          <div className="mt-2">
                            <small className="text-muted">
                              First 2 subcategories included. Additional: ${getRate.extended} each
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="form-group mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label text-dark fw-semibold mb-0">
                            Description <span className="text-danger">*</span>
                          </label>
                          <button
                            type="button"
                            className={`keyboard-toggle-btn mb-2 ${descCheckbox ? 'active' : ''}`}
                            onClick={() => {
                              const newState = !descCheckbox;
                              setDescCheckbox(newState);
                              setBusinessNameCheckbox(false);
                              setShowKeyboard(newState);
                              setKeyboardTarget(newState ? descInputRef.current : null);
                              if (newState) descInputRef.current.focus();
                            }}
                          >
                            Հայերեն Ստեղնաշար
                          </button>
                        </div>
                        <textarea
                          ref={descInputRef}
                          name="description"
                          data-armenian-input
                          value={formData.description}
                          onChange={handleInputChange}
                          onFocus={() => setKeyboardTarget(descInputRef.current)}
                          className={`form-control ${showKeyboard && keyboardTarget === descInputRef.current ? 'keyboard-active' : ''} ${errors.description ? 'is-invalid' : ''}`}
                          rows="5"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Working Hours</h5>
                      
                      <div className="d-flex align-items-center" style={{ fontSize: '16pt' }}>
                        <input
                          type="checkbox"
                          id="hideHours"
                          name="hide_hour"
                          checked={formData.hide_hour}
                          onChange={handleHideHoursChange}
                          className="me-2"
                        />
                        <label htmlFor="hideHours" className="form-label mb-0">
                          Hide
                        </label>
                      </div>
                      
                      {!formData.hide_hour && (
                        <div className="container px-0 mt-1">
                          <span className="text-muted font-weight-semibold" style={{ fontSize: '14px' }}>
                            (Check the box if you prefer not to display the operating hours)
                          </span>
                          <div className="card p-2 mb-1 hour_card">
                            <div className="m-0 p-0">
                              {daysOfWeek.map(day => (
                                <div className="row mb-2 align-items-center" key={day.id}>
                                  <div className="col-2">
                                    <input
                                      type="checkbox"
                                      id={day.id}
                                      name={day.id}
                                      checked={formData[day.id]}
                                      onChange={(e) => handleDayCheckboxChange(day.id, e.target.checked)}
                                      className="me-2"
                                    />
                                    <label htmlFor={day.id} className="font-weight-bold">
                                      {day.label}
                                    </label>
                                  </div>
                                  <div className="col-10 px-0">
                                    <div className="d-flex align-items-center gap-2" style={{margin: '0 15px 0 0'}}>
                                      {/* Start Time */}
                                      <div className="flex-grow-1 position-relative">
                                        <div className="input-group">
                                          <span className="input-group-text bg-light border-end-0 py-2">
                                            <FaClock size={12} className="text-muted" />
                                          </span>
                                          <input
                                            type="time"
                                            name={`${day.id}_startTime`}
                                            value={formData[`${day.id}_startTime`]}
                                            onChange={(e) => handleTimeChange(`${day.id}_startTime`, e.target.value)}
                                            className={`form-control border-start-0 py-2 ${
                                              errors[`${day.id}_startTime`] ? 'is-invalid' : ''
                                            }`}
                                            disabled={!formData[day.id]}
                                            style={{ 
                                              paddingRight: '2.5rem',
                                              backgroundColor: formData[day.id] ? '#fff' : '#f8f9fa'
                                            }}
                                          />
                                          <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted small">
                                            Start
                                          </span>
                                        </div>
                                        {errors[`${day.id}_startTime`] && (
                                          <div className="text-danger small mt-1">
                                            {errors[`${day.id}_startTime`]}
                                          </div>
                                        )}
                                      </div>

                                      {/* Separator */}
                                      <div className="text-muted" style={{ width: '20px', textAlign: 'center' }}>–</div>

                                      {/* End Time */}
                                      <div className="flex-grow-1 position-relative">
                                        <div className="input-group">
                                          <input
                                            type="time"
                                            name={`${day.id}_endTime`}
                                            value={formData[`${day.id}_endTime`]}
                                            onChange={(e) => handleTimeChange(`${day.id}_endTime`, e.target.value)}
                                            className={`form-control border-end-0 py-2 ${
                                              errors[`${day.id}_endTime`] ? 'is-invalid' : ''
                                            }`}
                                            disabled={!formData[day.id]}
                                            style={{ 
                                              paddingLeft: '2.5rem',
                                              backgroundColor: formData[day.id] ? '#fff' : '#f8f9fa'
                                            }}
                                          />
                                          <span className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted small">
                                            End
                                          </span>
                                          <span className="input-group-text bg-light border-start-0 py-2">
                                            <FaClock size={12} className="text-muted" />
                                          </span>
                                        </div>
                                        {errors[`${day.id}_endTime`] && (
                                          <div className="text-danger small mt-1">
                                            {errors[`${day.id}_endTime`]}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Contact Information</h5>
                      
                      <div className="form-group">
                        <label className="form-label text-dark fw-semibold">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <div className="row">
                          <div className="col-md-8">
                            <input
                              type="text"
                              name="telNo"
                              value={formData.telNo}
                              onChange={handleInputChange}
                              className={`form-control ${errors.telNo ? 'is-invalid' : ''}`}
                              placeholder="(123) 456-7890"
                            />
                            {errors.telNo && <div className="invalid-feedback">{errors.telNo}</div>}
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              name="tel_ext"
                              value={formData.tel_ext}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="Ext."
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Alternate Phone</label>
                        <div className="row">
                          <div className="col-md-8">
                            <input
                              type="text"
                              name="altTelNo"
                              value={formData.altTelNo}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="(123) 456-7890"
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="text"
                              name="alt_tel_ext"
                              value={formData.alt_tel_ext}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="Ext."
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Social Media</h5>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label text-dark fw-semibold">Facebook</label>
                            <input
                              type="url"
                              name="facebook"
                              value={formData.facebook}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://facebook.com/yourpage"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label text-dark fw-semibold">Instagram</label>
                            <input
                              type="url"
                              name="instagram"
                              value={formData.instagram}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://instagram.com/yourpage"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label text-dark fw-semibold">Yelp</label>
                            <input
                              type="url"
                              name="yelp"
                              value={formData.yelp}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://yelp.com/biz/yourbusiness"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label text-dark fw-semibold">YouTube</label>
                            <input
                              type="url"
                              name="youtube"
                              value={formData.youtube}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://youtube.com/yourchannel"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Person Section */}
                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Contact Person</h5>
                      
                      <div className="form-group">
                        <label className="form-label text-dark fw-semibold">Contact Name</label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Contact Phone</label>
                        <input
                          type="text"
                          name="contactTelNo"
                          value={formData.contactTelNo}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div className="form-group mt-3">
                        <label className="form-label text-dark fw-semibold">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="mb-4">
                      <h5 className="border-bottom pb-2 mb-3">Business Logo</h5>
                      
                      <label className="form-label text-dark fw-semibold">
                        Upload Logo
                        {logoPreview && <span className="text-muted ms-2">(1 file)</span>}
                      </label>
                      
                      <div 
                        className={`dropzone ${dragActive ? 'drag-active' : ''} ${logoPreview ? 'dropzone-full' : ''}`}
                        onClick={handleLogoClick}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="logo"
                          onChange={handleLogoChange}
                          className="d-none"
                          accept="image/*"
                        />
                        
                        <div className="dropzone-content">
                          <FaCloudUploadAlt size={42} className="text-primary mb-3" />
                          <p className="mb-1">
                            <strong>
                              {logoPreview 
                                ? 'Logo uploaded' 
                                : 'Drag & drop logo here'}
                            </strong>
                          </p>
                          <p className="text-muted mb-3">
                            {logoPreview 
                              ? 'Click to replace' 
                              : 'or click to browse'}
                          </p>
                          
                          {!logoPreview && (
                            <button 
                              type="button" 
                              className="btn btn-outline-primary"
                              onClick={handleLogoClick}
                            >
                              Select Logo
                            </button>
                          )}
                          
                          <p className="text-muted mt-2 mb-0">
                            Supports JPG, PNG (Max 2MB)
                          </p>
                        </div>
                      </div>
                      
                      {fileError && (
                        <div className="text-danger mt-2">{fileError}</div>
                      )}
                      
                      {logoPreview && (
                        <div className="previews-container mt-3">
                          <div className="position-relative d-inline-block">
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="img-thumbnail"
                              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                            />
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={handleRemoveLogo}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4 mt-4">
                        <h5 className="border-bottom pb-2 mb-3">Business Images</h5>
                        
                        <label className="form-label text-dark fw-semibold">
                        Upload Images (max 5)
                        </label>
                        
                        <div 
                        className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                        onClick={() => fileInputThumbnails.current.click()}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={(e) => {
                            handleDrag(e);
                            handleThumbnailsChange(e);
                        }}
                        >
                        <input
                            ref={fileInputThumbnails}
                            type="file"
                            multiple
                            onChange={handleThumbnailsChange}
                            className="d-none"
                            accept="image/*"
                        />
                        
                        <div className="dropzone-content">
                            <FaCloudUploadAlt size={42} className="text-primary mb-3" />
                            <p className="mb-1">
                            <strong>
                                {thumbnailPreviews.length > 0 
                                ? `${thumbnailPreviews.length} images uploaded` 
                                : 'Drag & drop images here'}
                            </strong>
                            </p>
                            <p className="text-muted mb-3">
                            {thumbnailPreviews.length > 0 
                                ? 'Click to add more' 
                                : 'or click to browse'}
                            </p>
                            
                            <button 
                            type="button" 
                            className="btn btn-outline-primary"
                            >
                            Select Images
                            </button>
                            
                            <p className="text-muted mt-2 mb-0">
                            Supports JPG, PNG (Max 5 images, 2MB each)
                            </p>
                        </div>
                        </div>
                        
                        {fileError && (
                        <div className="text-danger mt-2">{fileError}</div>
                        )}
                        
                        {thumbnailPreviews.length > 0 && (
                        <div className="previews-container mt-3">
                            <div className="d-flex flex-wrap gap-2">
                            {thumbnailPreviews.map((preview, index) => (
                                <div key={index} className="position-relative">
                                <img 
                                    src={preview} 
                                    alt={`Thumbnail ${index + 1}`} 
                                    className="img-thumbnail"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeThumbnail(index)}
                                >
                                    <FaTimes />
                                </button>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                    </div> 
                    {/* CAPTCHA */}
                    {!isEditMode && !isReturningFromPreview && !showPreview && (
                      <div className="form-group mt-3">
                        <div className="d-flex flex-nowrap align-items-center gap-2">
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
                        {isEditMode ? 'Update Listing' : 'Continue to Preview'}
                      </button>
                      {isEditMode && (
                        <button
                          type="button"
                          className="btn btn-secondary mt-3 w-100"
                          onClick={onCancel}
                        >
                          Cancel
                        </button>
                      )}
                      <p className="mt-3 small text-muted">
                        By creating your listing on ArmenianAd.com, you agree to our {' '}
                        <a 
                          href="/terms/and/conditions" 
                          className="fw-semibold" 
                          style={{ color: '#2450a0', textDecoration: 'underline' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a 
                          href="/privacy/policy"
                          className="fw-semibold" 
                          style={{ color: '#2450a0', textDecoration: 'underline' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>.
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
        <AuthModal 
          show={showAuthModal}
          onHide={() => setShowAuthModal(false)}
          saveDraftData={saveDraftData}
          model="Directory"
        />
      )}
      
      <VirtualKeyboard
        isVisible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeyPress={handleKeyboardInput}
        targetInput={keyboardTarget}
      />
    </section>
  );
};

export default BusinessCreateForm;