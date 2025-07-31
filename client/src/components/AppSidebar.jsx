import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CBadge,
  CSpinner
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../_nav';
import { logout } from './../redux/auth/authSlice';
import ConfirmationModal from './Modals/ConfirmationModal';
import GoogleAuthButton from './GoogleAuthButton';
import googleDriveService from '../services/googleDriveService';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [showModal, setShowModal] = useState(false);
  const [driveStatus, setDriveStatus] = useState(null); // Will hold the drive status object

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const checkDriveConnection = async () => {
    try {
      const status = await googleDriveService.checkConnection();
      setDriveStatus(status);
    } catch (error) {
      console.error('Drive connection check error:', error);
      setDriveStatus({ success: false, authenticated: false, sessionValid: false });
    }
  };

  const fetchAndDownloadFiles = async () => {
    try {
      const result = await googleDriveService.downloadFiles();
    } catch (error) {
      console.error('Auto download error:', error);
    }
  };

  useEffect(() => {
    // Check connection immediately
    checkDriveConnection();

    // Set up interval for checking connection
    const connectionInterval = setInterval(checkDriveConnection, 30000); // Check every 30 seconds

    return () => {
      clearInterval(connectionInterval);
    };
  }, []); // Empty dependency array - run only once

  // Separate useEffect for download interval that depends on driveStatus
  useEffect(() => {
    if (!driveStatus) {
      return; // Don't start interval until we have status
    }

    const downloadInterval = setInterval(() => {
      if (googleDriveService.isConnected(driveStatus)) {
        fetchAndDownloadFiles();
      } else {
        console.log('Drive not connected, skipping download');
      }
    }, 10000); // Download every 10 seconds for testing (was 60000)

    return () => {
      console.log('Cleaning up download interval');
      clearInterval(downloadInterval);
    };
  }, [driveStatus]); // Depends on driveStatus

  const renderDriveStatus = () => {
    const statusDisplay = googleDriveService.getStatusDisplay(driveStatus);

    if (statusDisplay === 'loading') return <CSpinner size="sm" color="light" />;
    if (statusDisplay === 'connected') return <CBadge color="success" className="px-2">🟢 Drive</CBadge>;
    return <CBadge color="danger" className="px-2">🔴 Drive</CBadge>;
  };

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
          <div className="text-white">{renderDriveStatus()}</div>
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>

        <AppSidebarNav items={navigation} />
        <GoogleAuthButton driveStatus={driveStatus} />

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