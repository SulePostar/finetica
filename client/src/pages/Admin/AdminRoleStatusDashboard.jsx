import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import RoleStatusDashboard from '../../components/Admin/Role and Status dashboard/RoleStatusDashboard';

const AdminRoleStatusDashboard = () => {
    return (
        <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1 px-3">
                    <RoleStatusDashboard />
                </div>
            </div>
        </>
    );
};

export default AdminRoleStatusDashboard;
