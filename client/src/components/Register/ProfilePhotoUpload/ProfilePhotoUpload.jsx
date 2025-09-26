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
    const [selectedFile, setSelectedFile] = useState(null);

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
            setSelectedFile(file);
            setPreviewUrl(preview);
        },
        []
    );

    const handleSave = useCallback(() => {
        if (selectedFile) {
            onPhotoSelect?.(selectedFile);
            notify.onSuccess('Photo selected! It will be uploaded when you save.');
        }
        setShowModal(false);
    }, [selectedFile, onPhotoSelect]);

    const handleRemovePhoto = useCallback(() => {
        setPreviewUrl(null);
        setSelectedFile(null);
        onPhotoSelect?.(null);
        onRemove?.();
    }, [onPhotoSelect, onRemove]);

    return (
        <>
            {/* Avatar Section */}
            <div className="profile-photo-upload-container">
                <div
                    className={`profile-photo-circle ${disabled ? 'disabled' : ''}`}
                    onClick={handlePhotoClick}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-label="Upload profile photo"
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
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

                    {!disabled && (
                        <div className="camera-overlay">
                            <CIcon icon={cilCamera} size="lg" />
                        </div>
                    )}
                </div>

                <div className="profile-photo-text mt-2">
                    <div className="photo-title">Profile Picture</div>
                    <div className="photo-subtitle">
                        Upload a professional photo that represents you
                    </div>
                </div>

                {!disabled && (
                    <AppButton variant="primary" className="mt-3" onClick={handlePhotoClick}>
                        <CIcon icon={cilCamera} className="me-2" />
                        Upload Photo
                    </AppButton>
                )}
            </div>

            {/* Upload Modal */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
                <CModalHeader closeButton={false}>
                    <h4>Upload Profile Photo</h4>
                    <button
                        type="button"
                        className="custom-close-btn"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </CModalHeader>

                <CModalBody>
                    <div className="upload-dropzone">
                        <input
                            type="file"
                            accept={FileUploadService.ALLOWED_IMAGE_TYPES.join(',')}
                            onChange={handleFileSelect}
                            id="photo-upload-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="photo-upload-input" className="dropzone-label">
                            <CIcon icon={cilCamera} size="2xl" className="mb-2" />
                            <p>Drag and drop your photo here, or click to browse</p>
                            <small className="text-muted">PNG, JPG, GIF up to 10MB</small>
                        </label>
                    </div>

                    {previewUrl && (
                        <div className="preview-container mt-3">
                            <img src={previewUrl} alt="Preview" className="photo-preview-large" />
                        </div>
                    )}
                </CModalBody>

                <CModalFooter>
                    <AppButton
                        variant="no-hover"
                        onClick={() => setShowModal(false)}
                        disabled={disabled}
                    >
                        Cancel
                    </AppButton>
                    <AppButton variant="primary" onClick={handleSave} disabled={!selectedFile}>
                        Save
                    </AppButton>
                    {previewUrl && (
                        <AppButton variant="danger" onClick={handleRemovePhoto}>
                            Remove Photo
                        </AppButton>
                    )}
                </CModalFooter>
            </CModal>
        </>
    );
};

export default ProfilePhotoUpload;
