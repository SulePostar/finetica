import React, { useState } from 'react';
import { CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudUpload } from '@coreui/icons';
import { uploadFile } from '../../lib/uploadFile';

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
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadResult('');
        setUploadError('');

        try {
            const result = await uploadFile(file, bucketName, description);

            if (result.success) {
                const successMessage = `File uploaded successfully to ${bucketName} bucket!`;
                setUploadResult(successMessage);
                console.log('Upload result:', result);

                // Call success callback if provided
                if (onUploadSuccess) {
                    onUploadSuccess(result);
                }

                // Auto-clear success message after 3 seconds
                setTimeout(() => {
                    setUploadResult('');
                }, 3000);
            } else {
                const errorMessage = 'Upload failed: Unknown error';
                setUploadError(errorMessage);

                // Call error callback if provided
                if (onUploadError) {
                    onUploadError(new Error(errorMessage));
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = `Upload failed: ${error.message}`;
            setUploadError(errorMessage);

            // Call error callback if provided
            if (onUploadError) {
                onUploadError(error);
            }

            // Auto-clear error message after 5 seconds
            setTimeout(() => {
                setUploadError('');
            }, 5000);
        } finally {
            setUploading(false);
            // Clear the file input
            e.target.value = '';
        }
    };

    return (
        <div className={`upload-button-container ${className}`}>
            <input
                type="file"
                id={`file-upload-${bucketName}`}
                onChange={handleFileUpload}
                disabled={uploading}
                accept="*/*"
                style={{ display: 'none' }}
            />

            <CButton
                color={color}
                variant={variant}
                onClick={() => document.getElementById(`file-upload-${bucketName}`).click()}
                disabled={uploading}
                className="d-flex align-items-center"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                {...props}
            >
                <CIcon icon={cilCloudUpload} className="me-1" style={{ width: '12px', height: '12px' }} />
                {children || (uploading ? 'Uploading...' : 'Upload File')}
            </CButton>

            {uploadResult && (
                <CAlert
                    color="success"
                    className="mt-1 mb-0"
                    style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}
                >
                    {uploadResult}
                </CAlert>
            )}

            {uploadError && (
                <CAlert
                    color="danger"
                    className="mt-1 mb-0"
                    style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}
                >
                    {uploadError}
                </CAlert>
            )}
        </div>
    );
};

export default UploadButton;
