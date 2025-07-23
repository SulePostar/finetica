import React, { useState, useEffect } from 'react';
import { CForm, CInputGroup, CInputGroupText, CFormInput, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilLockLocked, cilContact } from '@coreui/icons';
import { injectRegisterFormStyles, registerFormStyles } from './RegisterForm.styles';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  useEffect(() => {
    const cleanup = injectRegisterFormStyles();

    console.log('RegisterForm rendered at:', new Date().toISOString());

    return cleanup;
  }, []);

  return (
    <div className="register-form-container" key="register-form-2025">
      <div className="register-form-card register-form">
        <div className="register-form-header">
          <h2 className="register-form-title">Register</h2>
          <p className="register-form-subtitle">Create your account</p>
        </div>

        <CForm onSubmit={handleSubmit}>
          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilUser} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilContact} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilEnvelopeClosed} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </CInputGroup>

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilLockLocked} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </CInputGroup>

          <CInputGroup className="mb-4">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilLockLocked} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </CInputGroup>

          <CButton type="submit" className="register-form-button">
            Create Account
          </CButton>
        </CForm>
      </div>
    </div>
  );
};

export default RegisterForm;