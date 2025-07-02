// src/components/BannerCreation/BannerCreateForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BannerPreview from './BannerPreview';
import './BannerCreateForm.css';

const BannerCreateForm = () => {
  const navigate = useNavigate();
  // ... existing state and functions ...

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

  const handlePreview = () => {
    if (validateForm()) {
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
              bannerData,
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
    }
  };

  // ... rest of the component ...
};
