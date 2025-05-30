// ... existing imports ...
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const JobOfferForm = (/* ... existing props ... */) => {
  // ... existing state variables ...
  
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // ... existing functions ...

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    setFileError('');
    
    // Check total file count
    if (filePreviews.length + files.length > 5) {
    setFileError('Maximum 5 files allowed');
      return;
    }
    
    // Filter valid files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setFileError('Only JPG, PNG, and PDF files are allowed');
      } else if (!isValidSize) {
        setFileError('File size must be less than 5MB');
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length === 0) return;
    
    // Create previews
    const newPreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }));
    
    // Update state
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
    
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  // Trigger file input
  const handleClick = () => {
    if (filePreviews.length >= 5) {
      setFileError('Maximum 5 files allowed');
      return;
    }
    fileInputRef.current.click();
  };

  // ... existing component code ...

  return (
    <section className="sptb pt-5">
      {/* ... existing JSX ... */}
      
      {/* File Upload Section */}
      <div className="form-group mt-3">
        <label className="form-label text-dark fw-semibold">
          Attachments (max 5)
          {filePreviews.length > 0 && (
            <span className="text-muted ms-2">
              ({filePreviews.length}/5 files)
            </span>
          )}
        </label>
        
        <div 
          className={`dropzone ${dragActive ? 'drag-active' : ''} ${filePreviews.length >= 5 ? 'dropzone-full' : ''}`}
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            name="attachments"
            onChange={handleFileChange}
            className="d-none"
            accept="image/*,.pdf"
          />
          
          <div className="dropzone-content">
            <FaCloudUploadAlt size={48} className="text-primary mb-3" />
            <p className="mb-1">
              <strong>
                {filePreviews.length >= 5 
                  ? 'Maximum files reached' 
                  : 'Drag & drop files here'}
              </strong>
            </p>
            <p className="text-muted mb-3">
              {filePreviews.length >= 5 
                ? 'Remove files to add more' 
                : 'or click to browse'}
            </p>
            
            {filePreviews.length < 5 && (
              <button 
                type="button" 
                className="btn btn-outline-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Select Files
              </button>
            )}
            
            <p className="text-muted mt-2 mb-0">
              Supports JPG, PNG, PDF (Max 5MB each)
            </p>
          </div>
        </div>
        
        {fileError && (
          <div className="text-danger mt-2">{fileError}</div>
        )}
        
        {filePreviews.length > 0 && (
          <div className="previews-container mt-3">
            <div className="row">
              {filePreviews.map((preview, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3 position-relative mb-3">
                  <div className="preview-thumbnail">
                    {preview.type.startsWith('image') ? (
                      <img 
                        src={preview.url} 
                        alt="preview" 
                        className="img-fluid"
                      />
                    ) : (
                      <div className="file-preview">
                        <FaFileAlt size={24} className="text-muted" />
                        <small className="d-block text-truncate mt-1">
                          {preview.name}
                        </small>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* ... rest of the component ... */}
    </section>
  );
};

// ... Preview component ...