import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CSpinner, CContainer } from '@coreui/react';
import ProtectedRoute from '../protectedRoutes/ProtectedRouter';

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const LoginPage = React.lazy(() => import('../pages/LoginPage/LoginPage'));
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard/AdminDashboard'));
const KIF = React.lazy(() => import('../pages/KIF/KIF'));

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
              <KIF />
            </ProtectedRoute>
          }
        />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
