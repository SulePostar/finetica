import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CCloseButton,
} from '@coreui/react';
import navigation from '../_nav';
import { AppSidebarNav } from './AppSidebarNav';
import './AppSidebar.css';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName);
  const [isHovered, setIsHovered] = useState(false);

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
    <CSidebar
      className={`border-end sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''
        } ${unfoldable && isHovered ? 'sidebar-hover-expanded' : ''}`}
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
      <CSidebarHeader className="border-bottom d-flex align-items-center justify-content-between px-3 sidebar-header">
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
      </CSidebarHeader>

      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);