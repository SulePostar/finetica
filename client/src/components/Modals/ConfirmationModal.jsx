import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CAlert,
} from '@coreui/react';
const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  title,
  body,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmColor = 'primary',
  // New props for form functionality
  isForm = false,
  formData = {},
  onFormChange = null,
  formFields = [],
  loading = false,
  error = '',
}) => {
  const [localFormData, setLocalFormData] = useState({});
  useEffect(() => {
    if (isForm && formData) {
      setLocalFormData(formData);
    }
  }, [isForm, formData]);
  const handleInputChange = (field, value) => {
    const newData = { ...localFormData, [field]: value };
    setLocalFormData(newData);
    if (onFormChange) {
      onFormChange(newData);
    }
  };
  const handleConfirm = () => {
    if (isForm) {
      onConfirm(localFormData);
    } else {
      onConfirm();
    }
  };
  return (
    <CModal
      visible={visible}
      onClose={onCancel}
      alignment="center"
      className="modal-blur-overlay"
      size={isForm ? 'lg' : undefined}
    >
      <CModalHeader closeButton>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
        {isForm ? (
          <div>
            {formFields.map((field) => (
              <div key={field.name} className="mb-3">
                <CFormLabel htmlFor={field.name}>{field.label}</CFormLabel>
                {field.type === 'select' ? (
                  <CFormSelect
                    id={field.name}
                    value={localFormData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </CFormSelect>
                ) : (
                  <CFormInput
                    id={field.name}
                    type={field.type || 'text'}
                    value={localFormData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>{body}</div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          onClick={onCancel}
          disabled={loading}
          style={{ backgroundColor: '#718096', borderColor: '#718096' }}
        >
          {cancelText}
        </CButton>
        <CButton
          color={confirmColor}
          onClick={handleConfirm}
          disabled={loading}
          style={{
            backgroundColor: confirmColor === 'danger' ? '#9B2C2C' : '#5B3CC4',
            borderColor: confirmColor === 'danger' ? '#9B2C2C' : '#5B3CC4',
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
export default ConfirmationModal;