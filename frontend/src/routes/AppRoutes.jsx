import { Navigate, Routes, Route } from 'react-router-dom'
import React from 'react';

const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));
const BankStatements = React.lazy(() => import('../pages/BankStatements'));
const Kuf = React.lazy(() => import('../pages/Kuf'));
const Contacts = React.lazy(() => import('../pages/Contacts'));
const Partner = React.lazy(() => import('../pages/PartnersPage'));
const Kif = React.lazy(() => import('../pages/Kif'));


export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <DefaultLayout />
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

            {/* Fallback for unknown routes */}

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}