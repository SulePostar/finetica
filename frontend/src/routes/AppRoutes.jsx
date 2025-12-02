import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'
import ProfilePage from '@/pages/ProfilePage';

const BankStatements = React.lazy(() => import('../pages/BankStatements'));
const Kuf = React.lazy(() => import('../pages/Kuf'));
const Contracts = React.lazy(() => import('../pages/Contracts'));
const Partner = React.lazy(() => import('../pages/PartnersPage'));
const Kif = React.lazy(() => import('../pages/Kif'));
const Users = React.lazy(() => import('../pages/Users'));
import Register from '@/pages/Register';

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
                path="/contracts"
                element={
                    <Contracts />
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
            {/* Fallback for unknown routes */}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
