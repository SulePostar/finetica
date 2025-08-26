import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { validateUserForm } from '../../utilis/formatters';
const EditUserModal = ({ visible, onCancel, onConfirm, user, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      setValidationErrors({});
    }
  }, [user]);
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
    // Clear validation errors when user types
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  };
  const handleConfirm = () => {
    const errors = validateUserForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    onConfirm(formData);
  };
  const formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email address',
    },
  ];
  return (
    <ConfirmationModal
      visible={visible}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      title={`Edit User: ${user?.firstName || user?.email || 'User'}`}
      isForm={true}
      formData={formData}
      onFormChange={handleFormChange}
      formFields={formFields}
      loading={loading}
      error={
        error || Object.keys(validationErrors).length > 0 ? 'Please fix the validation errors' : ''
      }
      cancelText="Cancel"
      confirmText="Update User"
      confirmColor="primary"
    />
  );
};
export default EditUserModal;