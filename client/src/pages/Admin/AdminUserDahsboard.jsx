import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import UserDashboard from '../../components/Admin/User dahboard/UserDashboard';
import DefaultLayout from '../../layout/DefaultLayout'

const AdminUserDashboard = () => {
  return (
    <>
      <DefaultLayout>
        <div className="body flex-grow-1 px-3">
          <UserDashboard />
        </div>
      </DefaultLayout>
    </>
  );
};

export default AdminUserDashboard;
