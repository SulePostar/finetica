import React, { useState, useCallback } from 'react';
import { CModal, CModalBody, CModalHeader, CModalFooter, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCamera, cilUser } from '@coreui/icons';
import PhotoUploadService from '../../../services/photoUploadService';
import './ProfilePhotoUpload.styles.css';

const ProfilePhotoUpload = ({ onPhotoSelect, disabled = false, initialPhoto = null }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialPhoto);
    const [error, setError] = useState('');

    const handlePhotoClick = useCallback(() => {
        if (!disabled) {
            setShowModal(true);
            setError('');
        }
    }, [disabled]);

    const handleFileSelect = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        const validation = PhotoUploadService.validateImageFile(file);
        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        try {
            // Create preview
            const preview = await PhotoUploadService.createPreviewUrl(file);

            setSelectedFile(file);
            setPreviewUrl(preview);
            setError('');

            // Notify parent component
            if (onPhotoSelect) {
                onPhotoSelect(file);
            }
        } catch (err) {
            setError('Failed to process image');
            console.error('Preview creation error:', err);
        }
    }, [onPhotoSelect]);

    const handleRemovePhoto = useCallback(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError('');

        if (onPhotoSelect) {
            onPhotoSelect(null);
        }
    }, [onPhotoSelect]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const hasPhoto = Boolean(previewUrl);

    return (
        <>
            <div className="profile-photo-upload-container">
                <div
                    className={`profile-photo-circle ${disabled ? 'disabled' : ''}`}
                    onClick={handlePhotoClick}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                            e.preventDefault();
                            handlePhotoClick();
                        }
                    }}
                    aria-label="Upload profile photo"
                >
                    {hasPhoto ? (
                        <img
                            src={previewUrl}
                            alt="Profile preview"
                            className="profile-photo-preview"
                        />
                    ) : (
                        <div className="profile-photo-placeholder">
                            <CIcon icon={cilUser} size="xl" />
                        </div>
                    )}
                </div>

                <div className="profile-photo-text">Upload a photo</div>
                <div className="profile-photo-subtext">(Optional)</div>
            </div>

            <CModal visible={showModal} onClose={handleCloseModal} alignment="center">
                <CModalHeader>
                    <h4>Upload Profile Photo</h4>
                </CModalHeader>

                <CModalBody className="text-center">
                    {error && (
                        <CAlert color="danger" className="mb-3">
                            {error}
                        </CAlert>
                    )}

                    {selectedFile && !error && (
                        <CAlert color="success" className="mb-3">
                            Photo selected! It will be uploaded when you register.
                        </CAlert>
                    )}

                    {previewUrl && (
                        <div className="preview-container mb-3">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="photo-preview"
                            />
                        </div>
                    )}

                    <div className="upload-section">
                        <input
                            type="file"
                            accept={PhotoUploadService.ALLOWED_TYPES.join(',')}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="photo-upload-input"
                        />

                        <CButton
                            color="primary"
                            variant="outline"
                            onClick={() => document.getElementById('photo-upload-input').click()}
                            disabled={disabled}
                            className="mb-3"
                        >
                            <CIcon icon={cilCamera} className="me-2" />
                            Choose Photo
                        </CButton>

                        <div className="upload-info">
                            <small className="text-muted">
                                Supported: JPG, PNG, GIF, WebP (Max 5MB)
                            </small>
                        </div>
                    </div>
                </CModalBody>

                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="outline"
                        onClick={handleCloseModal}
                        disabled={disabled}
                    >
                        Cancel
                    </CButton>

                    <CButton
                        color="success"
                        onClick={handleCloseModal}
                    >
                        Done
                    </CButton>

                    {hasPhoto && (
                        <CButton
                            color="danger"
                            variant="outline"
                            onClick={handleRemovePhoto}
                            disabled={disabled}
                        >
                            Remove Photo
                        </CButton>
                    )}
                </CModalFooter>
            </CModal>
        </>
    );
};

export default ProfilePhotoUpload;