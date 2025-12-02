import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'
import ProfilePage from '@/pages/ProfilePage';

const BankStatements = React.lazy(() => import('../pages/BankStatements'));
const Kuf = React.lazy(() => import('../pages/Kuf'));
const Contacts = React.lazy(() => import('../pages/Contacts'));
const Partner = React.lazy(() => import('../pages/PartnersPage'));
const Kif = React.lazy(() => import('../pages/Kif'));
const Users = React.lazy(() => import('../pages/Users'));
import Register from '@/pages/Register';
import RoleAndStatusManagement from '@/pages/RoleAndStatusManagement';

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <h1 className="text-2xl font-semibold" ></h1>
                }
            />
            <Route
                path="/register"
                element={
                    <Register />
                }
            />
            <Route
                path="/kif"
                element={
                    <Kif />
                }
            />
            <Route
                path="/bank-statements"
                element={
                    <BankStatements />
                }
            />
            <Route
                path="/kuf"
                element={
                    <Kuf />
                }
            />
            <Route
                path="/contacts"
                element={
                    <Contacts />
                }
            />
            <Route
                path="/partners"
                element={
                    <Partner />
                }
            />
            <Route
                path="/users"
                element={
                    <Users />
                }
            />

            <Route
                path="/profile"
                element={
                    <ProfilePage />
                }
            />

            <Route
                path="/roles-permissions"
                element={
                    <RoleAndStatusManagement />
                }
            />
            {/* Fallback for unknown routes */}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}