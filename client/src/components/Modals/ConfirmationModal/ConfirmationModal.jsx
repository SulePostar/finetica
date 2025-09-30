import React, { useState, useEffect } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CAlert,
  CFormTextarea,
  CBadge,
} from '@coreui/react';
import AppButton from '../../AppButton/AppButton';
import './ConfirmationModal.css';

const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  title,
  body,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmColor = 'primary',
  isForm = false,
  formData = {},
  onFormChange = null,
  formFields = [],
  loading = false,
  error = '',
  showSections = false,
  isDarkMode
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

  // Group fields by section for better organization
  const renderFormFields = () => {
    if (!showSections) {
      return formFields.map((field, index) => renderField(field, index));
    }

    let currentSection = '';
    const sections = [];

    formFields.forEach((field, index) => {
      if (field.type === 'section') {
        currentSection = field.label;
        sections.push({ type: 'section', label: currentSection, fields: [] });
      } else if (currentSection && field.section) {
        const currentSectionObj = sections.find(s => s.label === currentSection);
        if (currentSectionObj) {
          currentSectionObj.fields.push(field);
        }
      } else {
        // Handle fields without sections
        if (!sections.length || sections[sections.length - 1].type !== 'unsectioned') {
          sections.push({ type: 'unsectioned', fields: [] });
        }
        sections[sections.length - 1].fields.push(field);
      }
    });

    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex}>
        {section.type === 'section' && (
          <>
            {sectionIndex > 0 && <hr className={`my-4 ${isDarkMode ? 'border-light' : 'border-dark'}`} />}
            <div className={`section-header mb-3 ${isDarkMode ? 'text-light bg-dark' : 'text-dark bg-light'} p-2 rounded`}>
              <strong>{section.label}</strong>
            </div>
          </>
        )}
        {section.fields.map((field, fieldIndex) => renderField(field, `${sectionIndex}-${fieldIndex}`))}
      </div>
    ));
  };

  const renderField = (field, key) => {
    if (field.type === 'section') {
      return null;
    }

    const inputClassName = isDarkMode ? 'bg-dark text-light border-secondary' : '';
    const labelClassName = `fw-semibold ${isDarkMode ? 'text-light' : 'text-dark'}`;

    if (field.type === 'readonly') {
      return (
        <div key={key} className="mb-3">
          <CFormLabel className={labelClassName}>{field.label}</CFormLabel>
          <div className={`readonly-field p-2 rounded ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-dark border'}`}>
            {field.value}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="mb-3">
        <CFormLabel htmlFor={field.name} className={labelClassName}>
          {field.label}
        </CFormLabel>
        {field.type === 'select' ? (
          <CFormSelect
            id={field.name}
            value={localFormData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${field.className || ''} ${inputClassName}`}
          >
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
        ) : field.type === 'textarea' ? (
          <CFormTextarea
            id={field.name}
            value={localFormData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={inputClassName}
          />
        ) : (
          <CFormInput
            id={field.name}
            type={field.type || 'text'}
            value={localFormData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`${field.className || ''} ${inputClassName}`}
            disabled={field.readonly || false}
          />
        )}
      </div>
    );
  };

  return (
    <CModal
      visible={visible}
      onClose={onCancel}
      alignment="center"
      size={isForm ? 'lg' : undefined}
      className={isDarkMode ? 'dark-modal' : ''}
    >
      <CModalHeader
        closeButton
        className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
      >
        <CModalTitle className={isDarkMode ? 'text-light' : ''}>
          {title}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className={isDarkMode ? 'bg-dark text-light' : ''}>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}
        {isForm ? (
          <div className="modal-form">
            {renderFormFields()}
          </div>
        ) : (
          <div className={isDarkMode ? 'text-light' : ''}>{body}</div>
        )}
      </CModalBody>
      <CModalFooter className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}>
        <AppButton variant="no-hover" onClick={onCancel} disabled={loading}>
          {cancelText}
        </AppButton>
        <AppButton
          variant={confirmColor}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </AppButton>
      </CModalFooter>
    </CModal>
  );
};

export default ConfirmationModal;