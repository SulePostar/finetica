# Finetica User Manual

> **Finetica** is a comprehensive web application for Financial Operations that leverages AI-powered document processing (Google Gemini AI) to automate the extraction, management, and organization of financial data including invoices, bank statements, contracts, and business partner information.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Navigation and Layout](#navigation-and-layout)
4. [Dashboard](#dashboard)
5. [Document Management Overview](#document-management-overview)
6. [KIF - Sales Invoices](#kif---sales-invoices)
7. [KUF - Purchase Invoices](#kuf---purchase-invoices)
8. [Bank Transactions](#bank-transactions)
9. [Contracts](#contracts)
10. [Business Partners](#business-partners)
11. [User Management (Admin Only)](#user-management-admin-only)
12. [Roles and Status Management (Admin Only)](#roles-and-status-management-admin-only)
13. [Profile Settings](#profile-settings)
14. [Invalid PDFs](#invalid-pdfs)
15. [Help Center](#help-center)
16. [Troubleshooting](#troubleshooting)
17. [Glossary](#glossary)

---

## Getting Started

### System Requirements

Finetica is a web-based application accessible through any modern web browser. The following are recommended:

| Requirement | Specification |
|-------------|---------------|
| **Browser** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Screen Resolution** | 1280x720 minimum (1920x1080 recommended) |
| **Internet Connection** | Stable broadband connection |
| **JavaScript** | Must be enabled |
| **Cookies** | Must be enabled for session management |

### First-Time Access

1. Obtain your Finetica application URL from your system administrator
2. Open the URL in your web browser
3. You will be redirected to the login page
4. If you don't have an account, you can either:
   - Click "Sign Up" to register a new account
   - Contact your administrator to have an account created for you

### Supported Features by Role

| Feature | Regular User | Administrator |
|---------|--------------|---------------|
| View Dashboard | ✓ | ✓ |
| Upload Documents | ✓ | ✓ |
| View/Approve Documents | ✓ | ✓ |
| Manage Business Partners | ✓ | ✓ |
| View Own Profile | ✓ | ✓ |
| Access Help Center | ✓ | ✓ |
| Manage Users | ✗ | ✓ |
| Manage Roles & Statuses | ✗ | ✓ |
| Add FAQ Items | ✗ | ✓ |

---

## Authentication

### Login Process

#### Step-by-Step Instructions

1. **Navigate to Login Page**
   - Open your browser and go to the Finetica URL
   - You will see the login page with a purple gradient on the left panel and the login form on the right

2. **Enter Your Credentials**
   - **Email Address**: Enter your registered email address in the email field
     - The field has an email icon on the left
     - Invalid email format will show an error message
   - **Password**: Enter your password (minimum 6 characters required)
     - The field has a lock icon on the left
     - Click the eye icon on the right to toggle password visibility

3. **Submit Login**
   - Click the purple "Login" button
   - If successful, you will be redirected to the Dashboard
   - If unsuccessful, an error message will appear below the header

#### Login Form Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| Email | Required, must be valid email format | "Email is required" or "Invalid email format" |
| Password | Required, minimum 6 characters | "Password is required" or "Minimum 6 characters" |

#### Password Visibility Toggle

- Click the **eye icon** (👁) on the right side of the password field to show the password
- Click the **eye-off icon** to hide it again
- This helps verify you're typing the correct password

### Registration Process

#### Step-by-Step Instructions

1. **Access Registration Page**
   - Click "Sign Up" on the login page, or
   - Navigate directly to `/register`

2. **Upload Profile Photo (Optional)**
   - Click on the circular avatar area at the top of the form
   - A dialog will open with a dropzone for image upload
   - Supported formats: PNG, JPG, JPEG, GIF
   - Maximum file size: 10MB
   - Drag and drop an image or click to browse
   - Click "Confirm" to save or "Cancel" to discard

3. **Fill in Personal Information**
   - **First Name**: Required, enter your first name
   - **Last Name**: Required, enter your last name
   - **Email**: Required, must be a valid email address (format: user@domain.com)
   - **Password**: Required, minimum 6 characters
   - **Confirm Password**: Required, must match the password field

4. **Submit Registration**
   - Click "Create Account"
   - Upon successful registration, you may be redirected to the dashboard
   - Note: Your account may require administrator approval before full access is granted

#### Registration Form Validation

| Field | Validation Rule | Error Message |
|-------|-----------------|---------------|
| First Name | Required | "First name required" |
| Last Name | Required | "Last name required" |
| Email | Required, valid format | "Email required" or "Invalid email" |
| Password | Required, min 6 characters | "Password required" or "Min 6 characters" |
| Confirm Password | Required, must match password | "Confirm password required" or "Passwords do not match" |

### Password Reset

#### How to Reset Your Password

1. On the login page, click **"Forgot Password?"** link
2. Enter your registered email address in the form that appears
3. Click the submit button
4. Check your email inbox (and spam folder) for the reset link
5. Click the link in the email
6. Enter your new password (minimum 6 characters)
7. Confirm the new password
8. Click submit to complete the reset
9. You can now log in with your new password

#### Important Notes

- Password reset links expire after a set time period
- If you don't receive the email, check your spam folder
- Contact your administrator if you still cannot access your account

### Session Management

#### How Sessions Work

- When you log in, Finetica creates a secure session using JWT (JSON Web Tokens)
- Your session includes both an access token and a refresh token
- Access tokens have a shorter lifespan for security
- Refresh tokens automatically renew your session without requiring re-login
- Sessions persist across browser tabs

#### Automatic Token Refresh

- When your access token expires, the system automatically uses your refresh token
- This happens transparently in the background
- You remain logged in without interruption
- Refresh tokens last for several days (configurable by administrator)

#### Logout

- Click your profile avatar in the sidebar to access profile options
- Click "Logout" to end your session
- All tokens are invalidated for security
- You will be redirected to the login page

---

## Navigation and Layout

### Main Layout Structure

Finetica uses a consistent layout across all pages:

```
┌─────────────────────────────────────────────────────────────┐
│                        Top Header Bar                        │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│          │                                                   │
│  Sidebar │              Main Content Area                    │
│   Menu   │                                                   │
│          │                                                   │
│          │                                                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### Sidebar Navigation

The sidebar provides access to all main sections:

| Icon | Menu Item | Description | Access |
|------|-----------|-------------|--------|
| 🏠 | Dashboard | Main overview with statistics | All users |
| 📄 | KIF | Sales invoices management | All users |
| 📄 | KUF | Purchase invoices management | All users |
| 💳 | Bank Statements | Bank transaction management | All users |
| 📋 | Contracts | Contract management | All users |
| 👥 | Partners | Business partner management | All users |
| ⚠️ | Invalid PDFs | Failed document processing | All users |
| 👤 | Users | User management | Admin only |
| 🔧 | Roles & Statuses | Role/status configuration | Admin only |
| ❓ | Help | Help center and FAQ | All users |
| 👤 | Profile Avatar | Access user profile | All users |

### Page Components

#### Page Title
Each page displays a title with an optional subtitle:
- **Title**: Main heading (e.g., "KIF", "Partners")
- **Subtitle**: Descriptive text (e.g., "Overview of all Kif files")

#### Dynamic Tables
Most data pages use dynamic tables with:
- **Header**: Page title and action buttons
- **Toolbar**: Search, filters, and clear button
- **Data Grid**: Sortable columns with data rows
- **Pagination**: Navigate between pages of results

#### Loading States
- **Spinner**: Purple spinning animation while data loads
- **Skeleton**: Placeholder content for loading items
- **Overlay**: Semi-transparent overlay with spinner for background updates

---

## Dashboard

### Overview

The Dashboard is your central hub providing a quick overview of system metrics and key performance indicators.

### Accessing the Dashboard

- Click "Dashboard" in the sidebar, or
- Navigate to `/` or `/dashboard`
- This is the default page after login

### Dashboard Widgets

The dashboard displays statistical widgets in a responsive grid layout:

#### Top Row Widgets (3 columns)

| Widget | Description | Icon Color |
|--------|-------------|------------|
| **Active Contracts** | Count of currently active contracts with percentage change from previous period | Brand Blue |
| **Invalid PDFs** | Number of documents that failed AI processing | Red (Destructive) |
| **Bank Transactions** | Total count of processed bank transactions | Purple |

#### Bottom Row Widgets (2 columns)

| Widget | Description | Icon Color |
|--------|-------------|------------|
| **AI Accuracy** | Percentage accuracy of AI document extraction | Chart Color |
| **Site Traffic** | Application usage and traffic metrics | Green |

### Widget Details

Each widget displays:
- **Title**: Name of the metric
- **Value**: Current numeric value (formatted with commas for thousands)
- **Delta**: Percentage change indicator with up/down arrow
- **Icon**: Visual representation of the metric type
- **Color Coding**: Green for positive trends, red for negative trends

---

## Document Management Overview

### How Document Processing Works

Finetica uses Google Gemini AI to automatically extract data from uploaded PDF documents. Here's the complete flow:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Upload    │────▶│   Storage   │────▶│     AI      │────▶│   Review    │
│    PDF      │     │  (Supabase) │     │  Processing │     │  & Approve  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

#### Step 1: Upload
- User uploads a PDF file through the upload button
- File is validated for type and size
- Maximum file size: 10MB for documents

#### Step 2: Storage
- File is stored securely in Supabase cloud storage
- Each document type has its own storage bucket
- A processing log entry is created

#### Step 3: AI Processing
- Google Gemini AI analyzes the document
- Extracts structured data (numbers, dates, text, line items)
- Matches business partners from existing database
- Validates data against expected schema

#### Step 4: Review & Approve
- Extracted data is displayed for user review
- User can edit any incorrect data
- Once verified, user approves the document
- Approved documents are finalized in the system

### Supported Document Types

| Document Type | Storage Bucket | AI Model Used |
|---------------|----------------|---------------|
| KIF (Sales Invoice) | `kif` | gemini-2.5-flash-lite |
| KUF (Purchase Invoice) | `kuf` | gemini-2.5-flash |
| Bank Transaction | `transactions` | gemini-2.5-flash-lite |
| Contract | `contracts` | gemini-2.5-flash-lite |

### Document Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| **Pending** | Yellow/Orange | Uploaded but not yet reviewed or approved |
| **Approved** | Green | Reviewed and confirmed by a user |
| **Invalid** | Red | Failed AI processing or validation |

### Common Upload Button

All document pages feature a consistent upload button:

1. **Button Location**: Top-right corner of the page header
2. **Button Style**: Purple background with white text
3. **Button Text**: "Upload [Document Type]" (e.g., "Upload KIF")
4. **Disabled State**: Grayed out while an upload is in progress

#### Upload Process

1. Click the "Upload [Type]" button
2. A file browser dialog opens
3. Select one or more PDF files
4. Files begin uploading immediately
5. "Uploading & processing..." message appears
6. Upon completion, the table refreshes with new data
7. Success notification appears confirming the upload

### Time Filter

Most document pages include a time filter dropdown:

| Option | Description |
|--------|-------------|
| All | Show all documents regardless of date |
| Today | Documents from today only |
| This Week | Documents from the current week |
| This Month | Documents from the current month |
| This Year | Documents from the current year |

---

## KIF - Sales Invoices

### What is KIF?

KIF (Knjiga Izlaznih Faktura / Sales Invoice Book) is the module for managing outgoing sales invoices. These are invoices your company issues to customers.

### Accessing KIF

- Click "KIF" in the sidebar
- Navigate to `/kif`
- Page title: "Kif" with subtitle "Overview of all Kif files"

### KIF Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Kif                              [Upload Kif] [Time Filter ▼] │
│  Overview of all Kif files                                     │
├────────────────────────────────────────────────────────────────┤
│  [Invoice Type ▼]                              [Clear filters] │
├────────────────────────────────────────────────────────────────┤
│  Invoice # │ Date │ Partner │ Net Total │ VAT │ Type │ Status │
│  ──────────┼──────┼─────────┼───────────┼─────┼──────┼────────│
│  INV-001   │ ...  │ ...     │ ...       │ ... │ ...  │ ...    │
│  INV-002   │ ...  │ ...     │ ...       │ ... │ ...  │ ...    │
├────────────────────────────────────────────────────────────────┤
│  Showing 1-10 of 25                        [<] [1] [2] [3] [>] │
└────────────────────────────────────────────────────────────────┘
```

### Uploading Sales Invoices

#### Step-by-Step Instructions

1. **Click "Upload Kif" Button**
   - Located in the top-right corner
   - Button is purple with white text

2. **Select PDF File(s)**
   - A file browser opens
   - Navigate to your sales invoice PDF
   - Select one or more files
   - Only PDF files are accepted

3. **Wait for Processing**
   - The button becomes disabled during upload
   - "Uploading & processing..." message appears with spinner
   - AI extracts: Invoice number, date, partner, amounts, line items

4. **Verify Upload**
   - Page refreshes automatically
   - New invoice appears in the table
   - Check the status column

### Filtering KIF Invoices

#### By Invoice Type

1. Click the "Invoice Type" dropdown (shows "All types" by default)
2. Select a specific invoice type from the list
3. Table filters immediately
4. Page resets to page 1

Available invoice types are dynamically loaded from the database and may include:
- Regular Invoice
- Credit Note
- Debit Note
- Advance Invoice
- etc.

#### By Time Period

1. Click the time filter dropdown in the top-right
2. Select: All, Today, This Week, This Month, or This Year
3. Table filters to show only matching invoices

#### Clearing Filters

- Click the "Clear filters" button to reset all filters
- Returns to showing all invoices

### Viewing KIF Details

1. Click on any row in the KIF table
2. You will be navigated to `/kif/:id`
3. The detail page shows:
   - All extracted invoice data
   - Original PDF document viewer
   - Business partner information
   - Line items with descriptions, quantities, prices
   - Approval status and history

### KIF Table Columns

| Column | Description |
|--------|-------------|
| Invoice Number | Unique identifier extracted from PDF |
| Invoice Date | Date of the invoice |
| Business Partner | Customer name (linked to Partners) |
| Net Total | Total amount before VAT |
| VAT Amount | Value Added Tax amount |
| Invoice Type | Category of the invoice |
| Status | Pending or Approved |

### Approving KIF Invoices

1. Open the invoice detail page
2. Review all extracted information for accuracy
3. Edit any incorrect fields if necessary
4. Click the "Approve" button
5. System records:
   - Approval timestamp
   - User who approved
6. Invoice status changes to "Approved"

### Viewing Invoice Items

- Navigate to `/kif/:id/items`
- Shows all line items extracted from the invoice:
  - Item description
  - Quantity
  - Unit price
  - Total price
  - VAT rate/amount

---

## KUF - Purchase Invoices

### What is KUF?

KUF (Knjiga Ulaznih Faktura / Purchase Invoice Book) is the module for managing incoming purchase invoices from suppliers.

### Accessing KUF

- Click "KUF" in the sidebar
- Navigate to `/kuf`
- Page title: "KUF" with subtitle "Overview of all KUF Purchase Invoices"

### KUF Page Layout

Similar to KIF with:
- Upload KUF button
- Time filter
- Invoice type filter
- Paginated data table
- Clear filters button

### Uploading Purchase Invoices

1. Click **"Upload KUF"** button
2. Select PDF invoice file(s) from your supplier
3. Wait for "Uploading & processing..." to complete
4. AI extracts all relevant data

### KUF vs KIF Differences

| Aspect | KIF (Sales) | KUF (Purchase) |
|--------|-------------|----------------|
| Direction | Outgoing to customers | Incoming from suppliers |
| Partner Type | Customer | Supplier |
| Storage Bucket | `kif` | `kuf` |
| AI Model | gemini-2.5-flash-lite | gemini-2.5-flash |

### Filtering KUF Invoices

#### By Invoice Type
- Click the invoice type dropdown
- Shows "All invoices" by default
- Select specific type to filter
- Types are capitalized (first letter uppercase)

#### By Time
- Use the time filter same as KIF

### Viewing KUF Details

- Click any invoice row to view details
- Navigate to `/kuf/:id`
- View extracted data, PDF, partner info, line items

### KUF Table Columns

| Column | Description |
|--------|-------------|
| Invoice Number | Supplier's invoice number |
| Invoice Date | Date on the invoice |
| Supplier | Supplier/vendor name |
| Net Total | Pre-VAT total amount |
| VAT Amount | VAT/tax amount |
| Status | Current processing status |

---

## Bank Transactions

### Overview

The Bank Transactions module handles bank statement uploads and transaction management. Upload your bank statements and the AI will extract all individual transactions.

### Accessing Bank Transactions

- Click "Bank Statements" in the sidebar
- Navigate to `/bank-statements`
- Page title: "Bank Transactions" with subtitle "Overview of all bank transactions"

### Uploading Bank Statements

#### Step-by-Step Instructions

1. **Click "Upload Bank Transactions" Button**
   - Located top-right of the page

2. **Select Bank Statement PDF**
   - Choose your bank statement PDF file
   - Ensure it's a standard bank statement format

3. **Wait for Processing**
   - AI extracts:
     - Statement date
     - Account number
     - Opening and closing balances
     - All individual transactions
     - Transaction dates, descriptions, amounts

4. **Review Results**
   - New bank transaction entry appears in table
   - Click to view all extracted transactions

### Bank Transaction Page Features

- **Upload Button**: "Upload Bank Transactions"
- **Time Filter**: Filter by time period
- **Pagination**: 10 transactions per page

### Bank Transaction Details

Navigate to `/bank-statements/:id` to view:

- Statement summary (dates, account, balances)
- List of all extracted transaction items
- Original PDF viewer

#### Transaction Item Fields

| Field | Description |
|-------|-------------|
| Transaction Date | Date of the transaction |
| Description | Transaction narration/description |
| Debit | Amount debited (money out) |
| Credit | Amount credited (money in) |
| Balance | Running balance after transaction |
| Reference | Bank reference number |

### Editing Bank Transactions

1. Navigate to `/bank-statements/:id/edit`
2. Modify transaction data as needed
3. Each field can be edited individually
4. Save changes when done

### Approving Bank Transactions

1. Navigate to `/bank-statements/:id/approve`
2. Review all extracted transactions
3. Verify balances match your records
4. Click "Approve" to finalize
5. System records approval timestamp and user

---

## Contracts

### Overview

The Contracts module manages business contracts with partners, suppliers, and customers. AI extracts key contract information for easy reference and management.

### Accessing Contracts

- Click "Contracts" in the sidebar
- Navigate to `/contracts`
- Page title: "Contracts" with subtitle "Overview of all Contracts files"

### Uploading Contracts

1. Click **"Upload Contract"** button
2. Select contract PDF file
3. Wait for AI processing
4. AI extracts:
   - Contract number
   - Contract type
   - Business partner
   - Start and end dates
   - Amount and currency
   - Payment terms
   - Description

### Contract Table Columns

| Column | Description |
|--------|-------------|
| Contract Number | Unique contract identifier |
| Partner | Associated business partner |
| Contract Type | Category (service, supply, etc.) |
| Start Date | Contract commencement date |
| End Date | Contract expiration date |
| Amount | Contract value |
| Currency | Currency code (EUR, USD, etc.) |
| Status | Active/Inactive |
| Approved | Whether contract is approved |

### Filtering Contracts

- **Time Filter**: Filter by creation/upload date
- Page automatically refreshes when filters change

### Contract Details

Navigate to `/contracts/:id` to view:

- Complete contract information
- All extracted fields
- Original PDF document
- Business partner details
- Approval status

### Approving Contracts

- Contracts require approval before being finalized
- Click "Approve" on the contract detail page
- Only unapproved contracts can be approved
- Already approved contracts show "Contract already approved" error

### Active Contracts Count

- The Dashboard displays the count of active contracts
- Contracts with `isActive: true` are counted
- Use this to monitor ongoing agreements

---

## Business Partners

### Overview

The Business Partners module manages all your customers, suppliers, and other business relationships. Partners are linked to invoices, contracts, and transactions.

### Accessing Partners

- Click "Partners" in the sidebar
- Navigate to `/partners`
- Page title: "Partners" with subtitle "Manage business partners"

### Partners Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Partners                                      [Time Filter ▼] │
│  Manage business partners                                      │
├────────────────────────────────────────────────────────────────┤
│  [Search by email or short name....] [Partner Type ▼] [Clear] │
├────────────────────────────────────────────────────────────────┤
│  Name │ Short Name │ Email │ Type │ Status │ Actions          │
├────────────────────────────────────────────────────────────────┤
│  ...  │ ...        │ ...   │ ...  │ ...    │ ...              │
└────────────────────────────────────────────────────────────────┘
```

### Partner Types

| Type | Description | Usage |
|------|-------------|-------|
| **Customer** | Buys from you | Linked to sales invoices (KIF) |
| **Supplier** | Sells to you | Linked to purchase invoices (KUF) |
| **Both** | Both customer and supplier | Can be linked to either |

### Searching Partners

The search feature supports:
- **Search by Email**: Type part of the email address
- **Search by Short Name**: Type the abbreviated company name
- **Debounced Search**: 400ms delay for performance
- Results filter in real-time as you type

### Filtering Partners by Type

1. Click the "Partner Type" dropdown
2. Options: All partners, Suppliers, Customers
3. Select to filter the table
4. Page resets to 1

### Viewing Partner Details

1. Click on any partner row in the table
2. Navigate to `/partners/:id`
3. View complete partner profile:
   - Full name
   - Short name
   - Email address
   - Phone number
   - Address
   - Tax ID
   - Partner type
   - Active status

### Partner Information Fields

| Field | Description | Required |
|-------|-------------|----------|
| Name | Full legal name | Yes |
| Short Name | Abbreviated name for display | No |
| Email | Contact email address | No |
| Phone | Contact phone number | No |
| Address | Business address | No |
| Tax ID | Tax identification number | No |
| Type | Customer/Supplier/Both | Yes |
| Is Active | Whether partner is active | Yes |

### Editing Partners

1. Open partner detail page
2. Click "Edit" button
3. Modify desired fields
4. Click "Save" to apply changes
5. Success message confirms update

### Deactivating Partners

Partners are soft-deleted (deactivated) rather than permanently removed:

1. Open partner detail page
2. Toggle the active status to "Inactive"
3. Partner will:
   - Still exist in database
   - Be hidden from default views
   - Preserve historical data integrity

### Clearing Filters

Click "Clear filters" to:
- Reset partner type to "All partners"
- Reset time filter to "all"
- Clear the search field
- Return to page 1

---

## User Management (Admin Only)

> ⚠️ **Administrator Access Required**: This section is only accessible to users with Admin role.

### Overview

The User Management page allows administrators to view, filter, and manage all system users including their roles, statuses, and account states.

### Accessing User Management

- Click "Users" in the sidebar (visible to admins only)
- Navigate to `/users`
- Page title: "Users" with subtitle "Users management dashboard"

### User Management Features

```
┌────────────────────────────────────────────────────────────────┐
│  Users                                                          │
│  Users management dashboard                                     │
├────────────────────────────────────────────────────────────────┤
│  [Search by name or email...] [Status ▼] [Role ▼] [Clear]     │
├────────────────────────────────────────────────────────────────┤
│  Name │ Email │ Role │ Status │ Last Login │ Actions          │
├────────────────────────────────────────────────────────────────┤
│  ...  │ ...   │ ...  │ ...    │ ...        │ [View] [Approve]  │
└────────────────────────────────────────────────────────────────┘
```

### Searching Users

- Search by first name, last name, or email
- 400ms debounce for performance
- Results update as you type

### Filtering Users

#### By Status
- All statuses
- Active
- Pending
- Rejected
- (Other custom statuses)

#### By Role
- All roles
- Admin
- User
- (Other custom roles)

### User Actions

| Action | Description | Available When |
|--------|-------------|----------------|
| **View** | Opens user profile page | Always |
| **Approve** | Sets user status to Active | Status is Pending |
| **Reject** | Sets user status to Rejected | Status is Pending |
| **Activate** | Re-enables a disabled account | Account is disabled |
| **Deactivate** | Disables user account | Account is enabled |

### Approving New Users

When users register, they may have "Pending" status:

1. Find the user in the list (filter by Pending status)
2. Click "Approve" in the actions column
3. User status changes to Active
4. User can now log in and use the system

### Rejecting Users

1. Find the pending user
2. Click "Reject" in the actions
3. User status changes to Rejected
4. User cannot log in

### Activating/Deactivating Users

A confirmation dialog appears:

**Deactivate Dialog:**
```
┌─────────────────────────────────────────┐
│  Deactivate user                        │
│                                         │
│  Are you sure you want to deactivate    │
│  [User's Full Name]?                    │
│                                         │
│  This user will no longer be able to    │
│  log in.                                │
│                                         │
│  [Cancel]              [Deactivate]     │
└─────────────────────────────────────────┘
```

**Activate Dialog:**
```
┌─────────────────────────────────────────┐
│  Activate user                          │
│                                         │
│  Are you sure you want to activate      │
│  [User's Full Name]?                    │
│                                         │
│  This user will be able to log in       │
│  again.                                 │
│                                         │
│  [Cancel]                [Activate]     │
└─────────────────────────────────────────┘
```

### Self-Deactivation Warning

If an admin attempts to deactivate their own account:

```
⚠️ You will be logged out immediately after deactivating your account.
```

After confirmation:
1. Account is deactivated
2. User is logged out automatically
3. Redirected to login page

### Navigating to User Profiles

- Click the "View" action or click the row
- Opens `/profile/:userId`
- View full user profile details

---

## Roles and Status Management (Admin Only)

> ⚠️ **Administrator Access Required**

### Overview

Manage user roles and account statuses that control access and account states throughout the system.

### Accessing This Page

- Click "Roles & Statuses" in the sidebar (admin only)
- Navigate to `/roles-statuses`

### Managing Roles

Roles define what permissions users have:

| Role | Description | Typical Permissions |
|------|-------------|---------------------|
| Admin | Full system access | All features + user management |
| User | Standard access | Documents, partners, profile |

#### Creating a New Role

1. Click "Add Role" button
2. Enter role name (e.g., "Manager")
3. Add description
4. Click "Save"

#### Editing Roles

1. Find the role in the list
2. Click "Edit"
3. Modify name or description
4. Click "Save"

#### Deleting Roles

1. Click "Delete" on a role
2. Confirm deletion
3. Cannot delete roles assigned to users

### Managing Statuses

Statuses define account states:

| Status | Description | Can Login |
|--------|-------------|-----------|
| Active | Normal active account | Yes |
| Pending | Awaiting approval | No |
| Rejected | Registration rejected | No |
| Disabled | Account disabled | No |

#### Creating a New Status

1. Click "Add Status"
2. Enter status name
3. Add description
4. Click "Save"

#### Editing/Deleting Statuses

Similar process to roles with same restrictions.

---

## Profile Settings

### Accessing Your Profile

1. Click your profile avatar in the sidebar
2. Or navigate to `/profile/:userId`
3. You can view your own profile or (as admin) other users' profiles

### Profile Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│                         User Profile                           │
│                 View and manage your profile                   │
│                                          [✏️ Edit Profile]      │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                                  │
│  │  Photo   │  Profile Picture                                 │
│  │          │  Upload a professional photo that represents you │
│  └──────────┘                                                  │
├────────────────────────────────────────────────────────────────┤
│  First Name: [___________]    Last Name: [___________]         │
│  Email: [_________________]   Role: [________________]         │
├────────────────────────────────────────────────────────────────┤
│  Account Status: [Active ✓]   Last Login: [2026-01-20 10:00]   │
└────────────────────────────────────────────────────────────────┘
```

### Edit Mode

1. Click the **pencil icon** (Edit Profile) button
2. Fields become editable
3. Button changes to **X** (Cancel Edit)

### Editable vs Read-Only Fields

| Field | Editable | Notes |
|-------|----------|-------|
| First Name | ✓ | Only in edit mode |
| Last Name | ✓ | Only in edit mode |
| Email | ✗ | Always read-only (grayed) |
| Role | ✗ | Set by administrators |
| Status | ✗ | Displayed as badge |
| Last Login | ✗ | System-generated |
| Profile Picture | ✓ | In edit mode |

### Updating Profile Picture

1. Enter edit mode
2. Click on the profile picture area
3. Dialog opens with:
   - Current photo display
   - Dropzone for new image upload
4. Drag & drop or click to select image
5. Supported formats: PNG, JPG, JPEG, GIF
6. Maximum size: 10MB
7. Click "Confirm" to save
8. Click "Remove Photo" to delete current photo
9. Click "Cancel" to discard changes

### Saving Profile Changes

1. Make your edits
2. Click "Save Changes" button (appears in edit mode)
3. Success notification confirms update
4. Exit edit mode

### Viewing Other Users' Profiles

As an admin:
1. Navigate to `/profile/:userId` with another user's ID
2. View their information
3. Cannot edit other users' profiles from this page
4. Use User Management for admin changes

---

## Invalid PDFs

### Overview

The Invalid PDFs page shows documents that failed during AI processing or validation. Use this to identify and resolve document issues.

### Accessing Invalid PDFs

- Click "Invalid PDFs" in the sidebar
- Navigate to `/invalid-pdfs`

### Why Documents Become Invalid

| Reason | Description | Solution |
|--------|-------------|----------|
| **Not a valid PDF** | File isn't actually a PDF | Convert to proper PDF format |
| **Password protected** | PDF requires password | Remove password protection |
| **Image-only PDF** | No extractable text | Use OCR-enabled PDF |
| **Corrupted file** | File is damaged | Re-export from source |
| **Wrong format** | Content doesn't match expected type | Verify document type |
| **Low quality scan** | Text is unreadable | Re-scan at higher quality |
| **Unsupported layout** | Unusual document structure | Standardize format |

### Invalid PDF Information

Each invalid PDF entry shows:
- Filename
- Document type (KIF, KUF, Contract, Transaction)
- Error message/reason for failure
- Upload timestamp
- Processing attempt timestamp

### Resolving Invalid Documents

1. **Review the error message** - Understand why it failed
2. **Obtain a corrected version** - Fix the issue with the source document
3. **Re-upload** - Upload the corrected PDF through the appropriate section
4. The new upload will be processed fresh

### Preventing Invalid PDFs

Best practices for document preparation:

1. **Use clear, high-quality scans** (300 DPI minimum)
2. **Ensure text is selectable** (not just an image)
3. **Remove password protection** before uploading
4. **Verify file integrity** before uploading
5. **Use standard invoice/document formats**
6. **Ensure proper orientation** (not rotated or upside down)

---

## Help Center

### Accessing Help

- Click "Help" in the sidebar
- Navigate to `/help`
- Page title: "Help Center"

### Help Center Features

1. **Search Bar**: Search across all FAQ content
2. **FAQ Tab**: Frequently asked questions organized by category
3. **Contact Tab**: Support contact information

### Searching for Help

1. Enter your question or keyword in the search bar
2. Results filter in real-time
3. Matching questions are displayed from all categories
4. "No results found" message if nothing matches

### FAQ Categories

| Category | Icon | Topics Covered |
|----------|------|----------------|
| Getting Started | ❓ | Login, password reset, dashboard overview |
| Managing Documents | 📄 | Upload, view, process documents |
| Bank Transactions | 💳 | Statement uploads, transaction management |
| Partners | 👥 | Partner creation and management |
| User Management | 👥 | Roles, statuses, user settings |

### Expanding FAQ Answers

1. Click on any question
2. Answer expands below
3. Click again to collapse
4. Only one answer can be expanded at a time

### FAQ Content

#### Getting Started

**Q: How do I log in to the system?**
> Navigate to the login page and enter your credentials (email and password). If you don't have an account yet, contact your administrator to create one for you.

**Q: How do I reset my password?**
> Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email to reset your password.

**Q: What is the Dashboard?**
> The Dashboard is your main overview page where you can see key metrics and quick access to important features. It provides a snapshot of your system's current state.

#### Managing Documents

**Q: How do I upload documents?**
> Navigate to the specific document type page (KIF, KUF, Contracts, or Bank Transactions). Look for the upload button, click it, and select your PDF files. The system will automatically process them.

**Q: What document formats are supported?**
> Currently, the system supports PDF files. Make sure your documents are in PDF format before uploading.

**Q: How do I view document details?**
> Click on any document in the table to view its detailed information. You can see all extracted data, processing status, and related information.

**Q: What are Invalid PDFs?**
> Invalid PDFs are documents that failed processing or validation. Check the Invalid PDFs page to see which documents need attention and why they failed.

#### Bank Transactions

**Q: How do I upload bank statements?**
> Go to the Bank Transactions page and click the upload button. Select your bank statement PDF files and the system will extract transaction data automatically.

**Q: Can I edit bank transaction data?**
> Yes, click on a transaction to view its details and use the edit function to modify information as needed.

**Q: How do I filter transactions?**
> Use the filter options at the top of the Bank Transactions page to filter by date, amount, status, or other criteria.

#### Partners

**Q: How do I add a new partner?**
> Navigate to the Partners page and click "Add Partner". Fill in the required information including name, contact details, and any relevant business information.

**Q: How do I view partner details?**
> Click on any partner in the partners list to view their complete profile, including contact information, transaction history, and associated documents.

**Q: Can I edit partner information?**
> Yes, from the partner details page, click the edit button to modify partner information. Make sure to save your changes.

#### User Management

**Q: How do I manage users?**
> Navigate to the Users page where you can view all system users, add new users, edit user information, and manage user roles and statuses.

**Q: What are user roles?**
> User roles define what actions a user can perform in the system. Different roles have different permissions. Visit the Roles & Statuses page to manage these.

**Q: How do I update my profile?**
> Click on your profile avatar in the sidebar to access your profile page. You can update your personal information, change your password, and upload a profile picture.

### Contacting Support

The Contact tab provides:

#### Email Support
- **Email**: support@finetica.com
- Response within 24 hours
- Click the email to open your email client

#### Phone Support
- **Phone**: +123 456 7890
- Available during business hours
- Click to dial (on mobile devices)

#### Business Hours
- Monday - Friday, 9:00 AM - 5:00 PM

#### Contact Form
1. Enter your name
2. Enter your email
3. Enter subject
4. Write your message
5. Click "Send Message"

### Admin: Adding FAQ Items

Administrators can add new FAQ items:
1. Click the "Add FAQ" button (visible to admins only)
2. A modal dialog opens
3. Enter the question
4. Enter the answer
5. Select a category
6. Click "Save"

---

## Troubleshooting

### Authentication Issues

#### Cannot Log In

| Issue | Solution |
|-------|----------|
| "Invalid credentials" | Verify email and password are correct |
| "Account pending" | Contact administrator for approval |
| "Account disabled" | Contact administrator to re-enable |
| Page doesn't load | Check internet connection, try different browser |
| Forgot password | Use "Forgot Password" link |

#### Session Expired

| Issue | Solution |
|-------|----------|
| Sudden logout | Session may have expired, log in again |
| Token refresh failed | Clear cookies and log in again |
| Multiple tab issues | Ensure only one active session |

### Document Upload Issues

#### Upload Fails

| Issue | Solution |
|-------|----------|
| "File too large" | Reduce file size below 10MB |
| "Invalid file type" | Ensure file is PDF format |
| Upload timeout | Check internet connection, try smaller file |
| "Upload failed" generic | Try again, contact support if persists |

#### AI Processing Fails

| Issue | Solution |
|-------|----------|
| Document becomes invalid | Check Invalid PDFs page for reason |
| Wrong data extracted | Manually edit and approve |
| No data extracted | Document may not be processable, try clearer copy |
| Processing takes too long | Wait, system may be under load |

### Page/UI Issues

#### Page Not Loading

1. Check internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try different browser
4. Refresh the page (F5)
5. Check if server is accessible

#### Table Not Showing Data

1. Check if filters are applied
2. Click "Clear filters"
3. Refresh the page
4. Check browser console for errors

#### Spinner Won't Stop

1. Wait 30 seconds
2. Refresh the page
3. Clear browser cache
4. Try different browser

### Permission Issues

#### "Access Denied" Error

| Cause | Solution |
|-------|----------|
| Not logged in | Log in to your account |
| Insufficient role | Request higher permissions from admin |
| Session expired | Log in again |
| Wrong account | Verify you're using correct account |

#### Cannot See Menu Items

- User management and roles are admin-only
- Contact your administrator if you need access
- Verify your role in your profile page

### General Tips

1. **Always save work** before navigating away
2. **Refresh** the page if data seems stale
3. **Check notifications** for success/error messages
4. **Use clear filters** if results seem wrong
5. **Contact support** for persistent issues

---

## Glossary

| Term | Definition |
|------|------------|
| **AI Processing** | Automatic data extraction using Google Gemini artificial intelligence |
| **Approval** | User confirmation that extracted data is correct |
| **Bank Transaction** | Individual money movement (credit/debit) in bank account |
| **Business Partner** | Customer, supplier, or other organization you do business with |
| **Contract** | Formal agreement document with a business partner |
| **Dashboard** | Main overview page with key metrics |
| **Deactivate** | Disable a user account without deleting |
| **Invalid PDF** | Document that failed AI processing |
| **JWT** | JSON Web Token - secure authentication mechanism |
| **KIF** | Knjiga Izlaznih Faktura - Sales Invoice Book (outgoing invoices) |
| **KUF** | Knjiga Ulaznih Faktura - Purchase Invoice Book (incoming invoices) |
| **Pagination** | Dividing data into pages (usually 10 items per page) |
| **Pending** | Status awaiting review or approval |
| **Refresh Token** | Token used to obtain new access tokens |
| **Role** | User permission level (e.g., Admin, User) |
| **Soft Delete** | Deactivating rather than permanently removing |
| **Status** | Account state (Active, Pending, Rejected, Disabled) |
| **Supabase** | Cloud storage service for document files |
| **Time Filter** | Filter to show data from specific periods |
| **Upload** | Process of sending a file to the system |
| **VAT** | Value Added Tax |

---

## Technical Support Information

### Application Details

| Component | Technology |
|-----------|------------|
| Frontend | React with Vite |
| Styling | TailwindCSS |
| Backend | Node.js with Express |
| Database | PostgreSQL with Sequelize |
| Storage | Supabase |
| AI | Google Gemini (gemini-2.5-flash-lite) |
| Authentication | JWT with refresh tokens |

### Contact Information

- **Email**: support@finetica.com
- **Phone**: +123 456 7890
- **Hours**: Monday - Friday, 9:00 AM - 5:00 PM

---

*Last Updated: January 2026*
*Version: 2.0 (Detailed Edition)*
