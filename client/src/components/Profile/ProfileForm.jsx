import React, { useState } from 'react';
import {
  CForm, CInputGroup, CInputGroupText, CFormInput, CButton, CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser, cilContact, cilEnvelopeClosed, cilLockLocked,
} from '@coreui/icons';
import { profileFormStyles } from './ProfileForm.styles';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your validation + API update logic here
    setSuccess('Profile updated successfully!');
  };

  return (
    <div className="profile-form-card" style={{ maxWidth: '600px', margin: 'auto', padding: '40px' }}>
      <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '32px' }}>Your Profile</h2>

      {error && <CAlert color="danger">{error}</CAlert>}
      {success && <CAlert color="success">{success}</CAlert>}

      <CForm onSubmit={handleSubmit}>
        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilUser} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilContact} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilEnvelopeClosed} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilLockLocked} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            type="password"
            placeholder="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </CInputGroup>

        <CInputGroup className="mb-4">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilLockLocked} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            type="password"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </CInputGroup>

        <CButton type="submit" style={profileFormStyles.button}>
          Update Profile
        </CButton>
      </CForm>
    </div>
  );
};

export default ProfileForm;
