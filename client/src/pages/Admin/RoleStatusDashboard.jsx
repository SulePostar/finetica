import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout.jsx';
import RoleAndStatusDashboard from '../../components/Admin/RoleAndStatusDashboard/RoleAndStatusDashboard.jsx';
import { useSidebarWidth } from '../../hooks/useSidebarWidth.js';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const RoleStatusDashboard = () => {
    const sidebarWidth = useSidebarWidth();

    return (
        <MantineProvider>
            <Notifications />
            <DefaultLayout>
                <div
                    className="role-status-dashboard-page"
                    style={{
                        marginLeft: sidebarWidth,
                        width: `calc(100vw - ${sidebarWidth}px)`,
                        transition: 'margin-left 0.3s ease, width 0.3s ease',
                        padding: '20px',
                        minHeight: '100vh',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <RoleAndStatusDashboard />
                </div>
            </DefaultLayout>
        </MantineProvider>
    );
};

export default RoleStatusDashboard;
