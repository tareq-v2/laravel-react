// src/components/BannerCreation/BannerPreview.jsx
import React from 'react';

const BannerPreview = ({ 
  formData, 
  previewImage, 
  bannerCategories, 
  onEdit, 
  onProceed, 
  isSubmitting,
  bannerRate,
  displayPeriod,
  isVideoBanner
}) => {
  const getCategoryName = () => {
    const category = bannerCategories.find(
      cat => cat.id.toString() === formData.banner_category
    );
    return category ? `${category.name} - #${category.id}` : 'Unknown Category';
  };

  const getDisplayPeriod = () => {
    switch(displayPeriod) {
      case '30': return '30 Days';
      case '60': return '60 Days';
      case '90': return '90 Days';
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
            <span className="label">Banner Type:</span>
            <span className="value">{isVideoBanner ? 'Video' : 'Graphic'}</span>
          </div>
          <div className="preview-row">
            <span className="label">Display Period:</span>
            <span className="value">{getDisplayPeriod()}</span>
          </div>
          <div className="preview-row">
            <span className="label">Total Price:</span>
            <span className="value">${bannerRate}</span>
          </div>
          {formData.external_link && (
            <div className="preview-row">
              <span className="label">
                {isVideoBanner ? 'YouTube Embed:' : 'External Link:'}
              </span>
              <span className="value">
                {isVideoBanner ? (
                  <div className="video-link-preview">
                    Video Embed Code Provided
                  </div>
                ) : (
                  formData.external_link
                )}
              </span>
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
          <h4>{isVideoBanner ? 'Video Thumbnail Preview' : 'Banner Preview'}</h4>
          <div className="banner-preview-image">
            {previewImage ? (
              <img src={previewImage} alt="Banner preview" />
            ) : isVideoBanner ? (
              <div className="no-thumbnail">No thumbnail uploaded</div>
            ) : (
              <div className="no-image">No image uploaded</div>
            )}
          </div>
          
          {isVideoBanner && previewImage && (
            <div className="video-note">
              Note: This is your video thumbnail preview
            </div>
          )}
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
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default BannerPreview;