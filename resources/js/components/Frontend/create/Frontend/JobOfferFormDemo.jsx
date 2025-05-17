import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaRedo } from 'react-icons/fa';
import VirtualKeyboard from './Frontend/VirtualKeyboard';
import './Frontend/JobOfferForm.css';

// Initial form state
const initialFormData = {
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
  socialShare: null,
  duration: null
};

const JobOfferForm = () => {
  // State initialization with localStorage
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem('jobFormState');
    return savedState 
      ? JSON.parse(savedState, (key, value) => {
          if (key === 'socialShare' && value) return convertDataURLToFile(value);
          if (key === 'attachments') return value.map(convertStoredFile);
          return value;
        })
      : {
          formData: initialFormData,
          errors: {},
          titleCheckbox: false,
          showKeyboard: false,
          keyboardTarget: null,
          showPreview: false,
          captchaText: generateNewCaptcha(),
          captchaInput: '',
          captchaError: '',
          descCheckbox: false,
          isReturningFromPreview: false,
          filePreviews: [],
          showFeatureSelection: false,
          showAuthModal: false,
          getRate: null,
          socialMediaPromotion: false
        };
  });

  // Refs
  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Categories (memoized)
  const [categories] = useState(
    `Accountant/Bookkeeper Appliance Technician Auto Body Auto Mechanic Auto Sales Babysitter/Nanny Bakery/Pastry Beauty Salon Car Wash Caregiver Cashier Child Care Cleaning Services Construction Delivery Jobs Dental Assistant/Office Dispatcher Driver Dry Cleaning Electrician Financial Services Florist Government Jobs Grocery/Market Housekeeper/Maid In-Home Care Jewelry Sales/Repair Legal/Paralegal Medical/Healthcare Medical Office/Billing Nail Salon No Experience Required Office/Admin Parking Attendant Pet Grooming Pharmacy Pool Cleaning Receptionist/Front Desk Restaurant Jobs Mall Jobs Sales/Marketing Security Guard Smoke Shop Tailor/Alteration Teacher/Education Telemarketing Truck Driver UBER Driver Web/IT Developer Work From Home Other Jobs`
      .split(' ')
      .map(line => line.trim())
      .filter(Boolean)
  );

  // Save state to localStorage on changes
  useEffect(() => {
    const stateToSave = {
      ...state,
      formData: {
        ...state.formData,
        attachments: state.formData.attachments.map(file => ({
          dataUrl: file.dataUrl,
          name: file.name,
          type: file.type
        })),
        socialShare: state.formData.socialShare 
          ? convertFileToDataURL(state.formData.socialShare)
          : null
      }
    };
    localStorage.setItem('jobFormState', JSON.stringify(stateToSave));
  }, [state]);

  // Helper functions for file conversion
  function convertFileToDataURL(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        dataUrl: reader.result,
        name: file.name,
        type: file.type
      });
      reader.readAsDataURL(file);
    });
  }

  function convertDataURLToFile(dataUrlObj) {
    const byteString = atob(dataUrlObj.dataUrl.split(',')[1]);
    const mimeString = dataUrlObj.dataUrl.split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new File([ab], dataUrlObj.name, { type: mimeString });
  }

  function convertStoredFile(storedFile) {
    return {
      dataUrl: storedFile.dataUrl,
      name: storedFile.name,
      type: storedFile.type,
      preview: URL.createObjectURL(convertDataURLToFile(storedFile))
    };
  }

  // File handling
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + state.formData.attachments.length > 5) {
      alert('Maximum 5 files allowed');
      return;
    }

    const validFiles = files.filter(file => 
      ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
    );

    const newAttachments = await Promise.all(
      validFiles.map(async file => ({
        file,
        stored: await convertFileToDataURL(file),
        preview: URL.createObjectURL(file)
      }))
    );

    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        attachments: [
          ...prev.formData.attachments,
          ...newAttachments.map(({ stored }) => stored)
        ]
      },
      filePreviews: [
        ...prev.filePreviews,
        ...newAttachments.map(({ preview, stored }) => ({
          url: preview,
          name: stored.name,
          type: stored.type
        }))
      ]
    }));
  };

  const handleRemoveFile = (index) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        attachments: prev.formData.attachments.filter((_, i) => i !== index)
      },
      filePreviews: prev.filePreviews.filter((_, i) => i !== index)
    }));
  };

  // Social media file handling
  const handleSocialFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storedFile = await convertFileToDataURL(file);
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        socialShare: storedFile
      }
    }));
  };

  const removeSocialImage = () => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        socialShare: null
      }
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form submission handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation logic...
    setState(prev => ({ ...prev, showPreview: true }));
  };

  const handleFeaturedSubmit = async () => {
    // Convert stored files to actual File objects
    const formPayload = new FormData();
    const attachments = await Promise.all(
      state.formData.attachments.map(convertDataURLToFile)
    );
    const socialShare = state.formData.socialShare 
      ? convertDataURLToFile(state.formData.socialShare)
      : null;

    // Add other form data...
    attachments.forEach(file => formPayload.append('attachments[]', file));
    if (socialShare) formPayload.append('socialShare', socialShare);

    // Submit logic...
    localStorage.removeItem('jobFormState');
    navigate('/payment');
  };

  // Other handlers and JSX remain similar but use state and setState
  // ...

  return (
    // JSX structure remains similar but uses state and setState
    // Ensure all form elements update state correctly
    // ...
  );
};

// Preview component remains similar
// ...

export default JobOfferForm;