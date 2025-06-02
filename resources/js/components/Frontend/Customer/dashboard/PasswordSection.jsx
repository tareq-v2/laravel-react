import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import Lottie from 'lottie-react';
import savePasswordAnimation from '../savePasswordSuccess.json';

const PasswordSection = ({ 
  passwordForm, 
  passwordChangeError, 
  passwordChangeSuccess, 
  isChangingPassword,
  handlePasswordChange,
  handlePasswordSubmit
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="password-section">
      {passwordChangeSuccess ? (
        <div className="password-success">
          <div className="success-animation">
            <Lottie 
              animationData={savePasswordAnimation}
              loop={false}
              autoplay={true}
              style={{ height: 150, width: 150 }}
            />
          </div>
          <h3 className="tomato-text">Password Changed Successfully!</h3>
          <p>Your password has been updated.</p>
        </div>
      ) : (
        <form className="password-form" onSubmit={handlePasswordSubmit}>
          {["oldPassword", "newPassword", "confirmPassword"].map(field => (
            <div className="form-group" key={field}>
              <label className="input-label">
                <FiLock className="tomato-icon" /> 
                <span>
                  {field === "oldPassword" && "Old Password"}
                  {field === "newPassword" && "New Password"}
                  {field === "confirmPassword" && "Confirm Password"}
                </span>
              </label>
              <div className="password-input-container">
                <input 
                  type={passwordVisibility[field] ? "text" : "password"}
                  name={field}
                  value={passwordForm[field]}
                  onChange={handlePasswordChange}
                  className="tomato-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility(field)}
                >
                  {passwordVisibility[field] ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          ))}
          
          {passwordChangeError && (
            <div className="password-error">
              <p>{passwordChangeError}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="tomato-button"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <span>Changing Password...</span>
            ) : (
              <>
                <FiCheck className="mr-2" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordSection;