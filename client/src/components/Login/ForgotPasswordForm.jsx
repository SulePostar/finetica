import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CForm, CFormInput, CButton, CAlert, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilArrowLeft } from '@coreui/icons';
import { authService } from '../../services';
import notify from '../../utilis/toastHelper';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // prevent double submit

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await authService.requestPasswordReset(email.trim());

            if (result.success) {
                setSuccess(true);
                notify.onSuccess('Password reset email sent successfully!');
            } else {
                setError(result.message || 'Failed to send reset email');
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
                    <h3 className="mb-3">Check Your Email</h3>
                    <p className="text-muted mb-4">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-muted mb-4">
                        The link will expire in 15 minutes. If you don't see the email, check your spam folder.
                    </p>
                    <Link to="/login" className="btn btn-primary">
                        Back to Login
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
                            <h3 className="mb-2">Forgot Password?</h3>
                            <p className="text-muted">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {error && (
                            <CAlert color="danger" className="mb-4">
                                {error}
                            </CAlert>
                        )}

                        <CForm onSubmit={handleSubmit}>
                            <CInputGroup className="mb-4">
                                <CInputGroupText>
                                    <CIcon icon={cilEnvelopeClosed} />
                                </CInputGroupText>
                                <CFormInput
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                />
                            </CInputGroup>

                            <CButton
                                type="submit"
                                color="primary"
                                className="w-100 rounded-pill py-3 mb-3"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordForm;
