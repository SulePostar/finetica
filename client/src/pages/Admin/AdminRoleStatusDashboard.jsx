import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import RoleStatusDashboard from '../../components/Admin/Role and Status dashboard/RoleStatusDashboard';
import DefaultLayout from '../../layout/DefaultLayout';

const AdminRoleStatusDashboard = () => {
    return (
        <>
            <DefaultLayout>
                <div className="body flex-grow-1 px-3">
                    <RoleStatusDashboard />
                </div>
            </DefaultLayout>
        </>
    );
};

export default AdminRoleStatusDashboard;
