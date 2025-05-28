// Add this state variable at the top of your component
const [isSaving, setIsSaving] = useState(false);

// Update the handleProfileUpdate function
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  
  // Store the current blob URL for cleanup
  const tempImageUrl = profileForm.profileImage;
  
  // Show loading state
  setIsSaving(true);
  
  const formData = new FormData();
  formData.append('name', profileForm.name);
  formData.append('email', profileForm.email);
  
  if (profileForm.profileImageFile instanceof File) {
    formData.append('avatar', profileForm.profileImageFile);
  }

  try {
    const response = await axios.post('/update-profile', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle different response structures
    const userDataFromResponse = response.data.user || response.data;
    const name = userDataFromResponse.name || profileForm.name;
    const email = userDataFromResponse.email || profileForm.email;
    const avatarUrl = userDataFromResponse.avatar_url || userDataFromResponse.avatarUrl;

    // Create a fresh image URL with cache busting
    const newAvatarUrl = avatarUrl 
      ? `${avatarUrl}?ts=${Date.now()}`
      : null;

    // Update both userData and profileForm with the final URL
    setUserData(prev => ({
      ...prev,
      name,
      email,
      profileImage: newAvatarUrl
    }));

    setProfileForm(prev => ({
      ...prev,
      name,
      email,
      profileImageFile: null,
      profileImage: newAvatarUrl
    }));

    alert('Profile updated successfully!');

  } catch (error) {
    console.error('Profile update error:', error);
    alert(error.response?.data?.message || 'Update failed');
    
    // Revert to the blob URL if update fails
    setUserData(prev => ({
      ...prev,
      profileImage: tempImageUrl
    }));
  } finally {
    setIsSaving(false);
    
    // Revoke the blob URL only after new image is set
    if (tempImageUrl && tempImageUrl.startsWith('blob:')) {
      setTimeout(() => {
        URL.revokeObjectURL(tempImageUrl);
      }, 1000); // Give time for new image to load
    }
  }
};

// Update the save button in your JSX
<button 
  className="tomato-button"
  onClick={handleProfileUpdate}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'Save Changes'}
</button>