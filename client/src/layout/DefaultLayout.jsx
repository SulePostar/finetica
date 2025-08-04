import { Container, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { AppHeader, AppSidebar } from '../components/index';
import { useColorModes } from '@coreui/react';

const DefaultLayout = () => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (colorMode === 'auto') {
      setColorMode('dark');
    }
  }, [colorMode, setColorMode]);

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
    <Container fluid className="min-vh-100 bg-light dark:bg-dark">
      <Row className="flex-nowrap">
        <Col xs="auto" className="p-0">
          <AppSidebar isDarkMode={isDarkMode} />
        </Col>
        <Col className="d-flex flex-column p-0">
          <AppHeader />
          <Container as="main" className="p-3 flex-grow-1">
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DefaultLayout;
