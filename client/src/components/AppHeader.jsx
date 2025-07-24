import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CContainer,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react';

import AppHeaderDropdown from './header/AppHeaderDropdown.jsx';

const AppHeader = () => {
  const headerRef = useRef();
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        );
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer fluid className="border-bottom px-4">
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          className="ms-n3"
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex" />

        <CHeaderNav>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
            </CDropdownToggle>
            <CDropdownMenu />
          </CDropdown>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      {/* Optional container below header if needed */}
      <CContainer fluid className="px-4" />
    </CHeader>
  );
};

export default AppHeader;
