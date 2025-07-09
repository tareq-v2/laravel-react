// src/components/BannerCreation/CreateBannerForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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
            data.isVideoBanner ? 'video_thumbnail.jpg' : 'banner_image.jpg'
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
        clearPreviewData();
      }
    }
  };

  // Clear preview data from sessionStorage
  const clearPreviewData = () => {
    sessionStorage.removeItem('bannerPreviewData');
  };

  // Clear preview data when navigating away
  useEffect(() => {
    const unlisten = navigate((location) => {
      // Don't clear if navigating within banner creation
      if (!location.pathname.includes('/create/banner')) {
        clearPreviewData();
      }
    });

    return () => {
      unlisten();
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

    // Clear preview data when unmounting
    return () => {
      clearPreviewData();
    };
  }, []);

  // Rest of component remains the same...
  // (handleInputChange, handleImageUpload, etc.)

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

  // ... rest of the component
};

export default CreateBannerForm;