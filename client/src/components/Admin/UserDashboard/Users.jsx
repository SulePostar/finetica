import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  ActionIcon,
  TextInput,
  Button,
  Modal,
  Table,
  ScrollArea,
  Stack,
  Alert,
  Loader,
  Center,
  ThemeIcon,
  Divider,
  Box,
  Paper,
  SimpleGrid,
  Select,
  Pagination,
  Textarea,
  Switch,
  Grid,
  Avatar,
  Menu,
  UnstyledButton,
  Tooltip,
  Progress,
  RingProgress,
  rem
} from '@mantine/core';
import {
  IconSearch,
  IconRefresh,
  IconEdit,
  IconTrash,
  IconUser,
  IconUsers,
  IconShield,
  IconUserCheck,
  IconUserX,
  IconMail,
  IconCalendar,
  IconSettings,
  IconDots,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconPlus,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconEye,
  IconLock,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

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

import { filterUsers, getRoleName, getStatusBadge, isNewUser } from '../../../utilis/formatters';

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
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Form states for editing
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
  }, [dispatch]);

  // Handle notifications
  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Error',
        message: error,
        color: 'red',
        icon: <IconX size="1rem" />,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      notifications.show({
        title: 'Success',
        message: success,
        color: 'green',
        icon: <IconCheck size="1rem" />,
      });
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm, filterRole);
  }, [users, searchTerm, filterRole]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';

      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [filteredUsers, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditUser = useCallback((user) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || ''
    });
    openEditModal();
  }, [openEditModal]);

  const handleUpdateUser = useCallback(() => {
    if (selectedUser) {
      dispatch(updateUser({ userId: selectedUser.id, userData: editFormData }));
      closeEditModal();
    }
  }, [dispatch, selectedUser, editFormData, closeEditModal]);

  const handleDeleteUser = useCallback((user) => {
    modals.openConfirmModal({
      title: 'Delete User',
      children: (
        <Text size="sm">
          Are you sure you want to delete user <strong>{user.fullName}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        dispatch(deleteUser(user.id));
        notifications.show({
          title: 'User Deleted',
          message: `User ${user.fullName} has been deleted`,
          color: 'red',
        });
      },
    });
  }, [dispatch]);

  const handleQuickStatusChange = useCallback(
    (userId, newStatusId) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        dispatch(quickChangeUserStatus({ userId, statusId: newStatusId }));
        notifications.show({
          title: 'Status Updated',
          message: `User status has been updated`,
          color: 'blue',
        });
      }
    },
    [dispatch, users]
  );

  const handleQuickRoleChange = useCallback(
    (userId, newRoleId) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        dispatch(quickChangeUserRole({ userId, roleId: newRoleId }));
        notifications.show({
          title: 'Role Updated',
          message: `User role has been updated`,
          color: 'blue',
        });
      }
    },
    [dispatch, users]
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    if (!status) return 'gray';

    const statusName = status.status.toLowerCase();
    if (statusName.includes('active')) return 'green';
    if (statusName.includes('inactive')) return 'red';
    if (statusName.includes('pending')) return 'yellow';
    return 'blue';
  };

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return 'gray';

    const roleName = role.role.toLowerCase();
    if (roleName.includes('admin')) return 'red';
    if (roleName.includes('user')) return 'blue';
    if (roleName.includes('manager')) return 'orange';
    return 'gray';
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => {
      const status = statuses.find(s => s.id === user.statusId);
      return status && status.status.toLowerCase().includes('active');
    }).length;
    const adminUsers = users.filter(user => {
      const role = roles.find(r => r.id === user.roleId);
      return role && role.role.toLowerCase().includes('admin');
    }).length;
    const newUsers = users.filter(user => isNewUser(user)).length;

    return { totalUsers, activeUsers, adminUsers, newUsers };
  }, [users, statuses, roles]);

  if (loading) {
    return (
      <Container fluid>
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="xl" />
            <Text c="dimmed" size="lg">Loading users...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Stack gap="xl">
        {/* Header */}
        <Paper p="xl" radius="md" withBorder>
          <Group>
            <ThemeIcon size="xl" color="blue" variant="light">
              <IconUsers size="2rem" />
            </ThemeIcon>
            <div>
              <Title order={2}>User Management Dashboard</Title>
              <Text c="dimmed" size="lg">
                Manage users, roles, and permissions
              </Text>
            </div>
          </Group>
        </Paper>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" fw={500}>Total Users</Text>
                <Text fw={700} size="xl">{stats.totalUsers}</Text>
              </div>
              <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                <IconUsers size="1.5rem" />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" fw={500}>Active Users</Text>
                <Text fw={700} size="xl" c="green">{stats.activeUsers}</Text>
              </div>
              <ThemeIcon color="green" variant="light" size="lg" radius="md">
                <IconUserCheck size="1.5rem" />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" fw={500}>Admin Users</Text>
                <Text fw={700} size="xl" c="red">{stats.adminUsers}</Text>
              </div>
              <ThemeIcon color="red" variant="light" size="lg" radius="md">
                <IconShield size="1.5rem" />
              </ThemeIcon>
            </Group>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm" fw={500}>New Users</Text>
                <Text fw={700} size="xl" c="orange">{stats.newUsers}</Text>
              </div>
              <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                <IconUser size="1.5rem" />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Search and Filters */}
        <Card withBorder p="md" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>Users</Title>
            <Button
              leftSection={<IconRefresh size="1rem" />}
              onClick={handleRefresh}
              variant="light"
            >
              Refresh
            </Button>
          </Group>

          <Group mb="md">
            <TextInput
              placeholder="Search users..."
              leftSection={<IconSearch size="1rem" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by role"
              data={[
                { value: '', label: 'All Roles' },
                ...roles.map(role => ({
                  value: role.id.toString(),
                  label: role.role.charAt(0).toUpperCase() + role.role.slice(1)
                }))
              ]}
              value={filterRole}
              onChange={(value) => setFilterRole(value || '')}
              style={{ width: 200 }}
            />
          </Group>

          {/* Users Table */}
          <ScrollArea>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <UnstyledButton onClick={() => handleSort('fullName')}>
                      <Group gap="xs">
                        <Text fw={600}>Name</Text>
                        {sortField === 'fullName' && (
                          sortDirection === 'asc' ? <IconSortAscending size="0.875rem" /> : <IconSortDescending size="0.875rem" />
                        )}
                      </Group>
                    </UnstyledButton>
                  </Table.Th>
                  <Table.Th>
                    <UnstyledButton onClick={() => handleSort('email')}>
                      <Group gap="xs">
                        <Text fw={600}>Email</Text>
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? <IconSortAscending size="0.875rem" /> : <IconSortDescending size="0.875rem" />
                        )}
                      </Group>
                    </UnstyledButton>
                  </Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedUsers.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  const role = roles.find(r => r.id === user.roleId);
                  const status = statuses.find(s => s.id === user.statusId);

                  return (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size="sm" color="blue">
                            {user.firstName?.charAt(0) || user.email.charAt(0)}
                          </Avatar>
                          <div>
                            <Text fw={500}>{user.fullName}</Text>
                            {isNewUser(user) && (
                              <Badge size="xs" color="green" variant="light">
                                New
                              </Badge>
                            )}
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconMail size="0.875rem" color="gray" />
                          <Text size="sm" c="dimmed">{user.email}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getRoleColor(user.roleId)}
                          variant="light"
                          size="sm"
                        >
                          {role ? role.role.charAt(0).toUpperCase() + role.role.slice(1) : 'No Role'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getStatusColor(user.statusId)}
                          variant="light"
                          size="sm"
                        >
                          {status ? status.status.charAt(0).toUpperCase() + status.status.slice(1) : 'Unknown'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Select
                            placeholder="Status"
                            size="xs"
                            data={statuses.map(s => ({
                              value: s.id.toString(),
                              label: s.status.charAt(0).toUpperCase() + s.status.slice(1)
                            }))}
                            value={user.statusId?.toString() || ''}
                            onChange={(value) => value && handleQuickStatusChange(user.id, parseInt(value))}
                            disabled={changingStatus || statusesLoading}
                            style={{ width: 100 }}
                          />
                          <Select
                            placeholder="Role"
                            size="xs"
                            data={[
                              { value: '', label: 'No Role' },
                              ...roles.map(r => ({
                                value: r.id.toString(),
                                label: r.role.charAt(0).toUpperCase() + r.role.slice(1)
                              }))
                            ]}
                            value={user.roleId?.toString() || ''}
                            onChange={(value) => value && handleQuickRoleChange(user.id, parseInt(value))}
                            disabled={changingRole || rolesLoading}
                            style={{ width: 100 }}
                          />
                          <Tooltip label="Edit User">
                            <ActionIcon
                              color="blue"
                              variant="light"
                              onClick={() => handleEditUser(user)}
                              disabled={updatingUser || deletingUser}
                            >
                              <IconEdit size="0.875rem" />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete User">
                            <ActionIcon
                              color="red"
                              variant="light"
                              onClick={() => handleDeleteUser(user)}
                              disabled={isSelf || updatingUser || deletingUser}
                            >
                              <IconTrash size="0.875rem" />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
              />
            </Group>
          )}
        </Card>

        {/* Edit User Modal */}
        <Modal
          opened={editModalOpened}
          onClose={closeEditModal}
          title={
            <Group>
              <ThemeIcon color="blue" size="sm">
                <IconEdit size="1rem" />
              </ThemeIcon>
              Edit User: {selectedUser?.fullName}
            </Group>
          }
          centered
        >
          <Stack gap="md">
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              value={editFormData.firstName}
              onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              value={editFormData.lastName}
              onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
            />
            <TextInput
              label="Email"
              placeholder="Enter email address"
              value={editFormData.email}
              onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                loading={updatingUser === selectedUser?.id}
                disabled={!editFormData.firstName.trim() || !editFormData.lastName.trim() || !editFormData.email.trim()}
              >
                Update User
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
};

export default Users;