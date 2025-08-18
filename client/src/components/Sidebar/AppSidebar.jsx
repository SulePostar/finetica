import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CSidebar,
  CSidebarFooter,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';

import navigation from '../../_nav';
import { AppSidebarNav } from './AppSidebarNav';
import './AppSidebar.css';
import { colors } from '../../styles/colors';
import { setDriveConnected } from '../../redux/sidebar/sidebarSlice';
import DriveStatusBadge from './DriveStatusBadge';

const BP = {
  MOBILE: 992,   // <992 → hidden
  DESKTOP: 1200, // 992–1199 → folded; >=1200 → normal
};

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();

  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName);

  const driveConnected = useSelector((state) => state.sidebar.driveConnected);
  const [isHovered, setIsHovered] = useState(false);

  // ---- Drive status polling ----
  const checkDriveConnection = async () => {
    try {
      const baseUrl = import.meta.env?.VITE_API_BASE_URL?.replace('/api', '') || '';
      const response = await fetch(`${baseUrl}/drive/drive-connection`, {
        credentials: 'include',
      });
      const data = await response.json();
      dispatch(setDriveConnected(Boolean(data.connected)));
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

  // ---- Responsive behavior (debounced & breakpoint-aware) ----
  const lastModeRef = useRef(null);
  const rafRef = useRef(null);

  const computeMode = (w) => {
    if (w < BP.MOBILE) return 'mobile';
    if (w < BP.DESKTOP) return 'tablet';
    return 'desktop';
  };

  const applyMode = (mode) => {
    if (mode === lastModeRef.current) return; // no unnecessary dispatches
    lastModeRef.current = mode;

    if (mode === 'mobile') {
      // Hide and disable unfoldable/hover
      dispatch({ type: 'set', sidebarShow: false });
      dispatch({ type: 'set', sidebarUnfoldable: false });
      setIsHovered(false);
    } else if (mode === 'tablet') {
      // Show folded (hover-to-expand)
      dispatch({ type: 'set', sidebarShow: true });
      dispatch({ type: 'set', sidebarUnfoldable: true });
    } else {
      // Desktop: show, but don't force user's unfoldable preference
      dispatch({ type: 'set', sidebarShow: true });
    }
  };

  const handleResize = () => {
    const w = window.innerWidth;
    const mode = computeMode(w);
    applyMode(mode);
  };

  useEffect(() => {
    // initial
    handleResize();

    // debounced resize via rAF
    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleResize);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dispatch]);

  // ---- Filter navigation by role and collapsed state ----
  const filteredNav = navigation
    .map((item) => {
      const isAdmin = userRole === 'admin';

      if (item.component?.displayName === 'CNavGroup' && item.items) {
        if (item.adminOnly && !isAdmin) return null;

        // remove children when folded and not hovered
        if (unfoldable && !isHovered) {
          return {
            component: item.component,
            name: item.name,
            icon: item.icon,
            adminOnly: item.adminOnly,
            items: [],
          };
        }

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
    <CSidebar
      className={`border-end sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''} ${unfoldable && isHovered ? 'sidebar-hover-expanded' : ''}`}
      colorScheme={isDarkMode ? 'dark' : 'light'}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
      style={{
        zIndex: unfoldable && isHovered ? 1060 : 1050,
        transition: 'z-index 0.1s ease',
        backgroundColor: isDarkMode ? '#432e62df' : '#bfaee5ff',
      }}
      onMouseEnter={() => unfoldable && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src={isDarkMode ? '/SymphonyLogoDarkTheme.jpeg' : '/SymphonyLogoLightTheme.jpeg'}
          alt="Logo"
        />
      </div>

      <AppSidebarNav items={filteredNav} />

      {/* Google Drive Status */}
      {unfoldable && !isHovered ? (
        <div
          className="border-top d-none d-lg-flex justify-content-center align-items-center p-3"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: driveConnected
                ? colors.success.background
                : colors.error.background,
              transition: 'background-color 0.3s ease',
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
        <div
          className="border-top d-flex justify-content-between align-items-center px-3 py-2 drive-status"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className="fw-semibold small"
            style={{ color: isDarkMode ? '#ffffff' : '#212529' }}
          >
            Google Drive
          </div>
          <DriveStatusBadge driveConnected={driveConnected} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Footer */}
      <CSidebarFooter className="border-top d-flex justify-content-center align-items-center p-3 drive-status1">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
