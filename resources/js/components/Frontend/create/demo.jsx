// 1. Update the ProfileImage component
const ProfileImage = ({ src }) => {
  const imgRef = useRef(null);
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.1)');

  useEffect(() => {
    const currentImgRef = imgRef.current;
    
    const updateShadow = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(currentImgRef);
        const [r, g, b] = dominantColor;
        setShadowColor(`rgba(${r},${g},${b},0.4)`);
      } catch (error) {
        setShadowColor('rgba(255,99,71,0.4)');
      }
    };

    if (currentImgRef && src) {
      if (currentImgRef.complete) {
        updateShadow();
      } else {
        currentImgRef.addEventListener('load', updateShadow);
      }
    }

    return () => {
      if (currentImgRef) {
        currentImgRef.removeEventListener('load', updateShadow);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Profile"
      className="profile-image-small"
      crossOrigin="anonymous"
      style={{ 
        boxShadow: `0 8px 20px ${shadowColor}`,
        transition: 'box-shadow 0.3s ease-in-out'
      }}
    />
  );
};

// 2. Update the handleProfileUpdate function
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('name', profileForm.name);
  formData.append('email', profileForm.email);
  
  if (profileForm.profileImage instanceof File) {
    formData.append('avatar', profileForm.profileImage);
  }

  try {
    const response = await axios.put('/update-profile', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Update user data with fresh image URL
    setUserData(prev => ({
      ...prev,
      name: response.data.user.name,
      email: response.data.user.email,
      profileImage: `${response.data.user.avatar_url}?ts=${Date.now()}`
    }));

    // Reset form only after successful update
    setProfileForm(prev => ({
      name: response.data.user.name,
      email: response.data.user.email,
      profileImage: null
    }));

    alert('Profile updated successfully!');

  } catch (error) {
    console.error('Profile update error:', error.response?.data);
    alert(error.response?.data?.message || 'Update failed');
  }
};

// 3. Update the profile image rendering in the top section
<div className="profile-summary tomato-border d-flex my-3 position-relative">
  <div className="profile-image-small mr-3">
    {userData.profileImage ? (
      <ProfileImage key={userData.profileImage} src={userData.profileImage} />
    ) : (
      <div className="profile-initials-small">
        {userData.name.charAt(0)}
      </div>
    )}
  </div>
  <div className="profile-info-small">
    <h3>{userData.name}</h3>
    <p>{userData.email}</p>
  </div>
</div>