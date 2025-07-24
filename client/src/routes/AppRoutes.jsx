import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CSpinner, CContainer } from '@coreui/react';


const DefaultLayout = React.lazy(() => import('../layout/DefaultLayout'));

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
                <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
        </Suspense>
    );
}
