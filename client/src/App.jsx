import { useColorModes } from '@coreui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import './scss/examples.scss';
import './scss/style.scss';

import AuthWrapper from './protectedRoutes/AuthWrapper';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0];
    if (theme) {
      setColorMode(theme);
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthWrapper>
      <AppRoutes />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </AuthWrapper>
  );
};

export default App;
