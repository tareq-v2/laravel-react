// src/components/Payment/OrderSummary.jsx
import React, { useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const OrderSummary = ({
    paymentType,
  rates,
  promoCode,
  setPromoCode,
  promoCodeMsg,
  applyPromoCode,
  promoDiscount,
  totalAmount,
  paymentDetails,
  handlePaymentChange,
  errors,
  //   cardError,
  cardElementOptions,
  handleSubmitPayment,
  isSubmitting,
  stripe
}) => {
    const [cardError, setCardError] = useState('');
  return (
    <div className="p-4 h-100">
      <div className="sticky-summary">
        <h3 className="mb-4 fw-bold text-danger">
          <i className="bi bi-receipt me-2"></i>
          Order Summary
        </h3>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="price-breakdown">
              {paymentType === 'jobOffer' ? (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Base Job Posting:</span>
                    <span className="fw-bold">
                      {(rates.baseRate || 0) === 0 ? 'Free' : `$${rates.baseRate.toFixed(2)}`}
                    </span>
                  </div>
                  {rates.featureRate > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Featured Upgrade:</span>
                      <span className="fw-bold">
                        +${rates.featureRate.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {rates.socialMediaRate > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Social Media Promotion:</span>
                      <span className="fw-bold">
                        +${rates.socialMediaRate.toFixed(2)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Banner Advertising:</span>
                  <span className="fw-bold">
                    ${rates.baseRate.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="promo-code-section mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {promoCodeMsg.text && (
                  <div className={`text-small ${promoCodeMsg.type === 'success' ? 'text-success' : 'text-danger'}`}>
                    {promoCodeMsg.text}
                  </div>
                )}

                {promoDiscount > 0 && (
                  <div className="d-flex justify-content-between mt-2">
                    <span className="text-muted">Promo Discount:</span>
                    <span className="fw-bold text-success">
                      -${promoDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <hr className="my-3" />

              <div className="d-flex justify-content-between fs-5">
                <span className="text-muted">Total:</span>
                <span className="fw-bold text-danger">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-details">
          <h5 className="mb-3 fw-bold text-danger">
            <i className="bi bi-credit-card-2-front me-2"></i>
            Payment Details
          </h5>

          <form onSubmit={handleSubmitPayment}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="mb-4">
                  <label className="form-label">Card Holder Name*</label>
                  <input
                    type="text"
                    name="card_holder_name"
                    className={`form-control form-control-lg ${errors.card_holder_name ? 'is-invalid' : ''}`}
                    value={paymentDetails.card_holder_name}
                    onChange={handlePaymentChange}
                    placeholder="John Doe"
                  />
                  {errors.card_holder_name &&
                    <div className="invalid-feedback">{errors.card_holder_name}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label">Card Details*</label>
                  <div className={`stripe-card-element ${cardError ? 'is-invalid' : ''}`}>
                    <CardElement
                      options={cardElementOptions}
                      onChange={(e) => {
                        setCardError(e.error?.message || '');
                      }}
                    />
                  </div>
                  {cardError && (
                    <div className="invalid-feedback d-block">{cardError}</div>
                  )}
                </div>

                {errors.form && (
                  <div className="alert alert-danger mt-3">
                    {errors.form}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mt-2"
                  disabled={isSubmitting || (totalAmount > 0 && !stripe)}
                >
                  {isSubmitting ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
