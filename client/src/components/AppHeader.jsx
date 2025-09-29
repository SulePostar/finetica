import { cilContrast, cilMenu, cilMoon, cilSun } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './AppHeader.css';
import AppHeaderDropdown from './header/AppHeaderDropdown.jsx';
import AppButton from './AppButton/AppButton.jsx';
import '../scss/style.scss';

// Returns route and label for a detail or item details page
const getDetailPageConfig = (pathname) => {
  // Item details page: /kif/:id/items or /kuf/:id/items
  const kifItemMatch = pathname.match(/^\/kif\/(\d+)\/items/);
  if (kifItemMatch) {
    return { route: `/kif/${kifItemMatch[1]}`, label: 'KIF Invoice' };
  }
  const kufItemMatch = pathname.match(/^\/kuf\/(\d+)\/items/);
  if (kufItemMatch) {
    return { route: `/kuf/${kufItemMatch[1]}`, label: 'KUF Invoice' };
  }
  const bankItemMatch = pathname.match(/^\/bank-transactions\/(\d+)\/items/);
  if (bankItemMatch) {
    return {
      route: `/bank-transactions/${bankItemMatch[1]}`,
      label: 'Bank Statement',
    };
  }
  // Document details page
  if (pathname.startsWith('/contracts/') && pathname !== '/contracts') {
    return { route: '/contracts', label: 'Contracts' };
  }
  // Invoice details page
  if (pathname.startsWith('/kuf/') && pathname !== '/kuf') {
    return { route: '/kuf', label: 'KUF' };
  }
  if (pathname.startsWith('/kif/') && pathname !== '/kif') {
    return { route: '/kif', label: 'KIF' };
  }
  if (pathname.startsWith('/partners/') && pathname !== '/partners') {
    return { route: '/partners', label: 'Partners' };
  }
  if (pathname.startsWith('/bank-transactions/') && pathname !== '/bank-transactions') {
    return { route: '/bank-transactions', label: 'Bank Statements' };
  }
  if (pathname.startsWith('/contracts/') && pathname !== '/contracts') {
    return { route: '/contracts', label: 'Contracts' };
  }
  return null;
};

const AppHeader = ({ isDarkMode, colorMode, setColorMode }) => {
  const headerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const sidebarUnfoldable = useSelector((state) => state.ui.sidebarUnfoldable);

  const detailPage = getDetailPageConfig(location.pathname);

  useEffect(() => {
    if (detailPage && sidebarShow) {
      dispatch({ type: 'set', sidebarShow: false });
    }
  }, [detailPage, sidebarShow, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const isMobile = window.innerWidth < 768;

  return (
    <CHeader
      position="fixed"
      className={`px-4 d-flex align-items-center h-64 app-header`}
      style={{
        marginLeft: `${!isMobile && sidebarShow ? (sidebarUnfoldable ? 56 : 240) : 0}px`,
      }}
    >
      {detailPage ? (
        <AppButton
          variant="outline"
          onClick={() => navigate(detailPage.route)}
          icon="mdi:arrow-left"
          iconClassName="me-2"
          className="border rounded-pill px-3 py-2 d-flex align-items-center gap-2 header-back"
        >
          Back to {detailPage.label}
        </AppButton>
      ) : (
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          className={`ms-n3 border-0 rounded ${isDarkMode ? 'text-white hover-dark' : 'text-dark hover-light'}`}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
      )}

      <div className="flex-grow-1"></div>

      <CHeaderNav className="ms-auto d-flex gap-3 align-items-center">
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
              as="button"
              type="button"
              onClick={() => setColorMode('light')}
              className="d-flex align-items-center"
            >
              <CIcon className="me-2" icon={cilSun} size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              active={colorMode === 'dark'}
              as="button"
              type="button"
              onClick={() => setColorMode('dark')}
              className="d-flex align-items-center"
            >
              <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              active={colorMode === 'auto'}
              as="button"
              type="button"
              onClick={() => setColorMode('auto')}
              className="d-flex align-items-center"
            >
              <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <AppHeaderDropdown isDarkMode={isDarkMode} />
      </CHeaderNav>
    </CHeader>
  );
};

export default AppHeader;