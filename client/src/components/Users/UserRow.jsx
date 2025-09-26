import { CTableRow, CTableDataCell, CBadge } from '@coreui/react';
import { getRoleName, getStatusBadge, isNewUser } from '../../utilis/formatters';

const UserRow = ({
  user,
  currentUser,
  roles = [],
  statuses = [],
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
    </CTableRow>
  );
};

export default UserRow;