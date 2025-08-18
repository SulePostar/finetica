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
  const isKifDetailPage = location.pathname.startsWith('/kif/') && location.pathname !== '/kif';
  const isContractDetailPage = location.pathname.startsWith('/contracts/') && location.pathname !== '/contracts';
  const isDetailPage = isKufDetailPage || isKifDetailPage || isContractDetailPage;

  useEffect(() => {
    if (isDetailPage && sidebarShow) {
      dispatch({ type: 'set', sidebarShow: false });
    }
  }, [isDetailPage, sidebarShow, dispatch]);

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
        position="fixed"
        className={`p-0 header app-header ${isDarkMode ? 'header-dark' : 'header-light'}`}
        data-coreui-theme={isDarkMode ? 'dark' : 'light'}
        ref={headerRef}
      >
        <CContainer
          fluid
          className={`px-4 header-container-fluid ${isDarkMode ? 'header-dark' : 'header-light'}`}
          style={{
            marginLeft: `${headerMargin}px`,
          }}
        >
          {isKufDetailPage ? (
            <CButton
              variant="outline"
              onClick={() => navigate('/kuf')}
              className="ms-n3 back-button"
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to KUF
            </CButton>
          ) : isKifDetailPage ? (
            <CButton
              variant="outline"
              onClick={() => navigate('/kif')}
              className="ms-n3 back-button"
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to KIF
            </CButton>
          ) : isContractDetailPage ? (
            <CButton
              variant="outline"
              onClick={() => navigate('/contracts')}
              className="ms-n3 back-button"
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to Contracts
            </CButton>
          ) : (
            <CHeaderToggler
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              className={`ms-n3 header-toggle-btn ${isDarkMode ? 'toggle-dark' : 'toggle-light'}`}
            >
              <CIcon icon={cilMenu} size="lg" className={isDarkMode ? 'menu-icon-dark' : 'menu-icon-light'} />
            </CHeaderToggler>
          )}
          <CHeaderNav className="d-none d-md-flex" />
          <div className="flex-spacer"></div>
        </CContainer>
      </CHeader >

      <div className="fixed-header-nav">
        <CHeaderNav className="fixed-header-nav-gap">
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
      </div >
    </>
  );
};
export default AppHeader;