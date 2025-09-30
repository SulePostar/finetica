import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import RoleAndStatusDashboard from '../../components/Admin/RoleAndStatusDashboard/RoleAndStatusDashboard';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/shared/CommonStyles.css';
import '../Admin/RoleStatusDashboard.css';

const RoleStatusDashboard = () => {
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div
                className="role-status-page-wrapper"
                style={{
                    marginLeft: sidebarWidth,
                    width: '90%'
                }}
            >
                <div
                    className="role-status-page-content"
                >
                    <div className="role-status-card">
                        <div className="role-status-header">
                            <h1>Role & Status Management </h1>
                            <p>Manage user roles and approval statuses in one place</p>
                        </div>
                        <RoleAndStatusDashboard />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default RoleStatusDashboard;
