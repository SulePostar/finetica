import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import UserDashboard from '../../components/Admin/User dahboard/UserDashboard';

const AdminUserDashboard = () => {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <UserDashboard />
        </div>
      </div>
    </>
  );
};

export default AdminUserDashboard;
