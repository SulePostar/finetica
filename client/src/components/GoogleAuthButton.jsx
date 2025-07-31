import googleDriveService from '../services/googleDriveService';

const GoogleAuthButton = ({ driveStatus }) => {
    const handleLogin = () => {
        const authUrl = `${import.meta.env.VITE_DRIVE_API_BASE_URL}/auth/google`;
        window.location.href = authUrl;
    };

    const statusDisplay = googleDriveService.getStatusDisplay(driveStatus);

    if (statusDisplay === 'connected') {
        return (
            <div style={badgeStyle('#28a745')}>🟢 Drive Connected</div>
        );
    }

    if (statusDisplay === 'loading') {
        return (
            <div style={badgeStyle('#6c757d')}>⏳ Provjera...</div>
        );
    }

    return (
        <button onClick={handleLogin} style={buttonStyle}>
            🔐 Prijavi se s Google Drive
        </button>
    );
};

// Stil helperi
const badgeStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: 'white',
    padding: '6px 12px',
    fontSize: '0.75rem',
    borderRadius: '4px',
    marginRight: '8px',
    display: 'inline-block',
});

const buttonStyle = {
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '0.75rem',
    marginRight: '8px',
    cursor: 'pointer',
};

export default GoogleAuthButton;
