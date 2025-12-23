import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom'
import ProfilePage from '@/pages/ProfilePage';
import Login from '@/pages/Login';
import Dashboard from '@/pages/DashboardPage';

const BankTransactions = React.lazy(() => import('../pages/BankTransactions'));
const Kuf = React.lazy(() => import('../pages/Kuf'));
const Contracts = React.lazy(() => import('../pages/Contracts'));
const Partner = React.lazy(() => import('../pages/PartnersPage'));
const Kif = React.lazy(() => import('../pages/Kif'));
const Users = React.lazy(() => import('../pages/Users'));
const InvalidPdfs = React.lazy(() => import('../pages/InvalidPDFs'))
import Register from '@/pages/Register';
import RoleAndStatusManagement from '@/pages/RoleAndStatusManagement';
import ProtectedRoute from './ProtectedRoute';
import DocumentDetails from '@/pages/DocumentDetails';
import NotFound from '@/pages/NotFound';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/kif" element={<Kif />} />
                <Route path="/bank-statements" element={<BankTransactions />} />
                <Route path="/kuf" element={<Kuf />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/partners" element={<Partner />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/roles-statuses" element={<RoleAndStatusManagement />} />
                <Route path="/invalid-pdfs" element={<InvalidPdfs />} />
                <Route path="/:type/:id" element={<DocumentDetails />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}