// src/components/BannerCreation/BannerPreview.jsx
import React from 'react';

const BannerPreview = ({ formData, previewImage, bannerCategories, onEdit, onProceed, onSubmit, isSubmitting }) => {
  const getCategoryName = () => {
    const category = bannerCategories.find(
      cat => cat.id.toString() === formData.banner_category
    );
    return category ? `${category.name} - #${category.id}` : 'Unknown Category';
  };

  const getDisplayPeriod = () => {
    switch(formData.expire_date) {
      case '30': return '30 Days';
      case '60': return '60 Days';
      case '90': return '90 Days';
      case '36500': return 'Unlimited';
      default: return '30 Days';
    }
  };

  return (
    <div className="banner-preview">
      <div className="preview-header">
        <h3>Review Your Banner Details</h3>
        <p>Please review all information before submitting</p>
      </div>

      <div className="preview-content">
        <div className="preview-section">
          <h4>Banner Details</h4>
          <div className="preview-row">
            <span className="label">Banner Spot:</span>
            <span className="value">{getCategoryName()}</span>
          </div>
          <div className="preview-row">
            <span className="label">Display Period:</span>
            <span className="value">{getDisplayPeriod()}</span>
          </div>
          {formData.external_link && (
            <div className="preview-row">
              <span className="label">External Link:</span>
              <span className="value">{formData.external_link}</span>
            </div>
          )}
          <div className="preview-row">
            <span className="label">Customer Email:</span>
            <span className="value">
              {formData.override ? 'Override Enabled' : formData.customer_email}
            </span>
          </div>
        </div>

        <div className="preview-section">
          <h4>Banner Preview</h4>
          <div className="banner-preview-image">
            {previewImage ? (
              <img src={previewImage} alt="Banner preview" />
            ) : (
              <div className="no-image">No image uploaded</div>
            )}
          </div>
        </div>
      </div>

      <div className="preview-actions">
        <button type="button" onClick={onEdit} className="btn btn-edit">
          Edit Details
        </button>
        <button
          type="button"
          onClick={onProceed}
          className="btn btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Banner...' : 'Create Banner'}
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;
