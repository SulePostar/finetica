import AppButton from '../AppButton/AppButton';

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
          <AppButton variant="success" disabled>Approved</AppButton>
        </div>
      );
    }

    // If editing in approve mode, show Save + Cancel
    if (isEditing) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <AppButton variant="primary" onClick={handleSave}>Save</AppButton>
          <AppButton variant="no-hover" onClick={handleCancel}>Cancel</AppButton>
        </div>
      );
    }
    return (
      <div className="w-100 d-flex justify-content-center mt-3 gap-2">
        <AppButton variant="success" onClick={handleApprove}>Approve</AppButton>
        <AppButton variant="edit" onClick={handleEdit}>Edit</AppButton>
      </div>
    );
  }

  // Edit mode logic
  if (isEditMode) {
    if (isSaved) {
      return (
        <div className="w-100 d-flex justify-content-center mt-3 gap-2">
          <AppButton variant="primary">Saved</AppButton>
        </div>
      );
    }
    return (
      <div className="w-100 d-flex justify-content-center mt-3 gap-2">
        <AppButton variant="primary">Save</AppButton>
        <AppButton variant="no-hover">Cancel</AppButton>
      </div>
    )
  }

  return null;
};

export default ActionButtons;