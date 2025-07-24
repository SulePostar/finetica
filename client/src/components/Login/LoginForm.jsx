// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CButton, CCard, CCardBody, CForm, CFormInput, CAlert } from '@coreui/react';
import { authService } from '../../services';
const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear errors when user starts typing
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
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await authService.login({
                email: formData.email,
                password: formData.password,
            });
            if (result.success) {
                // Login successful, redirect to home page
                navigate('/');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };
    return (
        <CCard
            className="shadow-lg border-0 rounded-4 px-4 py-5"
            style={{ width: '100%', maxWidth: '600px' }}
        >
            <CCardBody>
                <div className="text-center mb-4">
                    <h2>Welcome Back</h2>
                    <p className="text-medium-emphasis">Sign in to your account.</p>
                </div>
                {error && (
                    <CAlert color="danger" style={{ marginBottom: '20px' }}>
                        {error}
                    </CAlert>
                )}
                <CForm onSubmit={handleSubmit}>
                    <CFormInput
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mb-3 rounded-pill py-2"
                        disabled={loading}
                        required
                    />
                    <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mb-2 rounded-pill py-2"
                        disabled={loading}
                        required
                    />
                    <div className="text-end mb-3">
                        <Link
                            to="/forgot-password"
                            className="text-decoration-none"
                            style={{ fontSize: '0.9rem', color: '#5B3CC4' }}
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <CButton
                        type="submit"
                        color="primary"
                        className="w-100 rounded-pill py-2"
                        style={{ backgroundColor: '#5B3CC4' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Login'}
                    </CButton>
                </CForm>
                <div className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        style={{ color: '#5B3CC4', textDecoration: 'none', fontWeight: '600' }}
                    >
                        Sign Up
                    </Link>
                </div>
            </CCardBody>
        </CCard>
    );
};
export default LoginForm;



