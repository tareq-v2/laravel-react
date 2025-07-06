// ... existing imports ...

const CreateBannerForm = () => {
  // ... existing state declarations ...

  // MODIFIED: Simplified handlePreview to just set step to preview
  const handlePreview = () => {
    if (validateForm()) {
      setStep('preview');
    }
  };

  // NEW: Function to handle payment redirection
  const handleProceedToPayment = () => {
    const bannerData = {
      ...formData,
      totalAmount: calculateTotal()
    };

    navigate('/payment', {
      state: {
        draftData: {
          type: 'banner',
          bannerData,
          rate: calculateTotal(),
          email: formData.customer_email
        }
      }
    });
  };

  // ... rest of existing code ...

  return (
    <div className="banner-creation-container">
      {/* ... existing header ... */}

      {step === 'form' ? (
        <div className="banner-form">
          {/* ... existing form fields ... */}

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Reset
            </button>
            {/* MODIFIED: Changed onClick handler to handlePreview */}
            <button type="button" onClick={handlePreview} className="btn btn-primary">
              Preview Banner
            </button>
          </div>
        </div>
      ) : (
        <BannerPreview
          formData={formData}
          previewImage={previewImage}
          bannerCategories={bannerCategories}
          onEdit={handleEdit}
          // MODIFIED: Added onProceed prop
          onProceed={handleProceedToPayment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CreateBannerForm;
