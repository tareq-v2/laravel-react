    import React, { useState, useRef } from 'react';
    import { Link } from 'react-router-dom';
    import axios from 'axios';
    import { FaFileAlt } from 'react-icons/fa';

    const JobOfferForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        category: '',
        description: '',
        businessName: '',
        address: '',
        salary: '',
        name: '',
        telNo: '',
        telExt: '',
        altTelNo: '',
        altTelExt: '',
        email: '',
        website: '',
        keywords: '',
        captcha: '',
        attachment: null
    });

    const [errors, setErrors] = useState({});
    const [filePreview, setFilePreview] = useState(null);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const fileInputRef = useRef(null);
    const [categories] = useState(
        `Accountant/Bookkeeper Appliance Technician Auto Body Auto Mechanic Auto Sales Babysitter/Nanny Bakery/Pastry Beauty Salon Car Wash Caregiver Cashier Child Care Cleaning Services Construction Delivery Jobs Dental Assistant/Office Dispatcher Driver Dry Cleaning Electrician Financial Services Florist Government Jobs Grocery/Market Housekeeper/Maid In-Home Care Jewelry Sales/Repair Legal/Paralegal Medical/Healthcare Medical Office/Billing Nail Salon No Experience Required Office/Admin Parking Attendant Pet Grooming Pharmacy Pool Cleaning Receptionist/Front Desk Restaurant Jobs Mall Jobs Sales/Marketing Security Guard Smoke Shop Tailor/Alteration Teacher/Education Telemarketing Truck Driver UBER Driver Web/IT Developer Work From Home Other Jobs`
            .split(' ')
            .map(line => line.trim())
            .filter(Boolean)
        );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setFormData(prev => ({ ...prev, attachment: file }));
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setFilePreview(null);
        setFormData(prev => ({ ...prev, attachment: null }));
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.city) newErrors.city = 'Location is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description) newErrors.description = 'Description is required';
        
        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }

        try {
        const formPayload = new FormData();
        for (const key in formData) {
            if (key !== 'attachment' && formData[key] !== null) {
            formPayload.append(key, formData[key]);
            }
        }
        if (formData.attachment) {
            formPayload.append('attachment', formData.attachment);
        }

        const response = await axios.post('/api/job-offers', formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log('Submission successful:', response.data);
        // Reset form
        setFormData({
            title: '',
            city: '',
            category: '',
            description: '',
            businessName: '',
            address: '',
            salary: '',
            name: '',
            telNo: '',
            telExt: '',
            altTelNo: '',
            altTelExt: '',
            email: '',
            website: '',
            keywords: '',
            captcha: '',
            attachment: null
        });
        setFilePreview(null);
        setErrors({});
        
        } catch (error) {
        console.error('Submission error:', error);
        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors);
        }
        }
    };
  return (
    <section className="sptb pt-5">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-xl-8" style={{ position: 'relative' }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="card">
                <div className="card-header d-md-flex justify-content-between align-items-center">
                  <h4 className="mb-0"><strong>Create Ad</strong></h4>
                  <h4 className="mb-0">
                    <strong>Free for 30 days</strong>
                  </h4>
                </div>

                <div className="card-body">
                  {/* Title Input */}
                  <div className="form-group">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label text-dark">
                        Ad Title <span className="text-danger">*</span>
                      </label>
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="keyboardToggle1"
                          checked={showKeyboard}
                          onChange={(e) => setShowKeyboard(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="keyboardToggle1">
                          Armenian Keyboard (Հայերեն Ստեղնաշար)
                        </label>
                      </div>
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    <p className="mb-1 text-muted">
                      <strong className="text-danger">Note:</strong> Enter a general title description...
                    </p>
                  </div>

                  {/* Location Input */}
                  <div className="form-group">
                    <label className="form-label text-dark">
                      Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  {/* Category Select */}
                  <div className="form-group">
                    <label className="form-label text-dark">
                      Job Category <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>

                  {/* Description Textarea */}
                  <div className="form-group">
                    <label className="form-label text-dark">
                      Job Description/Requirements <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows="7"
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  {/* Business Name Input */}
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  {/* Address Input */}
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  {/* Salary Input */}
                  <div className="form-group">
                    <label className="form-label">Salary/Compensation</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="$"
                    />
                  </div>

                  {/* Contact Info Section */}
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>

                  {/* Telephone Inputs */}
                  <div className="form-group">
                    <div className="row">
                      <div className="col-8">
                        <label className="form-label">Tel No.</label>
                        <input
                          type="text"
                          name="telNo"
                          value={formData.telNo}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">Ext.</label>
                        <input
                          type="number"
                          name="telExt"
                          value={formData.telExt}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  {/* More form elements... */}

                  {/* File Upload */}
                  <div className="form-group">
                    <label className="form-label text-dark">Attachment</label>
                    <div className="input-group">
                        <div className="custom-file">
                        <input
                            type="file"
                            name="attachment"
                            onChange={handleFileChange}
                            className="custom-file-input"
                            id="offerPost"
                            ref={fileInputRef}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        <label className="custom-file-label" htmlFor="offerPost">
                            {filePreview ? 'File selected' : 'Choose file'}
                        </label>
                        </div>
                    </div>
                    
                    {filePreview && (
                        <div className="position-relative d-inline-block mt-2">
                        {filePreview.startsWith('data:image') ? (
                            <img 
                            src={filePreview} 
                            alt="preview" 
                            className="img-thumbnail" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="file-preview-icon">
                            <FaFileAlt size={60} className="text-muted" />
                            </div>
                        )}
                        <button
                            type="button"
                            className="btn btn-danger btn-sm rounded-circle position-absolute"
                            style={{ top: '-10px', right: '-10px' }}
                            onClick={handleRemoveFile}
                        >
                            <FaTimes />
                        </button>
                        </div>
                    )}
                    </div>

                  {/* Submit Button */}
                  <div className="form-group mt-4">
                    <button type="submit" className="btn btn-primary w-100">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

        <style>{`
        .file-preview-icon {
            width: 150px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
        }
        
        .custom-file-input:focus ~ .custom-file-label {
            border-color: #80bdff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        `}</style>

    </section>
  );
};

export default JobOfferForm;