import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CCloseButton,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CBadge,
} from '@coreui/react';

import navigation from '../_nav';
import { AppSidebarNav } from './AppSidebarNav';
import { logout } from './../redux/auth/authSlice';
import ConfirmationModal from './Modals/ConfirmationModal';
import './AppSidebar.css';
import { colors } from '../styles/colors';
import { setShowModal, setDriveConnected } from '../redux/sidebar/sidebarSlice';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName);

  const showModal = useSelector((state) => state.sidebar.showModal);
  const driveConnected = useSelector((state) => state.sidebar.driveConnected);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const checkDriveConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      const response = await fetch(`${baseUrl}/drive/drive-connection`, {
        credentials: 'include',
      });
      const data = await response.json();
      dispatch(setDriveConnected(data.connected));
    } catch (error) {
      console.error('Drive connection check error:', error);
      dispatch(setDriveConnected(false));
    }
  };

  useEffect(() => {
    checkDriveConnection();
    const interval = setInterval(checkDriveConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredNav = navigation
    .map((item) => {
      const isAdmin = userRole === 'admin';

      if (item.component?.displayName === 'CNavGroup' && item.items) {
        if (item.adminOnly && !isAdmin) return null;
        const filteredItems = item.items.filter(
          (child) => !child.adminOnly || isAdmin
        );
        if (filteredItems.length === 0) return null;
        return { ...item, items: filteredItems };
      }

      if (item.component?.displayName === 'CNavTitle') {
        if (item.adminOnly && !isAdmin) return null;
        return item;
      }

      if (item.adminOnly && !isAdmin) return null;
      return item;
    })
    .filter(Boolean);

  return (
    <>
      <CSidebar
        className={`border-end sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''} ${unfoldable && isHovered ? 'sidebar-hover-expanded' : ''}`}
        colorScheme={isDarkMode ? 'dark' : 'light'}
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        style={{
          zIndex: unfoldable && isHovered ? 1060 : 1050,
          transition: 'z-index 0.1s ease',
          backgroundColor: isDarkMode ? '#432e62df' : '#d8d3e4ff',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CSidebarHeader className="border-bottom">
          <CCloseButton
            className="d-lg-none"
            dark={isDarkMode}
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>

        <AppSidebarNav items={filteredNav} />

        {/* Google Drive Status */}
        <div
          className="border-top d-none d-lg-flex justify-content-between align-items-center px-3 py-2"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className="fw-semibold small"
            style={{
              color: isDarkMode ? '#ffffff' : '#212529',
            }}
          >
            Google Drive
          </div>

          <CBadge
            size="sm"
            style={{
              backgroundColor: driveConnected
                ? colors.success.background
                : isDarkMode
                  ? colors.white
                  : colors.textPrimary,
              color: driveConnected
                ? colors.success.text
                : isDarkMode
                  ? colors.error.text
                  : colors.textPrimary,
            }}
          >
            {driveConnected ? 'Connected' : 'Disconnected'}
          </CBadge>
        </div>

        {/* Footer */}
        <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center align-items-center p-3">
          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
            onClick={() => dispatch(setShowModal(true))}
          >
            <CSidebarToggler
              onClick={() =>
                dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
              }
            />
            <span
              className="small"
              style={{ color: isDarkMode ? colors.white : colors.textPrimary }}
            >
              Logout
            </span>
          </div>
        </CSidebarFooter>
      </CSidebar>

      <ConfirmationModal
        visible={showModal}
        onCancel={() => dispatch(setShowModal(false))}
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
