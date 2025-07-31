import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import navigation from '../_nav';
import { logout } from './../redux/auth/authSlice';
import ConfirmationModal from './Modals/ConfirmationModal';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => dispatch({ type: 'set', sidebarShow: visible })}
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand to="/" />
          <CCloseButton
            className="d-lg-none"
            dark
            onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          />
        </CSidebarHeader>

        <AppSidebarNav items={navigation} />

        <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center align-items-center p-3">
          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            <CSidebarToggler />
            <span className="text-white small">Logout</span>
          </div>
        </CSidebarFooter>
      </CSidebar>

      <ConfirmationModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        body="Are you sure you want to log out?"
        cancelText="Cancel"
        confirmText="Logout"
        confirmColor="danger"
      />
    </>
  );
};

export default React.memo(AppSidebar);