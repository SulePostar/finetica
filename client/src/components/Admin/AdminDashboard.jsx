import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
  CAlert,
  CSpinner,
  CBadge,
  CContainer,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPencil, cilTrash, cilUser } from '@coreui/icons';
import api from '../../services/api';
import { ConfirmationModal } from '../index';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [quickChangeData, setQuickChangeData] = useState({
    userId: null,
    newValue: null,
    type: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = useSelector((state) => state.user.profile);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Debug: Check user role and token
      const token = localStorage.getItem('jwt_token');
      console.log('Token exists:', !!token);
      console.log('Current user:', user);
      console.log('User role_id:', user?.roleId);

      const response = await api.get('/users');
      console.log('Users data received:', response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 403) {
        setError('Access denied. You need admin permissions to view this page.');
      } else {
        setError('Error fetching users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      roleId: user.role_id || user.roleId || null,
      statusId: user.statusId || user.status_id || 1,
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUpdateUser = async (formData) => {
    try {
      await api.patch(`/users/${selectedUser.id}`, formData);
      setSuccess('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}`);
      setSuccess('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user');
    }
  };

  const handleQuickStatusChange = (userId, newStatusId) => {
    setQuickChangeData({ userId, newValue: newStatusId, type: 'status' });
    setShowStatusModal(true);
  };

  const handleQuickRoleChange = (userId, newRoleId) => {
    setQuickChangeData({ userId, newValue: newRoleId, type: 'role' });
    setShowRoleModal(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      await api.patch(`/users/${quickChangeData.userId}`, { statusId: quickChangeData.newValue });
      setSuccess('User status updated successfully');
      setShowStatusModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Error updating user status');
    }
  };

  const handleConfirmRoleChange = async () => {
    try {
      await api.patch(`/users/${quickChangeData.userId}`, { roleId: quickChangeData.newValue });
      setSuccess('User role updated successfully');
      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Error updating user role');
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = (user.fullName || user.email || '').toLowerCase();
    const matchesSearch =
      searchText.includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !filterRole || (user.role_id || user.roleId) === parseInt(filterRole);

    return matchesSearch && matchesRole;
  });

  const getRoleName = (user) => {
    // Check if user has role object
    if (user.role && user.role.name) {
      return user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1);
    }
    // Fallback to role_id mapping
    const roles = { 1: 'Guest', 2: 'User', 3: 'Admin' };
    const roleId = user.role_id || user.roleId;
    return roleId ? roles[roleId] : 'No Role Assigned';
  };

  const getStatusName = (statusId) => {
    const statuses = { 1: 'Pending', 2: 'Approved', 3: 'Rejected', 4: 'Deleted' };
    return statuses[statusId] || 'Unknown';
  };

  const getRoleNameById = (roleId) => {
    const roles = { 1: 'Guest', 2: 'User', 3: 'Admin' };
    return roleId ? roles[roleId] : 'No Role Assigned';
  };

  const getStatusBadge = (statusId) => {
    const statuses = { 1: 'pending', 2: 'approved', 3: 'rejected', 4: 'deleted' };
    const status = statuses[statusId] || 'unknown';

    if (status === 'approved') {
      return <CBadge color="success">Approved</CBadge>;
    } else if (status === 'pending') {
      return <CBadge color="warning">Pending</CBadge>;
    } else if (status === 'rejected') {
      return <CBadge color="danger">Rejected</CBadge>;
    } else if (status === 'deleted') {
      return <CBadge color="secondary">Deleted</CBadge>;
    } else {
      return <CBadge color="info">Unknown</CBadge>;
    }
  };

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
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </CAlert>
            )}

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="mb-2"
                >
                  <option value="">All Roles</option>
                  <option value="1">Guest</option>
                  <option value="2">User</option>
                  <option value="3">Admin</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CButton color="primary" onClick={fetchUsers}>
                  Refresh
                </CButton>
              </CCol>
            </CRow>

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
                {filteredUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>{user.id}</CTableDataCell>
                    <CTableDataCell>
                      {user.fullName || user.email}
                      {!user.roleId && !user.role_id && (
                        <CBadge color="warning" className="ms-2">
                          New User
                        </CBadge>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{getRoleName(user)}</CTableDataCell>
                    <CTableDataCell>{getStatusBadge(user.statusId)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-1">
                        <CButton size="sm" color="info" onClick={() => handleEditUser(user)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CFormSelect
                          size="sm"
                          value={user.statusId}
                          onChange={(e) =>
                            handleQuickStatusChange(user.id, parseInt(e.target.value))
                          }
                          style={{ width: 'auto', minWidth: '100px' }}
                          title="Change Status"
                        >
                          <option value={1}>Pending</option>
                          <option value={2}>Approved</option>
                          <option value={3}>Rejected</option>
                          <option value={4}>Deleted</option>
                        </CFormSelect>
                        <CFormSelect
                          size="sm"
                          value={user.roleId || ''}
                          onChange={(e) => handleQuickRoleChange(user.id, parseInt(e.target.value))}
                          style={{ width: 'auto', minWidth: '100px' }}
                          title="Change Role"
                        >
                          <option value="">No Role</option>
                          <option value={1}>Guest</option>
                          <option value={2}>User</option>
                          <option value={3}>Admin</option>
                        </CFormSelect>
                        <CButton size="sm" color="danger" onClick={() => handleDeleteUser(user)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        {/* Edit User Modal */}
        <ConfirmationModal
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          onConfirm={handleUpdateUser}
          title={`Edit User: ${selectedUser?.firstName} ${selectedUser?.lastName}`}
          isForm={true}
          formData={editForm}
          onFormChange={setEditForm}
          formFields={[
            {
              name: 'firstName',
              label: 'First Name',
              type: 'text',
              placeholder: 'Enter first name',
            },
            {
              name: 'lastName',
              label: 'Last Name',
              type: 'text',
              placeholder: 'Enter last name',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter email address',
            },
            {
              name: 'roleId',
              label: 'Role',
              type: 'select',
              options: [
                { value: '', label: 'No Role Assigned' },
                { value: '1', label: 'Guest' },
                { value: '2', label: 'User' },
                { value: '3', label: 'Admin' },
              ],
            },
            {
              name: 'statusId',
              label: 'Status',
              type: 'select',
              options: [
                { value: '1', label: 'Pending' },
                { value: '2', label: 'Approved' },
                { value: '3', label: 'Rejected' },
                { value: '4', label: 'Deleted' },
              ],
            },
          ]}
          cancelText="Cancel"
          confirmText="Update User"
          confirmColor="primary"
          error={error}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          body={`Are you sure you want to delete user "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
          cancelText="Cancel"
          confirmText="Delete User"
          confirmColor="danger"
        />

        {/* Status Change Confirmation Modal */}
        <ConfirmationModal
          visible={showStatusModal}
          onCancel={() => setShowStatusModal(false)}
          onConfirm={handleConfirmStatusChange}
          title="Change User Status"
          body={`Are you sure you want to change the status to "${getStatusName(
            quickChangeData.newValue
          )}"?`}
          cancelText="Cancel"
          confirmText="Update Status"
          confirmColor="primary"
        />

        {/* Role Change Confirmation Modal */}
        <ConfirmationModal
          visible={showRoleModal}
          onCancel={() => setShowRoleModal(false)}
          onConfirm={handleConfirmRoleChange}
          title="Change User Role"
          body={`Are you sure you want to change the role to "${getRoleNameById(
            quickChangeData.newValue
          )}"?`}
          cancelText="Cancel"
          confirmText="Update Role"
          confirmColor="primary"
        />
      </CContainer>
    </div>
  );
};

export default AdminDashboard;
