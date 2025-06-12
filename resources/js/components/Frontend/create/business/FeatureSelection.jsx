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
  // Calculate extended cost
  const extendedCount = Math.max(0, formData.subCategories.length - 2);
  const extendedCost = extendedCount * (getRate.extended || 0);
  
  // Calculate total
  const total = 
    formData.rate + 
    formData.featureRate + 
    formData.socialMediaRate +
    extendedCost;
    
  return (
    <div className="card feature-card">
      <div className="card-header">
        <h4 className="mb-0">
          <strong>Business Directory Listing - ${formData.rate}</strong>
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
        
        {/* Base Rate */}
        <div className="rate-breakdown mb-3">
          <div className="d-flex justify-content-between">
            <span>Base Rate:</span>
            <span>${formData.rate}</span>
          </div>
        </div>
        
        {/* Extended Subcategories */}
        {extendedCount > 0 && (
          <div className="rate-breakdown mb-3">
            <div className="d-flex justify-content-between">
              <span>
                {extendedCount} Additional Subcategor{extendedCount > 1 ? 'ies' : 'y'} 
                <br />
                <small className="text-muted">(${getRate.extended} each)</small>
              </span>
              <span>${extendedCost}</span>
            </div>
          </div>
        )}
        
        {/* Feature Option */}
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
              <strong>Feature your business on directory homepage - ${getRate.feature}</strong>
            </label>
          </div>
        </div>  
        
        {/* Social Promotion */}
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
              <strong>Promote your business on our social media - ${getRate.social}</strong>
            </label>
          </div>
        </div>
        
        {/* Total */}
        <div className="total-section mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total:</span>
            <span>${total}</span>
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