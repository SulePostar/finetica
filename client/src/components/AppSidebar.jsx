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
  const [isHovered, setIsHovered] = useState(false);

  // Debug logging
  console.log('AppSidebar render - sidebarShow:', sidebarShow, 'unfoldable:', unfoldable);

  return (
    <CSidebar
      className={`border-end sidebar ${sidebarShow ? 'show' : ''} ${unfoldable ? 'sidebar-unfoldable' : ''} ${unfoldable && isHovered ? 'sidebar-hover-expanded' : ''}`}
      colorScheme={isDarkMode ? 'dark' : 'light'}
      position="fixed"
      unfoldable={unfoldable}
      style={{
        zIndex: (unfoldable && isHovered) ? 1060 : 1050,
        transition: 'z-index 0.1s ease'
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

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
