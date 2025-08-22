import React from 'react';
import { CTableRow, CTableDataCell, CButton, CFormSelect, CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import { getRoleName, getStatusBadge, isNewUser } from '../../utilis/formatters';

const UserRow = ({
  user,
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
  const roleName = getRoleName(user);
  const statusBadge = getStatusBadge(user.statusId);
  const isSelf = user.id === currentUser?.id;
  const isNew = isNewUser(user);

  return (
    <CTableRow key={user.id}>
      <CTableDataCell>{user.id}</CTableDataCell>
      <CTableDataCell>
        {user.fullName || user.email}
        {isNew && (
          <CBadge color="warning" className="ms-2">
            New User
          </CBadge>
        )}
      </CTableDataCell>
      <CTableDataCell>{user.email}</CTableDataCell>
      <CTableDataCell>{roleName}</CTableDataCell>
      <CTableDataCell>{statusBadge}</CTableDataCell>
      <CTableDataCell>
        <div className="d-flex gap-1">
          <CButton
            size="sm"
            color="info"
            onClick={() => onEdit(user)}
            disabled={isUpdating || isDeleting}
          >
            <CIcon icon={cilPencil} />
          </CButton>
          <CFormSelect
            size="sm"
            value={user.statusId}
            onChange={(e) => onQuickStatus(user.id, parseInt(e.target.value))}
            style={{ width: 'auto', minWidth: '100px' }}
            title="Change Status"
            disabled={isChangingStatus}
          >
            <option value={1}>Pending</option>
            <option value={2}>Approved</option>
            <option value={3}>Rejected</option>
            <option value={4}>Deleted</option>
          </CFormSelect>
          <CFormSelect
            size="sm"
            value={user.roleId || user.role_id || ''}
            onChange={(e) => onQuickRole(user.id, parseInt(e.target.value))}
            style={{ width: 'auto', minWidth: '100px' }}
            title="Change Role"
            disabled={isChangingRole}
          >
            <option value="">No Role</option>
            <option value={2}>Admin</option>
            <option value={3}>User</option>
          </CFormSelect>
          <CButton
            size="sm"
            color="danger"
            onClick={() => onDelete(user)}
            disabled={isSelf || isUpdating || isDeleting}
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      </CTableDataCell>
    </CTableRow>
  );
};

export default UserRow;