import { cilContrast, cilMenu, cilMoon, cilSun, cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CButton,
} from '@coreui/react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AppHeaderDropdown from './header/AppHeaderDropdown.jsx';
import './AppHeader.css';

const AppHeader = ({ isDarkMode, colorMode, setColorMode }) => {
  const headerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const sidebarUnfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const isKufDetailPage = location.pathname.startsWith('/kuf/') && location.pathname !== '/kuf';
  const isKifDetailsPage = location.pathname.startsWith('/kif/') && location.pathname !== '/kif';

  useEffect(() => {
    if (isKufDetailPage && sidebarShow) {
      dispatch({ type: 'set', sidebarShow: false });
    }
  }, [isKufDetailPage, sidebarShow, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderMargin = () => {
    if (!sidebarShow) return 0;
    return sidebarUnfoldable ? 56 : 240;
  };

  const headerMargin = getHeaderMargin();

  return (
    <>
      <CHeader
        position="sticky"
        className="p-0"
        ref={headerRef}
        style={{
          width: '100%',
          marginLeft: 0,
          zIndex: 1040,
          backgroundColor: isDarkMode ? '#432e62df' : '#bfaee5ff',
          transition: 'none'
        }}
      >
        <CContainer
          fluid
          className="px-4"
          style={{
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: `${headerMargin}px`,
            transition: 'margin-left 0.3s ease-in-out'
          }}
        >
          {isKufDetailPage ? (
            <CButton
              variant="outline"
              onClick={() => navigate('/kuf')}
              className="ms-n3"
              style={{
                border: '1px solid var(--cui-border-color)',
                borderRadius: '6px',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: 'var(--cui-body-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--cui-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to KUF
            </CButton>
          ) : isKifDetailsPage ? (
            <CButton
              variant="outline"
              onClick={() => navigate('/kif')}
              className="ms-n3"
              style={{
                border: '1px solid var(--cui-border-color)',
                borderRadius: '6px',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: 'var(--cui-body-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--cui-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to KIF
            </CButton>
          ) : (
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              className="ms-n3"
              style={{
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: 'transparent',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <CIcon icon={cilMenu} size="lg" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
            </CHeaderToggler>
          )}
          <CHeaderNav className="d-none d-md-flex" />
          <div style={{ flexGrow: 1 }}></div>
        </CContainer>
      </CHeader >
      <div
        className="fixed-header-nav"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1060,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          backgroundColor: isDarkMode ? '#432e62df' : '#bfaee5ff',
          borderLeft: '#ffffff'
        }}
      >
        <CHeaderNav style={{ gap: '1rem' }}>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false} className="bg-transparent border-0">
              {colorMode === 'dark' && <CIcon icon={cilMoon} size="lg" className="text-white" />}
              {colorMode === 'light' && <CIcon icon={cilSun} size="lg" className="text-dark" />}
              {colorMode === 'auto' && (
                <CIcon
                  icon={cilContrast}
                  size="lg"
                  className={isDarkMode ? 'text-white' : 'text-dark'}
                />
              )}
            </CDropdownToggle>
            <CDropdownMenu className={isDarkMode ? 'dropdown-menu-dark' : ''}>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown isDarkMode={isDarkMode} />
        </CHeaderNav>
      </div>
    </>
  );
};

export default AppHeader;









