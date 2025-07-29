import { cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';

const AppHeaderDropdown = ({ isDarkMode }) => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" caret={false} className="bg-transparent border-0">
        <CIcon icon={cilUser} size="lg" className={isDarkMode ? 'text-white' : 'text-dark'} />
      </CDropdownToggle>

      <CDropdownMenu
        placement="bottom-end"
        className={`pt-0 ${isDarkMode ? 'dropdown-menu-dark' : ''}`}
      >
        <CDropdownHeader className="bg-body-secondary fw-semibold my-1">Settings</CDropdownHeader>
        <CDropdownItem href="profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
