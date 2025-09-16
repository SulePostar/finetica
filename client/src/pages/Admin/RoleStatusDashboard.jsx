import React from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import RoleAndStatusDashboard from "../../components/Admin/RoleAndStatusDashboard/RoleAndStatusDashboard";
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
import "../../styles/shared/CommonStyles.css";
import "../../styles/TablePages.css";

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
                <div className="role-status-dashboard-page"
                    style={{
                        width: `calc(100vw - ${sidebarWidth}px)`,
                        transition: 'margin-left 0.3s ease, width 0.3s ease',
                    }}>
                    <RoleAndStatusDashboard />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default RoleStatusDashboard;
