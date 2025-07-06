import React from 'react';

// MODIFIED: Added onProceed prop
const BannerPreview = ({ formData, previewImage, bannerCategories, onEdit, onProceed, isSubmitting }) => {
  // ... existing code ...

  return (
    <div className="banner-preview">
      {/* ... existing preview content ... */}

      <div className="preview-actions">
        <button type="button" onClick={onEdit} className="btn btn-edit">
          Edit Details
        </button>
        {/* MODIFIED: Added Proceed to Payment button */}
        <button
          type="button"
          onClick={onProceed}
          className="btn btn-submit"
          disabled={isSubmitting}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;
