import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import makeCustomStyles from '../../Tables/DynamicTable.styles';
import { capitalizeFirst } from '../../../helpers/capitalizeFirstLetter';
import ActionsDropdown from '../../Tables/Dropdown/ActionsDropdown';
import { formatDateTime } from '../../../helpers/formatDate';
import ViewUserModal from '../../Modals/ViewUserModal/ViewUserModal';

import './Users.css';
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
  const [showViewModal, setShowViewModal] = useState(false);

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

  const roleOptions = useMemo(() => {
    if (rolesLoading) return [{ value: "loading", label: "Loading..." }];

    return roles
      .filter(r => r.id && r.role)
      .map(r => ({
        value: r.id.toString(),
        label: capitalizeFirst(r.role),
      }));
  }, [roles, rolesLoading]);

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        selector: (row) => row.fullName,
        sortable: true,
        width: '25%',
        cell: (row) => (
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-circle d-flex align-items-center me-2 
            justify-content-center rounded-circle fw-semibold text-white">
              {row.fullName?.charAt(0) || "U"}
            </div>
            <div className="d-flex flex-column">
              <div className="user-fullname fw-semibold">{row.fullName}</div>
            </div>
          </div>
        ),
      },
      {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
        width: '25%',
        cell: (row) => <div className="user-email">{row.email}</div>,
      },
      {
        name: 'Role',
        selector: (row) => getRoleName(row, roles),
        sortable: true,
        width: '10%',
        cell: (row) => (
          <span className="badge bg-light text-dark">{getRoleName(row, roles)}</span>
        ),
      },
      {
        name: 'Status',
        selector: (row) => row.statusId,
        sortable: true,
        width: '15%',
        cell: (row) => getStatusBadge(row.statusId, statuses),
      },
      {
        name: 'Last Active',
        selector: (row) => row.lastLoginAt ? formatDateTime(row.lastLoginAt) : "—",
        sortable: true,
        width: '15%',
      },
      {
        name: 'Actions',
        width: '10%',
        cell: (row) => (
          <ActionsDropdown
            row={row}
            // onView={handleView}
            onEdit={() => handleEditUser(row)}
            onDelete={() => handleDeleteUser(row)}
          />
        ),
        ignoreRowClick: true,
      },
    ],
    [
      currentUser,
      updatingUser,
      deletingUser,
      roles,
      statuses,
      handleEditUser,
      handleDeleteUser,
    ]
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" data-testid="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="p-3">
        <Card className="my-4 shadow-sm border-0 bg-light dark:bg-dark">
          <Card.Body>
            <Card.Title className="user-dashboard-title mb-3 fw-bold">
              User Management Dashboard
            </Card.Title>

            {/* Search and Filters */}
            <div className='mb-3'>
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[{ name: "role", label: "All Roles", options: roleOptions }]}
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
              onRowClicked={(row) => {
                setSelectedUser(row);
                setShowViewModal(true);
              }}
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

      {selectedUser && (
        // In Users component
        <ViewUserModal
          visible={showViewModal}
          onClose={() => setShowViewModal(false)}
          user={selectedUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          roles={roles}
          statuses={statuses}
        />
      )}

      {/* Quick Change Modal */}
      {/* {selectedUser && (
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
      )} */}
    </div>
  );
};

export default Users;