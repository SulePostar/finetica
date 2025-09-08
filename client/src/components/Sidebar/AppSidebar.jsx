import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CSidebar,
  CSidebarFooter,
  CSidebarToggler,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';

import navigation from '../../_nav';
import { AppSidebarNav } from './AppSidebarNav';
import './AppSidebar.css';
import { colors } from '../../styles/colors';
import { setDriveConnected } from '../../redux/sidebar/sidebarSlice';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();

  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName);
  const driveConnected = useSelector((state) => state.sidebar.driveConnected);

  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Check Google Drive connection
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

  useEffect(() => {
    if (sidebarShow && windowWidth <= 768) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [sidebarShow, windowWidth]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredNav = useMemo(() => {
    if (!navigation || !Array.isArray(navigation)) return [];

    return navigation
      .map((item) => {
        const isAdmin = userRole === 'admin';
        if (!item.component) return null;

        if (item.component.displayName === 'CNavGroup' && item.items) {
          if (item.adminOnly && !isAdmin) return null;

          if ((unfoldable && !isHovered) || windowWidth <= 576) {
            return { ...item, items: [] };
          }

          const filteredItems = item.items.filter(
            (child) => !child.adminOnly || isAdmin
          );
          if (filteredItems.length === 0) return null;
          return { ...item, items: filteredItems };
        }

        if (item.component.displayName === 'CNavTitle') {
          if (item.adminOnly && !isAdmin) return null;
          return item;
        }

        if (item.adminOnly && !isAdmin) return null;
        return item;
      })
      .filter(Boolean);
  }, [userRole, unfoldable, isHovered, windowWidth]);

  const handleNavItemClick = () => {
    if (windowWidth < 768) {
      dispatch({ type: 'set', sidebarShow: false });
    }
  };

  return (
    <>
      <CSidebar
        className={`
          sidebar border-end
          position-fixed top-0 start-0 vh-100
          ${sidebarShow ? 'show' : ''}
          ${unfoldable ? 'sidebar-unfoldable' : ''}
        `}
        data-bs-theme={isDarkMode ? 'dark' : 'light'}
        unfoldable={unfoldable}
        visible={sidebarShow}
        onClick={handleNavItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          zIndex: unfoldable && isHovered ? 1060 : 1050,
          backgroundColor: isDarkMode ? '#432e62df' : '#bfaee5ff',
          width:
            windowWidth <= 576
              ? '100%' // mobile fullscreen
              : unfoldable && !isHovered
                ? '56px' // collapsed
                : '240px', // expanded
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo d-flex align-items-center justify-content-center py-2">
          <img
            src={
              isDarkMode
                ? '/SymphonyLogoDarkTheme.jpeg'
                : '/SymphonyLogoLightTheme.jpeg'
            }
            alt="Logo"
          />
        </div>

        <AppSidebarNav items={filteredNav} />

        {/* Google Drive Status */}
        {unfoldable && !isHovered ? (
          <div className="border-top d-none d-lg-flex justify-content-center align-items-center p-3">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: driveConnected
                  ? colors.success.background
                  : colors.error.background,
              }}
            >
              <CIcon
                icon={cilCloudDownload}
                style={{
                  color: driveConnected ? colors.success.text : colors.error.text,
                  fontSize: '16px',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="border-top d-none d-lg-flex justify-content-between align-items-center px-3 py-2">
            <div
              className="fw-semibold small text-body"
              style={{ color: isDarkMode ? '#fff' : '#212529' }}
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
        )}

        {/* Footer */}
        <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center align-items-center p-3">
          <CSidebarToggler
            onClick={() =>
              dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
            }
          />
        </CSidebarFooter>
      </CSidebar>

      {/* Mobile fullscreen backdrop */}
      {sidebarShow && windowWidth <= 576 && (
        <div
          className="sidebar-backdrop position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      )}
    </>
  );
};

export default React.memo(AppSidebar);