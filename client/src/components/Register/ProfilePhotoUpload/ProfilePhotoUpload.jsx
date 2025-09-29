import React, { useState, useCallback, useRef } from 'react';
import { CModal, CModalBody, CModalHeader, CModalFooter, CModalTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCamera, cilUser } from '@coreui/icons';
import FileUploadService from '../../../services/fileUploadService';
import notify from '../../../utilis/toastHelper';
import AppButton from '../../AppButton/AppButton';
import './ProfilePhotoUpload.css';

const ProfilePhotoUpload = ({ onPhotoSelect, onRemove, disabled = false, currentPhoto }) => {
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentPhoto || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [pendingRemove, setPendingRemove] = useState(false);
    const fileInputRef = useRef(null);

    const handlePhotoClick = useCallback(() => {
        if (!disabled) setShowModal(true);
    }, [disabled]);

    const handleFileSelect = useCallback((file) => {
        if (!file) return;

        const validation = FileUploadService.validateImageFile(file);
        if (!validation.isValid) {
            notify.onError(validation.error);
            return;
        }

        const preview = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(preview);
    }, []);

    const handleFileInputChange = useCallback((event) => {
        const file = event.target.files?.[0];
        handleFileSelect(file);
    }, [handleFileSelect]);

    const handleSave = useCallback(async () => {
        if (pendingRemove) {
            onRemove?.();
        } else if (selectedFile) {
            await onPhotoSelect?.(selectedFile)
        }

        setPendingRemove(false);
        setShowModal(false);
    }, [pendingRemove, selectedFile, onRemove, onPhotoSelect]);


    const handleRemovePhoto = useCallback(() => {
        setPendingRemove(true);
        setPreviewUrl(null);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);

        if (!pendingRemove) {
            setPreviewUrl(currentPhoto);
        } else if (pendingRemove && !selectedFile) {

            setPreviewUrl(currentPhoto);
        }

        setSelectedFile(null);
        setPendingRemove(false);
    }, [currentPhoto, pendingRemove]);


    // Drag and drop handlers
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    const handleDropzoneClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <>
            {/* Avatar Section */}
            <div className="profile-photo-card align-items-center m-0">
                <div className="me-3">
                    <div
                        className={`profile-photo-circle d-flex align-items-center justify-content-center position-relative overflow-hidden ${disabled ? 'disabled' : ''}`}
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
                    </div>
                </div>

                <div>
                    <div className='fs-5 fw-semibold mb-1'>Profile Picture</div>
                    <div className="photo-subtitle mb-2">
                        Upload a professional photo that represents you
                    </div>
                    {!disabled && (
                        <AppButton variant="primary" onClick={handlePhotoClick}>
                            <CIcon icon={cilCamera} className="me-2" />
                            Upload Photo
                        </AppButton>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <CModal
                visible={showModal}
                onClose={handleCloseModal}
                alignment="center"
                backdrop="static"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Upload Profile Photo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div
                        className={`upload-dropzone ${isDragOver ? 'dragover' : ''} ${previewUrl ? 'd-none' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleDropzoneClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={FileUploadService.ALLOWED_IMAGE_TYPES.join(',')}
                            onChange={handleFileInputChange}
                            id="photo-upload-input"
                            style={{ display: 'none' }}
                        />
                        <div className="dropzone-label">
                            <CIcon icon={cilCamera} size="2xl" className="mb-2" />
                            <p>Drag and drop your photo here, or click to browse</p>
                            <small className="text-muted">PNG, JPG, GIF up to 10MB</small>
                        </div>
                    </div>

                    {previewUrl && (
                        <div className="preview-container">
                            <div className="position-relative d-inline-block">
                                <img src={previewUrl} alt="Preview" className="photo-preview-large" />
                            </div>
                        </div>
                    )}
                </CModalBody>

                <CModalFooter>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <AppButton
                            variant="no-hover"
                            onClick={handleCloseModal}
                            disabled={disabled}
                        >
                            Cancel
                        </AppButton>

                        <div className="d-flex gap-2">
                            {previewUrl && (
                                <AppButton variant="danger" onClick={handleRemovePhoto}>
                                    Remove Photo
                                </AppButton>
                            )}
                            <AppButton
                                variant="primary"
                                onClick={handleSave}
                                disabled={!selectedFile && !pendingRemove}
                            >
                                Save
                            </AppButton>
                        </div>
                    </div>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default ProfilePhotoUpload;