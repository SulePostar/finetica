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

const ProfileForm = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-coreui-theme') === 'dark'
  );

  useEffect(() => {
    const handler = () => {
      const mode = document.documentElement.getAttribute('data-coreui-theme');
      setIsDarkMode(mode === 'dark');
    };
    window.document.documentElement.addEventListener('ColorSchemeChange', handler);
    return () =>
      document.documentElement.removeEventListener('ColorSchemeChange', handler);
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

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Profile updated successfully!');
    setIsEditable(false);
    setTimeout(() => setSuccess(''), 5000);
  };

  const centeringContainerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={centeringContainerStyle}>
      <div style={styles.formContainerCard}>
        <h2 style={styles.title}>User Profile</h2>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <CAvatar
            src="https://i.pravatar.cc/150?u=filip"
            size="xl"
            style={{ marginBottom: '16px', width: '10rem', height: '10rem' }}
          />
          <div>
            <CButton color="outline-primary" size="sm" style={{ marginRight: '8px' }}>
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
          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>First name</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>Last name</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>Email</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditable}
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>Role</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              value={
                formData.roleName?.charAt(0).toUpperCase() + formData.roleName?.slice(1)
              }
              disabled
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>Status</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              value={
                formData.statusName?.charAt(0).toUpperCase() + formData.statusName?.slice(1)
              }
              disabled
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={styles.inputGroupText}>
              <CFormLabel style={styles.labelInInputGroupText}>Last login</CFormLabel>
            </CInputGroupText>
            <CFormInput
              style={styles.formInput}
              value={formData.lastLoginAt}
              disabled
            />
          </CInputGroup>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <CButton
              type="button"
              style={styles.button}
              onClick={() => setIsEditable((prev) => !prev)}
            >
              {isEditable ? 'Cancel' : 'Edit Profile'}
            </CButton>
            {isEditable && (
              <CButton type="submit" style={styles.button}>
                Submit Changes
              </CButton>
            )}
          </div>
        </CForm>
      </div>
    </div>
  );
};

export default ProfileForm;
