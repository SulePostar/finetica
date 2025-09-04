import { useColorModes } from '@coreui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
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

    // Update data attribute for CSS selectors
    document.documentElement.setAttribute('data-coreui-theme', dark ? 'dark' : 'light');
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [colorMode]);

  useEffect(() => {
    checkDarkMode();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', checkDarkMode);

    return () => media.removeEventListener('change', checkDarkMode);
  }, [checkDarkMode]);

  const sidebarWidth = useMemo(() => {
    if (!sidebarShow) return 0;
    return sidebarUnfoldable ? 56 : 240;
  }, [sidebarShow, sidebarUnfoldable]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div
        className={`sidebar-container ${!sidebarShow ? 'd-none' : ''} ${sidebarUnfoldable ? 'collapsed' : ''}`}
        style={{ width: sidebarShow ? `${sidebarWidth}px` : 0 }}
      >
        <AppSidebar isDarkMode={isDarkMode} />
      </div>

      <div
        className="main-content-wrapper"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="header-container">
          <AppHeader
            isDarkMode={isDarkMode}
            colorMode={colorMode}
            setColorMode={setColorMode}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">
            <Container fluid className="px-0 p-3">
              {children}
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;