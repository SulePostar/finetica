import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout.jsx';
import RoleAndStatusDashboard from '../../components/Admin/RoleAndStatusDashboard/RoleAndStatusDashboard.jsx';
import { useSidebarWidth } from '../../hooks/useSidebarWidth.js';
import '../../styles/shared/CommonStyles.css';

const RoleStatusDashboard = () => {
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div
                className="role-status-dashboard-page"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                    transition: 'margin-left 0.3s ease, width 0.3s ease',
                    padding: '50px',
                    minHeight: '100vh'
                }}
            >
                <div className="page-header mb-4">
                    <h2 className="page-title">Role and Status Management</h2>
                    <p className="page-subtitle">
                        Manage roles and statuses for your organization
                    </p>
                </div>
                <RoleAndStatusDashboard />
            </div>
        </DefaultLayout>
    );
};

export default RoleStatusDashboard;
