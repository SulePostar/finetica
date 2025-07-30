import React, { useState } from 'react';
import { AppHeader, AppSidebar, FileUploadModal } from '../../components/index';
import { CContainer, CButton, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import { useBucketName } from '../../lib/bucketUtils';
import './KUF.styles.css';

const Kuf = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const bucketName = useBucketName();

    const handleUploadClick = () => {
        setShowUploadModal(true);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
    };

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
                                    <CButton
                                        color="primary"
                                        onClick={handleUploadClick}
                                        className="d-flex align-items-center"
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        <CIcon icon={cilCloudUpload} className="me-1" style={{ width: '12px', height: '12px' }} />
                                        Upload File
                                    </CButton>
                                </div>
                            </CCol>
                        </CRow>
                    </CContainer>
                </div>
            </CContainer>

            {/* File Upload Modal */}
            <FileUploadModal
                visible={showUploadModal}
                onClose={handleCloseModal}
                bucketName={bucketName}
            />
        </>
    );
};

export default Kuf;