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
  CFormTextarea,
  CBadge,
} from '@coreui/react';

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
            {sectionIndex > 0 && <hr className="my-4" />}
            <CBadge className="section-header mb-3 fs-6">{section.label}</CBadge>
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

    if (field.type === 'readonly') {
      return (
        <div key={key} className="mb-3">
          <CFormLabel className="fw-semibold">{field.label}</CFormLabel>
          <div className='readonly-field'>
            {field.value}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="mb-3">
        <CFormLabel htmlFor={field.fullName} className="fw-semibold">
          {field.label}
        </CFormLabel>
        {field.type === 'select' ? (
          <CFormSelect
            id={field.name}
            value={localFormData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            // className={`form-select ${field.className || ''}`}
            className={field.className || ''}
          >
            <option value="">Select {field.label.replace('*', '').trim()}</option>
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
          />
        ) : (
          <CFormInput
            id={field.name}
            type={field.type || 'text'}
            value={localFormData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`input ${field.className || ''}`}
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
          <div className="modal-form">
            {renderFormFields()}
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