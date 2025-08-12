# Google Drive Integration - Frontend Documentation

## Overview

This documentation covers the frontend implementation of Google Drive integration in the Finetica application. It explains how the client-side components interact with the backend Google Drive services.

## Architecture

### Frontend Components
- **Google Drive Service** (`/client/src/services/googleDriveService.js`) - *If implemented*
- **Google Auth Button** (`/client/src/components/GoogleAuth/GoogleAuthButton.jsx`) - *If implemented*
- **AppSidebar Integration** (`/client/src/components/AppSidebar.jsx`) - *If implemented*

### Backend API Endpoints (Used by Frontend)
- `GET /drive-connection` - Check Google Drive connection status
- Backend services handle authentication and file sync automatically

## Setup Instructions - Frontend

### Client Environment Configuration

Create or update the `.env` file in the `/client` directory:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## File Structure - Frontend

```
client/
├── src/
│   ├── services/
│   │   └── googleDriveService.js   # Frontend service for API calls (if implemented)
│   └── components/
│       ├── GoogleAuth/
│       │   └── GoogleAuthButton.jsx # Authentication button component (if implemented)
│       └── AppSidebar.jsx          # Main sidebar with status indicator (if implemented)
└── documentation/
    └── google-drive.md             # This frontend documentation
```

## Frontend Implementation

### Google Drive Service (`googleDriveService.js`) - *If Implemented*

The frontend service communicates with backend APIs to manage Google Drive integration:

```javascript
class GoogleDriveService {
    async checkConnection()          // Check connection status via /drive-connection
    async getAutoSyncStatus()        // Get auto sync status
    isConnected(status)             // Helper to check connection status
    getStatusDisplay(status)        // Get display status string
}
```

#### Example Implementation:

```javascript
class GoogleDriveService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/drive-connection`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to check drive connection:', error);
            return {
                connected: false,
                isRunning: false,
                hasToken: false
            };
        }
    }

    isConnected(status) {
        return status.connected && status.hasToken;
    }

    getStatusDisplay(status) {
        if (!status.hasToken) return 'Not authenticated';
        if (!status.isRunning) return 'Sync stopped';
        if (status.connected) return 'Connected & syncing';
        return 'Connection issues';
    }
}

export default new GoogleDriveService();
```

### Components - *If Implemented*

#### GoogleAuthButton Component

A React component that displays Google Drive connection status and handles user interactions:

```jsx
import React, { useState, useEffect } from 'react';
import googleDriveService from '../../services/googleDriveService';

const GoogleAuthButton = () => {
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        isRunning: false,
        hasToken: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkConnectionStatus();
        
        // Poll status every 30 seconds
        const interval = setInterval(checkConnectionStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkConnectionStatus = async () => {
        setLoading(true);
        const status = await googleDriveService.checkConnection();
        setConnectionStatus(status);
        setLoading(false);
    };

    const getStatusColor = () => {
        if (!connectionStatus.hasToken) return 'text-gray-500';
        if (!connectionStatus.isRunning) return 'text-yellow-500';
        if (connectionStatus.connected) return 'text-green-500';
        return 'text-red-500';
    };

    const getStatusIcon = () => {
        if (loading) return '⏳';
        if (!connectionStatus.hasToken) return '🔒';
        if (!connectionStatus.isRunning) return '⏸️';
        if (connectionStatus.connected) return '✅';
        return '❌';
    };

    return (
        <div className="google-drive-status">
            <div className={`status-indicator ${getStatusColor()}`}>
                <span className="icon">{getStatusIcon()}</span>
                <span className="text">
                    Google Drive: {googleDriveService.getStatusDisplay(connectionStatus)}
                </span>
            </div>
            {!connectionStatus.hasToken && (
                <button 
                    onClick={() => window.open('/auth/google', '_blank')}
                    className="auth-button"
                >
                    Connect Google Drive
                </button>
            )}
        </div>
    );
};

export default GoogleAuthButton;
```

#### AppSidebar Integration

Integration example for the main application sidebar:

```jsx
import React, { useState, useEffect } from 'react';
import GoogleAuthButton from './GoogleAuth/GoogleAuthButton';
import googleDriveService from '../services/googleDriveService';

const AppSidebar = () => {
    const [driveStatus, setDriveStatus] = useState(null);

    useEffect(() => {
        // Check status on component mount
        checkDriveStatus();
        
        // Set up periodic status checks
        const interval = setInterval(checkDriveStatus, 60000); // Every minute
        
        // Check status when window regains focus (user returns from auth)
        const handleFocus = () => checkDriveStatus();
        window.addEventListener('focus', handleFocus);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const checkDriveStatus = async () => {
        const status = await googleDriveService.checkConnection();
        setDriveStatus(status);
    };

    return (
        <div className="app-sidebar">
            {/* Other sidebar content */}
            
            <div className="drive-integration-section">
                <h3>Google Drive Integration</h3>
                <GoogleAuthButton />
                
                {driveStatus && (
                    <div className="drive-status-details">
                        <p>Status: {googleDriveService.getStatusDisplay(driveStatus)}</p>
                        {driveStatus.connected && (
                            <p className="sync-info">
                                Auto-sync: {driveStatus.isRunning ? 'Active' : 'Inactive'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppSidebar;
```

## Frontend Usage Flow

### 1. Component Initialization
1. Components mount and initialize Google Drive service
2. Automatic status check via `/drive-connection` endpoint
3. UI updates based on connection status
4. Periodic status polling begins

### 2. User Authentication Flow
1. User sees "Connect Google Drive" button when not authenticated
2. Button opens authentication window (`/auth/google`)
3. User completes OAuth flow in popup/new tab
4. Frontend detects window focus return and checks status
5. UI updates to show connected state

### 3. Status Monitoring
1. Frontend polls `/drive-connection` endpoint periodically
2. Updates UI indicators based on response:
   - **Token Status**: Shows if user is authenticated
   - **Sync Status**: Shows if auto-sync is running
   - **Connection Status**: Shows overall health
3. Handles error states gracefully

### 4. User Experience
- **Visual Indicators**: Icons and colors show current status
- **Real-time Updates**: Status changes reflect immediately
- **Error Handling**: Clear messages for connection issues
- **Auto-retry**: Periodic checks recover from temporary issues

## Frontend Error Handling

### API Error Responses
Handle various error states from the backend:

```javascript
// Example error handling in service
async checkConnection() {
    try {
        const response = await fetch(`${this.baseUrl}/drive-connection`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Drive connection check failed:', error);
        
        // Return safe default state
        return {
            connected: false,
            isRunning: false,
            hasToken: false,
            error: error.message
        };
    }
}
```

### Component Error States

```jsx
const GoogleAuthButton = () => {
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(null);

    const checkConnectionStatus = async () => {
        try {
            const status = await googleDriveService.checkConnection();
            
            if (status.error) {
                setError(status.error);
            } else {
                setError(null);
            }
            
            setConnectionStatus(status);
        } catch (err) {
            setError('Failed to check connection status');
            setConnectionStatus({
                connected: false,
                isRunning: false,
                hasToken: false
            });
        }
    };

    return (
        <div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {/* Status display */}
        </div>
    );
};
```

### Common Error Scenarios
- **Network Errors**: Show retry options
- **Authentication Errors**: Guide user to re-authenticate
- **Server Errors**: Display friendly error messages
- **Timeout Errors**: Implement automatic retry logic

## Frontend Development

### Testing Frontend Integration

1. **Service Testing**
   ```javascript
   // Test the service independently
   import googleDriveService from './services/googleDriveService';
   
   // Test connection check
   const status = await googleDriveService.checkConnection();
   console.log('Connection status:', status);
   ```

2. **Component Testing**
   ```jsx
   // Test components in isolation
   import { render, screen } from '@testing-library/react';
   import GoogleAuthButton from './GoogleAuthButton';
   
   test('displays connection status', () => {
       render(<GoogleAuthButton />);
       // Add assertions
   });
   ```

3. **Integration Testing**
   - Test full authentication flow
   - Verify status updates work correctly
   - Test error handling scenarios

### Development Tips

1. **Environment Setup**
   - Ensure `VITE_API_BASE_URL` points to correct backend
   - Test with both development and production backends
   - Use browser dev tools to monitor API calls

2. **Debugging**
   - Monitor network tab for API calls to `/drive-connection`
   - Check console for service errors
   - Use React dev tools for component state

3. **Performance Considerations**
   - Implement debouncing for frequent status checks
   - Cache status responses when appropriate
   - Use loading states for better UX

### Styling Examples

```css
/* Example CSS for Google Drive components */
.google-drive-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    background-color: #f9fafb;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.status-indicator.text-green-500 {
    color: #10b981;
}

.status-indicator.text-red-500 {
    color: #ef4444;
}

.status-indicator.text-yellow-500 {
    color: #f59e0b;
}

.status-indicator.text-gray-500 {
    color: #6b7280;
}

.auth-button {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
}

.auth-button:hover {
    background-color: #3367d6;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    padding: 0.25rem;
    background-color: #fef2f2;
    border-radius: 0.25rem;
    border: 1px solid #fecaca;
}
```

## Frontend API Reference

### Google Drive Service Methods

#### `checkConnection()`
Checks current Google Drive connection status by calling the backend API.

**Returns**: Promise resolving to:
```json
{
  "connected": true,
  "isRunning": true,
  "hasToken": true
}
```

#### `isConnected(status)`
Helper method to determine if Google Drive is properly connected.

**Parameters**:
- `status` - Status object from `checkConnection()`

**Returns**: `boolean`

#### `getStatusDisplay(status)`
Gets a human-readable status string for display in UI.

**Parameters**:
- `status` - Status object from `checkConnection()`

**Returns**: `string` - One of:
- "Not authenticated"
- "Sync stopped" 
- "Connected & syncing"
- "Connection issues"

### Backend API Endpoints (Used by Frontend)

#### `GET /drive-connection`
Primary endpoint for checking Google Drive status.

**Response**:
```json
{
  "connected": true,
  "isRunning": true,
  "hasToken": true
}
```

**Error Response**:
```json
{
  "connected": false,
  "isRunning": false,
  "hasToken": false
}
```

### Component Props and State

#### GoogleAuthButton Component

**Props**: None (self-contained)

**State**:
```typescript
interface ConnectionStatus {
  connected: boolean;
  isRunning: boolean; 
  hasToken: boolean;
  error?: string;
}

interface ComponentState {
  connectionStatus: ConnectionStatus;
  loading: boolean;
  error: string | null;
}
```

#### AppSidebar Integration

**Props**:
```typescript
interface AppSidebarProps {
  // Other sidebar props
  onDriveStatusChange?: (status: ConnectionStatus) => void;
}
```

