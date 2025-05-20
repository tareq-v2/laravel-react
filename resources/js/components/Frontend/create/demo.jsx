// In handleSubmitPayment function:
const handleSubmitPayment = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    // ... existing code ...

    const response = await axios.post('/ads/final/post', formPayload);

    if (response.data.success) {
      // Clear ALL related data
      localStorage.removeItem('jobOfferFormState');
      setPaymentDetails(initialState);
      setDraftData(null);

      // Navigate with history replacement
      navigate(`/post-confirmation/${response.data.post_id}`, { 
        replace: true,
        state: { paymentCompleted: true }
      });
    }
    
  } catch (error) {
    // Handle specific error codes
    if (error.response?.status === 409) {
      navigate('/', { replace: true });
      alert('This payment was already processed');
    } else if (error.response?.status === 410) {
      navigate('/create-post', { replace: true });
      alert('Session expired. Please start over.');
    }
    // ... rest of error handling ...
  }
};

// Add mount check to prevent access without draft
useEffect(() => {
  if (!draftData || Object.keys(draftData).length === 0) {
    navigate('/create-post', { replace: true });
  }
}, [draftData, navigate]);