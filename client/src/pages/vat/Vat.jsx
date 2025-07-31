import React from 'react';
import { AppHeader, AppSidebar, UploadButton } from '../../components/index';
import { CContainer, CRow, CCol } from '@coreui/react';
import { useBucketName } from '../../lib/bucketUtils';
import './Vat.styles.css';

const Vat = () => {
    const bucketName = useBucketName();

    return (
        <>
            <AppSidebar />
            <CContainer className="wrapper d-flex flex-column min-vh-100" fluid>
                <AppHeader />

                {/* Main content area */}
                <div className="body flex-grow-1 px-3">
                    <CContainer className="h-100" fluid>
                        {/* Page header with upload button */}
                        <CRow className="mb-2">
                            <CCol>
                                <div className="d-flex justify-content-end align-items-center">
                                    <UploadButton
                                        bucketName={bucketName}
                                    />
                                </div>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>
            </CContainer>
        </>
    );
};

export default Vat; 