import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CSpinner,
  CContainer,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser } from '@coreui/icons';

// Redux imports
import {
  fetchUsers,
  updateUser,
  deleteUser,
  quickChangeUserStatus,
  quickChangeUserRole,
  clearError,
  clearSuccess,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersSuccess,
  selectUpdatingUser,
  selectDeletingUser,
  selectChangingStatus,
  selectChangingRole,
} from '../../redux/users/usersSlice';

// Component imports
import {
  UserTable,
  SearchFilters,
  EditUserModal,
  DeleteUserModal,
  QuickChangeModal,
} from '../index';

// Utility imports
import { filterUsers } from '../../utils/formatters';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.profile);

  // Redux state
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const success = useSelector(selectUsersSuccess);
  const updatingUser = useSelector(selectUpdatingUser);
  const deletingUser = useSelector(selectDeletingUser);
  const changingStatus = useSelector(selectChangingStatus);
  const changingRole = useSelector(selectChangingRole);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuickChangeModal, setShowQuickChangeModal] = useState(false);
  const [quickChangeData, setQuickChangeData] = useState({
    type: null,
    newValue: null,
  });

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Clear messages after a delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm, filterRole);
  }, [users, searchTerm, filterRole]);

  // Event handlers
  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditUser = useCallback((user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);

  const handleDeleteUser = useCallback((user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);

  const handleQuickStatusChange = useCallback(
    (userId, newStatusId) => {
      setSelectedUser(users.find((u) => u.id === userId));
      setQuickChangeData({ type: 'status', newValue: newStatusId });
      setShowQuickChangeModal(true);
    },
    [users]
  );

  const handleQuickRoleChange = useCallback(
    (userId, newRoleId) => {
      setSelectedUser(users.find((u) => u.id === userId));
      setQuickChangeData({ type: 'role', newValue: newRoleId });
      setShowQuickChangeModal(true);
    },
    [users]
  );

  const handleUpdateUser = useCallback(
    (formData) => {
      dispatch(updateUser({ userId: selectedUser.id, userData: formData }));
      setShowEditModal(false);
    },
    [dispatch, selectedUser]
  );

  const handleConfirmDelete = useCallback(() => {
    dispatch(deleteUser(selectedUser.id));
    setShowDeleteModal(false);
  }, [dispatch, selectedUser]);

  const handleConfirmQuickChange = useCallback(() => {
    const { type, newValue } = quickChangeData;
    if (type === 'status') {
      dispatch(quickChangeUserStatus({ userId: selectedUser.id, statusId: newValue }));
    } else if (type === 'role') {
      dispatch(quickChangeUserRole({ userId: selectedUser.id, roleId: newValue }));
    }
    setShowQuickChangeModal(false);
  }, [dispatch, selectedUser, quickChangeData]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    );
  }

  return (
    <div>
      <CContainer fluid className="p-4">
        <CCard className="admin-dashboard-card mb-4">
          <CCardHeader>
            <h4 className="mb-0">
              <CIcon icon={cilUser} className="me-2" />
              User Management Dashboard
            </h4>
          </CCardHeader>
          <CCardBody>
            {/* Error and Success Messages */}
            {error && (
              <CAlert color="danger" dismissible onClose={() => dispatch(clearError())}>
                {error}
              </CAlert>
            )}
            {success && (
              <CAlert color="success" dismissible onClose={() => dispatch(clearSuccess())}>
                {success}
              </CAlert>
            )}

            {/* Search and Filters */}
            <CRow className="mb-3">
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterRole={filterRole}
                onFilterRoleChange={setFilterRole}
                onRefresh={handleRefresh}
              />
            </CRow>

            {/* Users Table */}
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onQuickStatus={handleQuickStatusChange}
              onQuickRole={handleQuickRoleChange}
              onDelete={handleDeleteUser}
              currentUser={currentUser}
              isUpdating={updatingUser}
              isDeleting={deletingUser}
              isChangingStatus={changingStatus}
              isChangingRole={changingRole}
            />
          </CCardBody>
        </CCard>

        {/* Edit User Modal */}
        {selectedUser && (
          <EditUserModal
            visible={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onConfirm={handleUpdateUser}
            user={selectedUser}
            loading={updatingUser === selectedUser?.id}
            error={error}
          />
        )}

        {/* Delete User Modal */}
        {selectedUser && (
          <DeleteUserModal
            visible={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            user={selectedUser}
            loading={deletingUser === selectedUser?.id}
            error={error}
          />
        )}

        {/* Quick Change Modal */}
        {selectedUser && (
          <QuickChangeModal
            visible={showQuickChangeModal}
            onCancel={() => setShowQuickChangeModal(false)}
            onConfirm={handleConfirmQuickChange}
            type={quickChangeData.type}
            newValue={quickChangeData.newValue}
            user={selectedUser}
            loading={changingStatus === selectedUser?.id || changingRole === selectedUser?.id}
            error={error}
          />
        )}
      </CContainer>
    </div>
  );
};

export default AdminDashboard;
