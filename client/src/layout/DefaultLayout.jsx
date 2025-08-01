import { useEffect, useState } from 'react';
import { Container, Col } from 'react-bootstrap';
import { AppHeader, AppSidebar } from '../components/index';
import { useColorModes, CRow, CCol } from '@coreui/react';
import makeLayoutStyles from './DefaultLayout.styles';
import { UploadButton } from '../components/index';
import { useBucketName } from '../lib/bucketUtils';

const DefaultLayout = ({ children }) => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const styles = makeLayoutStyles();

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

  const bucketName = useBucketName();


  return (
    <Container fluid className={styles.container.className}>
      {/* Sidebar */}
      <Col
        xs="auto"
        className={styles.sidebarCol.className}
        style={styles.sidebarCol.style}
      >
        <AppSidebar isDarkMode={isDarkMode} />
      </Col>

      {/* Main Content */}
      <Col className={styles.mainCol.className}>
        <AppHeader />
        <CRow className="mb-2 mx-5">
          <CCol>
            <div className="d-flex justify-content-end align-items-center">
              <UploadButton
                bucketName={bucketName}
              />
            </div>
          </CCol>
        </CRow>
        <Container fluid as="main" className={styles.mainContent.className}>
          {children}
        </Container>
      </Col>
    </Container>
  );
};

export default DefaultLayout;
