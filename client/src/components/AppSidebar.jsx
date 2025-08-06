import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CCloseButton,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CSidebarBrand,
  CBadge
} from '@coreui/react';

import navigation from '../_nav';
import { AppSidebarNav } from './AppSidebarNav';
import { logout } from './../redux/auth/authSlice';
import ConfirmationModal from './Modals/ConfirmationModal';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [showModal, setShowModal] = useState(false);
  const [driveConnected, setDriveConnected] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const checkDriveConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      const response = await fetch(`${baseUrl}/admin/drive-connection`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDriveConnected(data.connected);
    } catch (error) {
      console.error('Drive connection check error:', error);
      setDriveConnected(false);
    }
  };

  useEffect(() => {
    checkDriveConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkDriveConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Add drive status to navigation
  const navigationWithStatus = [
    ...navigation,
    {
      component: () => (
        <div className="d-flex justify-content-between align-items-center px-3 py-2">
          <span className="text-white-50 small">Google Drive</span>
          <CBadge
            color={driveConnected ? 'success' : 'secondary'}
            size="sm"
          >
            {driveConnected ? 'Connected' : 'Disconnected'}
          </CBadge>
        </div>
      ),
      name: 'Drive Status'
    }
  ];

  return (
    <>
      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
      >
        <CSidebarHeader className="border-bottom d-flex justify-content-between align-items-center px-3">
          <CSidebarBrand to="/" />
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>

        <AppSidebarNav items={navigationWithStatus} />

        <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center align-items-center p-3">
          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            <CSidebarToggler />
            <span className="text-white small">Logout</span>
          </div>
        </CSidebarFooter>
      </CSidebar>

      <ConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        body="Are you sure you want to log out?"
        cancelText="Cancel"
        confirmText="Logout"
        confirmColor="danger"
      />
    </>
  );
};

export default React.memo(AppSidebar);