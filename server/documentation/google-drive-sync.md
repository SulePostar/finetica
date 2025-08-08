# Google Drive to Supabase Synchronization - Complete Documentation

## Table of Contents

- [Overview](#overview)
- [Quick Setup Guide](#quick-setup-guide)
- [Detailed Setup](#detailed-setup)
- [How It Works](#how-it-works)
- [Running the Sync](#running-the-sync)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Performance & Optimization](#performance--optimization)
- [Security](#security)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 📋 Overview

This synchronization system automatically syncs files between Google Drive folders and Supabase storage buckets. It ensures that all files uploaded to specific Google Drive folders are also available in corresponding Supabase storage buckets.

### 🎯 What it does:

- **Monitors** three Google Drive folders: `kif`, `kuf`, and `transactions`
- **Syncs** files to corresponding Supabase storage buckets
- **Handles** Google Apps files (Docs, Sheets, Slides) by converting them to standard formats
- **Provides** detailed progress tracking and error reporting
- **Processes** files in batches for optimal performance

### 🏗️ System Architecture

```
Google Drive Folders          Supabase Storage Buckets
├── My Drive/
│   ├── kif/          ────────├── kif (bucket)
│   ├── kuf/          ────────┼── kuf (bucket)
│   └── transactions/ ────────┼── transactions (bucket)
```

### File Processing Flow:

1. **Scan** Google Drive folders for files
2. **Compare** with existing files in Supabase buckets
3. **Download** missing files from Google Drive
4. **Convert** Google Apps files to standard formats
5. **Upload** to appropriate Supabase bucket
6. **Clean up** temporary files

---

## 🚀 Quick Setup Guide

### ✅ Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] Google account with Drive access
- [ ] Supabase account

### ✅ Step 1: Google Cloud Console (5 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:4000/auth/google/callback`
6. Configure OAuth consent screen
7. Add yourself as test user

### ✅ Step 2: Supabase Setup (3 min)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create/select project
3. Go to Storage → Create buckets:
   - `kif`
   - `kuf`
   - `transactions`
4. Copy Project URL and service_role key

### ✅ Step 3: Google Drive Structure (2 min)

Create folder structure:

```
📁 My Drive/
├── 📁 kif/
├── 📁 kuf/
└── 📁 transactions/
```

Get folder IDs from URLs

### ✅ Step 4: Environment Variables

Copy this template to your `.env`:

```env
# Google Drive API
CLIENT_ID=your_client_id.apps.googleusercontent.com
CLIENT_SECRET=GOCSPX-your_client_secret
REDIRECT_URI=http://localhost:4000/auth/google/callback

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Drive Folders
GOOGLE_DRIVE_KIF_FOLDER_ID=your_kif_folder_id
GOOGLE_DRIVE_KUF_FOLDER_ID=your_kuf_folder_id
GOOGLE_DRIVE_TRANSACTIONS_FOLDER_ID=your_transactions_folder_id

# Will be added in next step
GOOGLE_REFRESH_TOKEN=
```

### ✅ Step 5: Get Refresh Token (2 min)

```bash
# 1. Get auth URL
node sync/get-auth-url.js

# 2. Visit URL, authorize, copy code from callback

# 3. Edit sync/get-refresh-token.js with your code and run:
node sync/get-refresh-token.js

# 4. Add the refresh token to .env
```

### ✅ Step 6: Test & Run

```bash
# Test the sync
node sync/googleDriveSync.js
```

### 🎯 Expected Output

```
[2025-08-03T10:30:00.000Z] ℹ️  Starting Google Drive to Supabase sync...

📁 Syncing KIF...
📊 Found 2 files to upload in KIF
✅ Uploaded document.pdf to kif (2.5MB)
📤 [1/2] Uploaded: document.pdf

📋 Sync Summary:
🎯 Overall: 2/2 files synced successfully
📊 Success rate: 100.0%
✅ Sync completed! 2 new files added to Supabase storage.
```

---

## 🛠️ Detailed Setup

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Google Cloud Project** with Drive API enabled
3. **Supabase Project** with storage buckets created
4. **Google Drive** folder structure set up

### Step 1: Install Dependencies

```bash
cd /path/to/your/project/server
npm install @supabase/supabase-js googleapis dotenv
```

### Step 2: Google Cloud Console Setup

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing one

2. **Enable Google Drive API:**
   - Navigate to **APIs & Services** → **Library**
   - Search for "Google Drive API" and enable it

3. **Create OAuth 2.0 Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:4000/auth/google/callback`

4. **Configure OAuth Consent Screen:**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields (app name, email, etc.)
   - Add your email as a test user

### Step 3: Supabase Setup

1. **Create Supabase Project:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project or select existing one

2. **Create Storage Buckets:**
   - Navigate to **Storage** in your Supabase dashboard
   - Create three buckets:
     - `kif`
     - `kuf`
     - `transactions`
   - Set appropriate permissions (allow uploads)

3. **Get API Keys:**
   - Go to **Settings** → **API**
   - Copy **Project URL** and **service_role** key

### Step 4: Google Drive Folder Setup

1. **Create Folder Structure:**

   ```
   📁 My Drive/
   ├── 📁 kif/
   ├── 📁 kuf/
   └── 📁 transactions/
   ```

2. **Get Folder IDs:**
   - Open each folder in Google Drive
   - Copy the folder ID from the URL:
     ```
     https://drive.google.com/drive/folders/FOLDER_ID_HERE
     ```

### Step 5: Environment Configuration

Create or update your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=4000

# Google Drive API
CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_SECRET=GOCSPX-your_client_secret
REDIRECT_URI=http://localhost:4000/auth/google/callback

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Drive Authentication
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Google Drive Folder IDs
GOOGLE_DRIVE_KIF_FOLDER_ID=your_kif_folder_id
GOOGLE_DRIVE_KUF_FOLDER_ID=your_kuf_folder_id
GOOGLE_DRIVE_TRANSACTIONS_FOLDER_ID=your_transactions_folder_id

# Optional: Debugging
DEBUG=false
```

### Step 6: Get Google Refresh Token

1. **Generate Authorization URL:**

   ```bash
   node sync/get-auth-url.js
   ```

2. **Visit the URL** and authorize the application

3. **Extract Authorization Code** from the callback URL

4. **Get Refresh Token:**

   ```bash
   # Edit sync/get-refresh-token.js with your authorization code
   node sync/get-refresh-token.js
   ```

5. **Add Refresh Token** to your `.env` file

---

## 🔧 How It Works

### 1. **Authentication**

- Uses OAuth 2.0 refresh token for Google Drive API access
- Uses Supabase service role key for storage operations

### 2. **File Discovery**

```javascript
// Gets all files from Google Drive folder
const driveFiles = await drive.files.list({
  q: `'${folderId}' in parents and trashed=false`,
  fields: 'files(id, name, mimeType, size, modifiedTime)',
});

// Gets all files from Supabase bucket
const { data: supabaseFiles } = await supabase.storage.from(bucketName).list('', { limit: 1000 });
```

### 3. **File Comparison**

- Creates maps of files by filename
- Identifies files missing from Supabase
- Handles Google Apps files by adding appropriate extensions

### 4. **File Processing**

```javascript
// Google Apps files are exported to standard formats
if (mimeType.startsWith('application/vnd.google-apps.')) {
  // Google Docs → .docx
  // Google Sheets → .xlsx
  // Google Slides → .pptx
  const response = await drive.files.export({
    fileId,
    mimeType: exportFormat,
  });
}
```

### 5. **Batch Processing**

- Processes files in batches of 5 (configurable)
- Parallel processing within each batch
- Immediate cleanup of temporary files

### 6. **Error Handling**

- Retry logic with exponential backoff
- Individual file failure doesn't stop the process
- Comprehensive error logging

### 📊 File Format Handling

#### Regular Files

- **Direct transfer**: PDFs, images, text files, etc.
- **Preserves**: Original filename and format

#### Google Apps Files

| Google Format   | Export Format             | Extension |
| --------------- | ------------------------- | --------- |
| Google Docs     | Word Document (.docx)     | `.docx`   |
| Google Sheets   | Excel Spreadsheet (.xlsx) | `.xlsx`   |
| Google Slides   | PowerPoint (.pptx)        | `.pptx`   |
| Google Drawings | PDF                       | `.pdf`    |

#### File Size Limits

- **Maximum**: 50MB per file (Supabase free tier limit)
- **Check**: Performed before upload
- **Handling**: Large files are skipped with error message

---

## 🚀 Running the Sync

### Manual Sync

```bash
node sync/googleDriveSync.js
```

### Automated Sync (Cron Job)

```bash
# Run every hour
0 * * * * cd /path/to/your/project/server && node sync/googleDriveSync.js

# Run daily at 2 AM
0 2 * * * cd /path/to/your/project/server && node sync/googleDriveSync.js
```

### Using Node.js Scheduler

```javascript
const cron = require('node-cron');

// Run every 6 hours
cron.schedule('0 */6 * * *', () => {
  require('./sync/googleDriveSync.js');
});
```

### 🔍 Monitoring Log Output

```
[2025-08-03T10:30:00.000Z] ℹ️  Starting Google Drive to Supabase sync...

📁 Syncing KIF...
📊 Found 3 files to upload in KIF
📤 Uploading document.pdf (2.5MB)...
✅ Uploaded document.pdf to kif (2.5MB)
📤 [1/3] Uploaded: document.pdf

📋 Sync Summary:
================
📁 KIF: 3/3 uploaded
📁 KUF: 1/1 uploaded
📁 TRANSACTIONS: 0/0 uploaded

🎯 Overall: 4/4 files synced successfully
📊 Success rate: 100.0%
✅ Sync completed! 4 new files added to Supabase storage.

[2025-08-03T10:30:45.000Z] ✅ Sync completed in 45.23 seconds
```

---

## ⚙️ Configuration

### Environment Configuration File (.env.sync) (optional) - not applied currently

```bash
# Google Drive to Supabase Sync Configuration

## File Size Limits
MAX_FILE_SIZE_MB=50

## Batch Processing
BATCH_SIZE=5
MAX_RETRIES=3

## Rate Limiting
RATE_LIMIT_DELAY_MS=1000

## Debugging
DEBUG=false

## Supported File Types (for Google Apps exports)
EXPORT_GOOGLE_DOCS_AS=application/vnd.openxmlformats-officedocument.wordprocessingml.document
EXPORT_GOOGLE_SHEETS_AS=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
EXPORT_GOOGLE_SLIDES_AS=application/vnd.openxmlformats-officedocument.presentationml.presentation

## File Extensions for Google Apps
GOOGLE_DOCS_EXTENSION=.docx
GOOGLE_SHEETS_EXTENSION=.xlsx
GOOGLE_SLIDES_EXTENSION=.pptx
```

### Performance Options

```javascript
// Batch size for parallel processing
const BATCH_SIZE = 5; // Adjust based on your needs

// Retry attempts for failed downloads
const MAX_RETRIES = 3;

// File size limit (in bytes)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
```

### Debug Mode

Enable detailed logging:

```env
DEBUG=true
```

---

## 🐛 Troubleshooting

### Authentication Issues

#### Error: "403 Access Denied" when visiting auth URL

```
Pristup je blokiran: aplikacija nije dovršila Googleov postupak potvrđivanja
```

**Causes:**

- App not verified by Google
- User not added as test user

**Solutions:**

1. **Add yourself as test user:**
   - Go to Google Cloud Console → APIs & Services → OAuth consent screen
   - Scroll to "Test users" section
   - Click "+ ADD USERS"
   - Add your email address

2. **Check OAuth consent screen:**
   - Ensure User Type is "External"
   - Fill all required fields
   - Save configuration

#### Error: "401 Invalid Client"

```
Error 401: invalid_client
```

**Causes:**

- Wrong Client ID format
- Incorrect redirect URI

**Solutions:**

1. **Check Client ID format:**

   ```env
   # ❌ Wrong (has http://)
   CLIENT_ID=http://906234456020-abc123.apps.googleusercontent.com

   # ✅ Correct
   CLIENT_ID=906234456020-abc123.apps.googleusercontent.com
   ```

2. **Verify redirect URIs in Google Cloud Console:**
   - Must match exactly what's in your .env file
   - Add both: `http://localhost:4000/auth/google/callback` and `urn:ietf:wg:oauth:2.0:oob`

#### Error: "Missing GOOGLE_REFRESH_TOKEN"

```
❌ Missing GOOGLE_REFRESH_TOKEN in .env file
```

**Solution:**

1. Run the auth URL script: `node sync/get-auth-url.js`
2. Visit the URL and authorize
3. Extract code from callback URL
4. Update `sync/get-refresh-token.js` with the code
5. Run: `node sync/get-refresh-token.js`
6. Add the token to your `.env` file

### Supabase Issues

#### Error: "Bucket does not exist"

```
❌ Error fetching files from Supabase bucket kif: Bucket not found
```

**Solution:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Storage
3. Create missing buckets: `kif`, `kuf`, `transactions`
4. Ensure bucket names are exactly lowercase

#### Error: "Invalid JWT" or "Authentication failed"

```
❌ Missing Supabase configuration
```

**Causes:**

- Wrong Supabase URL
- Wrong service role key
- Using anon key instead of service role key

**Solutions:**

1. **Get correct keys from Supabase:**
   - Go to Settings → API
   - Copy **Project URL** (not the reference ID)
   - Copy **service_role** key (not anon/public key)

2. **Update .env file:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Google Drive Issues

#### Error: "Kif folder not found"

```
❌ Error fetching files from Drive folder undefined
```

**Causes:**

- Folder doesn't exist
- Wrong folder ID
- No access permissions

**Solutions:**

1. **Create folder structure:**

   ```
   📁 My Drive/
   ├── 📁 kif/
   ├── 📁 kuf/
   └── 📁 transactions/
   ```

2. **Get correct folder IDs:**
   - Open folder in Google Drive
   - Copy ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Update .env with correct IDs

3. **Check permissions:**
   - Ensure folders are not private
   - Make sure the Google account has access

#### Error: "Files list empty" but folder has files

```
📊 Found 0 files to upload in KIF
```

**Causes:**

- Files are in trash
- Files are in subfolders
- Permission issues

**Solutions:**

1. **Check trash:** Restore any accidentally deleted files
2. **Move files:** Ensure files are directly in the folder (not subfolders)
3. **Check file ownership:** Make sure files aren't restricted

### File Processing Issues

#### Error: "File too large"

```
❌ File document.pdf (75.5MB) exceeds 50MB limit
```

**Solutions:**

1. **Compress files** before uploading to Google Drive
2. **Upgrade Supabase plan** for higher limits
3. **Split large files** into smaller parts

#### Error: "Unsupported file type"

```
❌ Unsupported Google Apps file type: application/vnd.google-apps.map
```

**Solution:**

- Some Google Apps file types aren't supported
- Convert to standard format before uploading
- Supported: Docs, Sheets, Slides, Drawings

#### Error: "Download failed" repeatedly

```
⚠️  Download attempt 3/3 failed for document.pdf: Request timeout
```

**Causes:**

- Network connectivity issues
- File corruption
- Google Drive API rate limits

**Solutions:**

1. **Check internet connection**
2. **Try again later** (may be temporary issue)
3. **Increase retry count** in script configuration

### Performance Issues

#### Sync takes very long

**Solutions:**

1. **Reduce batch size:**

   ```javascript
   const BATCH_SIZE = 3; // Reduce from 5 to 3
   ```

2. **Check file sizes:** Large files take longer
3. **Monitor network speed**

#### Memory issues / Script crashes

**Solutions:**

1. **Reduce batch size**
2. **Add more memory to your system**
3. **Process fewer files at once**

### Environment & Configuration Issues

#### Error: "Cannot find module"

```
Error: Cannot find module '@supabase/supabase-js'
```

**Solution:**

```bash
npm install @supabase/supabase-js googleapis dotenv
```

#### Error: "ENOENT: no such file or directory"

```
Error: ENOENT: no such file or directory, open '.env'
```

**Solutions:**

1. **Check .env file location:** Must be in `/server/` directory
2. **Create .env file** if it doesn't exist
3. **Check file permissions**

#### Script runs but no output

**Causes:**

- All files already synced
- No files in Google Drive folders
- Silent errors

**Solutions:**

1. **Enable debug mode:**
   ```env
   DEBUG=true
   ```
2. **Check folder contents** in Google Drive
3. **Review log output** for errors

### 🔍 Debugging Steps

#### 1. Basic Checks

```bash
# Check if files exist
ls -la sync/
cat .env | grep -E "(GOOGLE|SUPABASE)"

# Test Node.js modules
node -e "console.log(require('@supabase/supabase-js'))"
```

#### 2. Test Individual Components

**Test Google Drive Access:**

```javascript
// Create test-google.js
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

drive.files
  .list({ pageSize: 1 })
  .then((res) => console.log('✅ Google Drive access OK'))
  .catch((err) => console.error('❌ Google Drive error:', err.message));
```

**Test Supabase Access:**

```javascript
// Create test-supabase.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase.storage
  .from('kif')
  .list('', { limit: 1 })
  .then((res) => console.log('✅ Supabase access OK'))
  .catch((err) => console.error('❌ Supabase error:', err.message));
```

#### 3. Environment Validation Checklist

| Check         | Command                          | Expected Result |
| ------------- | -------------------------------- | --------------- |
| Node.js       | `node --version`                 | v14+            |
| Dependencies  | `npm list @supabase/supabase-js` | Installed       |
| Env File      | `ls -la .env`                    | Exists          |
| Google Auth   | `echo $CLIENT_ID`                | Not empty       |
| Supabase URL  | `echo $VITE_SUPABASE_URL`        | Not empty       |
| Refresh Token | `echo $GOOGLE_REFRESH_TOKEN`     | Not empty       |

### 🆘 Quick Fix Reference

| Issue                   | Quick Fix                                              |
| ----------------------- | ------------------------------------------------------ |
| "403 Access Denied"     | Add yourself as test user in OAuth consent             |
| "Missing refresh token" | Run get-auth-url.js → authorize → get-refresh-token.js |
| "Bucket does not exist" | Create buckets in Supabase dashboard                   |
| "Folder not found"      | Check folder IDs in .env                               |
| "Invalid client"        | Remove http:// from CLIENT_ID                          |
| "Cannot find module"    | Run npm install                                        |

---

## ⚡ Performance & Optimization

### Configuration Options

```javascript
// Batch size for parallel processing
const BATCH_SIZE = 5; // Adjust based on your needs

// Retry attempts for failed downloads
const MAX_RETRIES = 3;

// File size limit (in bytes)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
```

### Best Practices

1. **Batch Size**: Start with 5, increase if you have good bandwidth
2. **Monitoring**: Check logs regularly for errors
3. **Cleanup**: Script automatically cleans temporary files
4. **Rate Limiting**: Built-in delays prevent API rate limit issues

### Performance Tuning

- **Small files**: Increase batch size to 10
- **Large files**: Decrease batch size to 3
- **Slow network**: Increase retry delay
- **Fast network**: Decrease delays

---

## 🛡️ Security

### API Keys

- **Service Role Key**: Keep secure, has admin access to Supabase
- **Refresh Token**: Allows long-term Google Drive access
- **Environment Variables**: Never commit `.env` file to version control

### Permissions

- **Google Drive**: Read-only access to specific folders
- **Supabase**: Upload access to specific buckets
- **File Access**: Only processes files in designated folders

### Data Privacy

- **Temporary Files**: Automatically deleted after processing
- **No Persistent Storage**: Files only temporarily stored during transfer
- **Access Logs**: Monitor who accesses the sync functionality

---

## 📈 Monitoring & Maintenance

### Regular Checks

- **Monthly**: Review sync logs for errors
- **Weekly**: Check storage usage in Supabase
- **Daily**: Monitor automated sync results

### Maintenance Tasks

- **Update dependencies**: Keep packages current
- **Rotate credentials**: Refresh tokens periodically
- **Monitor quotas**: Google Drive API and Supabase limits
- **Backup configuration**: Keep environment variables backed up

### Performance Metrics

- **Sync duration**: Track how long syncs take
- **Success rate**: Monitor file sync success percentage
- **Error frequency**: Watch for recurring issues
- **Storage usage**: Monitor Supabase storage consumption

### Log Analysis

```bash
# Save logs to file
node sync/googleDriveSync.js > sync.log 2>&1

# Analyze success rate
grep "Success rate" sync.log

# Find errors
grep "❌" sync.log

# Check file counts
grep "📊 Found" sync.log
```

---

## 🔄 Future Enhancements

### Potential Improvements

- **Bidirectional sync**: Sync from Supabase back to Google Drive
- **File versioning**: Handle file updates and versions
- **Selective sync**: Choose specific file types to sync
- **Real-time sync**: Use webhooks for instant synchronization
- **Compression**: Automatic file compression before upload
- **Metadata sync**: Preserve file metadata and timestamps

### Scaling Considerations

- **Multiple instances**: Run sync across multiple servers
- **Database tracking**: Store sync history in database
- **Queue system**: Use job queue for large file processing
- **CDN integration**: Direct upload to CDN for better performance

---

## 📞 Support & Resources

### Files Structure

```
📁 sync/
├── 📄 googleDriveSync.js    # Main sync script
├── 📄 get-auth-url.js       # Get authorization URL
├── 📄 get-refresh-token.js  # Get refresh token
└── 📄 .env.sync            # Configuration template

📁 documentation/
└── 📄 google-drive-sync.md  # This documentation
```

### Environment Template

```env
# Copy this to your .env file and fill in the values

# Google Drive API
CLIENT_ID=your_client_id.apps.googleusercontent.com
CLIENT_SECRET=GOCSPX-your_client_secret
REDIRECT_URI=http://localhost:4000/auth/google/callback

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Drive Folders
GOOGLE_DRIVE_KIF_FOLDER_ID=your_kif_folder_id
GOOGLE_DRIVE_KUF_FOLDER_ID=your_kuf_folder_id
GOOGLE_DRIVE_TRANSACTIONS_FOLDER_ID=your_transactions_folder_id

# Google Authentication
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Optional
DEBUG=false
```

### Common Commands

```bash
# Run sync
node sync/googleDriveSync.js

# Get authorization URL
node sync/get-auth-url.js

# Get refresh token
node sync/get-refresh-token.js

# Run with logging
node sync/googleDriveSync.js > sync.log 2>&1

# Debug mode
DEBUG=true node sync/googleDriveSync.js
```
