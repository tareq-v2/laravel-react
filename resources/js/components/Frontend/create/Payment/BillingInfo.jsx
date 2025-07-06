// src/components/Payment/BillingInfo.jsx
import React from 'react';
import CountryDropdown from './CountryDropdown';

const BillingInfo = ({ paymentDetails, handlePaymentChange, errors }) => {
  return (
    <div className="p-4">
      <h3 className="mb-4 fw-bold text-primary">
        <i className="bi bi-credit-card me-2"></i>
        Billing Information
      </h3>

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Billing Address*</label>
          <input
            type="text"
            name="street"
            className={`form-control form-control-lg ${errors.street ? 'is-invalid' : ''}`}
            value={paymentDetails.street}
            onChange={handlePaymentChange}
            placeholder="123 Main Street"
          />
          {errors.street && <div className="invalid-feedback">{errors.street}</div>}
        </div>

        <div className="col-md-4">
          <CountryDropdown
            value={paymentDetails.country}
            onChange={handlePaymentChange}
            error={errors.country}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">State*</label>
          <input
            type="text"
            name="state"
            className={`form-control form-control-lg ${errors.state ? 'is-invalid' : ''}`}
            value={paymentDetails.state}
            onChange={handlePaymentChange}
            placeholder="State"
          />
          {errors.state && <div className="invalid-feedback">{errors.state}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">City*</label>
          <input
            type="text"
            name="city"
            className={`form-control form-control-lg ${errors.city ? 'is-invalid' : ''}`}
            value={paymentDetails.city}
            onChange={handlePaymentChange}
            placeholder="City"
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">ZIP Code*</label>
          <input
            type="text"
            name="zip"
            className={`form-control form-control-lg ${errors.zip ? 'is-invalid' : ''}`}
            value={paymentDetails.zip}
            onChange={handlePaymentChange}
            placeholder="10001"
          />
          {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number*</label>
          <input
            type="tel"
            name="phone"
            className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
            value={paymentDetails.phone}
            onChange={handlePaymentChange}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Email*</label>
          <input
            type="email"
            name="email"
            className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
            value={paymentDetails.email}
            onChange={handlePaymentChange}
            placeholder="john@example.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
