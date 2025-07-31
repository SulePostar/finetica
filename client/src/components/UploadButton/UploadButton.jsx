import React, { useState } from 'react';
import { CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import { FileUploadModal } from '../Modals';

const UploadButton = ({
    bucketName,
    description = '',
    size = 'sm',
    variant = 'outline',
    color = 'primary',
    className = '',
    onUploadSuccess,
    onUploadError,
    children,
    ...props
}) => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadClick = () => {
        setShowUploadModal(true);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
    };

    const handleModalUploadSuccess = (result) => {
        if (onUploadSuccess) {
            onUploadSuccess(result);
        }
        setShowUploadModal(false);
    };

    const handleModalUploadError = (error) => {
        if (onUploadError) {
            onUploadError(error);
        }
    };

    return (
        <>
            <div className={`upload-button-container ${className}`}>
                <CButton
                    color="info"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="d-flex align-items-center"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    {...props}
                >
                    <CIcon icon={cilCloudUpload} className="me-1" style={{ width: '12px', height: '12px' }} />
                    {children || 'Upload File'}
                </CButton>
            </div>

            {/* File Upload Modal */}
            <FileUploadModal
                visible={showUploadModal}
                onClose={handleCloseModal}
                bucketName={bucketName}
                onUploadSuccess={handleModalUploadSuccess}
                onUploadError={handleModalUploadError}
            />
        </>
    );
};

export default UploadButton;
