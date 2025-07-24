import React, { useState, useEffect } from 'react';
import { CForm, CInputGroup, CInputGroupText, CFormInput, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilLockLocked, cilContact } from '@coreui/icons';
import { injectRegisterFormStyles, registerFormStyles } from './RegisterForm.styles';
import { authService } from '../../../services';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setSuccess('Registration successful! You are now logged in.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        // Redirect to dashboard or home page after a delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        // Handle validation errors or other backend errors
        if (result.errors && result.errors.length > 0) {
          setError(result.errors.join(', '));
        } else {
          setError(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <CAlert color="danger" style={{ marginBottom: '20px' }}>
            {error}
          </CAlert>
        )}

        {success && (
          <CAlert color="success" style={{ marginBottom: '20px' }}>
            {success}
          </CAlert>
        )}

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </CInputGroup>

          <CButton type="submit" className="register-form-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </CButton>
        </CForm>
      </div>
    </div>
  );
};

export default RegisterForm;
