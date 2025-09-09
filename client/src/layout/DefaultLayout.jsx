import { useColorModes } from '@coreui/react';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { AppHeader, AppSidebar } from '../components/index';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const sidebarUnfoldable = useSelector((state) => state.ui.sidebarUnfoldable);

  const checkDarkMode = useCallback(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const dark = colorMode === 'dark' || (colorMode === 'auto' && media.matches);
    setIsDarkMode(dark);

    document.documentElement.setAttribute('data-coreui-theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', dark);
  }, [colorMode]);

  useEffect(() => {
    checkDarkMode();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', checkDarkMode);
    return () => media.removeEventListener('change', checkDarkMode);
  }, [checkDarkMode]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar-container ${!sidebarShow ? 'sidebar-hidden' : ''} ${sidebarUnfoldable ? 'sidebar-collapsed' : ''
          }`}
      >
        <AppSidebar isDarkMode={isDarkMode} />
      </div>

      {/* Main content */}
      <div className="main-content d-flex flex-column flex-grow-1">
        <div className="header-container">
          <AppHeader
            isDarkMode={isDarkMode}
            colorMode={colorMode}
            setColorMode={setColorMode}
          />
        </div>
        <div className="flex-grow-1 overflow-auto">
          <Container fluid className="p-3 py-5">{children}</Container>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;