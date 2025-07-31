# Google Drive Integration Documentation

## Overview

This documentation covers the Google Drive integration in the Finetica application, which allows users to authenticate with Google Drive and automatically sync files from a specific "finetica" folder.

## Architecture

The Google Drive integration consists of several components:

### Backend Components
- **Authentication Routes** (`/server/routes/googleDrive/googleDrive.js`)
- **Drive API Routes** (`/server/routes/googleDrive/drive.js`)
- **Google Drive Configuration** (`/server/config/googleDrive.js`)

### Frontend Components
- **Google Drive Service** (`/client/src/services/googleDriveService.js`)
- **Google Auth Button** (`/client/src/components/GoogleAuth/GoogleAuthButton.jsx`)
- **AppSidebar Integration** (`/client/src/components/AppSidebar.jsx`)

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
DB_PORT=5432
DB_NAME=finetica
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=4000
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
VITE_DRIVE_API_BASE_URL=http://localhost:4000
```

## File Structure

```
server/
├── config/
│   └── googleDrive.js              # Google OAuth2 client configuration
├── routes/
│   └── googleDrive/
│       ├── googleDrive.js          # Authentication routes
│       └── drive.js                # File download/sync routes
└── googleDriveDownloads/           # Local storage for downloaded files

client/
├── src/
│   ├── services/
│   │   └── googleDriveService.js   # Frontend service for API calls
│   └── components/
│       ├── GoogleAuth/
│       │   └── GoogleAuthButton.jsx # Authentication button component
│       └── AppSidebar.jsx          # Main sidebar with status indicator
└── documentation/
    └── google-drive-integration.md # This documentation
```

## Backend Implementation

### Authentication Flow (`googleDrive.js`)

#### Routes:
- `GET /auth/google` - Initiates OAuth flow
- `GET /auth/google/callback` - Handles OAuth callback
- `GET /auth/google/status` - Checks authentication status

#### Session Management:
- Sessions expire after 24 hours
- Tokens are stored in `req.session.tokens`
- Session creation time tracked in `req.session.createdAt`

### File Sync API (`drive.js`)

#### Routes:
- `GET /api/drive/files/download-new` - Downloads new/updated files
- `POST /api/drive/files/download-new` - Manual download trigger

#### Features:
- **Folder Restriction**: Only downloads files from "finetica" folder
- **Smart Sync**: Compares modification times to avoid unnecessary downloads
- **File Type Support**: 
  - Regular files (PDF, images, etc.) - direct download
  - Google Apps files (Docs, Sheets, Slides) - exported to Office formats
- **Local Storage**: Files saved to `server/googleDriveDownloads/`

### Configuration (`config/googleDrive.js`)

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

### Google Drive Service (`googleDriveService.js`)

```javascript
class GoogleDriveService {
    async checkConnection()          // Check authentication status
    async downloadFiles()            // Trigger automatic download
    async downloadFilesManual()      // Trigger manual download
    isConnected(status)             // Helper to check connection status
    getStatusDisplay(status)        // Get display status string
}
```

### Components

#### GoogleAuthButton
- Displays connection status
- Handles authentication flow
- Shows appropriate UI based on connection state

#### AppSidebar Integration
- **Auto Status Check**: Every 5 seconds
- **Auto Download**: Every 10 seconds when connected
- **Window Focus**: Checks status when user returns from auth

## Usage Flow

### 1. Initial Authentication
1. User clicks "Prijavi se s Google Drive" button
2. Redirected to Google OAuth consent screen
3. After approval, redirected back to application
4. Session tokens stored on server
5. Status automatically updates in UI

### 2. Automatic File Sync
1. Background process checks connection every 5 seconds
2. If connected, downloads new files every 10 seconds
3. Only processes files from "finetica" folder in Google Drive
4. Compares modification times to avoid duplicate downloads
5. Updates local file timestamps to match Google Drive

### 3. File Processing
- **New Files**: Downloaded immediately
- **Updated Files**: Re-downloaded if Drive version is newer
- **Unchanged Files**: Skipped to save bandwidth
- **Google Apps Files**: Exported to Office formats (.docx, .xlsx, .pptx)

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
- Sessions expire after 24 hours
- Secure cookie settings for production (HTTPS)
- Session secrets should be cryptographically strong

### File Access
- Only files from "finetica" folder are accessible
- Downloaded files stored in secure server directory
- No direct file serving to prevent unauthorized access

## Monitoring and Logging

### Server Logs
```
✅ Google authentication successful - session will last 24 hours
📁 Found 5 files in "finetica" folder
📥 New file found: document.pdf
✅ Downloaded: document.pdf
⏭️ File is up to date: spreadsheet.xlsx
```

### Client Logs
- Connection status changes
- Download success/failure
- Authentication state transitions

## Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Check CLIENT_ID and CLIENT_SECRET in .env
   - Verify redirect URI matches Google Console settings
   - Ensure Google Drive API is enabled

2. **Files Not Downloading**
   - Verify "finetica" folder exists in Google Drive
   - Check file permissions in Google Drive
   - Confirm session hasn't expired

3. **Status Not Updating**
   - Check network connectivity
   - Verify server is running on correct port
   - Check browser console for errors

### Development Tips

1. **Testing Authentication**
   - Use incognito mode to test fresh auth flow
   - Check server logs for authentication success/failure
   - Verify session data in browser dev tools

2. **File Sync Testing**
   - Add files to "finetica" folder in Google Drive
   - Monitor server logs for download activity
   - Check `server/googleDriveDownloads/` directory

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

### Authentication Endpoints

#### `GET /auth/google`
Initiates Google OAuth flow.

**Response**: 302 redirect to Google consent screen

#### `GET /auth/google/callback`
Handles OAuth callback from Google.

**Parameters**:
- `code` (query) - Authorization code from Google

**Response**: 302 redirect to client application

#### `GET /auth/google/status`
Checks current authentication status.

**Response**:
```json
{
  "authenticated": true,
  "sessionValid": true,
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
  "message": "✅ Obradno 5 fajlova iz \"finetica\" foldera. Preuzeto: 2, Preskočeno: 3",
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

## Version History

- **v1.0** - Initial implementation with basic auth and file download
- **v1.1** - Added smart sync with modification time comparison
- **v1.2** - Added support for Google Apps files export
- **v1.3** - Implemented automatic background sync
- **v1.4** - Added folder restriction to "finetica" only
