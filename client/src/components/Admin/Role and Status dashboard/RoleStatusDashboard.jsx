import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RolesStatusesTable from '../../Tables/RolesStatusesTable';
import {
    fetchRoles,
    addRole,
    selectRoles,
    deleteRole
} from '../../../redux/roles/rolesSlice';
import {
    fetchStatuses,
    addStatus,
    selectStatuses,
    deleteStatus
} from '../../../redux/statuses/statusesSlice';

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
        <div className="row mt-4">
            <div className="col-md-6 mb-4">
                <RolesStatusesTable
                    title="Roles"
                    data={roles}
                    nameKey="role"
                    onAdd={handleAddRole}
                    onDelete={handleDeleteRole}
                />
            </div>
            <div className="col-md-6 mb-4">
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
