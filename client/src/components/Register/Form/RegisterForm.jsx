import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CForm, CInputGroup, CInputGroupText, CFormInput, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilLockLocked, cilContact } from '@coreui/icons';
import { injectRegisterFormStyles, registerFormStyles } from './RegisterForm.styles';
import { authService } from '../../../services';
import { useRegistrationForm } from '../../../hooks/useRegistrationForm';
import PhotoUploadService from '../../../services/photoUploadService';
import ProfilePhotoUpload from '../ProfilePhotoUpload';

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleInputChange,
    validateForm,
    resetForm,
    getFieldError
  } = useRegistrationForm();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhotoSelect = useCallback((file) => {
    setProfilePhoto(file);
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      // Upload profile photo if provided
      if (profilePhoto) {
        const uploadResult = await PhotoUploadService.uploadProfileImage(
          profilePhoto,
          formData.firstName,
          formData.lastName
        );

        if (!uploadResult.success) {
          setError(`Photo upload failed: ${uploadResult.error}`);
          return;
        }

        registrationData.profileImage = uploadResult.url;
      }

      const result = await authService.register(registrationData);

      if (result.success) {
        setSuccess('Registration successful! Redirecting to login page...');
        resetForm();
        setProfilePhoto(null);

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = result.errors?.length > 0
          ? result.errors.join(', ')
          : result.message || 'Registration failed';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [validateForm, formData, profilePhoto, resetForm, navigate]);

  const clearGeneralError = useCallback(() => {
    if (error) setError('');
  }, [error]);

  useEffect(() => {
    const cleanup = injectRegisterFormStyles();
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

        <CForm onSubmit={handleSubmit} noValidate>
          <ProfilePhotoUpload
            onPhotoSelect={handlePhotoSelect}
            disabled={loading}
          />

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilUser} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => {
                handleInputChange(e);
                clearGeneralError();
              }}
              disabled={loading}
              invalid={Boolean(getFieldError('firstName'))}
              required
            />
          </CInputGroup>
          {getFieldError('firstName') && (
            <div className="text-danger small mb-2">{getFieldError('firstName')}</div>
          )}

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilContact} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => {
                handleInputChange(e);
                clearGeneralError();
              }}
              disabled={loading}
              invalid={Boolean(getFieldError('lastName'))}
              required
            />
          </CInputGroup>
          {getFieldError('lastName') && (
            <div className="text-danger small mb-2">{getFieldError('lastName')}</div>
          )}

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilEnvelopeClosed} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange(e);
                clearGeneralError();
              }}
              disabled={loading}
              invalid={Boolean(getFieldError('email'))}
              required
            />
          </CInputGroup>
          {getFieldError('email') && (
            <div className="text-danger small mb-2">{getFieldError('email')}</div>
          )}

          <CInputGroup className="mb-3">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilLockLocked} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleInputChange(e);
                clearGeneralError();
              }}
              disabled={loading}
              invalid={Boolean(getFieldError('password'))}
              required
            />
          </CInputGroup>
          {getFieldError('password') && (
            <div className="text-danger small mb-2">{getFieldError('password')}</div>
          )}

          <CInputGroup className="mb-4">
            <CInputGroupText style={registerFormStyles.inputGroupText}>
              <CIcon icon={cilLockLocked} style={registerFormStyles.icon} />
            </CInputGroupText>
            <CFormInput
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleInputChange(e);
                clearGeneralError();
              }}
              disabled={loading}
              invalid={Boolean(getFieldError('confirmPassword'))}
              required
            />
          </CInputGroup>
          {getFieldError('confirmPassword') && (
            <div className="text-danger small mb-2">{getFieldError('confirmPassword')}</div>
          )}

          <CButton type="submit" className="register-form-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </CButton>

          <div className="register-form-login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-form-link">
                Sign in here
              </Link>
            </p>
          </div>
        </CForm>
      </div>
    </div>
  );
};

export default RegisterForm;
