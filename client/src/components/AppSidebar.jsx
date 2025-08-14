import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import './AppSidebar.css';
import { colors } from '../styles/colors';
import { setDriveConnected } from '../redux/sidebar/sidebarSlice';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();

  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName);

  const driveConnected = useSelector((state) => state.sidebar.driveConnected);
  const [isHovered, setIsHovered] = useState(false);

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
          backgroundColor: isDarkMode ? '#432e62df' : '#bfaee5ff',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src={isDarkMode ? '/SymphonyLogoDarkTheme.jpeg' : '/SymphonyLogoLightTheme.jpeg'}
            alt="Logo"
          />
        </div>

        <CCloseButton
          className="d-lg-none"
          dark={isDarkMode}
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
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
          <CSidebarToggler
            onClick={() =>
              dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
            }
          />
        </CSidebarFooter>
      </CSidebar>
    </>
  );
};


export default React.memo(AppSidebar);