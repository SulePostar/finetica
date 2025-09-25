import React, { useState, useCallback } from 'react';
import { CModal, CModalBody, CModalHeader, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCamera, cilUser } from '@coreui/icons';
import FileUploadService from '../../../services/fileUploadService';
import notify from '../../../utilis/toastHelper';
import AppButton from '../../AppButton/AppButton';
import './ProfilePhotoUpload.styles.css';

const ProfilePhotoUpload = ({ onPhotoSelect, onRemove, disabled = false, currentPhoto }) => {
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentPhoto || null);

    const handlePhotoClick = useCallback(() => {
        if (!disabled) setShowModal(true);
    }, [disabled]);

    const handleFileSelect = useCallback(
        (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const validation = FileUploadService.validateImageFile(file);
            if (!validation.isValid) {
                notify.onError(validation.error);
                return;
            }

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            onPhotoSelect?.(file);
            notify.onSuccess('Photo selected! It will be uploaded when you save.');
        },
        [onPhotoSelect]
    );

    const handleRemovePhoto = useCallback(() => {
        setPreviewUrl(null);
        onPhotoSelect?.(null);
        onRemove?.();
    }, [onPhotoSelect, onRemove, setPreviewUrl]);


    const handleCloseModal = useCallback(() => setShowModal(false), []);
    const hasPhoto = Boolean(previewUrl || currentPhoto);

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
                            src={previewUrl || currentPhoto}
                            alt="Profile"
                            className="profile-photo-preview"
                            loading="lazy"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="profile-photo-placeholder">
                            <CIcon icon={cilUser} size="xl" />
                        </div>
                    )}
                </div>
            </div>

            <CModal visible={showModal} onClose={handleCloseModal} alignment="center">
                <CModalHeader>
                    <h4>Upload Profile Photo</h4>
                </CModalHeader>

                <CModalBody className="text-center">
                    {hasPhoto && (
                        <div className="preview-container mb-3">
                            <img
                                src={previewUrl || currentPhoto}
                                alt="Preview"
                                className="photo-preview"
                                crossOrigin="anonymous"
                            />
                        </div>
                    )}

                    <div className="upload-section">
                        <input
                            type="file"
                            accept={FileUploadService.ALLOWED_IMAGE_TYPES.join(',')}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            id="photo-upload-input"
                        />

                        <AppButton
                            variant="primary"
                            onClick={() => document.getElementById('photo-upload-input')?.click()}
                            disabled={disabled}
                            className="mb-3"
                        >
                            <CIcon icon={cilCamera} className="me-2" />
                            Choose Photo
                        </AppButton>


                        <div className="upload-info">
                            <small className="text-muted">Supported: JPG, PNG, GIF, WebP (Max 5MB)</small>
                        </div>
                    </div>
                </CModalBody>

                <CModalFooter>
                    <AppButton variant="no-hover" onClick={handleCloseModal} disabled={disabled}>Cancel</AppButton>
                    <AppButton variant="primary" onClick={handleCloseModal}>Save</AppButton>

                    {hasPhoto && (
                        <AppButton
                            variant="danger"
                            onClick={handleRemovePhoto}
                            disabled={disabled}
                        >
                            Remove Photo
                        </AppButton>

                    )}
                </CModalFooter>
            </CModal>
        </>
    );
};

export default ProfilePhotoUpload;
