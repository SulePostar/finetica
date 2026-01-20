# Finetica Technical Reference

> Complete technical documentation for the Finetica Financial Operations platform. This reference provides detailed information about API endpoints, data models, system architecture, and configuration for RAG (Retrieval Augmented Generation) purposes.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Authentication System](#authentication-system)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Data Models](#data-models)
5. [AI Document Processing](#ai-document-processing)
6. [File Storage System](#file-storage-system)
7. [Frontend Architecture](#frontend-architecture)
8. [Error Handling](#error-handling)
9. [Environment Configuration](#environment-configuration)
10. [Database Schema](#database-schema)

---

## System Architecture

### Technology Stack Overview

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 18.x | UI Framework |
| **Build Tool** | Vite | 5.x | Fast development/build |
| **Styling** | TailwindCSS | 3.x | Utility-first CSS |
| **State Management** | React Query | 5.x | Server state caching |
| **Routing** | React Router | 6.x | Client-side routing |
| **Backend** | Node.js | 18.x+ | Runtime environment |
| **API Framework** | Express | 4.x | HTTP server |
| **Database** | PostgreSQL | 14+ | Relational database |
| **ORM** | Sequelize | 6.x | Database abstraction |
| **Storage** | Supabase | - | Cloud file storage |
| **AI Service** | Google Gemini | 2.5 | Document processing |
| **Email** | SendGrid | - | Transactional emails |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    React Frontend (Vite)                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │  Pages  │ │Component│ │  Hooks  │ │ Context │ │  API    │   │   │
│  │  │         │ │Library  │ │         │ │         │ │ Client  │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────┬────┘   │   │
│  └───────────────────────────────────────────────────────┼─────────┘   │
└──────────────────────────────────────────────────────────┼─────────────┘
                                                           │
                                                      HTTP/REST
                                                           │
┌──────────────────────────────────────────────────────────┼─────────────┐
│                           Server Layer                    │             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Express.js Backend                            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │ Routes  │ │  Cont-  │ │Services │ │ Middle- │ │ Models  │   │   │
│  │  │         │ │ rollers │ │         │ │  ware   │ │         │   │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └─────────┘ └────┬────┘   │   │
│  └───────┼───────────┼───────────┼───────────────────────┼─────────┘   │
│          │           │           │                       │             │
└──────────┼───────────┼───────────┼───────────────────────┼─────────────┘
           │           │           │                       │
           │           │           │                       │
┌──────────┼───────────┼───────────┼───────────────────────┼─────────────┐
│          │    External Services  │                       │             │
│  ┌───────▼───────┐ ┌─────▼──────┐ ┌─────────────┐ ┌─────▼──────┐      │
│  │   Supabase    │ │ Google AI  │ │  SendGrid   │ │ PostgreSQL │      │
│  │   Storage     │ │   Gemini   │ │   Email     │ │  Database  │      │
│  └───────────────┘ └────────────┘ └─────────────┘ └────────────┘      │
└───────────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request**: Browser sends HTTP request to API
2. **CORS Middleware**: Validates origin against allowed domains
3. **Authentication Middleware**: Validates JWT token
4. **Route Handler**: Routes request to appropriate controller
5. **Controller**: Handles HTTP concerns, delegates to service
6. **Service**: Contains business logic, interacts with models
7. **Model**: Sequelize model, interacts with database
8. **Response**: JSON response sent back to client

---

## Authentication System

### Authentication Flow

```
┌─────────────┐     POST /api/auth/login      ┌─────────────┐
│   Client    │ ─────────────────────────────▶│   Server    │
│             │     { email, password }       │             │
└─────────────┘                               └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │  Validate   │
                                              │ Credentials │
                                              └──────┬──────┘
                                                     │
                                              ┌──────▼──────┐
                                              │ Generate    │
                                              │ Tokens      │
                                              └──────┬──────┘
                                                     │
┌─────────────┐     { accessToken,            ┌──────▼──────┐
│   Client    │ ◀─────refreshToken }──────────│   Server    │
│             │                               │             │
└─────────────┘                               └─────────────┘
```

### Token Types

| Token Type | Location | Lifespan | Purpose |
|------------|----------|----------|---------|
| Access Token | Authorization header | Short (minutes/hours) | API authentication |
| Refresh Token | HTTP-only cookie | Long (days) | Token renewal |

### JWT Token Structure

**Access Token Payload:**
```json
{
  "userId": 123,
  "email": "user@example.com",
  "roleId": 1,
  "roleName": "admin",
  "iat": 1705738800,
  "exp": 1705742400
}
```

### Authentication Service Methods

#### `register(registerData)`
Registers a new user with hashed password.

**Input:**
```javascript
{
  email: string,      // Required, unique, valid email
  password: string,   // Required, min 6 characters
  firstName: string,  // Required
  lastName: string,   // Required
  profileImage: string // Optional, URL to profile image
}
```

**Process:**
1. Check if email already exists
2. Hash password using bcrypt
3. Create user with default status (Pending)
4. Send welcome email (via SendGrid)
5. Return user data (excluding password)

**Output:**
```javascript
{
  user: { id, email, firstName, lastName, roleId, statusId, ... }
}
```

#### `login(loginData)`
Authenticates user and returns tokens.

**Input:**
```javascript
{
  email: string,
  password: string
}
```

**Process:**
1. Find user by email (with password scope)
2. Check if user exists
3. Check if password matches (bcrypt compare)
4. Check if account is enabled
5. Check if status allows login (Active)
6. Generate access token (JWT)
7. Generate refresh token (random bytes)
8. Store refresh token in database
9. Update lastLoginAt
10. Set refresh token as HTTP-only cookie
11. Return access token and user data

**Output:**
```javascript
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  user: { id, email, firstName, lastName, roleName, statusName, ... }
}
```

#### `rotateTokens(refreshToken)`
Rotates both access and refresh tokens.

**Process:**
1. Find refresh token in database
2. Check if token is expired
3. Delete old refresh token
4. Generate new access token
5. Generate new refresh token
6. Store new refresh token
7. Return new tokens

#### `requestPasswordReset(email)`
Initiates password reset process.

**Process:**
1. Find user by email
2. Generate password reset token (crypto random)
3. Set token expiration (1 hour)
4. Store token in user record
5. Send reset email via SendGrid
6. Return success message

#### `resetPassword(token, newPassword)`
Completes password reset.

**Process:**
1. Find user by reset token
2. Check if token is expired
3. Hash new password
4. Update user password
5. Clear reset token and expiry
6. Invalidate all refresh tokens
7. Return success message

### Password Hashing

```javascript
// Hashing (during registration/password change)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Comparison (during login)
const isMatch = await bcrypt.compare(password, user.passwordHash);
```

### Middleware: `authMiddleware`

Protects routes requiring authentication:

```javascript
// Usage in routes
router.get('/protected', authMiddleware, controller.method);
```

**Process:**
1. Extract token from Authorization header (`Bearer <token>`)
2. Verify token using JWT_SECRET
3. Decode token to get user ID
4. Attach user to request object
5. Call next() or return 401

### Middleware: `adminMiddleware`

Protects admin-only routes:

```javascript
router.get('/admin-only', authMiddleware, adminMiddleware, controller.method);
```

**Process:**
1. Check if req.user exists
2. Check if user.roleName is 'admin'
3. Call next() or return 403

---

## API Endpoints Reference

### Base URL

All API endpoints are prefixed with `/api` (except Google Drive routes).

### Authentication Endpoints

#### POST `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "profileImage": "https://storage.example.com/image.jpg" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roleId": null,
      "statusId": 1,
      "isEmailVerified": false,
      "isEnabled": true
    }
  }
}
```

**Errors:**
- 400: Validation error
- 409: Email already exists

#### POST `/api/auth/login`

Authenticates user and returns tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roleName": "admin",
    "statusName": "active",
    "profileImage": "https://..."
  }
}
```

**Cookies Set:**
- `refreshToken`: HTTP-only, secure, 30-day expiry

**Errors:**
- 400: Missing credentials
- 401: Invalid credentials
- 403: Account disabled or not approved

#### POST `/api/auth/refresh-token`

Refreshes access token using refresh token cookie.

**Request:** Cookie with refreshToken

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- 401: Invalid or expired refresh token

#### POST `/api/auth/request-password-reset`

Sends password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent"
}
```

#### POST `/api/auth/reset-password`

Resets password using token from email.

**Request Body:**
```json
{
  "token": "abc123resettoken",
  "new_password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Errors:**
- 400: Invalid or expired token

---

### Users Endpoints

All endpoints require authentication. Most require admin role.

#### GET `/api/users`

Lists all users with pagination and filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 10 | Items per page |
| roleId | number | null | Filter by role |
| statusId | number | null | Filter by status |
| search | string | null | Search by name/email |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "fullName": "Admin User",
      "roleName": "admin",
      "statusName": "active",
      "isEnabled": true,
      "lastLoginAt": "2026-01-20T10:00:00Z"
    }
  ],
  "total": 25
}
```

#### GET `/api/users/:id`

Gets single user by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://...",
    "roleId": 2,
    "roleName": "user",
    "statusId": 2,
    "statusName": "active",
    "isEnabled": true,
    "lastLoginAt": "2026-01-20T10:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

#### PUT `/api/users/:id`

Updates user information. Admin only.

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "roleId": 2,
  "statusId": 2,
  "isEnabled": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

---

### KIF (Sales Invoice) Endpoints

#### GET `/api/kif`

Lists sales invoices with pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 10 | Items per page |
| sortField | string | 'createdAt' | Sort field |
| sortOrder | string | 'desc' | Sort direction |
| invoiceType | string | null | Filter by type |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-2026-001",
      "invoiceDate": "2026-01-15",
      "businessPartnerId": 5,
      "businessPartner": {
        "id": 5,
        "name": "Customer Corp"
      },
      "netTotal": 1000.00,
      "vatAmount": 170.00,
      "grossTotal": 1170.00,
      "invoiceType": "regular",
      "approvedAt": null,
      "approvedBy": null,
      "filename": "invoice_001.pdf",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 50
}
```

#### GET `/api/kif/:id`

Gets single sales invoice with details.

**Response (200):**
```json
{
  "id": 1,
  "invoiceNumber": "INV-2026-001",
  "invoiceDate": "2026-01-15",
  "businessPartner": {
    "id": 5,
    "name": "Customer Corp",
    "shortName": "CC"
  },
  "netTotal": 1000.00,
  "vatAmount": 170.00,
  "grossTotal": 1170.00,
  "invoiceType": "regular",
  "approvedAt": null,
  "pdfUrl": "https://supabase.co/.../signed-url"
}
```

#### GET `/api/kif/:id/items`

Gets line items for an invoice.

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "salesInvoiceId": 1,
      "description": "Consulting Services",
      "quantity": 10,
      "unitPrice": 100.00,
      "totalPrice": 1000.00,
      "vatRate": 17
    }
  ]
}
```

#### GET `/api/kif/invoice-types`

Gets available invoice types.

**Response (200):**
```json
{
  "invoiceTypes": ["regular", "credit_note", "advance"]
}
```

#### POST `/api/kif/:id/approve`

Approves a sales invoice.

**Request Body (optional):**
```json
{
  "invoiceNumber": "corrected-number",
  "netTotal": 1050.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Invoice approved",
  "data": {
    "id": 1,
    "approvedAt": "2026-01-20T10:00:00Z",
    "approvedBy": 1
  }
}
```

---

### KUF (Purchase Invoice) Endpoints

#### GET `/api/kuf`

Lists purchase invoices. Same structure as KIF.

#### GET `/api/kuf/:id`

Gets single purchase invoice.

#### GET `/api/kuf/:id/items`

Gets line items for purchase invoice.

#### GET `/api/kuf/invoice-types`

Gets available invoice types.

#### POST `/api/kuf/:id/approve`

Approves a purchase invoice.

---

### Bank Transactions Endpoints

#### GET `/api/bank-transactions`

Lists bank transactions.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 10 | Items per page |
| timeFilter | string | 'all' | Time period filter |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "accountNumber": "1234567890",
      "statementDate": "2026-01-01",
      "openingBalance": 10000.00,
      "closingBalance": 15000.00,
      "totalDebit": 2000.00,
      "totalCredit": 7000.00,
      "filename": "statement_jan.pdf",
      "approvedAt": null,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 12
}
```

#### GET `/api/bank-transactions/:id`

Gets single bank transaction with items.

**Response (200):**
```json
{
  "id": 1,
  "accountNumber": "1234567890",
  "statementDate": "2026-01-01",
  "openingBalance": 10000.00,
  "closingBalance": 15000.00,
  "items": [
    {
      "id": 1,
      "transactionDate": "2026-01-02",
      "description": "Transfer from ABC Ltd",
      "credit": 5000.00,
      "debit": 0,
      "balance": 15000.00,
      "reference": "TXN123456"
    }
  ],
  "pdfUrl": "https://..."
}
```

#### GET `/api/bank-transactions/:id/items`

Gets transaction items separately.

#### PUT `/api/bank-transactions/:id`

Updates bank transaction header.

#### PUT `/api/bank-transactions/:id/items/:itemId`

Updates individual transaction item.

#### POST `/api/bank-transactions/:id/approve`

Approves the bank transaction.

---

### Contracts Endpoints

#### GET `/api/contracts`

Lists contracts with pagination.

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "contractNumber": "CTR-2026-001",
      "contractType": "service",
      "partnerId": 5,
      "businessPartner": {
        "id": 5,
        "name": "Vendor Inc"
      },
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "amount": 50000.00,
      "currency": "EUR",
      "paymentTerms": "Net 30",
      "isActive": true,
      "approvedAt": null
    }
  ],
  "total": 15
}
```

#### GET `/api/contracts/:id`

Gets single contract with PDF URL.

#### POST `/api/contracts/:id/approve`

Approves a contract.

---

### Business Partners Endpoints

#### GET `/api/partners`

Lists business partners with filtering.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 10 | Items per page |
| type | string | 'all' | Filter: customer/supplier/all |
| search | string | '' | Search by email/shortName |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "ABC Corporation",
      "shortName": "ABC",
      "email": "contact@abc.com",
      "phone": "+1234567890",
      "address": "123 Business St",
      "taxId": "123-456-789",
      "type": "customer",
      "isActive": true
    }
  ],
  "total": 100
}
```

#### GET `/api/partners/:id`

Gets single partner.

#### POST `/api/partners`

Creates new partner.

**Request Body:**
```json
{
  "name": "New Partner Ltd",
  "shortName": "NPL",
  "email": "info@newpartner.com",
  "phone": "+1234567890",
  "address": "456 Partner Ave",
  "taxId": "987-654-321",
  "type": "supplier"
}
```

#### PUT `/api/partners/:id`

Updates partner information.

#### PATCH `/api/partners/:id/status`

Updates partner active status.

**Request Body:**
```json
{
  "isActive": false
}
```

---

### File Upload Endpoints

#### POST `/api/files/upload-profile-image`

Uploads profile image. Public endpoint.

**Request:** `multipart/form-data`
- `profileImage`: Image file (max 5MB)
- `firstName`: User's first name
- `lastName`: User's last name

**Response (200):**
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

#### POST `/api/files/upload`

Uploads document file. Admin only.

**Request:** `multipart/form-data`
- `file`: Document file (max 10MB)
- `bucketName`: Target bucket (kif/kuf/transactions/contracts)
- `description`: Optional description

**Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 123,
    "fileName": "invoice.pdf",
    "fileUrl": "https://...",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "bucketName": "kif"
  }
}
```

#### GET `/api/files`

Lists files with filtering. Admin only.

**Query Parameters:**
- `page`, `limit`, `bucket_name`, `search`

#### GET `/api/files/my-files`

Lists current user's uploaded files.

#### DELETE `/api/files/storage/:id`

Deletes file from storage. Admin only.

---

### User Roles Endpoints

#### GET `/api/user-roles`

Lists all roles.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "role": "admin", "description": "Full access" },
    { "id": 2, "role": "user", "description": "Standard access" }
  ]
}
```

#### POST `/api/user-roles`

Creates new role. Admin only.

#### PUT `/api/user-roles/:id`

Updates role. Admin only.

#### DELETE `/api/user-roles/:id`

Deletes role. Admin only.

---

### User Status Endpoints

#### GET `/api/user-statuses`

Lists all statuses.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "status": "pending", "description": "Awaiting approval" },
    { "id": 2, "status": "active", "description": "Active account" },
    { "id": 3, "status": "rejected", "description": "Registration rejected" }
  ]
}
```

#### POST `/api/user-statuses`

Creates new status. Admin only.

#### PUT `/api/user-statuses/:id`

Updates status. Admin only.

#### DELETE `/api/user-statuses/:id`

Deletes status. Admin only.

---

### Invalid PDFs Endpoints

#### GET `/api/invalid-pdfs`

Lists invalid/failed PDF processing logs.

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "filename": "corrupted_invoice.pdf",
      "bucketName": "kif",
      "isValid": false,
      "isProcessed": true,
      "message": "File is not a valid KIF invoice",
      "createdAt": "2026-01-15T10:00:00Z",
      "processedAt": "2026-01-15T10:01:00Z"
    }
  ]
}
```

---

### Google Drive Endpoints

#### GET `/drive/auth`

Initiates Google OAuth flow for Drive access.

**Response:** Redirects to Google OAuth consent screen

#### GET `/drive/callback`

OAuth callback handler.

**Query Parameters:**
- `code`: Authorization code from Google

---

## Data Models

### User Model

**Table:** `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Primary key |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| first_name | VARCHAR(255) | NOT NULL | First name |
| last_name | VARCHAR(255) | NOT NULL | Last name |
| profile_image | VARCHAR(255) | NULLABLE | Profile image URL |
| role_id | INTEGER | FK → user_roles | User's role |
| status_id | INTEGER | FK → user_statuses | Account status |
| is_email_verified | BOOLEAN | DEFAULT false | Email verified |
| is_enabled | BOOLEAN | DEFAULT true | Account enabled |
| verification_token | VARCHAR(255) | NULLABLE | Email verification token |
| password_reset_token | VARCHAR(255) | NULLABLE | Password reset token |
| reset_expires_at | TIMESTAMP | NULLABLE | Reset token expiry |
| last_login_at | TIMESTAMP | NULLABLE | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Associations:**
- `belongsTo(Role)` as 'role'
- `belongsTo(UserStatus)` as 'status'
- `hasMany(RefreshToken)` as 'refreshTokens'

### Sales Invoice (KIF) Model

**Table:** `sales_invoices`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Primary key |
| invoice_number | VARCHAR(255) | | Invoice number |
| invoice_date | DATE | | Invoice date |
| business_partner_id | INTEGER | FK → business_partners | Customer |
| net_total | DECIMAL(12,2) | | Net amount |
| vat_amount | DECIMAL(12,2) | | VAT amount |
| gross_total | DECIMAL(12,2) | | Total with VAT |
| invoice_type | VARCHAR(50) | | Invoice type |
| approved_at | TIMESTAMP | NULLABLE | Approval time |
| approved_by | INTEGER | FK → users | Approving user |
| filename | VARCHAR(255) | | Original filename |
| created_at | TIMESTAMP | | Creation time |
| updated_at | TIMESTAMP | | Update time |

**Associations:**
- `belongsTo(BusinessPartner)` as 'businessPartner'
- `hasMany(SalesInvoiceItem)` as 'items'

### Purchase Invoice (KUF) Model

**Table:** `purchase_invoices`

Same structure as SalesInvoice with supplier relationship.

### Bank Transaction Model

**Table:** `bank_transactions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Primary key |
| account_number | VARCHAR(50) | | Bank account number |
| statement_date | DATE | | Statement date |
| opening_balance | DECIMAL(12,2) | | Opening balance |
| closing_balance | DECIMAL(12,2) | | Closing balance |
| total_debit | DECIMAL(12,2) | | Total debits |
| total_credit | DECIMAL(12,2) | | Total credits |
| approved_at | TIMESTAMP | NULLABLE | Approval time |
| approved_by | INTEGER | FK → users | Approving user |
| filename | VARCHAR(255) | | Original filename |

**Associations:**
- `hasMany(BankTransactionItem)` as 'items'

### Bank Transaction Item Model

**Table:** `bank_transaction_items`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| bank_transaction_id | INTEGER | Parent transaction |
| transaction_date | DATE | Transaction date |
| description | TEXT | Narration |
| debit | DECIMAL(12,2) | Debit amount |
| credit | DECIMAL(12,2) | Credit amount |
| balance | DECIMAL(12,2) | Running balance |
| reference | VARCHAR(255) | Reference number |

### Contract Model

**Table:** `contracts`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| contract_number | VARCHAR(255) | Contract identifier |
| contract_type | VARCHAR(50) | Type (service, supply, etc) |
| partner_id | INTEGER | FK → business_partners |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| amount | DECIMAL(12,2) | Contract value |
| currency | VARCHAR(3) | Currency code |
| payment_terms | VARCHAR(255) | Payment terms |
| description | TEXT | Contract description |
| is_active | BOOLEAN | Active status |
| signed_at | TIMESTAMP | Signing date |
| approved_at | TIMESTAMP | Approval date |
| approved_by | INTEGER | FK → users |
| filename | VARCHAR(255) | PDF filename |

### Business Partner Model

**Table:** `business_partners`

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | Full name |
| short_name | VARCHAR(100) | Abbreviated name |
| email | VARCHAR(255) | Contact email |
| phone | VARCHAR(50) | Phone number |
| address | TEXT | Business address |
| tax_id | VARCHAR(50) | Tax ID |
| type | ENUM | 'customer', 'supplier', 'both' |
| is_active | BOOLEAN | Active status |

---

## AI Document Processing

### Overview

Finetica uses Google Gemini AI to extract structured data from PDF documents. The system processes invoices, bank statements, and contracts automatically.

### AI Service Architecture

```javascript
// services/aiService.js
const processDocument = async (fileBuffer, mimeType, schema, modelName, prompt) => {
  // 1. Convert file buffer to base64
  // 2. Send to Gemini with structured prompt
  // 3. Parse JSON response
  // 4. Validate against schema
  // 5. Return extracted data
};
```

### Model Configuration

| Document Type | Model | Prompt File |
|---------------|-------|-------------|
| KIF (Sales Invoice) | gemini-2.5-flash-lite | `prompts/Kif.js` |
| KUF (Purchase Invoice) | gemini-2.5-flash | `prompts/kuf.js` |
| Bank Transaction | gemini-2.5-flash-lite | `prompts/bankTransaction.js` |
| Contract | gemini-2.5-flash-lite | `prompts/contract.js` |

### Processing Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Upload to  │    │  Create     │    │  Process    │    │  Create     │
│  Supabase   │───▶│  Log Entry  │───▶│  with AI    │───▶│  Record     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │                  │                  │
                          │                  │                  │
                          ▼                  ▼                  ▼
                   Processing Log     Gemini API        Invoice/Contract
                   (unprocessed)      Extraction        in Database
```

### KIF Processing Example

```javascript
// services/kif.js
const extractKifData = async (fileBuffer, mimeType) => {
  const businessPartners = await BusinessPartner.findAll({
    attributes: ['id', 'name']
  });
  
  const promptWithPartners = `${KIF_PROMPT}\nAvailable partners: ${JSON.stringify(businessPartners)}`;
  
  const data = await processDocument(
    fileBuffer,
    mimeType,
    salesInvoiceSchema,
    'gemini-2.5-flash-lite',
    promptWithPartners
  );
  
  return data;
};
```

### Schema Validation

Each document type has a JSON schema (in `schemas/` directory) that validates the AI output:

```javascript
// schemas/kifSchema.js
module.exports = {
  type: 'object',
  required: ['invoiceNumber', 'invoiceDate', 'items'],
  properties: {
    invoiceNumber: { type: 'string' },
    invoiceDate: { type: 'string', format: 'date' },
    businessPartnerId: { type: 'integer' },
    netTotal: { type: 'number' },
    vatAmount: { type: 'number' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          quantity: { type: 'number' },
          unitPrice: { type: 'number' }
        }
      }
    }
  }
};
```

### Background Processing

Unprocessed files are processed via scheduled tasks or on-demand:

```javascript
// services/kif.js
const processUnprocessedKifFiles = async () => {
  const unprocessedLogs = await KifProcessingLog.findAll({
    where: { isProcessed: false, isValid: true }
  });
  
  for (const fileLog of unprocessedLogs) {
    await processSingleUnprocessedKifFile(fileLog);
  }
};
```

---

## File Storage System

### Supabase Configuration

| Setting | Value |
|---------|-------|
| Provider | Supabase Storage |
| Buckets | kif, kuf, transactions, contracts, user-images |
| Access | Service role key for server-side |
| URLs | Signed URLs for PDF viewing |

### Storage Buckets

| Bucket Name | Purpose | Public | Max Size |
|-------------|---------|--------|----------|
| `kif` | Sales invoice PDFs | No | 10MB |
| `kuf` | Purchase invoice PDFs | No | 10MB |
| `transactions` | Bank statement PDFs | No | 10MB |
| `contracts` | Contract PDFs | No | 10MB |
| `user-images` | Profile pictures | Yes | 5MB |

### File Upload Flow

```javascript
// utils/supabase/supabaseService.js

const uploadFile = async (fileBuffer, fileName, bucketName, mimeType) => {
  const sanitizedName = sanitizeFileName(fileName);
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(sanitizedName, fileBuffer, {
      contentType: mimeType,
      upsert: false
    });
    
  if (error) throw new Error(`Upload failed: ${error.message}`);
  
  return {
    path: data.path,
    url: getPublicUrl(bucketName, data.path)
  };
};
```

### Getting Signed URLs

For private buckets, signed URLs are generated for PDF viewing:

```javascript
const getSignedUrl = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600); // 1 hour expiry
    
  if (error) throw error;
  return data.signedUrl;
};
```

### Filename Sanitization

```javascript
const sanitizeFileName = (filename) => {
  // Convert special characters (e.g., "Fikret Zajmović.pdf" → "Fikret Zajmovic.pdf")
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
};
```

---

## Frontend Architecture

### Project Structure

```
frontend/src/
├── api/              # API client functions
│   ├── auth.js
│   ├── axios.js      # Axios instance with interceptors
│   ├── kif.js
│   ├── kuf.js
│   └── ...
├── components/       # Reusable components
│   ├── dashboard/    # Dashboard-specific
│   ├── shared-ui/    # Shared UI components
│   ├── table/        # Table components
│   ├── tables/       # Table configurations
│   │   └── columns/  # Column definitions
│   └── ui/           # shadcn/ui components
├── context/          # React Context providers
│   └── AuthContext.jsx
├── helpers/          # Utility functions
├── hooks/            # Custom React hooks
│   ├── use-action.js
│   ├── use-query-toast.js
│   └── use-table-search.js
├── layout/           # Layout components
├── lib/              # Library configurations
├── pages/            # Page components
│   ├── BankTransactions.jsx
│   ├── Contracts.jsx
│   ├── DashboardPage.jsx
│   ├── Kif.jsx
│   ├── Kuf.jsx
│   └── ...
├── queries/          # React Query hooks
│   ├── KifQueries.js
│   ├── Kuf.js
│   ├── BankTransactionsQueries.js
│   └── ...
└── routes/           # Routing configuration
    ├── AppRoutes.jsx
    └── ProtectedRoute.jsx
```

### React Query Integration

```javascript
// queries/KifQueries.js
export const kifKeys = {
  all: ['kif'],
  list: (params) => ['kif', 'list', params],
  detail: (id) => ['kif', 'detail', id],
  items: (id) => ['kif', 'items', id],
  invoiceTypes: () => ['kif', 'invoiceTypes']
};

export const useKifList = ({ page, perPage, invoiceType }) => {
  return useQuery({
    queryKey: kifKeys.list({ page, perPage, invoiceType }),
    queryFn: () => fetchKifList({ page, perPage, invoiceType })
  });
};
```

### Protected Routes

```javascript
// routes/ProtectedRoute.jsx
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user?.roleName?.toLowerCase())) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Outlet />;
};
```

### Auth Context

```javascript
// context/AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials) => { ... };
  const logout = async () => { ... };
  const refreshAuth = async () => { ... };
  
  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, loading,
      login, logout, refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Error Handling

### Backend Error Handler

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[${statusCode}] ${message}`, err.stack);
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

### Custom Error Class

```javascript
// utils/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 500 | Internal Error | Server error |

---

## Environment Configuration

### Server Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finetica

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN_DAYS=30
SESSION_SECRET=your-session-secret

# Client
CLIENT_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google AI
GOOGLE_API_KEY=your-google-api-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@finetica.com

# Google Drive (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/drive/callback
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     users       │───────│  user_roles     │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ email           │       │ role            │
│ password_hash   │       │ description     │
│ first_name      │       └─────────────────┘
│ last_name       │
│ role_id (FK)    │       ┌─────────────────┐
│ status_id (FK)  │───────│ user_statuses   │
└────────┬────────┘       ├─────────────────┤
         │                │ id              │
         │                │ status          │
         │                │ description     │
         │                └─────────────────┘
         │
         │        ┌─────────────────┐
         └────────│ refresh_tokens  │
                  ├─────────────────┤
                  │ id              │
                  │ user_id (FK)    │
                  │ token           │
                  │ expires_at      │
                  └─────────────────┘

┌─────────────────┐       ┌─────────────────────┐
│business_partners│───────│   sales_invoices    │
├─────────────────┤       ├─────────────────────┤
│ id              │       │ id                  │
│ name            │       │ invoice_number      │
│ short_name      │       │ business_partner_id │
│ email           │       │ net_total           │
│ type            │       │ vat_amount          │
│ is_active       │       │ approved_by (FK)    │
└─────────────────┘       └──────────┬──────────┘
         │                           │
         │                ┌──────────▼──────────┐
         │                │ sales_invoice_items │
         │                ├─────────────────────┤
         │                │ id                  │
         │                │ sales_invoice_id    │
         │                │ description         │
         │                │ quantity            │
         │                │ unit_price          │
         │                └─────────────────────┘
         │
         │        ┌─────────────────────┐
         └────────│  purchase_invoices  │
                  │  (similar to sales) │
                  └─────────────────────┘

┌───────────────────────┐      ┌──────────────────────────┐
│   bank_transactions   │──────│ bank_transaction_items   │
├───────────────────────┤      ├──────────────────────────┤
│ id                    │      │ id                       │
│ account_number        │      │ bank_transaction_id (FK) │
│ statement_date        │      │ transaction_date         │
│ opening_balance       │      │ description              │
│ closing_balance       │      │ debit                    │
│ approved_by (FK)      │      │ credit                   │
└───────────────────────┘      │ balance                  │
                               └──────────────────────────┘

┌─────────────────┐
│    contracts    │
├─────────────────┤
│ id              │
│ contract_number │
│ partner_id (FK) │
│ start_date      │
│ end_date        │
│ amount          │
│ is_active       │
│ approved_by     │
└─────────────────┘
```

---

*Last Updated: January 2026*
*Version: 2.0 (Detailed Edition)*
