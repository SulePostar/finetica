import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CCloseButton,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  useEffect(() => {
    const handler = () => {
      const theme = document.documentElement.getAttribute('data-coreui-theme');
      setIsDarkMode(theme === 'dark');
    };

    document.documentElement.addEventListener('ColorSchemeChange', handler);
    return () => document.documentElement.removeEventListener('ColorSchemeChange', handler);
  }, []);


  return (
    <CSidebar
      className='border-end'
      colorScheme={isDarkMode ? 'dark' : 'light'}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="text-decoration-none">
          {/* Logo position */}
        </CSidebarBrand>

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
