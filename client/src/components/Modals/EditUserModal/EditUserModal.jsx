import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { validateUserForm } from '../../../utilis/formatters';
import {
  selectStatuses,
} from '../../../redux/statuses/statusesSlice';
import {
  selectRoles,
} from '../../../redux/roles/rolesSlice';
import { formatDateTime } from '../../../helpers/formatDate';

const EditUserModal = ({ visible, onCancel, onConfirm, user, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const roles = useSelector(selectRoles);
  const statuses = useSelector(selectStatuses);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        roleId: user.roleId || '',
        department: user.department || '',
        statusId: user.statusId || '',
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

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.role : 'Unknown';
  };

  // Get status name by ID
  const getStatusName = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status ? status.status : 'Unknown';
  };

  const formFields = [
    {
      type: 'section',
      label: 'Basic Information'
    },
    {
      name: 'fullName',
      label: 'Full Name *',
      type: 'text',
      placeholder: 'Enter full name',
      section: 'basic',
      readonly: true,
    },
    {
      name: 'email',
      label: 'Email Address *',
      type: 'email',
      placeholder: 'Enter email address',
      section: 'basic',
      readonly: true,
    },
    {
      type: 'section',
      label: 'Role & Access'
    },
    {
      name: 'roleId',
      label: 'Role *',
      type: 'select',
      options: roles.map(role => ({
        value: role.id,
        label: role.role.charAt(0).toUpperCase() + role.role.slice(1)
      })),
      section: 'role'
    },
    {
      name: 'statusId',
      label: 'Status *',
      type: 'select',
      options: statuses.map(status => ({
        value: status.id,
        label: status.status.charAt(0).toUpperCase() + status.status.slice(1)
      })),
      section: 'role'
    },
    {
      type: 'section',
      label: 'Account Settings'
    },
    {
      type: 'readonly',
      label: 'Account Information',
      value: `User ID: ${user?.id || 'N/A'}\nLast Active: ${user?.lastLoginAt ? formatDateTime(user.lastLoginAt) : '-'}`
    }
  ];

  return (
    <ConfirmationModal
      visible={visible}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      title={`Edit User: ${user?.fullName || 'User'}`}
      isForm={true}
      formData={formData}
      onFormChange={handleFormChange}
      formFields={formFields}
      loading={loading}
      error={
        error || Object.keys(validationErrors).length > 0 ? 'Please fix the validation errors' : ''
      }
      cancelText="Cancel"
      confirmText="Save Changes"
      confirmColor="primary"
      showSections={true}
    />
  );
};

export default EditUserModal;