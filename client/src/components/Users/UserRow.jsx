import React from 'react';
import { CTableRow, CTableDataCell, CButton, CFormSelect, CBadge } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import { getRoleName, getStatusBadge, isNewUser } from '../../utilis/formatters';
import { capitalizeFirst } from '../../helpers/capitalizeFirstLetter';

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
  roles = [],
  statuses = [],
  rolesLoading = false,
  statusesLoading = false,
}) => {
  const roleName = getRoleName(user, roles);
  const statusBadge = getStatusBadge(user.statusId, statuses);
  const isSelf = user.id === currentUser?.id;
  const isNew = isNewUser(user);

  return (
    <CTableRow key={user.id}>
      <CTableDataCell>{user.id}</CTableDataCell>
      <CTableDataCell>
        {user.fullName}
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
            disabled={isChangingStatus || statusesLoading}
          >
            {statusesLoading ? (
              <option>Loading...</option>
            ) : (
              statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {capitalizeFirst(status.status)}
                </option>
              ))
            )}
          </CFormSelect>
          <CFormSelect
            size="sm"
            value={user.roleId || user.role_id || ''}
            onChange={(e) => onQuickRole(user.id, parseInt(e.target.value))}
            style={{ width: 'auto', minWidth: '100px' }}
            title="Change Role"
            disabled={isChangingRole || rolesLoading}
          >
            <option value="">No Role</option>
            {rolesLoading ? (
              <option>Loading...</option>
            ) : (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {capitalizeFirst(role.role)}
                </option>
              ))
            )}
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