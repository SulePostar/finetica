import React, { useState } from 'react';
import {
  CForm, CInputGroup, CInputGroupText, CFormInput, CButton, CAlert, CAvatar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser, cilContact, cilEnvelopeClosed, cilLockLocked,
} from '@coreui/icons';
import { profileFormStyles } from './ProfileForm.styles';

const ProfileForm = () => {
  const [isEditable, setIsEditable] = useState(false);
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    role: '',
    status: '',
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
    setSuccess('Profile updated successfully!');
  
    // Clear the success message after 5 seconds
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };
  

  return (
    <div className="profile-form-card" style={{ maxWidth: '600px', margin: 'auto', padding: '40px' }}>
      <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '32px' }}>Your Profile</h2>

      {/* Avatar Section */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <CAvatar 
          src="https://i.pravatar.cc/150?u=filip" 
          size="xl" 
          style={{ marginBottom: '16px' }}
        />
        <div>
          <CButton 
            color="outline-primary" 
            size="sm"
            style={{ marginRight: '8px' }}
          >
            Change Photo
          </CButton>
          <CButton 
            color="outline-secondary" 
            size="sm"
          >
            Remove
          </CButton>
        </div>
      </div>

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
            disabled={!isEditable}
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
            disabled={!isEditable}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilContact} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditable}
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
            disabled={!isEditable}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilEnvelopeClosed} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Role"
            type="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!isEditable}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilEnvelopeClosed} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Status"
            type="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!isEditable}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilEnvelopeClosed} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Email Verified"
            type="emailVerified"
            name="emailVerified"
            value={formData.emailVerified}
            onChange={handleChange}
            disabled={!isEditable}
          />
        </CInputGroup>

        <CInputGroup className="mb-3">
          <CInputGroupText style={profileFormStyles.inputGroupText}>
            <CIcon icon={cilEnvelopeClosed} style={profileFormStyles.icon} />
          </CInputGroupText>
          <CFormInput
            placeholder="Last Login"
            type="lastLogin"
            name="lastLogin"
            value={formData.lastLogin}
            onChange={handleChange}
            disabled          />
        </CInputGroup>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <CButton
          type="button"
          style={profileFormStyles.button}
          onClick={() => setIsEditable((prev) => !prev)}
        >
          {isEditable ? 'Cancel' : 'Edit Profile'}
        </CButton>

        <CButton type="submit" style={profileFormStyles.button}>
          Submit Changes
        </CButton>
      </div>

      </CForm>
    </div>
  );
};

export default ProfileForm;
