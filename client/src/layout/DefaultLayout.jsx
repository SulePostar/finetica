import { CRow, useColorModes } from '@coreui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Container } from 'react-bootstrap';
import { AppHeader, AppSidebar } from '../components/index';
import makeLayoutStyles from './DefaultLayout.styles';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const sidebarUnfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const styles = makeLayoutStyles();

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDarkMode = () => {
      const dark = colorMode === 'dark' || (colorMode === 'auto' && media.matches);
      setIsDarkMode(dark);
    };
    checkDarkMode();
    media.addEventListener('change', checkDarkMode);
    return () => media.removeEventListener('change', checkDarkMode);
  }, [colorMode]);

  // Calculate sidebar width based on state
  const getSidebarWidth = () => {
    if (!sidebarShow) return 0;
    return sidebarUnfoldable ? 56 : 240; // 56px for collapsed, 240px for expanded
  };

  const sidebarWidth = getSidebarWidth();

  return (
    <div className="app-layout">
      {/* Independent Sidebar */}
      <AppSidebar isDarkMode={isDarkMode} />

      {/* Main Content Area with Header */}
      <div
        className="main-content-wrapper"
        style={{
          minHeight: '100vh'
        }}
      >
        {/* Separate Header */}
        <div className="header-container" style={{
          position: 'relative',
          zIndex: 1040,
          backgroundColor: 'var(--cui-body-bg)',
          margin: 0,
          padding: 0
        }}>
          <AppHeader isDarkMode={isDarkMode} colorMode={colorMode} setColorMode={setColorMode} />
        </div>        {/* Page Content */}
        <div className="page-content">
          <CRow className="mb-2 mx-5"></CRow>
          <Container fluid as="main" className={styles.mainContent.className}>
            {children}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
