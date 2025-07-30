import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CAlert,
  CAvatar,
  CFormLabel,
} from '@coreui/react';
import { profileFormStyles } from './ProfileForm.styles';
import { formatDateTime } from '../../helpers/dateHelper.js';
import { capitalizeFirst } from '../../helpers/capitalizeFirstHelper.js';
import ConfirmationModal from '../Modals/ConfirmationModal';

const ProfileForm = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  useEffect(() => {
    const handler = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-coreui-theme') === 'dark');
    };
    window.document.documentElement.addEventListener('ColorSchemeChange', handler);
    return () => document.documentElement.removeEventListener('ColorSchemeChange', handler);
  }, []);

  const styles = useMemo(() => profileFormStyles(isDarkMode), [isDarkMode]);

  const [isEditable, setIsEditable] = useState(false);
  const profile = useSelector((state) => state.user.profile);

  const [formData, setFormData] = useState(profile);
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditable(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6" style={styles.formContainerCard}>
          <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 style={styles.title}>User Profile</h2>
          </div>
          <div className="text-center mb-4">
            <CAvatar
              src="https://i.pravatar.cc/150?u=filip"
              size="l"
              className="mb-3"
              style={{ width: '6rem', height: '6rem' }}
            />
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <CButton color="outline-primary" size="sm">
                Change Photo
              </CButton>
              <CButton color="outline-secondary" size="sm">
                Remove
              </CButton>
            </div>
          </div>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end mb-3">
              <CButton
                type="button"
                size="sm"
                onClick={() => setIsEditable((prev) => !prev)}
                style={styles.editToggle}
              >
                {isEditable ? 'Cancel' : 'Edit Profile'}
              </CButton>
            </div>

            {[
              { label: 'First name', name: 'firstName' },
              { label: 'Last name', name: 'lastName' },
              { label: 'Email', name: 'email', type: 'email' },
            ].map(({ label, name, type = 'text' }) => (
              <CInputGroup className="mb-3" key={name}>
                <CInputGroupText style={styles.inputGroupText}>
                  <CFormLabel style={styles.labelInInputGroupText}>{label}</CFormLabel>
                </CInputGroupText>
                <CFormInput
                  type={type}
                  name={name}
                  placeholder={label}
                  style={isEditable ? styles.formInput : styles.formInputDisabled}
                  value={formData[name]}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </CInputGroup>
            ))}

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Role</CFormLabel>
              </CInputGroupText>
              <CFormInput
                style={styles.formInputDisabled}
                value={capitalizeFirst(formData.roleName)}
                disabled
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Status</CFormLabel>
              </CInputGroupText>
              <CFormInput
                style={styles.formInputDisabled}
                value={capitalizeFirst(formData.statusName)}
                disabled
              />
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText style={styles.inputGroupText}>
                <CFormLabel style={styles.labelInInputGroupText}>Last login</CFormLabel>
              </CInputGroupText>
              <CFormInput
                style={styles.formInputDisabled}
                value={formatDateTime(formData.lastLoginAt)}
                disabled
              />
            </CInputGroup>

            {isEditable && (
              <div className="d-flex justify-content-center mt-4">
                <CButton type="submit" style={styles.button}>
                  Submit Changes
                </CButton>
              </div>
            )}
          </CForm>
        </div>
      </div>
      <ConfirmationModal
        visible={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        title="Profile Updated"
        body="Your changes have been saved successfully."
        confirmText="OK"
        confirmColor="success"
      />
    </div>
  );
};

export default ProfileForm;
