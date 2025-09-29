import { CContainer, CSpinner } from '@coreui/react';
import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../protectedRoutes/ProtectedRoute';
const DocumentItemsPage = React.lazy(() => import('../pages/DocumentDetails/DocumentItemsPage'));
const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const UsersDashboard = React.lazy(() => import('../pages/Admin/UsersDashboard'));
const Kif = React.lazy(() => import('../pages/kif/Kif'));
const DocumentDetails = React.lazy(() => import('../pages/DocumentDetails/DocumentDetails'));
const BankTransactions = React.lazy(() => import('../pages/BankTransactions/BankTransactions'));
const Kuf = React.lazy(() => import('../pages/kuf/Kuf'));
const Contracts = React.lazy(() => import('../pages/contract/Contract'));
const Partner = React.lazy(() => import('../pages/partner/Partner'));
const ProfilePage = React.lazy(() => import('../pages/Profile/ProfilePage'));
const GuestWrapper = React.lazy(() => import('../protectedRoutes/GuestWrapper'));
const ForgotPasswordForm = React.lazy(() => import('../components/Login/ForgotPasswordForm'));
const ResetPasswordForm = React.lazy(() => import('../components/Login/ResetPasswordForm'));
const RoleStatusDashboard = React.lazy(() => import('../pages/Admin/RoleStatusDashboard'));
const InvalidPdfs = React.lazy(() => import('../pages/invalidPdfs/InvalidPdfs'));
const InvalidPdfDetails = React.lazy(() => import('../components/InvalidPdfDetails/InvalidPdfDetails'));

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
              <DefaultLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsersDashboard />
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
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-transactions"
          element={
            <ProtectedRoute>
              <BankTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-transactions/:id"
          element={
            <ProtectedRoute>
              <DocumentDetails />
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
              <DocumentDetails />
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
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts/:id/approve"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partners"
          element={
            <ProtectedRoute>
              <Partner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/:id"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/partners/:id/edit"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kif/:id/approve"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuf/:id/approve"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-transactions/:id/approve"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invalid-pdfs"
          element={
            <ProtectedRoute>
              <InvalidPdfs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/document/:id"
          element={
            <ProtectedRoute>
              <InvalidPdfDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kif/:id/items"
          element={
            <ProtectedRoute>
              <DocumentItemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuf/:id/items"
          element={
            <ProtectedRoute>
              <DocumentItemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-transactions/:id/items"
          element={
            <ProtectedRoute>
              <DocumentItemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/role-status"
          element={
            <ProtectedRoute requiredRole="admin">
              <RoleStatusDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback for unknown routes */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
