// ... (previous imports and code)

const Dashboard = () => {
  // ... (previous state declarations)
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // ... (ProfileImage component and other code)

  // Profile Section JSX with inline editing
  const renderProfileInfo = () => (
    <div className="profile-section">
      <div className="profile-header">
        <div 
          className="profile-image-wrapper"
          onClick={() => document.getElementById('avatarInput').click()}
        >
          {userData.profileImage ? (
            <div className="profile-image-container">
              <img 
                src={userData.profileImage} 
                alt="Profile" 
                className="profile-image"
              />
              <div className="edit-overlay">
                <FiCamera size={20} />
              </div>
            </div>
          ) : (
            <div className="profile-initials">
              {userData.name.charAt(0)}
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
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  // ... (rest of the code remains the same until renderContent)

  const renderContent = () => {
    // ... (loading and error handling)

    switch(activeTab) {
      case 'Profile':
        return renderProfileInfo();
      // Remove the 'editProfile' case
      case 'changePassword':
        return renderChangePassword();
      case 'ads':
        return renderPostsContent();
      // ... other cases
    }
  };

  return (
    <>
      <div className="profile-summary tomato-border d-flex my-3 position-relative">
        <div 
          className="profile-image-small mr-3"
          onClick={() => document.getElementById('avatarInput').click()}
        >
          {userData.profileImage ? (
            <ProfileImage src={userData.profileImage} />
          ) : (
            <div className="profile-initials-small">
              {userData.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info-small position-absolute">
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
        </div>
      </div>
      
      <div className="dashboard">
        <nav className="tab-nav tomato-nav">
          {/* Updated Profile tab */}
          <button 
            className={activeTab === 'Profile' ? 'active tomato-button' : ''}
            onClick={() => setActiveTab('Profile')}
          >
            <FiUser className="nav-icon" />
            <span>Profile</span>
          </button>
          
          {/* Remove Edit Profile tab */}
          <button 
            className={activeTab === 'changePassword' ? 'active' : ''}
            onClick={() => setActiveTab('changePassword')}
          >
            <FiLock className="nav-icon" />
            <span>Change Password</span>
          </button>
          
          {/* ... other tabs */}
        </nav>

        <div className="dashboard-main">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;