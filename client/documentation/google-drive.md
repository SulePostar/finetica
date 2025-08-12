# Google Drive Integration Documentation

## Overview

This documentation covers the Google Drive integration in the Finetica application, which allows users to authenticate with Google Drive and automatically sync files from a specific "finetica" folder.

## Architecture

The Google Drive integration consists of several components:

### Backend Components
- **Drive Connection Routes** (`/server/routes/googleDrive.js`)
- **Drive Session Service** (`/server/services/driveSessionService.js`)
- **Google Drive Auto Sync** (`/server/utils/driveDownloader/googleDriveAutoSync.js`)
- **Token Storage Service** (`/server/services/tokenStorage.js`)
- **Google Drive Configuration** (`/server/config/driveConfig.js`)

### Frontend Components
- **Google Drive Service** (`/client/src/services/googleDriveService.js`) - *If implemented*
- **Google Auth Button** (`/client/src/components/GoogleAuth/GoogleAuthButton.jsx`) - *If implemented*
- **AppSidebar Integration** (`/client/src/components/AppSidebar.jsx`) - *If implemented*

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**
4. Go to **Credentials** and create **OAuth 2.0 Client IDs**
5. Set authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback`
   - Add production URLs when deploying

### 2. Environment Configuration

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

### 3. Client Environment Configuration

Create or update the `.env` file in the `/client` directory:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

## File Structure

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

client/
├── src/
│   ├── services/
│   │   └── googleDriveService.js   # Frontend service for API calls (if implemented)
│   └── components/
│       ├── GoogleAuth/
│       │   └── GoogleAuthButton.jsx # Authentication button component (if implemented)
│       └── AppSidebar.jsx          # Main sidebar with status indicator (if implemented)
└── documentation/
    └── google-drive.md             # This documentation
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
```

#### Routes:
- `GET /drive-connection` - Checks Google Drive connection status

### Drive Session Service (`driveSessionService.js`)

The main service handles all drive-related operations:

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
```

#### Required Environment Variables:
- `CLIENT_ID` - Google OAuth2 client ID
- `CLIENT_SECRET` - Google OAuth2 client secret
- `REDIRECT_URI` - OAuth callback URL

## Frontend Implementation

### Google Drive Service (`googleDriveService.js`) - *If Implemented*

The frontend service would typically include:

```javascript
class GoogleDriveService {
    async checkConnection()          // Check connection status via /drive-connection
    async getAutoSyncStatus()        // Get auto sync status
    isConnected(status)             // Helper to check connection status
    getStatusDisplay(status)        // Get display status string
}
```

### Components - *If Implemented*

#### GoogleAuthButton
- Displays connection status from driveSessionService
- Shows appropriate UI based on connection state
- Integrates with auto sync status

#### AppSidebar Integration
- **Auto Status Check**: Polls `/drive-connection` endpoint
- **Auto Sync Status**: Shows current sync status
- **Connection Indicator**: Visual feedback for drive connection state

## Usage Flow

### 1. Auto Sync Process
1. **GoogleDriveAutoSync** service runs every minute via cron job
2. Checks token validity using **tokenStorage** service
3. If valid tokens exist, connects to Google Drive
4. Scans "finetica" folder for new/updated files
5. Downloads files to `server/utils/googleDriveDownloads/`
6. Updates local file timestamps to match Google Drive

### 2. Connection Status Check
1. Frontend can call `/drive-connection` endpoint
2. **driveSessionService** checks token validity and sync status
3. Returns connection state, sync status, and token validity
4. Auto sync service status is included in response

### 3. File Processing
- **New Files**: Downloaded immediately when sync runs
- **Updated Files**: Re-downloaded if Drive version is newer
- **Unchanged Files**: Skipped to save bandwidth
- **Google Apps Files**: Exported to Office formats (.docx, .xlsx, .pptx)
- **Error Handling**: Failed downloads logged but don't stop the process

## Error Handling

### Common Errors
- **401 Unauthorized**: Session expired or not authenticated
- **404 Not Found**: "finetica" folder doesn't exist in Google Drive
- **403 Forbidden**: Insufficient permissions
- **429 Rate Limited**: Too many requests to Google API

### Error Recovery
- Sessions automatically cleared when expired
- Users prompted to re-authenticate when needed
- Failed downloads logged but don't stop the process

## Security Considerations

### Session Security
- Sessions expire after 30 days (one month)
- Automatic token refresh using refresh tokens
- Session secrets should be cryptographically strong

### File Access
- Only files from "finetica" folder are accessible
- Downloaded files stored in secure server directory (`utils/googleDriveDownloads/`)
- Auto sync service respects folder restrictions

### Token Management
- Tokens stored securely via tokenStorage service
- Automatic refresh when tokens expire
- Invalid tokens are cleared automatically

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

## Troubleshooting

### Common Issues

1. **Auto Sync Not Working**
   - Check if GoogleDriveAutoSync service is running
   - Verify tokenStorage has valid refresh tokens
   - Ensure "finetica" folder exists in Google Drive
   - Check cron job configuration

2. **Connection Status Issues**
   - Verify driveSessionService.getDriveConnectionStatus() response
   - Check token validity in tokenStorage service
   - Confirm auto sync service status

3. **Files Not Downloading**
   - Verify "finetica" folder exists in Google Drive
   - Check file permissions in Google Drive
   - Confirm download directory exists (`utils/googleDriveDownloads/`)
   - Check auto sync logs for errors

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

3. **Connection Monitoring**
   - Use `/drive-connection` endpoint to check status
   - Monitor auto sync service logs
   - Verify token storage functionality

## Production Deployment

### Environment Updates
- Change `REDIRECT_URI` to production domain
- Update CORS origins in server configuration
- Use secure session settings (secure: true)
- Set up proper SSL certificates

### Google Console Updates
- Add production redirect URIs
- Configure OAuth consent screen
- Set up proper scopes and permissions

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

#### `validateAndRefreshSession(req)`
Validates session tokens and automatically refreshes if needed.

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

#### `start()`
Starts the automatic sync process.

#### `stop()`
Stops the automatic sync process.

