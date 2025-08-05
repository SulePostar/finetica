import { cilExitToApp, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/authSlice';
import notify from '../../utilis/toastHelper';
import ConfirmationModal from './../Modals/ConfirmationModal';

const AppHeaderDropdown = ({ isDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    notify.onSuccess('Logout successful');
    navigate('/login');
  };

  return (
    <>
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
    </>
  );
};

export default AppHeaderDropdown;
