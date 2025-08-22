import { CContainer, CSpinner } from '@coreui/react';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../protectedRoutes/ProtectedRouter';
import { Nav } from 'react-bootstrap';

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const AdminUserDashboard = React.lazy(() => import('../pages/AdminDashboard/AdminUserDashboard'));
const Kif = React.lazy(() => import('../pages/kif/Kif'));
const InvoiceDetails = React.lazy(() => import('../pages/InvoiceDetails/InvoiceDetails'));
const Vat = React.lazy(() => import('../pages/vat/Vat'));
const Kuf = React.lazy(() => import('../pages/kuf/Kuf'));
const Contracts = React.lazy(() => import('../pages/contract/Contract'));
const ProfilePage = React.lazy(() => import('../pages/Profile/ProfilePage'));
const GuestWrapper = React.lazy(() => import('../protectedRoutes/GuestWrapper'));
const ForgotPasswordForm = React.lazy(() => import('../components/Login/ForgotPasswordForm'));
const ResetPasswordForm = React.lazy(() => import('../components/Login/ResetPasswordForm'));

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
          path="/forgot-password"
          element={
            <GuestWrapper>
              <ForgotPasswordForm />
            </GuestWrapper>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestWrapper>
              <ResetPasswordForm />
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
              <AdminUserDashboard />
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
          path="/vat/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
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
        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <Contracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts/:id"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts/:id/approve"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kif/:id/approve"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuf/:id/approve"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vat/:id/approve"
          element={
            <ProtectedRoute>
              <InvoiceDetails />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown routes */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
