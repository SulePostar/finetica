import axios from 'axios';

// Create a dedicated axios instance for Google Drive API calls
const driveApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL.replace('/api', ''),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor for drive API
driveApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Network error:', error.message);
        }
        return Promise.reject(error);
    }
);

class GoogleDriveService {
    async checkConnection() {
        try {
            const response = await driveApi.get('/auth/google/status');
            return {
                success: true,
                authenticated: response.data.authenticated,
                sessionValid: response.data.sessionValid,
                expiresAt: response.data.expiresAt,
                message: response.data.message
            };
        } catch (error) {
            console.error('Drive connection check error:', error);
            return {
                success: false,
                authenticated: false,
                sessionValid: false,
                message: error.response?.data?.message || 'Failed to check Google Drive connection'
            };
        }
    }

    async downloadFiles() {
        try {
            const response = await driveApi.get('/api/drive/files/download-new');
            return {
                success: true,
                message: response.data.message,
                summary: response.data.summary
            };
        } catch (error) {
            // Don't log 401 errors as they're expected when not authenticated
            if (error.response?.status !== 401) {
                console.error('Failed to download files:', error.message);
            }

            return {
                success: false,
                message: error.response?.data?.message || 'Failed to download files',
                error: error.response?.data?.error,
                authenticated: error.response?.status !== 401
            };
        }
    }

    async downloadFilesManual() {
        try {
            const response = await driveApi.post('/api/drive/files/download-new');
            return {
                success: true,
                message: response.data.message,
                summary: response.data.summary
            };
        } catch (error) {
            if (error.response?.status === 401) {
                return {
                    success: false,
                    message: 'Please authenticate with Google Drive first',
                    error: 'Not authenticated',
                    authenticated: false
                };
            }

            if (error.response?.status === 404) {
                return {
                    success: false,
                    message: 'Please create a folder named "finetica" in your Google Drive and put files there.',
                    error: 'Finetica folder not found',
                    authenticated: true
                };
            }

            return {
                success: false,
                message: error.response?.data?.message || 'Failed to download files',
                error: error.response?.data?.error || 'Download failed',
                authenticated: true
            };
        }
    }

    async getAuthUrl() {
        try {
            const response = await driveApi.get('/auth/google');
            return {
                success: true,
                authUrl: response.data.authUrl
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to get Google auth URL',
                error: error.response?.data?.error
            };
        }
    }

    isConnected(status) {
        return status && status.authenticated && status.sessionValid;
    }

    getStatusDisplay(status) {
        if (!status) return 'loading';
        return this.isConnected(status) ? 'connected' : 'disconnected';
    }

    handleError(error) {
        if (error.response) {
            const message = error.response.data?.message ||
                error.response.data?.error || 'An error occurred';
            return new Error(message);
        } else if (error.request) {
            return new Error('Network error. Please check your connection.');
        } else {
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

export default new GoogleDriveService();
