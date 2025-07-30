import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CSpinner, CContainer } from '@coreui/react';
import ProtectedRoute from '../protectedRoutes/ProtectedRouter';

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard/AdminDashboard'));
const Kif = React.lazy(() => import('../pages/Kif/Kif'));
const VAT = React.lazy(() => import('../pages/VAT/VAT'));
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
              <DefaultLayout />
            </ProtectedRoute>
          }
        />
        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/kif'
          element={
            <ProtectedRoute>
              <Kif />
            </ProtectedRoute>
          }
        />
        <Route
          path='/vat'
          element={
            <ProtectedRoute>
              <VAT />
            </ProtectedRoute>
          }
        />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
