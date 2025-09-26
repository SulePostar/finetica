import React from 'react';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

const EditItemModal = ({ visible, onCancel, onConfirm, formData, onFormChange, formFields, loading = false, error = '' }) => {
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
