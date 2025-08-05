import { CRow, useColorModes } from '@coreui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Container } from 'react-bootstrap';
import { AppHeader, AppSidebar } from '../components/index';
import makeLayoutStyles from './DefaultLayout.styles';

const DefaultLayout = ({ children }) => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
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

  return (
    <Container fluid className={styles.container.className}>
      {/* Sidebar */}
      <Col
        xs="auto"
        className={`${styles.sidebarCol.className} ${sidebarShow ? 'sidebar-visible' : 'sidebar-hidden'}`}
        style={{
          ...styles.sidebarCol.style,
          position: 'fixed',
          height: '100vh',
          zIndex: 1040,
          transform: sidebarShow ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <AppSidebar isDarkMode={isDarkMode} />
      </Col>

      {/* Main Content */}
      <Col
        className={styles.mainCol.className}
        style={{
          marginLeft: sidebarShow ? '240px' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <AppHeader isDarkMode={isDarkMode} colorMode={colorMode} setColorMode={setColorMode} />
        <CRow className="mb-2 mx-5"></CRow>
        <Container fluid as="main" className={styles.mainContent.className}>
          {children}
        </Container>
      </Col>
    </Container>
  );
};

export default DefaultLayout;
