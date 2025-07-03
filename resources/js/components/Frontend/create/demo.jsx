import React from 'react';

const BannerPreview = ({ formData, previewImage, bannerCategories, onEdit, onProceed }) => {
  // ... existing functions ...

  return (
    <div className="banner-preview">
      {/* ... existing preview content ... */}

      <div className="preview-actions">
        <button type="button" onClick={onEdit} className="btn btn-edit">
          Edit Details
        </button>
        <button
          type="button"
          onClick={onProceed}
          className="btn btn-submit"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;