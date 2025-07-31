import googleDriveService from '../../services/googleDriveService';
import { badgeStyle, buttonStyle } from './GoogleAuth.style';
import { FiRefreshCw } from 'react-icons/fi';

const GoogleAuthButton = ({ driveStatus }) => {
    const handleLogin = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
        const authUrl = `${baseUrl}/auth/google`;
        window.location.href = authUrl;
    };

    const statusDisplay = googleDriveService.getStatusDisplay(driveStatus);

    if (statusDisplay === 'connected') {
        return (
            <button
                onClick={handleLogin}
                title="Ponovo se prijavi"
                style={{
                    ...badgeStyle('#28a745'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                }}
            >
                🟢 Drive Connected
                <FiRefreshCw
                    onClick={handleLogin}
                    title="Ponovo se prijavi"
                    style={{ cursor: 'pointer', fontSize: '12px' }}
                />
            </button>
        );
    }

    if (statusDisplay === 'loading') {
        return (
            <div style={badgeStyle('#6c757d')}>⏳ Checking...</div>
        );
    }

    return (
        <button onClick={handleLogin} style={buttonStyle}>
            🔐 Log in with Google
        </button>
    );
};

export default GoogleAuthButton;
