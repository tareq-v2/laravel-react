import React from 'react';
import { FiX } from 'react-icons/fi';
import JobOfferForm from '../../create/JobOfferForm';
import '../../Design/CustomerDashboard.css';

const EditModal = ({ 
  isEditing, 
  setIsEditing, 
  editFormData,
  handleUpdatePost 
}) => {
  if (!isEditing) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content tomato-border rounded">
        <div className="modal-header tomato-bg text-white p-3 rounded-top">
          <h3 className="m-0">Edit Post</h3>
          <button 
            className="close-button text-white"
            onClick={() => setIsEditing(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body p-4">
          <JobOfferForm 
            isEditMode={true}
            initialData={editFormData}
            onSubmit={handleUpdatePost}
            onCancel={() => setIsEditing(false)}
            primaryButtonClass="tomato-button"
            secondaryButtonClass="tomato-button-outline"
          />
        </div>
      </div>
    </div>
  );
};

export default EditModal;