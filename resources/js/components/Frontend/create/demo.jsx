// src/components/BannerCreation/BannerPreview.jsx
import React from 'react';

const BannerPreview = ({ formData, onEdit, onSubmit }) => {
  return (
    <div className="banner-preview">
      {/* Preview content */}
      <div className="preview-actions">
        <button type="button" onClick={onEdit} className="btn btn-edit">
          Edit Details
        </button>
        <button 
          type="button" 
          onClick={onSubmit} 
          className="btn btn-submit"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;