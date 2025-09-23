import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import makeCustomStyles from '../../Tables/DynamicTable.styles';
import CIcon from '@coreui/icons-react';
import { cilUser, cilPencil, cilTrash } from '@coreui/icons';
import { capitalizeFirst } from '../../../helpers/capitalizeFirstLetter';

import './Users.css';
import { colors } from '../../../styles/colors';

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
} from '../../../redux/users/usersSlice';

import {
  fetchRoles,
  selectRoles,
  selectRolesLoading,
} from '../../../redux/roles/rolesSlice';

import {
  fetchStatuses,
  selectStatuses,
  selectStatusesLoading,
} from '../../../redux/statuses/statusesSlice';

import { SearchFilters, EditUserModal, ConfirmationModal, QuickChangeModal } from '../../index';

import { filterUsers, getRoleName, getStatusBadge, isNewUser } from '../../../utilis/formatters';
import notify from '../../../utilis/toastHelper';

const Users = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.profile);

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const success = useSelector(selectUsersSuccess);
  const updatingUser = useSelector(selectUpdatingUser);
  const deletingUser = useSelector(selectDeletingUser);
  const changingStatus = useSelector(selectChangingStatus);
  const changingRole = useSelector(selectChangingRole);

  // New selectors for roles and statuses
  const roles = useSelector(selectRoles);
  const rolesLoading = useSelector(selectRolesLoading);
  const statuses = useSelector(selectStatuses);
  const statusesLoading = useSelector(selectStatusesLoading);

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

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (error || success) {
      if (error) {
        notify.onError(error);
      }
      if (success) {
        notify.onSuccess(success);
      }

      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm, filterRole);
  }, [users, searchTerm, filterRole]);

  const customStyles = useMemo(() => makeCustomStyles(), []);

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
    notify.onWarning(`Deleting user: ${selectedUser.firstName || selectedUser.email}`);
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

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        selector: (row) => row.fullName,
        sortable: true,
        width: '15%',
        cell: (row) => (
          <div>
            {row.fullName}
            {isNewUser(row) && <span className="badge bg-success ms-2">New User</span>}
          </div>
        ),
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        width: '25%',
        cell: (row) => (
          <div className="user-dashboard-email-cell" title={row.email}>
            {row.email}
          </div>
        ),
      },
      {
        name: 'Role',
        selector: (row) => getRoleName(row, roles),
        sortable: true,
        width: '12.5%',
      },
      {
        name: 'Status',
        selector: (row) => row.statusId,
        sortable: true,
        width: '12.5%',
        cell: (row) => getStatusBadge(row.statusId, statuses),
      },
      {
        name: 'Actions',
        selector: (row) => row.id,
        sortable: false,
        width: '35%',
        cell: (row) => {
          const isSelf = row.id === currentUser?.id;
          return (
            <div className="user-dashboard-actions-container">
              <div className="user-dashboard-status-dropdown-wrapper">
                <select
                  className="form-select form-select-sm user-dashboard-status-dropdown"
                  value={row.statusId}
                  onChange={(e) => handleQuickStatusChange(row.id, parseInt(e.target.value))}
                  title="Change Status"
                  disabled={changingStatus || statusesLoading}
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
                </select>
              </div>
              <div className="user-dashboard-role-dropdown-wrapper">
                <select
                  className="form-select form-select-sm user-dashboard-role-dropdown"
                  value={row.roleId || row.role_id || ''}
                  onChange={(e) => handleQuickRoleChange(row.id, parseInt(e.target.value))}
                  title="Change Role"
                  disabled={changingRole || rolesLoading}
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
                </select>
              </div>
              <button
                className="btn btn-sm user-dashboard-edit-btn"
                onClick={() => handleEditUser(row)}
                disabled={updatingUser || deletingUser}
                title="Edit User"
                style={{ backgroundColor: colors.primary }}
              >
                <CIcon icon={cilPencil} />
              </button>
              <button
                className="btn bg-danger btn-sm user-dashboard-delete-btn"
                onClick={() => handleDeleteUser(row)}
                disabled={isSelf || updatingUser || deletingUser}
                title="Delete User"
              >
                <CIcon icon={cilTrash} />
              </button>
            </div>
          );
        },
      }
    ],
    [
      currentUser,
      updatingUser,
      deletingUser,
      changingStatus,
      changingRole,
      roles,
      statuses,
      rolesLoading,
      statusesLoading,
      handleEditUser,
      handleQuickStatusChange,
      handleQuickRoleChange,
      handleDeleteUser,
    ]
  );

  if (loading) {
    return (
      <div className="user-dashboard-loading" data-testid="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="user-dashboard-container">
        <Card className="my-4 shadow-sm border-0 bg-light dark:bg-dark">
          <Card.Body>
            <Card.Title className="user-dashboard-title">
              User Management Dashboard
            </Card.Title>

            {/* Search and Filters */}
            <div className="user-dashboard-search-filters">
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[
                  {
                    name: "role",
                    label: "All Roles",
                    options: [
                      { value: "", label: "All Roles" },
                      ...(rolesLoading
                        ? [{ value: "loading", label: "Loading..." }]
                        : roles.map((role) => ({
                          value: role.id.toString(),
                          label: capitalizeFirst(role.role),
                        }))
                      ),
                    ],
                  },
                ]}
                filterValues={{ role: filterRole }}
                onFilterChange={(name, value) => {
                  if (name === "role") setFilterRole(value);
                }}
                onRefresh={handleRefresh}
              />
            </div>

            {/* Users Table */}
            <DataTable
              columns={columns}
              data={filteredUsers}
              progressPending={loading}
              progressComponent={<Spinner animation="border" variant="primary" />}
              pagination
              paginationTotalRows={filteredUsers.length}
              highlightOnHover
              responsive
              customStyles={customStyles}
              dense
            />
          </Card.Body>
        </Card>
      </div>

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
        <ConfirmationModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          body={`Are you sure you want to delete user "${selectedUser.fullName}"? This action cannot be undone.`}
          cancelText="Cancel"
          confirmText="Delete User"
          confirmColor="danger"
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
          roles={roles}
          statuses={statuses}
        />
      )}
    </div>
  );
};

export default Users;