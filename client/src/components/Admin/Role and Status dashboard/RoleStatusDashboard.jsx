import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RolesStatusesTable from '../../Tables/RolesStatusesTable';
import {
    fetchRoles,
    addRole,
    selectRoles,
    deleteRole,
} from '../../../redux/roles/rolesSlice';
import {
    fetchStatuses,
    addStatus,
    selectStatuses,
    deleteStatus,
} from '../../../redux/statuses/statusesSlice';
import { useSidebarWidth } from '../../../hooks/useSidebarWidth';

const RoleStatusDashboard = () => {
    const dispatch = useDispatch();
    const roles = useSelector(selectRoles);
    const statuses = useSelector(selectStatuses);

    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchStatuses());
    }, [dispatch]);

    const handleAddRole = (payload) => {
        dispatch(addRole(payload)).then((res) => {
            if (!res.error) dispatch(fetchRoles());
        });
    };

    const handleAddStatus = (payload) => {
        dispatch(addStatus(payload)).then((res) => {
            if (!res.error) dispatch(fetchStatuses());
        });
    };

    const handleDeleteRole = (roleId) => {
        dispatch(deleteRole(roleId));
    };

    const handleDeleteStatus = (statusId) => {
        dispatch(deleteStatus(statusId));
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '20px',
                width: '100%',
                padding: '20px',
                transition: 'all 0.3s ease',

            }}
        >
            <div style={{ flex: 1 }}>
                <RolesStatusesTable
                    title="Roles"
                    data={roles}
                    nameKey="role"
                    onAdd={handleAddRole}
                    onDelete={handleDeleteRole}
                />
            </div>
            <div style={{ flex: 1 }}>
                <RolesStatusesTable
                    title="Statuses"
                    data={statuses}
                    nameKey="status"
                    onAdd={handleAddStatus}
                    onDelete={handleDeleteStatus}
                />
            </div>
        </div>
    );
};

export default RoleStatusDashboard;
