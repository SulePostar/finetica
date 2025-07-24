import React from 'react';
import LoginForm from './../../components/Login/LoginForm';
import logo from './../../assets/images/Symphony_transparent_1.png';

const LoginPage = () => {
    return (
        <div
            className="min-vh-100 d-flex"

        >
            {/* Left Logo & Text Section */}
            <div
                className="text-white d-none d-md-flex flex-column align-items-center text-center p-5"
                style={{ flex: 1.8, backgroundColor: '#8367deff' }}
            >

                <img
                    src={logo}
                    alt="Symphony Logo"
                    style={{
                        width: '700px',
                        maxWidth: '700%',
                        marginBottom: '2rem',
                    }}
                />

                <h1 className="fw-bold fs-1">Finetica</h1>
                <p className="mt-2 fs-4">Welcome to Symphony's Finetica!</p>

            </div>

            {/* Right Login Form Section */}
            <div
                className="d-flex align-items-center justify-content-center p-5"
                style={{ flex: 1.8, backgroundColor: '#ffffffff' }} // svijetlo ljubičasta
            >

                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
