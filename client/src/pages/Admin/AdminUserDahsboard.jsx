import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import UserDashboard from '../../components/Admin/User dahboard/UserDashboard';
import DefaultLayout from '../../layout/DefaultLayout'
import { useSidebarWidth } from "../../hooks/useSidebarWidth";

const AdminUserDashboard = () => {
    const sidebarWidth = useSidebarWidth();
  return (
    <DefaultLayout>
      <div
        className="role-status-dashboard-page"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        <UserDashboard />
      </div>
    </DefaultLayout>
  );
};

export default AdminUserDashboard;
