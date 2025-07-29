import { cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import { cilExitToApp } from '@coreui/icons';
import LogoutModal from './../Logout/LogoutModal';
import { useState } from 'react';

const AppHeaderDropdown = ({ isDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle
          placement="bottom-end"
          caret={false}
          className="bg-transparent border-0"
        >
          <CIcon icon={cilUser} size="lg" className={isDarkMode ? 'text-white' : 'text-dark'} />
        </CDropdownToggle>

        <CDropdownMenu
          placement="bottom-end"
          className={`pt-0 ${isDarkMode ? 'dropdown-menu-dark' : ''}`}
        >
          <CDropdownHeader className="bg-body-secondary fw-semibold my-1">Settings</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilExitToApp} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <LogoutModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default AppHeaderDropdown;
