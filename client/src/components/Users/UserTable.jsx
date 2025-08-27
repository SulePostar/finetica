import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody } from '@coreui/react';
import UserRow from './UserRow';

const UserTable = ({
  users,
  onEdit,
  onQuickStatus,
  onQuickRole,
  onDelete,
  currentUser,
  isUpdating,
  isDeleting,
  isChangingStatus,
  isChangingRole,
}) => {
  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>ID</CTableHeaderCell>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Role</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onEdit={onEdit}
            onQuickStatus={onQuickStatus}
            onQuickRole={onQuickRole}
            onDelete={onDelete}
            currentUser={currentUser}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            isChangingStatus={isChangingStatus}
            isChangingRole={isChangingRole}
          />
        ))}
      </CTableBody>
    </CTable>
  );
};

export default UserTable;