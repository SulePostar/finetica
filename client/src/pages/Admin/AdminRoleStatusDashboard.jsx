import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import RoleStatusDashboard from '../../components/Admin/RoleAndStatusDashboard/RoleStatusDashboard.jsx';
import { useSidebarWidth } from '../../hooks/useSidebarWidth';
import '../../styles/shared/CommonStyles.css';
import '../../styles/TablePages.css';

const AdminRoleStatusDashboard = () => {
    const sidebarWidth = useSidebarWidth();

    return (
        <DefaultLayout>
            <div
                className="table-page-outer"
                style={{
                    marginLeft: sidebarWidth,
                    width: `calc(100vw - ${sidebarWidth}px)`,
                }}
            >
                <div className="table-content-wrapper">
                    <RoleStatusDashboard />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AdminRoleStatusDashboard;
