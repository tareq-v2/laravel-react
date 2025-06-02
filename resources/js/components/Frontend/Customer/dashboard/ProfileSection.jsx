import React, { useState } from 'react';
import { FiCamera, FiEdit } from 'react-icons/fi';
import ProfileImage from './ProfileImage';

const ProfileSection = ({ 
  userData, 
  profileForm, 
  handleProfileChange, 
  handleProfileUpdate,
  isSaving
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  return (
    <div className="profile-section">
      <div className="profile-header">
        <div 
          className="profile-image-wrapper"
          onClick={() => document.getElementById('avatarInput').click()}
        >
          {userData.profileImage ? (
            <div className="profile-image-container">
              <ProfileImage src={userData.profileImage} />
              <div className="edit-overlay">
                <FiCamera size={20} />
              </div>
            </div>
          ) : (
            <div className="profile-initials">
              <div className="edit-overlay">
                <FiCamera size={20} />
              </div>
            </div>
          )}
          <input
            id="avatarInput"
            type="file"
            name="profileImage"
            style={{ display: 'none' }}
            onChange={handleProfileChange}
            accept="image/*"
          />
        </div>
        
        <div className="profile-meta">
          <div className="name-field">
            {isEditingName ? (
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="inline-edit"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingName(false)
                }}
              />
            ) : (
              <h2 onClick={() => setIsEditingName(true)}>
                {userData.name}
                <FiEdit className="edit-icon" />
              </h2>
            )}
          </div>
          
          <div className="email-field">
            {isEditingEmail ? (
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="inline-edit"
                autoFocus
                onBlur={() => setIsEditingEmail(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingEmail(false)
                }}
              />
            ) : (
              <p onClick={() => setIsEditingEmail(true)}>
                {userData.email}
                <FiEdit className="edit-icon" />
              </p>
            )}
          </div>
          
          <p>Member since {userData.joinDate}</p>
        </div>
      </div>
      
      <div className="profile-actions">
        <button 
          className="tomato-button"
          onClick={handleProfileUpdate}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;