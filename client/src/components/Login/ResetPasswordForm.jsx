import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CForm, CFormInput, CButton, CAlert, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilArrowLeft } from '@coreui/icons';
import { authService } from '../../services';
import notify from '../../utilis/toastHelper';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        setToken(tokenParam || null);
        if (!tokenParam) {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // prevent double submit
        if (!token) return; // no token present

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const result = await authService.resetPassword({
                token,
                newPassword: formData.newPassword,
            });

            if (result.success) {
                setSuccess(true);
                notify.onSuccess('Password reset successfully!');

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(result.message || 'Failed to reset password');
            }
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center p-5">
                <div className="text-center">
                    <div className="mb-4">
                        <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="mb-3">Password Reset Successful!</h3>
                    <p className="text-muted mb-4">
                        Your password has been reset successfully. You can now log in with your new password.
                    </p>
                    <p className="text-muted mb-4">Redirecting to login page...</p>
                    <Link to="/login" className="btn btn-primary">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (token === null) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center p-5">
                <div className="text-center">
                    <div className="mb-4">
                        <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="mb-3">Invalid Reset Link</h3>
                    <p className="text-muted mb-4">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link to="/forgot-password" className="btn btn-primary">
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-5">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <Link to="/login" className="text-decoration-none d-inline-flex align-items-center">
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Back to Login
                    </Link>
                </div>

                <div className="card shadow-lg border-0 rounded-4 px-4 py-5">
                    <div className="card-body">
                        <div className="text-center mb-4">
                            <h3 className="mb-2">Reset Your Password</h3>
                            <p className="text-muted">Enter your new password below.</p>
                        </div>

                        {error && (
                            <CAlert color="danger" className="mb-4">
                                {error}
                            </CAlert>
                        )}

                        <CForm onSubmit={handleSubmit}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText>
                                    <CIcon icon={cilLockLocked} />
                                </CInputGroupText>
                                <CFormInput
                                    type="password"
                                    placeholder="New Password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    required
                                />
                            </CInputGroup>

                            <CInputGroup className="mb-4">
                                <CInputGroupText>
                                    <CIcon icon={cilLockLocked} />
                                </CInputGroupText>
                                <CFormInput
                                    type="password"
                                    placeholder="Confirm New Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                    required
                                />
                            </CInputGroup>

                            <CButton
                                type="submit"
                                color="primary"
                                className="w-100 rounded-pill py-3 mb-3"
                                disabled={loading || !token}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </CButton>

                            <div className="text-center">
                                <p className="mb-0">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-decoration-none">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </CForm>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
