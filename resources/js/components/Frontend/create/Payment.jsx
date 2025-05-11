// Payment.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const draftData = location.state?.draftData || {};

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Complete Payment</h3>
        </div>
        <div className="card-body">
          {/* Display draft summary */}
          <div className="mb-4">
            <h5>{draftData.title}</h5>
            <p>{draftData.description}</p>
            <p>Price: $XX.XX</p>
          </div>

          {/* Simple payment form */}
          <form>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" className="form-control" placeholder="4242 4242 4242 4242" />
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Expiration Date</label>
                  <input type="text" className="form-control" placeholder="MM/YY" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" className="form-control" placeholder="123" />
                </div>
              </div>
            </div>

            <button className="btn btn-primary my-2 btn-block">
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;