import { cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0"
        caret={false}
      >
        <CIcon icon={cilUser} size="lg" />
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>

        <CDropdownItem component="a" href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
