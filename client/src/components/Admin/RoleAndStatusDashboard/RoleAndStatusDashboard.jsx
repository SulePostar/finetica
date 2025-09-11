import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Grid,
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
    SimpleGrid
} from '@mantine/core';
import {
    IconPlus,
    IconTrash,
    IconShield,
    IconUserCheck,
    IconAlertCircle,
    IconCheck,
    IconX,
    IconUsers,
    IconSettings
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    fetchRoles,
    addRole,
    selectRoles,
    selectRolesLoading,
    selectRolesError,
    selectRolesSuccess,
    deleteRole,
    clearRolesError,
    clearRolesSuccess
} from '../../../redux/roles/rolesSlice.js';
import {
    fetchStatuses,
    addStatus,
    selectStatuses,
    selectStatusesLoading,
    selectStatusesError,
    selectStatusesSuccess,
    deleteStatus,
    clearStatusesError,
    clearStatusesSuccess
} from '../../../redux/statuses/statusesSlice.js';

const RoleStatusDashboard = () => {
    const dispatch = useDispatch();
    const [addRoleModalOpened, { open: openAddRoleModal, close: closeAddRoleModal }] = useDisclosure(false);
    const [addStatusModalOpened, { open: openAddStatusModal, close: closeAddStatusModal }] = useDisclosure(false);
    const [deleteRoleModalOpened, { open: openDeleteRoleModal, close: closeDeleteRoleModal }] = useDisclosure(false);
    const [deleteStatusModalOpened, { open: openDeleteStatusModal, close: closeDeleteStatusModal }] = useDisclosure(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Roles selectors
    const roles = useSelector(selectRoles);
    const rolesLoading = useSelector(selectRolesLoading);
    const rolesError = useSelector(selectRolesError);
    const rolesSuccess = useSelector(selectRolesSuccess);

    // Statuses selectors
    const statuses = useSelector(selectStatuses);
    const statusesLoading = useSelector(selectStatusesLoading);
    const statusesError = useSelector(selectStatusesError);
    const statusesSuccess = useSelector(selectStatusesSuccess);

    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchStatuses());
    }, [dispatch]);

    // Handle notifications
    useEffect(() => {
        if (rolesError) {
            notifications.show({
                title: 'Error',
                message: rolesError,
                color: 'red',
                icon: <IconX size="1rem" />,
            });
            dispatch(clearRolesError());
        }
    }, [rolesError, dispatch]);

    useEffect(() => {
        if (rolesSuccess) {
            notifications.show({
                title: 'Success',
                message: rolesSuccess,
                color: 'green',
                icon: <IconCheck size="1rem" />,
            });
            dispatch(clearRolesSuccess());
        }
    }, [rolesSuccess, dispatch]);

    useEffect(() => {
        if (statusesError) {
            notifications.show({
                title: 'Error',
                message: statusesError,
                color: 'red',
                icon: <IconX size="1rem" />,
            });
            dispatch(clearStatusesError());
        }
    }, [statusesError, dispatch]);

    useEffect(() => {
        if (statusesSuccess) {
            notifications.show({
                title: 'Success',
                message: statusesSuccess,
                color: 'green',
                icon: <IconCheck size="1rem" />,
            });
            dispatch(clearStatusesSuccess());
        }
    }, [statusesSuccess, dispatch]);

    const handleAddRole = async (roleName) => {
        if (roleName.trim()) {
            setIsSubmitting(true);
            const result = await dispatch(addRole({ role: roleName.trim() }));
            if (!result.error) {
                dispatch(fetchRoles());
                closeAddRoleModal();
            }
            setIsSubmitting(false);
        }
    };

    const handleAddStatus = async (statusName) => {
        if (statusName.trim()) {
            setIsSubmitting(true);
            const result = await dispatch(addStatus({ status: statusName.trim() }));
            if (!result.error) {
                dispatch(fetchStatuses());
                closeAddStatusModal();
            }
            setIsSubmitting(false);
        }
    };

    const handleDeleteRole = async () => {
        if (itemToDelete) {
            setIsSubmitting(true);
            const result = await dispatch(deleteRole(itemToDelete.id));
            if (!result.error) {
                dispatch(fetchRoles());
                setItemToDelete(null);
                closeDeleteRoleModal();
            } else {
                // Optionally show notification on error
            }
            setIsSubmitting(false);
        }
    };

    const handleDeleteStatus = async () => {
        if (itemToDelete) {
            setIsSubmitting(true);
            const result = await dispatch(deleteStatus(itemToDelete.id));
            if (!result.error) {
                dispatch(fetchStatuses());
                setItemToDelete(null);
                closeDeleteStatusModal();
            } else {
                // Optionally show notification on error
            }
            setIsSubmitting(false);
        }
    };

    const openDeleteRoleModalWithItem = (item) => {
        setItemToDelete(item);
        openDeleteRoleModal();
    };

    const openDeleteStatusModalWithItem = (item) => {
        setItemToDelete(item);
        openDeleteStatusModal();
    };

    const getEntityCount = (data) => {
        return Array.isArray(data) ? data.filter(item => item && item.id).length : 0;
    };

    const EntityCard = ({ title, data, nameKey, loading, icon, color, modalOpened, openModal, closeModal, newValue, setNewValue, handleAdd, openDeleteModal }) => {
        const [inputValue, setInputValue] = React.useState("");
        const handleSubmit = () => {
            if (!inputValue.trim()) return;
            handleAdd(inputValue);   // pass up
            setInputValue("");       // reset field
            closeModal();            // close after adding
        };
        const filteredData = Array.isArray(data) ? data.filter(item => item && item.id) : [];

        return (
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between">
                        <Group>
                            <ThemeIcon color={color} size="lg" radius="md">
                                {icon}
                            </ThemeIcon>
                            <div>
                                <Text fw={600} size="lg">{title}</Text>
                                <Text size="sm" c="dimmed">
                                    {getEntityCount(data)} {title.toLowerCase()} total
                                </Text>
                            </div>
                        </Group>
                        <Button
                            leftSection={<IconPlus size="1rem" />}
                            onClick={openModal}
                            size="sm"
                            color={color}
                        >
                            Add {title.slice(0, -1)}
                        </Button>
                    </Group>
                </Card.Section>

                <Card.Section p="md">
                    {loading ? (
                        <Center h={200}>
                            <Stack align="center" gap="md">
                                <Loader size="md" />
                                <Text c="dimmed">Loading {title.toLowerCase()}...</Text>
                            </Stack>
                        </Center>
                    ) : filteredData.length > 0 ? (
                        <ScrollArea h={300}>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>ID</Table.Th>
                                        <Table.Th>{nameKey.charAt(0).toUpperCase() + nameKey.slice(1)}</Table.Th>
                                        <Table.Th w={100}>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredData.map((item) => (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                <Badge variant="light" color="gray">
                                                    #{item.id}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text fw={500}>{item[nameKey]}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <ActionIcon
                                                    color="red"
                                                    variant="light"
                                                    onClick={() => openDeleteModal(item)}
                                                    size="sm"
                                                >
                                                    <IconTrash size="0.875rem" />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    ) : (
                        <Center h={200}>
                            <Stack align="center" gap="md">
                                <ThemeIcon size="xl" color="gray" variant="light">
                                    {icon}
                                </ThemeIcon>
                                <Text c="dimmed" ta="center">
                                    No {title.toLowerCase()} found
                                </Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    Add your first {title.slice(0, -1).toLowerCase()}!
                                </Text>
                            </Stack>
                        </Center>
                    )}
                </Card.Section>

                {/* Add Modal */}
                <Modal
                    opened={modalOpened}
                    onClose={() => {
                        setInputValue("");
                        closeModal();
                    }}
                    title={
                        <Group>
                            <ThemeIcon color={color} size="sm">
                                {icon}
                            </ThemeIcon>
                            Add New {title.slice(0, -1)}
                        </Group>
                    }
                    centered
                >
                    <Stack gap="md">
                        <TextInput
                            label={`${nameKey.charAt(0).toUpperCase() + nameKey.slice(1)} Name`}
                            placeholder={`Enter ${nameKey} name`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.currentTarget.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                        <Group justify="flex-end" gap="sm">
                            <Button variant="light" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!inputValue.trim()}
                                color={color}
                            >
                                Add {title.slice(0, -1)}
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Card>
        );
    };

    return (
        <Container fluid>
            <Stack gap="xl">
                {/* Header */}
                <Paper p="xl" radius="md" withBorder>
                    <Group>
                        <ThemeIcon size="xl" color="blue" variant="light">
                            <IconSettings size="2rem" />
                        </ThemeIcon>
                        <div>
                            <Title order={2}>Role and Status Management</Title>
                            <Text c="dimmed" size="lg">
                                Manage user roles and statuses for your organization
                            </Text>
                        </div>
                    </Group>
                </Paper>

                {/* Cards Grid */}
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                    <EntityCard
                        title="Roles"
                        data={roles}
                        nameKey="role"
                        icon={<IconShield size="1.5rem" />}
                        color="blue"
                        loading={rolesLoading}
                        modalOpened={addRoleModalOpened}
                        openModal={openAddRoleModal}
                        closeModal={closeAddRoleModal}
                        handleAdd={handleAddRole}
                        openDeleteModal={openDeleteRoleModalWithItem}
                    />

                    <EntityCard
                        title="Statuses"
                        data={statuses}
                        nameKey="status"
                        icon={<IconUserCheck size="1.5rem" />}
                        color="green"
                        loading={statusesLoading}
                        modalOpened={addStatusModalOpened}
                        openModal={openAddStatusModal}
                        closeModal={closeAddStatusModal}
                        handleAdd={handleAddStatus}
                        openDeleteModal={openDeleteStatusModalWithItem}
                    />
                </SimpleGrid>

                {/* -------- Parent-level Delete Modals -------- */}

                {/* Delete Role Modal */}
                <Modal
                    opened={deleteRoleModalOpened}
                    onClose={() => { setItemToDelete(null); closeDeleteRoleModal(); }}
                    title={
                        <Group>
                            <ThemeIcon color="red" size="sm">
                                <IconTrash size="1rem" />
                            </ThemeIcon>
                            Delete Role
                        </Group>
                    }
                    centered
                >
                    <Stack gap="md">
                        <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="light">
                            Are you sure you want to delete this role?
                        </Alert>
                        {itemToDelete && (
                            <Paper p="md" withBorder>
                                <Text fw={500}>
                                    <strong>Role:</strong> {itemToDelete.role}
                                </Text>
                            </Paper>
                        )}
                        <Text size="sm" c="red">
                            <strong>Warning:</strong> This action cannot be undone.
                        </Text>
                        <Group justify="flex-end" gap="sm">
                            <Button
                                variant="light"
                                onClick={() => { setItemToDelete(null); closeDeleteRoleModal(); }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                onClick={handleDeleteRole}
                                loading={isSubmitting}
                                disabled={!itemToDelete}
                            >
                                Delete Role
                            </Button>
                        </Group>
                    </Stack>
                </Modal>

                {/* Delete Status Modal */}
                <Modal
                    opened={deleteStatusModalOpened}
                    onClose={() => { setItemToDelete(null); closeDeleteStatusModal(); }}
                    title={
                        <Group>
                            <ThemeIcon color="red" size="sm">
                                <IconTrash size="1rem" />
                            </ThemeIcon>
                            Delete Status
                        </Group>
                    }
                    centered
                >
                    <Stack gap="md">
                        <Alert icon={<IconAlertCircle size="1rem" />} color="red" variant="light">
                            Are you sure you want to delete this status?
                        </Alert>
                        {itemToDelete && (
                            <Paper p="md" withBorder>
                                <Text fw={500}>
                                    <strong>Status:</strong> {itemToDelete.status}
                                </Text>
                            </Paper>
                        )}
                        <Text size="sm" c="red">
                            <strong>Warning:</strong> This action cannot be undone.
                        </Text>
                        <Group justify="flex-end" gap="sm">
                            <Button
                                variant="light"
                                onClick={() => { setItemToDelete(null); closeDeleteStatusModal(); }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                onClick={handleDeleteStatus}
                                loading={isSubmitting}
                                disabled={!itemToDelete}
                            >
                                Delete Status
                            </Button>
                        </Group>
                    </Stack>
                </Modal>

            </Stack>
        </Container>
    );
};

export default RoleStatusDashboard;
