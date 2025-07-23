// src/components/LoginForm.jsx
import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CForm,
    CFormInput,
} from '@coreui/react'

const LoginForm = () => {
    return (
        <CCard className="shadow-lg border-0 rounded-4 px-4 py-5" style={{ width: '600%', maxWidth: '600px' }}>

            <CCardBody>
                <div className="text-center mb-4">
                    <h2>Welcome Back</h2>
                    <p className="text-medium-emphasis">
                        Sign in to your account.
                    </p>
                </div>
                <CForm>
                    <CFormInput
                        type="email"
                        placeholder="Email"
                        className="mb-3 rounded-pill py-2"
                    />
                    <CFormInput
                        type="password"
                        placeholder="Password"
                        className="mb-2 rounded-pill py-2"
                    />
                    <div className="text-end mb-3">
                        <a href="#" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>
                            Forgot Password?
                        </a>
                    </div>
                    <CButton
                        color="primary"
                        className="w-100 rounded-pill py-2"
                        style={{ backgroundColor: '#5b3cc4' }}
                    >
                        Login
                    </CButton>
                </CForm>
                <div className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
                    Don’t have an account? <a href="/register">Sign Up</a>
                </div>
            </CCardBody>
        </CCard>
    )
}

export default LoginForm
