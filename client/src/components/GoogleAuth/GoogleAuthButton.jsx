import googleDriveService from '../../services/googleDriveService';
import { badgeStyle, buttonStyle } from './GoogleAuth.style';

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

export default GoogleAuthButton;
