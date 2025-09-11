import React from 'react';
import Users from '../../components/Admin/UserDashboard/Users';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSidebarWidth } from "../../hooks/useSidebarWidth";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const UsersDashboard = () => {
  const sidebarWidth = useSidebarWidth();

  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <DefaultLayout>
          <div
            className="users-dashboard-page"
            style={{
              marginLeft: sidebarWidth,
              width: `calc(100vw - ${sidebarWidth}px)`,
              transition: 'margin-left 0.3s ease, width 0.3s ease',
              padding: '20px',
              minHeight: '100vh',
              backgroundColor: '#f8f9fa'
            }}
          >
            <Users />
          </div>
        </DefaultLayout>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default UsersDashboard;