import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import { getUserDisplayName } from '../../utilis/formatters';
const DeleteUserModal = ({ visible, onCancel, onConfirm, user, loading = false, error = '' }) => {
  const userName = getUserDisplayName(user);
  return (
    <ConfirmationModal
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="Delete User"
      body={`Are you sure you want to delete user "${userName}"? This action cannot be undone.`}
      cancelText="Cancel"
      confirmText="Delete User"
      confirmColor="danger"
      loading={loading}
      error={error}
    />
  );
};
export default DeleteUserModal;