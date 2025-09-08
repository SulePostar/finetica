import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EntityManagementTable from '../../Tables/EntityManagementTable.jsx';
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

    const handleAddRole = async (payload) => {
        const result = await dispatch(addRole(payload));
        if (!result.error) {
            dispatch(fetchRoles());
        }
    };

    const handleAddStatus = async (payload) => {
        const result = await dispatch(addStatus(payload));
        if (!result.error) {
            dispatch(fetchStatuses());
        }
    };

    const handleDeleteRole = async (roleId) => {
        const result = await dispatch(deleteRole(roleId));
        if (!result.error) {
            dispatch(fetchRoles());
        }
    };

    const handleDeleteStatus = async (statusId) => {
        const result = await dispatch(deleteStatus(statusId));
        if (!result.error) {
            dispatch(fetchStatuses());
        }
    };

    return (
        <div className="row g-4">
            <div className="col-lg-6">
                <EntityManagementTable
                    title="Roles"
                    data={roles}
                    nameKey="role"
                    onAdd={handleAddRole}
                    onDelete={handleDeleteRole}
                    loading={rolesLoading}
                    error={rolesError}
                    success={rolesSuccess}
                    onClearError={() => dispatch(clearRolesError())}
                    onClearSuccess={() => dispatch(clearRolesSuccess())}
                />
            </div>
            <div className="col-lg-6">
                <EntityManagementTable
                    title="Statuses"
                    data={statuses}
                    nameKey="status"
                    onAdd={handleAddStatus}
                    onDelete={handleDeleteStatus}
                    loading={statusesLoading}
                    error={statusesError}
                    success={statusesSuccess}
                    onClearError={() => dispatch(clearStatusesError())}
                    onClearSuccess={() => dispatch(clearStatusesSuccess())}
                />
            </div>
        </div>
    );
};

export default RoleStatusDashboard;