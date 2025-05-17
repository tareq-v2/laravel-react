// Payment.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css'; // Create this CSS file

const Payment = () => {
  const location = useLocation();
  const draftData = location.state?.draftData || {};
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const years = Array.from({ length: 40 }, (_, i) => currentYear + i);

  return (
    <section className="payment-section py-5">
      <div className="container">
        <div className="payment-card shadow-lg">
          <div className="row g-0">
            {/* Billing Info Column */}
            <div className="col-lg-6 billing-col">
              <div className="office-use-note p-4 bg-light border-bottom">
                <h5 className="text-center text-muted mb-2">
                  <i className="bi bi-lock-fill me-2"></i>
                  For Office Use Only
                </h5>
                <p className="text-center text-muted small mb-0">
                  Personal information will not be published publicly
                </p>
              </div>

              <div className="p-4">
                <h3 className="mb-4 fw-bold text-primary">
                  <i className="bi bi-credit-card me-2"></i>
                  Billing Information
                </h3>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Name on Card*</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Billing Address*</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">City*</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="New York"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">State*</label>
                    <select className="form-select form-select-lg">
                      <option>Select State</option>
                      {/* Add state options */}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">ZIP Code*</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="10001"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Country*</label>
                    <select className="form-select form-select-lg">
                      <option>United States</option>
                      {/* Add country options */}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number*</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="john@example.com"
                      defaultValue={draftData.email || ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Column */}
            <div className="col-lg-6 payment-summary-col bg-light">
              <div className="p-4 h-100">
                <div className="sticky-summary">
                  <h3 className="mb-4 fw-bold text-primary">
                    <i className="bi bi-receipt me-2"></i>
                    Order Summary
                  </h3>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Product:</span>
                        <span className="fw-bold">{draftData.title}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-muted">Subtotal:</span>
                        <span className="fw-bold">${draftData.amount}</span>
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between fs-5">
                        <span className="text-muted">Total:</span>
                        <span className="fw-bold text-primary">
                          ${draftData.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="payment-details mt-5">
                    <h5 className="mb-3 fw-bold text-primary">
                      <i className="bi bi-credit-card-2-front me-2"></i>
                      Payment Details
                    </h5>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        {/* Card Number */}
                        <div className="mb-4">
                          <label className="form-label">Card Number*</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              placeholder="•••• •••• •••• ••••"
                            />
                            <span className="input-group-text">
                              <i className="bi bi-credit-card"></i>
                            </span>
                          </div>
                        </div>

                        {/* Expiration and CVV */}
                        <div className="row g-3">
                          <div className="col-md-8">
                            <div className="expiration-group">
                              <label className="form-label">Expiration Date*</label>
                              <div className="d-flex gap-2">
                                <select className="form-select form-select-lg expiration-month">
                                  <option value="">MM</option>
                                  {months.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                  ))}
                                </select>
                                <span className="expiration-separator">/</span>
                                <select className="form-select form-select-lg expiration-year">
                                  <option value="">YYYY</option>
                                  {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <label className="form-label">CVV*</label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="•••"
                                maxLength="3"
                              />
                              <span className="input-group-text">
                                <i className="bi bi-lock"></i>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button className="btn btn-primary btn-lg w-100 mt-4">
                          <i className="bi bi-lock-fill me-2"></i>
                          Pay ${draftData.totalAmount}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;