import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const EditItemModal = ({ visible, onCancel, onConfirm, formData, onFormChange, formFields, loading = false, error = '' }) => {
    // Patch: pass readOnly prop to ConfirmationModal fields
    // ConfirmationModal will need to respect the readOnly property on each field
    return (
        <ConfirmationModal
            visible={visible}
            onCancel={onCancel}
            onConfirm={onConfirm}
            title="Edit Item"
            isForm={true}
            formData={formData}
            onFormChange={onFormChange}
            formFields={formFields}
            loading={loading}
            error={error}
            confirmText="Save"
            cancelText="Cancel"
        />
    );
};

export default EditItemModal;
