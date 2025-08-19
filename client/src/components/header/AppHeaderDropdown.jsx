import { cilExitToApp, cilUser, cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownDivider
} from '@coreui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/authSlice';
import authService from '../../services/authService';
import notify from '../../utilis/toastHelper';
import ConfirmationModal from './../Modals/ConfirmationModal';

const AppHeaderDropdown = ({ isDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      notify.onSuccess('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still log out locally
      dispatch(logout());
      notify.onSuccess('Logout successful');
      navigate('/login');
    }
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
          <CDropdownDivider />
          <CDropdownItem
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <ConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          handleLogout();
        }}
        title="Confirm Logout"
        body="Are you sure you want to log out?"
        cancelText="Cancel"
        confirmText="Logout"
        confirmColor="danger"
      />
    </>
  );
};

export default AppHeaderDropdown;
