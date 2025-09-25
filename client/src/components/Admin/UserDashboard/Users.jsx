import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useColorModes } from '@coreui/react';

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
  clearError,
  clearSuccess,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersSuccess,
  selectUpdatingUser,
  selectDeletingUser,
} from '../../../redux/users/usersSlice';

import {
  fetchRoles,
  selectRoles,
  selectRolesLoading,
} from '../../../redux/roles/rolesSlice';

import {
  fetchStatuses,
  selectStatuses,
} from '../../../redux/statuses/statusesSlice';

import {
  SearchFilters,
  EditUserModal,
  ConfirmationModal,
} from '../../index';

import {
  filterUsers,
  getRoleName,
  getStatusBadge,
} from '../../../utilis/formatters';
import notify from '../../../utilis/toastHelper';

import { useSidebarWidth } from '../../../hooks/useSidebarWidth';
import DefaultLayout from '../../../layout/DefaultLayout';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const Users = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.profile);
  const [showViewModal, setShowViewModal] = useState(false);

  const { colorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const success = useSelector(selectUsersSuccess);
  const updatingUser = useSelector(selectUpdatingUser);
  const deletingUser = useSelector(selectDeletingUser);

  const roles = useSelector(selectRoles);
  const rolesLoading = useSelector(selectRolesLoading);
  const statuses = useSelector(selectStatuses);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isMobile = useIsMobile();
  const sidebarWidth = useSidebarWidth();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (error || success) {
      if (error) notify.onError(error);
      if (success) notify.onSuccess(success);

      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const filteredUsers = useMemo(
    () => filterUsers(users, searchTerm, filterRole),
    [users, searchTerm, filterRole]
  );

  const customStyles = useMemo(() => makeCustomStyles(), []);

  const checkDarkMode = useCallback(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const dark = colorMode === 'dark' || (colorMode === 'auto' && media.matches);
    setIsDarkMode(dark);

    document.documentElement.setAttribute('data-coreui-theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', dark);
  }, [colorMode]);

  useEffect(() => {
    checkDarkMode();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', checkDarkMode);
    return () => media.removeEventListener('change', checkDarkMode);
  }, [checkDarkMode]);

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find((u) => u.id === selectedUser.id);
      if (updated) setSelectedUser(updated);
    }
  }, [users, selectedUser]);

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

  const roleOptions = useMemo(() => {
    if (rolesLoading) return [{ value: 'loading', label: 'Loading...' }];
    return roles
      .filter((r) => r.id && r.role)
      .map((r) => ({ value: r.id.toString(), label: capitalizeFirst(r.role) }));
  }, [roles, rolesLoading]);

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        selector: (row) => row.fullName,
        sortable: true,
        minWidth: '220px',
        grow: 2,
        cell: (row) => (
          <div className="d-flex align-items-center gap-2">
            <div
              className="avatar-circle d-flex align-items-center me-2 
            justify-content-center rounded-circle fw-semibold text-white"
            >
              {row.fullName?.charAt(0) || 'U'}
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
        minWidth: '240px',
        grow: 2,
        cell: (row) => <div className="user-email">{row.email}</div>,
      },
      {
        name: 'Role',
        selector: (row) => getRoleName(row, roles),
        sortable: true,
        minWidth: '140px',
        grow: 1,
        cell: (row) => <span className="badge bg-light text-dark">{getRoleName(row, roles)}</span>,
      },
      {
        name: 'Status',
        selector: (row) => row.statusId,
        sortable: true,
        minWidth: '140px',
        grow: 0.8,
        cell: (row) => getStatusBadge(row.statusId, statuses),
      },
      {
        name: 'Last Active',
        selector: (row) => (row.lastLoginAt ? formatDateTime(row.lastLoginAt) : '—'),
        sortable: true,
        minWidth: '170px',
        grow: 1,
      },
      {
        name: 'Actions',
        minWidth: '140px',
        grow: 0.6,
        cell: (row) => (
          <ActionsDropdown row={row} onEdit={() => handleEditUser(row)} onDelete={() => handleDeleteUser(row)} />
        ),
        ignoreRowClick: true,
      },
    ],
    [roles, statuses, handleEditUser, handleDeleteUser]
  );

  if (loading) {
    return (
      <DefaultLayout>
        <div
          className="table-page-outer"
          style={{ left: sidebarWidth + 24, right: 24 }}
        >
          <div className="users-table-scroll d-flex justify-content-center align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div
        className="table-page-outer"
        style={{ left: sidebarWidth + 24, right: 24 }}
      >
        <div className="users-table-scroll users-table-responsive">
          <Card className="my-0 shadow-none border-0 bg-transparent">
            <Card.Body className="p-0">
              <Card.Title className="user-dashboard-title mb-3 fw-bold">
                User Management Dashboard
              </Card.Title>

              <div className="mb-3">
                <SearchFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filters={[
                    {
                      name: 'role',
                      label: 'All Roles',
                      options: roleOptions,
                    },
                  ]}
                  filterValues={{ role: filterRole }}
                  onFilterChange={(name, value) => {
                    if (name === 'role') setFilterRole(value);
                  }}
                  onRefresh={handleRefresh}
                />
              </div>

              {!isMobile ? (
                <div className="users-table-card">
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
                </div>
              ) : (
                <div>
                  {filteredUsers.map((user) => (
                    <Card
                      key={user.id}
                      className="mb-3 shadow-sm border-0"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                    >
                      <Card.Body>
                        <Row className="mb-2">
                          <Col xs={4} className="fw-bold">Name:</Col>
                          <Col xs={8}>{user.fullName}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="fw-bold">Email:</Col>
                          <Col xs={8}>{user.email}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="fw-bold">Role:</Col>
                          <Col xs={8}>{getRoleName(user, roles)}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="fw-bold">Status:</Col>
                          <Col xs={8}>{getStatusBadge(user.statusId, statuses)}</Col>
                        </Row>
                        <Row className="mb-2">
                          <Col xs={4} className="fw-bold">Last Active:</Col>
                          <Col xs={8}>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}</Col>
                        </Row>
                        <Row>
                          <Col>
                            <ActionsDropdown
                              row={user}
                              onEdit={() => handleEditUser(user)}
                              onDelete={() => handleDeleteUser(user)}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

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
        <ViewUserModal
          visible={showViewModal}
          onClose={() => setShowViewModal(false)}
          user={selectedUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          roles={roles}
          statuses={statuses}
          isDarkMode={isDarkMode}
        />
      )}
    </DefaultLayout>
  );
};

export default Users;
