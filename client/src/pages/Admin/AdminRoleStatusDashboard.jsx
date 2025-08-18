import React from "react";
import RoleStatusDashboard from "../../components/Admin/Role and Status dashboard/RoleStatusDashboard";
import DefaultLayout from "../../layout/DefaultLayout";
import { useSidebarWidth } from "../../hooks/useSidebarWidth";

const AdminRoleStatusDashboard = () => {
  const sidebarWidth = useSidebarWidth();

  return (
    <DefaultLayout>
      <div
        className="role-status-dashboard-page"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
          transition: 'margin-left 0.3s ease, width 0.3s ease',
        }}
      >
        <RoleStatusDashboard />
      </div>
    </DefaultLayout>
  );
};

export default AdminRoleStatusDashboard;
