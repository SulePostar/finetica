import React from 'react';
import { AppHeader, AppSidebar, UserDashboard } from '../../components/index';
import Users from '../../components/Admin/UserDashboard/Users';
import DefaultLayout from '../../layout/DefaultLayout'
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
const UsersDashboard = () => {
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
        <Users />
      </div>
    </DefaultLayout>
  );
};
export default UsersDashboard;