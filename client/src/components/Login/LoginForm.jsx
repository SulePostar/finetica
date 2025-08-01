import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/Symphony_transparent_1.png';
import { loginSuccess } from '../../redux/auth/authSlice';
import { authService } from '../../services';
import notify from '../../utilis/toastHelper';
import { loginFormStyles } from './LoginForm.styles';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
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
    if (!validateForm()) return;
    notify.onSuccess('Login successful!');

    setLoading(true);
    setError('');
    try {
      const result = await authService.login(formData);
      if (result.success) {
        dispatch(loginSuccess({ token: result.token }));
        await Promise.resolve(); // Wait one tick for store to update
        navigate('/', { replace: true });
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Logo & Text Section */}
      <div
        className="text-white d-none d-md-flex flex-column align-items-center text-center p-5"
        style={loginFormStyles.leftSection}
      >
        <img src={logo} alt="Symphony Logo" style={loginFormStyles.logo} />
        <h1 className="fw-bold" style={loginFormStyles.welcomeText}>
          Welcome to Finetica!
        </h1>
      </div>

      {/* Right Login Form Section */}
      <div
        className="d-flex align-items-center justify-content-center p-5"
        style={loginFormStyles.rightSection}
      >
        <motion.div
          style={loginFormStyles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <CCard
            className="shadow-lg border-0 rounded-4 px-5 py-5"
            style={{ background: 'transparent' }}
          >
            <CCardBody>
              <div className="text-center mb-5">
                <h2 className="mb-3">Welcome Back</h2>
                <p className="text-medium-emphasis mb-4">Sign in to your account.</p>
              </div>

              {error && (
                <CAlert color="danger" className="mb-4">
                  {error}
                </CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
                <CInputGroup className="mb-4">
                  <CInputGroupText style={loginFormStyles.inputGroupText}>
                    <CIcon icon={cilEnvelopeClosed} style={loginFormStyles.icon} />
                  </CInputGroupText>
                  <CFormInput
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="py-3"
                    disabled={loading}
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-4">
                  <CInputGroupText style={loginFormStyles.inputGroupText}>
                    <CIcon icon={cilLockLocked} style={loginFormStyles.icon} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="py-3"
                    disabled={loading}
                    required
                  />
                </CInputGroup>

                <div className="text-end mb-4">
                  <Link
                    to="/error500"
                    className="text-decoration-none"
                    style={loginFormStyles.forgotLink}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <CButton
                  type="submit"
                  color="primary"
                  className="w-100 rounded-pill py-3 mb-4"
                  style={loginFormStyles.loginButton}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Login'}
                </CButton>
              </CForm>

              <div className="text-center mt-4" style={loginFormStyles.registerText}>
                Don't have an account?{' '}
                <Link to="/register" style={loginFormStyles.registerLink}>
                  Sign Up
                </Link>
              </div>
            </CCardBody>
          </CCard>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
