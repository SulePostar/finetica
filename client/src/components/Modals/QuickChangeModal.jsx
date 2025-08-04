import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import { getStatusName, getRoleNameById } from '../../utils/formatters';

const QuickChangeModal = ({
  visible,
  onCancel,
  onConfirm,
  type, // 'status' or 'role'
  newValue,
  user,
  loading = false,
  error = '',
}) => {
  const getTitle = () => {
    return type === 'status' ? 'Change User Status' : 'Change User Role';
  };

  const getBody = () => {
    const userName = user?.firstName || user?.email || 'User';
    if (type === 'status') {
      return `Are you sure you want to change the status to "${getStatusName(newValue)}"?`;
    } else {
      return `Are you sure you want to change the role to "${getRoleNameById(newValue)}"?`;
    }
  };

  const getConfirmText = () => {
    return type === 'status' ? 'Update Status' : 'Update Role';
  };

  return (
    <ConfirmationModal
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={getTitle()}
      body={getBody()}
      cancelText="Cancel"
      confirmText={getConfirmText()}
      confirmColor="primary"
      loading={loading}
      error={error}
    />
  );
};

export default QuickChangeModal;
