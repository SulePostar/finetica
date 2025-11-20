import { Routes, Route } from 'react-router-dom'
import RoleAndStatusManagement from '@/pages/RoleAndStatusManagement'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>Routing works</div>} />
            <Route path="/test" element={<div>Test route</div>} />


            <Route path="/management/status" element={<RoleAndStatusManagement />} />
        </Routes>
    );
}
