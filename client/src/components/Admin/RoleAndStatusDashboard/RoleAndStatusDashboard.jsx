import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RolesStatusesTable from '../../Tables/RolesStatusesTable';
import '../../../styles/shared/CommonStyles.css';
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
import {
    CRow, CCol,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react';

const RoleAndStatusDashboard = () => {
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

    return (
        <CRow className="user-dashboard-container">
            <CCol>
                <CCard>
                    <CCardHeader>
                        <h4 className="user-dashboard-title">Role & Status Management</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol md={6} className="pr-3">
                                <RolesStatusesTable
                                    title="Role"
                                    data={roles}
                                    nameKey="role"
                                    onAdd={handleAddRole}
                                    onDelete={(id) => dispatch(deleteRole(id))}
                                />
                            </CCol>
                            <CCol md={6} className="pl-3">
                                <RolesStatusesTable
                                    title="Status"
                                    data={statuses}
                                    nameKey="status"
                                    onAdd={handleAddStatus}
                                    onDelete={(id) => dispatch(deleteStatus(id))}
                                />
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

    );
};

export default RoleAndStatusDashboard;
