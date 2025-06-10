// Preview.jsx
import React from 'react';

const Preview = ({ 
  formData, 
  logoPreview, 
  thumbnailPreviews,
  location,
  onEdit, 
  onSubmit 
}) => {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0"><strong>Preview Your Business Listing</strong></h4>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Left Column */}
           <div className="col-md-7">
            <div className="mb-4">
              <h3>{formData.businessName}</h3>
              <p className="text-muted">
                {formData.category && <><strong>Category:</strong> {formData.category}<br /></>}
                {formData.subCategory && <><strong>Sub-Category:</strong> {formData.subCategory}<br /></>}
                {formData.address && <><strong>Address:</strong> {formData.address}</>}
                {formData.suite && `, ${formData.suite}`}<br />
                {formData.city && <>{formData.city}</>}
              </p>
            </div>

            {formData.description && (
              <div className="mb-4">
                <h5>Description</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>{formData.description}</p>
              </div>
            )}

            {(formData.workingHour || formData.days.length > 0) && (
              <div className="mb-4">
                <h5>Working Hours</h5>
                {formData.workingHour && <p>{formData.workingHour}</p>}
                
                {formData.days.length > 0 && (
                  <div>
                    <strong>Open Days:</strong>
                    <p>{formData.days.join(', ')}</p>
                  </div>
                )}
                
                {(formData.startTime || formData.endTime) && (
                  <p>
                    <strong>Hours:</strong> {formData.startTime} - {formData.endTime}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <h5>Contact Information</h5>
              <p>
                {formData.telNo && (
                  <><strong>Phone:</strong> {formData.telNo}
                  {formData.tel_ext && ` ext.${formData.tel_ext}`}<br /></>
                )}
                {formData.altTelNo && (
                  <><strong>Alt Phone:</strong> {formData.altTelNo}
                  {formData.alt_tel_ext && ` ext.${formData.alt_tel_ext}`}<br /></>
                )}
                {formData.email && <><strong>Email:</strong> {formData.email}<br /></>}
                {formData.website && <><strong>Website:</strong> {formData.website}<br /></>}
              </p>
              
              {(formData.facebook || formData.instagram || formData.yelp || formData.youtube) && (
                <div className="mt-3">
                  <strong>Social Media:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {formData.facebook && (
                      <a href={formData.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        Facebook
                      </a>
                    )}
                    {formData.instagram && (
                      <a href={formData.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        Instagram
                      </a>
                    )}
                    {formData.yelp && (
                      <a href={formData.yelp} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        Yelp
                      </a>
                    )}
                    {formData.youtube && (
                      <a href={formData.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {(formData.contactName || formData.contactTelNo || formData.contactEmail) && (
              <div className="mb-4">
                <h5>Contact Person</h5>
                <p>
                  {formData.contactName && <><strong>Name:</strong> {formData.contactName}<br /></>}
                  {formData.contactTelNo && <><strong>Phone:</strong> {formData.contactTelNo}<br /></>}
                  {formData.contactEmail && <><strong>Email:</strong> {formData.contactEmail}</>}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-5">
            {/* Logo Preview */}
            {logoPreview && (
              <div className="mb-4">
                <h5>Business Logo</h5>
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="img-fluid rounded border p-2"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}

            {/* Thumbnails Preview */}
            {thumbnailPreviews.length > 0 && (
              <div className="mt-4">
                <h5>Business Images</h5>
                <div className="d-flex flex-wrap gap-2">
                  {thumbnailPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Thumbnail ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-lg btn-outline-secondary"
            onClick={onEdit}
          >
            <i className="fas fa-edit me-2"></i>
            Edit Listing
          </button>
          
          <button 
            type="button" 
            className="btn btn-lg btn-primary"
            onClick={onSubmit}
          >
            <i className="fas fa-check-circle me-2"></i>
            Submit Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;