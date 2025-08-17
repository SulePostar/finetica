import { useState } from 'react';
import { CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import { FileUploadModal } from '../Modals';
import './UploadButton.css';

const UploadButton = ({
    bucketName,
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
            <CButton
                variant="outline"
                onClick={handleUploadClick}
                className={`d-flex align-items-center compact-upload-button ${className}`}
                size="sm"
                {...props}
            >
                <CIcon icon={cilCloudUpload} className="me-1 compact-upload-button-icon" />
                {children || 'Upload'}
            </CButton>

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
