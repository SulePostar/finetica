import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout.jsx';
import RoleAndStatusDashboard from '../../components/Admin/RoleAndStatusDashboard/RoleAndStatusDashboard.jsx';
import { useSidebarWidth } from '../../hooks/useSidebarWidth.js';
import '../../styles/shared/CommonStyles.css';
import '../../styles/TablePages.css';

const RoleStatusDashboard = () => {
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
                    <RoleAndStatusDashboard />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default RoleStatusDashboard;
