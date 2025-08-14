import { CContainer, CSpinner } from '@coreui/react';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../protectedRoutes/ProtectedRouter';

const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const AdminUserDahsboard = React.lazy(() => import('../pages/Admin/AdminUserDahsboard'));
const AdminRoleStatusDashboard = React.lazy(() => import('../pages/Admin/AdminRoleStatusDashboard'));
const Kif = React.lazy(() => import('../pages/kif/Kif'));
const InvoiceDetails = React.lazy(() => import('../pages/InvoiceDetails/InvoiceDetails'));
const Vat = React.lazy(() => import('../pages/vat/Vat'));
const Kuf = React.lazy(() => import('../pages/kuf/Kuf'));
const ProfilePage = React.lazy(() => import('../pages/Profile/ProfilePage'));
const GuestWrapper = React.lazy(() => import('../protectedRoutes/GuestWrapper'));

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
        <Route
          path="/register"
          element={
            <GuestWrapper>
              <Register />
            </GuestWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <GuestWrapper>
              <LoginPage />
            </GuestWrapper>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/admin/user-dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user-dashboard"
          element={
            <ProtectedRoute>
              <AdminUserDahsboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/role-status-dashboard"
          element={
            <ProtectedRoute>
              <AdminRoleStatusDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kif"
          element={
            <ProtectedRoute>
              <Kif />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kif/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vat"
          element={
            <ProtectedRoute>
              <Vat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuf"
          element={
            <ProtectedRoute>
              <Kuf />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuf/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}