import Register from '@/pages/Register';
import { Routes, Route } from 'react-router-dom'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<div>Routing works</div>} />
            <Route path="/test" element={<div>Test route</div>} />
        </Routes>
    );
}