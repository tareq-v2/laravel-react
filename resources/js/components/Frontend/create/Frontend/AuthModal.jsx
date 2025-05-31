import React from 'react';
import { Link } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ show, onHide, onGuestSubmit, saveDraftData }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ 
      display: 'block', 
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(3px)'
    }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content" style={{
          borderRadius: '12px',
          border: '1px solid rgba(255, 99, 71, 0.48)',
          boxShadow: '0 4px 10px rgba(255, 99, 71, 0.48)'
        }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title w-100 text-center text-dark">
              Continue to Checkout
            </h5>
            <button 
                type="button" 
                className="close-button" 
                onClick={onHide}
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
          </div>
          
          <div className="modal-body px-4">
            <div className="d-flex flex-column gap-2">
              {/* Login Button */}
              <Link
                to="/login"
                className="btn btn-light btn-block text-start p-3 rounded-lg shadow-sm"
                style={{ border: '1px solid #dee2e6' }}
                onClick={async () => {
                  await saveDraftData();
                  onHide();
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle p-2">
                    <i className="bi bi-box-arrow-in-right fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dark fw-medium">
                      <h4>Login</h4>
                    </div>
                    <small className="text-muted">Login to your account</small>
                  </div>
                </div>
              </Link>

              {/* Register Button */}
              <Link
                to="/register"
                className="btn btn-light btn-block text-start p-3 rounded-lg shadow-sm"
                style={{ border: '1px solid #dee2e6' }}
                onClick={async () => {
                  await saveDraftData();
                  onHide();
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success text-white rounded-circle p-2">
                    <i className="bi bi-person-plus fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dark fw-medium">
                      <h5>Create account</h5>
                    </div>
                    <small className="text-muted">Create new account</small>
                  </div>
                </div>
              </Link>

              {/* Guest Button */}
              <button
                className="btn btn-light btn-block text-start p-3 rounded-lg shadow-sm"
                style={{ border: '1px solid #dee2e6' }}
                onClick={async () => {
                  await onGuestSubmit();
                  onHide();
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning text-white rounded-circle p-2">
                    <i className="bi bi-person fs-5"></i>
                  </div>
                  <div>
                    <div className="text-dark fw-medium">
                      <h6>
                        Checkout as guest
                      </h6>
                    </div>
                  <small className="text-muted">Continue without account</small>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center mt-4 mb-2">
              <small style={{
                color: 'rgb(255, 99, 71, 0.75)'
              }}>
                Draft will be saved automatically
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;