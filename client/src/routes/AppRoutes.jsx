import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CSpinner, CContainer } from '@coreui/react';

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const ProfilePage = React.lazy(() => import('../pages/Profile/ProfilePage'));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <CContainer className="pt-3 text-center" fluid>
          <CSpinner color="primary" variant="grow" />
        </CContainer>
      }
    >
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<DefaultLayout />} />
        <Route path="*" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  );
}
