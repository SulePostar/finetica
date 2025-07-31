const GoogleAuthButton = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:4000/auth/google';
    };

    return (
        <button
            onClick={handleLogin}
            style={{
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                marginRight: '8px',
                cursor: 'pointer'
            }}
        >
            🔐 Prijavi se s Google Drive
        </button>
    );
};

export default GoogleAuthButton;
