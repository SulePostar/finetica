# File Upload System Documentation

## Overview

This documentation covers the complete file upload system integrated with Supabase storage, providing secure file uploads, profile image management, and comprehensive file handling capabilities.

## Components

### 1. Frontend Services

#### FileUploadService (`client/src/services/fileUploadService.js`)

**Purpose**: Frontend service for handling file uploads through backend APIs.

**Key Methods**:

- `uploadFile(file, bucketName, description)` - Admin-only file upload
- `uploadProfileImage(file, firstName, lastName)` - Public profile image upload
- `deleteFile(fileId)` - Delete file from storage
- `validateImageFile(file)` - Client-side validation
- `createPreviewUrl(file)` - Generate preview URLs

**Usage Example**:

```javascript
import FileUploadService from '../services/fileUploadService';

// Upload profile image during registration
const result = await FileUploadService.uploadProfileImage(imageFile, 'John', 'Doe');

// Upload document (admin only)
const result = await FileUploadService.uploadFile(documentFile, 'kif', 'Financial document');
```

### 2. Backend Components

#### Routes (`server/routes/uploadedFiles.js`)

**Purpose**: Clean route definitions with proper middleware integration.

**Endpoints**:

##### Upload Routes

- `POST /api/files/upload-profile-image` - Public profile image upload
- `POST /api/files/upload` - Admin-protected file upload
- `DELETE /api/files/storage/:id` - Admin-protected file deletion

##### File Management Routes

- `GET /api/files/stats` - File statistics (admin only)
- `GET /api/files/my-files` - Current user's files
- `GET /api/files/` - All files with filters (admin only)
- `GET /api/files/:id` - Get specific file
- `POST /api/files/` - Create file record (admin only)
- `PUT /api/files/:id` - Update file record (admin only)
- `DELETE /api/files/:id` - Soft delete file (admin only)
- `DELETE /api/files/:id/permanent` - Hard delete file (admin only)

#### Controllers (`server/controllers/uploadedFiles.js`)

**Purpose**: Handle HTTP requests and delegate business logic to services.

**Key Methods**:

- `uploadProfileImage()` - Handle profile image uploads
- `uploadFile()` - Handle general file uploads
- `deleteFileFromStorage()` - Handle file deletion
- `getFiles()` - List files with pagination and filters
- `getFileStats()` - Get upload statistics

#### Services

##### UploadedFilesService (`server/services/uploadedFiles.js`)

**Purpose**: Business logic for file management and database operations.

**Key Methods**:

- `uploadProfileImage(file, firstName, lastName)` - Complete profile upload process
- `uploadFile(file, bucketName, userId, description)` - Complete file upload process
- `deleteFileFromStorage(fileId)` - Complete deletion process
- `validateBucket(bucketName)` - Validate bucket names
- `getAllowedBuckets()` - Get list of allowed buckets

##### SupabaseService (`server/services/supabaseService.js`)

**Purpose**: Direct integration with Supabase storage and low-level operations.

**Key Methods**:

- `uploadFile(fileBuffer, fileName, bucketName, mimeType)` - Upload to Supabase
- `uploadProfileImage(fileBuffer, firstName, lastName)` - Profile image upload
- `deleteFile(filePath, bucketName)` - Delete from Supabase
- `sanitizeFileName(filename)` - Clean filenames for storage
- `validateImageFile(file)` - Validate image files

#### Middleware

##### Upload Middleware (`server/middleware/uploadMiddleware.js`)

**Purpose**: Handle file upload configuration and validation.

**Components**:

- `profileImageUpload` - Multer config for profile images (5MB, images only)
- `fileUpload` - Multer config for general files (10MB, documents + images)
- `handleUploadErrors` - Error handling for upload failures

##### Authentication Middleware (`server/middleware/authMiddleware.js`)

**Purpose**: Protect admin-only endpoints.

**Usage**: Applied to routes that require admin access.

### 3. Configuration

#### Upload Configuration (`server/config/upload.js`)

**Purpose**: Centralized configuration for file upload limits and allowed types.

**Settings**:

- `MAX_FILE_SIZE`: 10MB for general files
- `MAX_IMAGE_SIZE`: 5MB for images
- `ALLOWED_IMAGE_TYPES`: JPEG, PNG, GIF, WebP
- `ALLOWED_DOCUMENT_TYPES`: PDF, Word, Excel, CSV, etc.

## Storage Structure

### Supabase Buckets

The system uses four main storage buckets:

1. **`kif`** - KIF-related documents
2. **`kuf`** - KUF-related documents
3. **`transactions`** - Transaction-related files
4. **`user-images`** - Profile images and user photos

### File Naming Convention

#### Regular Files

- Original filename is preserved with special character sanitization
- Example: `"Fikret Zajmović.docx"` → `"Fikret Zajmovic.docx"`

#### Profile Images

- Format: `{firstName}_{lastName}.{extension}`
- Example: `"john_doe.jpg"`
- Names are sanitized and converted to lowercase

## Database Schema

### UploadedFile Model

```sql
CREATE TABLE uploaded_files (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  bucket_name VARCHAR(50) NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

### 1. File Type Validation

- **Frontend**: Client-side validation for immediate feedback
- **Middleware**: Server-side validation using multer file filters
- **Whitelist Approach**: Only explicitly allowed file types are accepted

### 2. File Size Limits

- **Images**: 5MB maximum
- **Documents**: 10MB maximum
- **Configurable**: Easily adjustable in configuration file

### 3. Access Control

- **Public Routes**: Profile image upload (for registration)
- **Admin Routes**: All file management operations
- **User Routes**: Access to own files only

### 4. Filename Sanitization

- **Special Characters**: Converts accented characters to Latin equivalents
- **Unicode Safe**: Handles various Unicode encodings
- **Preserves Structure**: Maintains original filename format where possible

## API Reference

### Upload Profile Image

```http
POST /api/files/upload-profile-image
Content-Type: multipart/form-data

Body:
- profileImage: File (required)
- firstName: String (required)
- lastName: String (required)
```

**Response**:

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "imageUrl": "https://supabase.co/storage/v1/object/public/user-images/john_doe.jpg",
    "fileName": "john_doe.jpg"
  }
}
```

### Upload File (Admin Only)

```http
POST /api/files/upload
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Body:
- file: File (required)
- bucketName: String (required) - One of: kif, kuf, transactions
- description: String (optional)
```

**Response**:

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 123,
    "fileName": "document.pdf",
    "fileUrl": "https://supabase.co/storage/v1/object/public/kif/document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "bucketName": "kif",
    "uploadedBy": 1,
    "description": "Important document",
    "createdAt": "2025-08-04T10:00:00Z"
  }
}
```

### Get Files (Admin Only)

```http
GET /api/files?page=1&limit=10&bucket_name=kif&search=document
Authorization: Bearer {admin_token}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "files": [...],
    "totalFiles": 50,
    "totalPages": 5,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get User Files

```http
GET /api/files/my-files?limit=20
Authorization: Bearer {user_token}
```

## Error Handling

### File Upload Errors

#### File Too Large

```json
{
  "success": false,
  "message": "File too large. Maximum size: 5MB"
}
```

#### Invalid File Type

```json
{
  "success": false,
  "message": "Invalid file type. Allowed types: image/jpeg, image/png, image/gif, image/webp"
}
```

#### Storage Error

```json
{
  "success": false,
  "message": "Upload failed: Storage upload failed: Invalid key"
}
```

### Authentication Errors

#### Unauthorized Access

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

## Integration Examples

### React Component Integration

```jsx
import React, { useState } from 'react';
import FileUploadService from '../services/fileUploadService';

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await FileUploadService.uploadFile(file, 'kif', 'User uploaded document');

      if (result.success) {
        console.log('Upload successful:', result.data);
      } else {
        console.error('Upload failed:', result.message);
      }
    } catch (error) {
      console.error('Upload error:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
};
```

### Profile Image Upload in Registration

```jsx
import FileUploadService from '../services/fileUploadService';

const handleRegistration = async (formData, profileImage) => {
  try {
    let profileImageUrl = null;

    // Upload profile image if provided
    if (profileImage) {
      const uploadResult = await FileUploadService.uploadProfileImage(
        profileImage,
        formData.firstName,
        formData.lastName
      );

      if (uploadResult.success) {
        profileImageUrl = uploadResult.url;
      }
    }

    // Register user with profile image URL
    const registrationData = {
      ...formData,
      profileImage: profileImageUrl,
    };

    const result = await authService.register(registrationData);
    // Handle registration result...
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

## Environment Variables

Required environment variables for Supabase integration:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Upload Configuration
MAX_FILE_SIZE_MB=10
MAX_IMAGE_SIZE_MB=5
```

## Deployment Considerations

### 1. Storage Bucket Setup

- Ensure all required buckets exist in Supabase
- Configure proper bucket policies for public access
- Set up appropriate CORS settings

### 2. File Size Limits

- Adjust limits based on server capacity
- Consider CDN for large file delivery
- Monitor storage usage and costs

### 3. Security

- Regularly audit file access patterns
- Implement file scanning for malware if needed
- Monitor for abuse of upload endpoints

### 4. Performance

- Enable caching for frequently accessed files
- Consider implementing file compression
- Monitor upload success rates and error patterns

## Troubleshooting

### Common Issues

#### 1. "Invalid key" Error

- **Cause**: Special characters in filename not properly sanitized
- **Solution**: Check `sanitizeFileName()` function in SupabaseService

#### 2. Upload Fails Silently

- **Cause**: Missing authentication or wrong bucket name
- **Solution**: Verify JWT token and bucket validation

#### 3. File Not Found After Upload

- **Cause**: Bucket configuration or URL generation issue
- **Solution**: Check Supabase bucket settings and public access

#### 4. Large Files Timeout

- **Cause**: Server timeout limits
- **Solution**: Increase timeout settings or implement chunked uploads

### Debug Mode

To enable debug logging, add console.log statements in:

- `SupabaseService.uploadFile()` - Track storage operations
- `UploadedFilesController` methods - Monitor request handling
- Frontend services - Debug client-side issues

## Future Enhancements

### Potential Improvements

1. **Chunked Uploads**: For very large files
2. **Image Resizing**: Automatic thumbnail generation
3. **File Preview**: Built-in file preview functionality
4. **Bulk Operations**: Multiple file upload/delete
5. **File Versioning**: Track file changes over time
6. **Advanced Search**: Full-text search in file contents
7. **File Sharing**: Generate shareable links with expiration
8. **Analytics**: Upload patterns and usage statistics

### Migration Path

If moving from this system to another storage provider:

1. **Export file metadata** from database
2. **Download files** from Supabase storage
3. **Update configuration** for new provider
4. **Migrate SupabaseService** to new storage service
5. **Test upload/download** functionality
6. **Update frontend** services if needed

---

## Support

For issues or questions regarding the file upload system:

1. Check this documentation first
2. Review error logs in both frontend and backend
3. Verify Supabase configuration and bucket settings
4. Test with minimal examples to isolate issues

**Last Updated**: August 4, 2025
**Version**: 1.0.0
