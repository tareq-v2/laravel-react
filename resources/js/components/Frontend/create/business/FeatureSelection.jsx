// FeatureSelection.jsx
import React from 'react';

const FeatureSelection = ({ 
  formData, 
  getRate, 
  setFormData, 
  setShowFeatureSelection,
  setShowPreview,
  handleFeaturedSubmit,
  socialMediaPromotion,
  setSocialMediaPromotion
}) => {
  return (
    <div className="card feature-card">
      <div className="card-header">
        <h4 className="mb-0">
          <strong>Business Directory Listing - {getRate.base === 0 ? 'Free' : `$${getRate.base}`}</strong>
        </h4>
      </div>
      
      <div className="card-body">
        <div className="post-duration-info mb-4">
          <p>Listing active for 1 year. Expires {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}.</p>
        </div>

        <div className="feature-option active">
          <div className="form-check">
            <input
              className="form-check-input single-checkbox2"
              type="checkbox"
              id="featured_post"
              checked={formData.featured === 'Yes'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                featured: e.target.checked ? 'Yes' : 'No',
                featureRate: e.target.checked ? getRate.feature : 0
              }))}
            />
            <label className="form-check-label package_label" htmlFor="featured_post">
              <strong>Feature your business on directory homepage - {getRate.feature === 0 ? 'Free' : `$${getRate.feature}`}</strong>
            </label>
          </div>
        </div>  

        <div className="social-promotion-section mt-4">
          <div className="form-check">
            <input
              className="form-check-input single-checkbox2"
              type="checkbox"
              id="social_media"
              checked={socialMediaPromotion}
              onChange={(e) => {
                setSocialMediaPromotion(e.target.checked);
                setFormData(prev => ({
                  ...prev,
                  socialMediaRate: e.target.checked ? getRate.social : 0
                }));
              }}
            />
            <label className="form-check-label package_label" htmlFor="social_media">
              <strong>Promote your business on our social media - {getRate.social === 0 ? 'Free' : `$${getRate.social}`}</strong>
            </label>
          </div>
        </div>

        <div className="action-buttons mt-3">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => {
              setShowFeatureSelection(false);
              setShowPreview(true);
            }}
          >
            ← Back to Preview
          </button>
          
          <button 
            className="btn btn-primary ms-2"
            onClick={handleFeaturedSubmit}
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelection;