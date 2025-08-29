import { CButton } from '@coreui/react';

const ActionButtons = ({
  isApproveMode = false,
  isEditMode = false,
  isEditing = false,
  isApproved = false,
  handleSave,
  handleCancel,
  handleApprove,
  handleEdit,
  isSaved = false,
}) => {
  // Approve mode logic
  if (isApproveMode) {
    // If already approved, show disabled Approved button
    if (isApproved) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <CButton color="success" disabled>
            Approved
          </CButton>
        </div>
      );
    }

    // If editing in approve mode, show Save + Cancel
    if (isEditing) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <CButton color="primary" onClick={handleSave}>
            Save
          </CButton>
          <CButton color="danger" onClick={handleCancel}>
            Cancel
          </CButton>
        </div>
      );
    }
    return (
      <div className="w-100 d-flex justify-content-center mt-3 gap-2">
        <CButton color="success" onClick={handleApprove}>
          Approve
        </CButton>
        <CButton color="secondary" onClick={handleEdit}>
          Edit
        </CButton>
      </div>
    );
  }

  // Edit mode logic
  if (isEditMode) {
    if (isSaved) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <CButton color="success" disabled>
            Saved
          </CButton>
        </div>
      );
    }
    return (
      <div className="w-100 d-flex justify-content-center mt-3 gap-2">
        <CButton color="primary" onClick={handleSave}>
          Save
        </CButton>
        <CButton color="danger" onClick={handleCancel}>
          Cancel
        </CButton>
      </div>
    )
  }

  return null;
};

export default ActionButtons;