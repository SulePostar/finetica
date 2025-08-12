# Google Drive Integration - Backend Documentation

## Overview

This documentation covers the backend implementation of Google Drive integration in the Finetica application, which handles authentication, automatic file synchronization, and provides APIs for frontend consumption.

## Architecture

### Backend Components
- **Drive Connection Routes** (`/server/routes/googleDrive.js`)
- **Drive Session Service** (`/server/services/driveSessionService.js`)
- **Google Drive Auto Sync** (`/server/utils/driveDownloader/googleDriveAutoSync.js`)
- **Token Storage Service** (`/server/services/tokenStorage.js`)
- **Google Drive Configuration** (`/server/config/driveConfig.js`)

### External Dependencies
- Google Drive API v3
- OAuth2 authentication
- Cron job scheduling
- File system operations

## Setup Instructions - Backend

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**
4. Go to **Credentials** and create **OAuth 2.0 Client IDs**
5. Set authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback`
   - Add production URLs when deploying

### 2. Server Environment Configuration

Create or update the `.env` file in the `/server` directory:

```bash
# Database Configuration
DB_HOST=localhost
PORT=4000
DB_NAME=finetica
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
SESSION_SECRET=your-secure-session-secret-key

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Google OAuth Configuration
CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLIENT_SECRET=your-google-client-secret
API_KEY=your-google-api-key
REDIRECT_URI=http://localhost:4000/auth/google/callback
```

## File Structure - Backend

```
server/
├── config/
│   └── driveConfig.js              # Google OAuth2 client configuration
├── routes/
│   └── googleDrive.js              # Drive connection status route
├── services/
│   ├── driveSessionService.js      # Main drive session management
│   └── tokenStorage.js             # Token storage and validation
├── utils/
│   └── driveDownloader/
│       ├── googleDriveAutoSync.js  # Automatic sync service
│       └── driveHelper.js          # Drive utility functions
└── googleDriveDownloads/           # Local storage for downloaded files
```
## Backend Implementation

### Drive Connection Status (`googleDrive.js`)

The main route file has been simplified to use the service layer:

```javascript
const express = require('express');
const router = express.Router();
const driveSessionService = require('../services/driveSessionService');

router.get('/drive-connection', (_, res) => {
    const connectionStatus = driveSessionService.getDriveConnectionStatus();
    res.json(connectionStatus);
});

module.exports = router;
```

#### Routes:
- `GET /drive-connection` - Checks Google Drive connection status

### Drive Session Service (`driveSessionService.js`)

The main service handles all drive-related operations:

```javascript
class DriveSessionService {
    getDriveConnectionStatus() {
        try {
            const hasToken = tokenStorage.hasValidRefreshToken();
            const status = googleDriveAutoSync.getStatus();

            return {
                connected: hasToken && status.isRunning,
                isRunning: status.isRunning,
                hasToken: hasToken
            };
        } catch (error) {
            return {
                connected: false,
                isRunning: false,
                hasToken: false
            };
        }
    }

    async validateAndRefreshSession(req) {
        // Session validation and token refresh logic
    }

    async downloadFineticaFiles(tokens, pageSize) {
        // File download implementation
    }

    async getFineticaFolderInfo(tokens) {
        // Folder information retrieval
    }
}
```

#### Methods:
- `getDriveConnectionStatus()` - Returns connection status including token validity and sync status
- `validateAndRefreshSession(req)` - Validates and refreshes OAuth tokens
- `downloadFineticaFiles(tokens, pageSize)` - Downloads files from finetica folder
- `getFineticaFolderInfo(tokens)` - Gets information about the finetica folder

#### Session Management:
- Sessions expire after 30 days (one month)
- Automatic token refresh using refresh tokens
- Session creation time tracked in `req.session.createdAt`

### Auto Sync Service (`googleDriveAutoSync.js`)

#### Features:
- **Automatic Sync**: Runs every minute using cron jobs
- **Token Management**: Integrates with tokenStorage service
- **Folder Restriction**: Only processes files from "finetica" folder
- **Smart Sync**: Compares modification times to avoid unnecessary downloads
- **File Type Support**: 
  - Regular files (PDF, images, etc.) - direct download
  - Google Apps files (Docs, Sheets, Slides) - exported to Office formats
- **Local Storage**: Files saved to `server/utils/googleDriveDownloads/`

#### Status Methods:
- `getStatus()` - Returns current sync status
- `start()` - Starts the auto sync process
- `stop()` - Stops the auto sync process

#### Implementation Example:
```javascript
class GoogleDriveAutoSync {
    constructor() {
        this.isRunning = false;
        this.syncInterval = '* * * * *'; // Every 1 minute
        this.downloadPath = path.join(__dirname, '../googleDriveDownloads');
    }

    start() {
        if (this.isRunning) return;
        
        this.cronJob = cron.schedule(this.syncInterval, async () => {
            await this.performSync();
        }, { scheduled: false, timezone: "Europe/Belgrade" });
        
        this.cronJob.start();
        this.isRunning = true;
    }

    async performSync() {
        // Sync implementation
    }
}
```

### Configuration (`config/driveConfig.js`)

```javascript
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

function createDriveClient() {
    return google.drive({
        version: 'v3',
        auth: oauth2Client,
    });
}

module.exports = {
    oauth2Client,
    createDriveClient,
};
```

#### Required Environment Variables:
- `CLIENT_ID` - Google OAuth2 client ID
- `CLIENT_SECRET` - Google OAuth2 client secret
- `REDIRECT_URI` - OAuth callback URL

### Token Storage Service (`tokenStorage.js`)

Handles secure token storage and validation:

```javascript
class TokenStorage {
    saveTokens(tokens) {
        // Save tokens securely
    }

    hasValidRefreshToken() {
        // Check if valid refresh token exists
    }

    clearTokens() {
        // Clear invalid tokens
    }
}
```
## Backend Usage Flow

### 1. Auto Sync Process
1. **GoogleDriveAutoSync** service runs every minute via cron job
2. Checks token validity using **tokenStorage** service
3. If valid tokens exist, connects to Google Drive
4. Scans "finetica" folder for new/updated files
5. Downloads files to `server/utils/googleDriveDownloads/`
6. Updates local file timestamps to match Google Drive

### 2. Connection Status Management
1. **driveSessionService** manages connection state
2. Checks token validity and sync status
3. Returns connection state via API endpoints
4. Auto sync service status is included in response

### 3. File Processing
- **New Files**: Downloaded immediately when sync runs
- **Updated Files**: Re-downloaded if Drive version is newer
- **Unchanged Files**: Skipped to save bandwidth
- **Google Apps Files**: Exported to Office formats (.docx, .xlsx, .pptx)
- **Error Handling**: Failed downloads logged but don't stop the process

## Error Handling

### Common Backend Errors
- **401 Unauthorized**: Session expired or not authenticated
- **404 Not Found**: "finetica" folder doesn't exist in Google Drive
- **403 Forbidden**: Insufficient permissions
- **429 Rate Limited**: Too many requests to Google API
- **500 Internal Server Error**: Service configuration issues

### Error Recovery
- Sessions automatically cleared when expired
- Invalid tokens cleared automatically
- Failed downloads logged but don't stop sync process
- Automatic retry mechanism for temporary failures

## Security Considerations

### Session Security
- Sessions expire after 30 days (one month)
- Automatic token refresh using refresh tokens
- Session secrets should be cryptographically strong
- Secure cookie settings for production (HTTPS)

### File Access
- Only files from "finetica" folder are accessible
- Downloaded files stored in secure server directory (`utils/googleDriveDownloads/`)
- Auto sync service respects folder restrictions
- No direct file serving to prevent unauthorized access

### Token Management
- Tokens stored securely via tokenStorage service
- Automatic refresh when tokens expire
- Invalid tokens are cleared automatically
- OAuth2 flow handles secure authentication

## Monitoring and Logging

### Server Logs
```
🔄 Attempting to refresh expired access token...
✅ Access token refreshed successfully
📁 Found n files in "finetica" folder
📥 New file found: document.pdf
✅ Downloaded: document.pdf
⏭️ File is up to date: spreadsheet.xlsx
⚠️ Google Drive auto sync is already running
```

### Auto Sync Logs
- Cron job execution status
- File sync results
- Token refresh attempts
- Connection status changes
- Error handling and recovery

## Troubleshooting

### Common Backend Issues

1. **Auto Sync Not Working**
   - Check if GoogleDriveAutoSync service is running
   - Verify tokenStorage has valid refresh tokens
   - Ensure "finetica" folder exists in Google Drive
   - Check cron job configuration
   - Verify environment variables are set correctly

2. **Authentication Issues**
   - Check CLIENT_ID and CLIENT_SECRET in .env
   - Verify redirect URI matches Google Console settings
   - Ensure Google Drive API is enabled
   - Check OAuth2 client configuration

3. **Files Not Downloading**
   - Verify "finetica" folder exists in Google Drive
   - Check file permissions in Google Drive
   - Confirm download directory exists (`utils/googleDriveDownloads/`)
   - Check auto sync logs for errors
   - Verify disk space availability

### Development Tips

1. **Testing Auto Sync**
   - Monitor cron job execution in server logs
   - Add files to "finetica" folder in Google Drive
   - Check `server/utils/googleDriveDownloads/` directory
   - Test connection status endpoint `/drive-connection`

2. **Service Testing**
   - Test driveSessionService methods individually
   - Verify token refresh functionality
   - Check auto sync service start/stop methods
   - Test error handling scenarios

3. **Connection Monitoring**
   - Use `/drive-connection` endpoint to check status
   - Monitor auto sync service logs
   - Verify token storage functionality
   - Check Google API quotas and limits

## Production Deployment

### Environment Updates
- Change `REDIRECT_URI` to production domain
- Update CORS origins in server configuration
- Use secure session settings (secure: true)
- Set up proper SSL certificates
- Configure proper logging levels

### Google Console Updates
- Add production redirect URIs
- Configure OAuth consent screen
- Set up proper scopes and permissions
- Monitor API usage and quotas

### Server Configuration
- Ensure adequate disk space for file downloads
- Configure proper backup for downloaded files
- Set up monitoring for sync service health
- Configure log rotation and retention

## API Reference

### Connection Status Endpoints

#### `GET /drive-connection`
Checks current Google Drive connection and auto sync status.

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

### Drive Session Service Methods

#### `getDriveConnectionStatus()`
Returns the current connection status including token validity and auto sync status.

**Returns**:
```json
{
  "connected": boolean,
  "isRunning": boolean,
  "hasToken": boolean
}
```

#### `validateAndRefreshSession(req)`
Validates session tokens and automatically refreshes if needed.

**Parameters**:
- `req` - Express request object with session

**Returns**:
```json
{
  "isValid": true,
  "tokens": {...},
  "message": "Session valid"
}
```

#### `downloadFineticaFiles(tokens, pageSize)`
Downloads files from the "finetica" folder.

**Parameters**:
- `tokens` - Valid OAuth tokens
- `pageSize` - Number of files to process (default: 10)

**Returns**:
```json
{
  "success": true,
  "totalFiles": 5,
  "downloadedCount": 2,
  "skippedCount": 3,
  "processedFiles": [...],
  "folderName": "finetica",
  "downloadPath": "/path/to/downloads"
}
```

### Auto Sync Service Methods

#### `getStatus()`
Returns current auto sync service status.

**Returns**:
```json
{
  "isRunning": boolean,
  "lastSyncTime": "timestamp",
  "syncInterval": "cron expression"
}
```

#### `start()`
Starts the automatic sync process.

#### `stop()`
Stops the automatic sync process.

#### `performSync()`
Manually triggers a sync operation (used internally by cron job).
  "expiresAt": "2025-08-01T12:00:00.000Z",
  "message": "User is authenticated"
}
```

### File Sync Endpoints

#### `GET|POST /api/drive/files/download-new`
Downloads new or updated files from "finetica" folder.

**Response**:
```json
{
  "message": "✅ Obradjeno 5 fajlova iz \"finetica\" foldera. Preuzeto: 2, Preskočeno: 3",
  "summary": {
    "totalChecked": 5,
    "newFiles": 2,
    "skipped": 3,
    "folderName": "finetica"
  }
}
```

**Error Responses**:
```json
{
  "error": "Not authenticated or session expired",
  "message": "Please authenticate with Google Drive again"
}
```

```json
{
  "error": "Finetica folder not found",
  "message": "Please create a folder named \"finetica\" in your Google Drive and put files there."
}
```

