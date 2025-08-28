import { CButton } from '@coreui/react';

const ActionButtons = ({
  isApproveMode,
  isEditing,
  isApproved,
  handleSave,
  handleCancel,
  handleApprove,
  handleEdit,
}) => {
  if (!isApproveMode) return null;

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
      <CButton color="success" onClick={handleApprove} disabled={isApproved}>
        {isApproved ? 'Approved' : 'Approve'}
      </CButton>
      {!isApproved && (
        <CButton color="secondary" onClick={handleEdit}>
          Edit
        </CButton>
      )}
    </div>
  );
};

export default ActionButtons;
