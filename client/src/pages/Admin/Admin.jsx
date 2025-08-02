import React from 'react';
import { AppHeader, AppSidebar } from '../../components/index';
import AdminDashboard from '../../components/Admin/AdminDashboard';

const Admin = () => {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AdminDashboard />
        </div>
      </div>
    </>
  );
};

export default Admin;
