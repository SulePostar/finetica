import { cilCloudUpload, cilDescription, cilFile } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CProgress,
  CSpinner,
} from '@coreui/react';
import { useRef, useState } from 'react';
import FileUploadService from '../../services/fileUploadService';
import notify from '../../utilis/toastHelper';
import './FileUploadModal.css';

const FileUploadModal = ({ visible, onClose, bucketName, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      notify.onError('Please select a file to upload');
      return;
    }

    const finalFileName = fileName.trim() || selectedFile.name;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create a new file with the custom name if different
      let fileToUpload = selectedFile;
      if (finalFileName !== selectedFile.name) {
        fileToUpload = new File([selectedFile], finalFileName, {
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
        });
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const result = await FileUploadService.uploadFile(fileToUpload, bucketName);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        notify.onSuccess(
          `File "${finalFileName}" uploaded and processed successfully to ${bucketName.toUpperCase()} bucket!`
        );

        if (onUploadSuccess) {
          onUploadSuccess(result);
        }

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        notify.onError(result.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      notify.onError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setFileName('');
      setUploadProgress(0);
      setDragOver(false);
      onClose();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      size="lg"
      backdrop="static"
      className="upload-modal"
    >
      <CModalHeader closeButton={!uploading}>
        <div className="d-flex align-items-center">
          <CIcon icon={cilCloudUpload} className="me-2" />
          Upload File to {bucketName.toUpperCase()}
        </div>
      </CModalHeader>

      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="fileInput">Select File</CFormLabel>

            {/* File Drop Area */}
            <div
              className={`file-input-area ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={triggerFileSelect}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={uploading}
                className="d-none"
              />

              {selectedFile ? (
                <div className="text-center">
                  <CIcon icon={cilFile} size="2xl" className="text-success mb-2" />
                  <div className="fw-bold text-success">{selectedFile.name}</div>
                  <div className="text small">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </div>
                  <div className="text small mt-2">Click to select a different file</div>
                </div>
              ) : (
                <div className="text-center">
                  <CIcon icon={cilCloudUpload} size="2xl" className="text-upload-primary mb-2" />
                  <div className="fw-bold text-upload-primary">Drop your file here</div>
                  <div className="text-upload-primary">or click to browse</div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="fileName">
              <CIcon icon={cilDescription} className="me-1" />
              File Name (optional)
            </CFormLabel>
            <CFormInput
              type="text"
              id="fileName"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="Enter custom file name or leave blank to use original"
              disabled={uploading}
            />
            <small className="text">
              Leave empty to use the original file name: <strong>{selectedFile?.name}</strong>
            </small>
          </div>

          {uploading && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-upload-primary">
                  Uploading to {bucketName.toUpperCase()} bucket...
                </span>
                <span className="fw-bold text-upload-primary">{uploadProgress}%</span>
              </div>
              <CProgress value={uploadProgress} className="upload-progress" color="primary" />
            </div>
          )}
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={handleClose} disabled={uploading} variant="outline">
          Cancel
        </CButton>
        <CButton
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="upload-primary-button"
        >
          {uploading ? (
            <>
              <CSpinner size="sm" className="me-2" />
              Uploading...
            </>
          ) : (
            <>
              <CIcon icon={cilCloudUpload} className="me-2" />
              Upload to {bucketName.toUpperCase()}
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default FileUploadModal;
