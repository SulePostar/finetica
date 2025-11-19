import { Routes, Route } from 'react-router-dom'
import RoleAndStatusManagement from '@/pages/RoleAndStatusManagement' // <-- add this import

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>Routing works</div>} />
            <Route path="/test" element={<div>Test route</div>} />

            {/* Your new page */}
            <Route path="/management/status" element={<RoleAndStatusManagement />} />
        </Routes>
    );
}
