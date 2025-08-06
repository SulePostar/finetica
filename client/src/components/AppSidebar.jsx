import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';

import navigation from '../_nav';
import { AppSidebarNav } from './AppSidebarNav';

const AppSidebar = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const userRole = useSelector((state) => state.user.profile.roleName); // ✅ Corrected

  const filteredNav = navigation
    .map((item) => {
      // If it's a group, filter its children
      if (item.component?.displayName === 'CNavGroup' && item.component?.displayName === 'CNavTitle' && item.items) {
        const filteredItems = item.items.filter(
          (child) => !child.adminOnly || userRole === 'admin'
        );

        if (filteredItems.length === 0) return null;

        return {
          ...item,
          items: filteredItems,
        };
      }

      // Filter admin-only top-level items
      if (item.adminOnly && userRole !== 'admin') return null;

      return item;
    })
    .filter(Boolean); // Remove nulls

  return (
    <CSidebar
      className="border-end"
      colorScheme={isDarkMode ? 'dark' : 'light'}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
    >
      <CSidebarHeader className="border-bottom">
        <CCloseButton
          className="d-lg-none"
          dark={isDarkMode}
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
