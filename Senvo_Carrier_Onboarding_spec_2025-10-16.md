# Senvo Carrier Onboarding Interface - Technical Specification

**Generated:** October 16, 2025
**Version:** 1.0.0
**Status:** Production Ready

---

## Overview

This document serves as the single source of truth for the Senvo Carrier Onboarding Interface. It describes a guided multi-step onboarding flow that enables customers to connect carrier accounts (DHL, UPS, FedEx, etc.), add tracking API credentials, and configure invoice forwarding.

### Purpose

The Senvo onboarding interface collects:
- Customer contact information
- Carrier account details and contracts
- Tracking API credentials (securely stored)
- Invoice delivery configuration

### Key Features

- **Multi-step guided flow** with progress indicators
- **File upload support** for contracts and rate sheets
- **Secure credential storage** with encryption
- **Dynamic email generation** for invoice forwarding
- **Responsive design** with modern UI/UX
- **Type-safe implementation** using TypeScript

---

## Flow Map

The onboarding process consists of 6 sequential screens:

### 1. Welcome Screen (`/`)
**Purpose:** Capture customer contact information
**Route:** `/`
**Progress:** 0%

**Fields:**
- Customer Name (text, required)
- Email Address (email, required)
- Phone Number (tel, required)

**Backend Action:**
- POST `/api/customers`
- Creates customer record
- Generates unique invoice email
- Returns customer ID

**Transition:** → Carrier Selection

---

### 2. Carrier Selection (`/carrier-selection`)
**Purpose:** Select shipping carrier
**Route:** `/carrier-selection`
**Progress:** 20%

**Options:**
- DHL Parcel
- DHL Express
- DPD
- GLS
- UPS
- FedEx

**Backend Action:**
- POST `/api/carrier-config`
- Creates carrier configuration record
- Links to customer ID
- Returns config ID

**Transition:** → Carrier Details

---

### 3. Carrier Details (`/carrier-details`)
**Purpose:** Collect carrier account information
**Route:** `/carrier-details`
**Progress:** 40%

**Fields:**
- Account Number (text, optional)
- Contract File (file upload, PDF/DOC/DOCX)
- Account Manager Name (text, optional)
- Account Manager Email (email, optional)
- Account Manager Phone (tel, optional)
- Premium Service (checkbox, boolean)
- Negotiated Rates (file upload, PDF/XLS/XLSX/CSV)

**Backend Action:**
- PUT `/api/carrier-config/:id`
- Uploads files to server storage
- Updates carrier configuration
- Stores file paths

**Transition:** → Tracking API

---

### 4. Tracking API Credentials (`/tracking-api`)
**Purpose:** Securely collect API credentials
**Route:** `/tracking-api`
**Progress:** 60%

**Fields:**
- API Endpoint URL (url, required)
- API Username (text, required)
- API Password (password, required)
- API Key (text, required)

**Info Text:**
"Find this in your [Carrier] Developer Portal under API Details."

**Backend Action:**
- POST `/api/carrier-config/:id/tracking-api`
- Encrypts credentials using AES-256
- Stores encrypted data separately
- Never logs sensitive information

**Transition:** → Invoice Setup

---

### 5. Invoice Forwarding Setup (`/invoices`)
**Purpose:** Display invoice email and confirm setup
**Route:** `/invoices`
**Progress:** 80%

**Dynamic Display:**
- Generated email: `invoices+{customer_id}@senvo.de`

**Fields:**
- Confirmation checkbox (required)

**Backend Action:**
- GET `/api/customers/:id/invoice-email` (on load)
- POST `/api/customers/:id/complete` (on submit)
- Marks onboarding as completed

**Transition:** → Completion

---

### 6. Completion (`/completion`)
**Purpose:** Confirm successful onboarding
**Route:** `/completion`
**Progress:** 100%

**Display:**
- Success icon (checkmark)
- Completion message
- Next steps guidance
- Link to dashboard

**No Backend Action**

---

## Field Definitions

### Customer Information

| Field Name | Type | Required | Validation | Storage |
|------------|------|----------|------------|---------|
| customer_name | string | Yes | 1-100 chars | customers.customer_name |
| customer_email | email | Yes | Valid email format | customers.customer_email |
| customer_phone | string | Yes | 10-20 chars | customers.customer_phone |

### Carrier Configuration

| Field Name | Type | Required | Validation | Storage |
|------------|------|----------|------------|---------|
| selected_carrier | enum | Yes | One of 6 carriers | carrier_config.selected_carrier |
| account_number | string | No | Max 50 chars | carrier_config.account_number |
| contract_file | file | No | PDF/DOC/DOCX, <10MB | carrier_config.contract_file_path |
| account_manager_name | string | No | Max 100 chars | carrier_config.account_manager_name |
| account_manager_email | email | No | Valid email format | carrier_config.account_manager_email |
| account_manager_phone | string | No | 10-20 chars | carrier_config.account_manager_phone |
| premium_service | boolean | No | true/false | carrier_config.premium_service |
| negotiated_rates | file | No | PDF/XLS/XLSX/CSV, <10MB | carrier_config.negotiated_rates_path |

### Tracking API Credentials

| Field Name | Type | Required | Validation | Storage |
|------------|------|----------|------------|---------|
| api_endpoint | url | Yes | Valid URL format | tracking_api.api_endpoint |
| api_username | string | Yes | Max 100 chars | tracking_api.api_username_encrypted |
| api_password | string | Yes | Max 100 chars | tracking_api.api_password_encrypted |
| api_key | string | Yes | Max 200 chars | tracking_api.api_key_encrypted |

---

## Data Model

### Database Tables

#### `customers`
```typescript
{
  id: string (nanoid)
  customer_name: string
  customer_email: string
  customer_phone: string
  invoice_email: string (generated)
  onboarding_completed: boolean
  created_at: Date
}
```

**Invoice Email Generation:**
```typescript
invoice_email = `invoices+${customer_id}@senvo.de`
```

#### `carrier_config`
```typescript
{
  id: string (nanoid)
  customer_id: string (FK)
  selected_carrier: string
  account_number?: string
  contract_file_path?: string
  account_manager_name?: string
  account_manager_email?: string
  account_manager_phone?: string
  premium_service: boolean (default: false)
  negotiated_rates_path?: string
  created_at: Date
  updated_at: Date
}
```

#### `tracking_api_credentials`
```typescript
{
  id: string (nanoid)
  carrier_config_id: string (FK)
  api_endpoint: string
  api_username_encrypted: string
  api_password_encrypted: string
  api_key_encrypted: string
  created_at: Date
}
```

### Data Relationships

```
customers (1) ─→ (1) carrier_config
carrier_config (1) ─→ (1) tracking_api_credentials
```

### Security Measures

**Encryption:**
- Algorithm: AES-256-CBC
- Encrypted fields: API username, password, API key
- Key storage: Environment variable (`ENCRYPTION_KEY`)

**File Storage:**
- Location: `server/uploads/`
- Naming: `{fieldname}-{timestamp}-{random}.{ext}`
- Size limit: 10MB per file
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, CSV

---

## API Endpoints

### Customer Endpoints

#### `POST /api/customers`
**Purpose:** Create new customer record

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@company.com",
  "customer_phone": "+1 (555) 123-4567"
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "invoice_email": "invoices+abc123xyz@senvo.de"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `500` - Server error

---

#### `GET /api/customers/:id/invoice-email`
**Purpose:** Retrieve generated invoice email

**Response:**
```json
{
  "email": "invoices+abc123xyz@senvo.de"
}
```

**Status Codes:**
- `200` - Success
- `404` - Customer not found
- `500` - Server error

---

#### `POST /api/customers/:id/complete`
**Purpose:** Mark onboarding as completed

**Response:**
```json
{
  "message": "Onboarding completed successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Customer not found
- `500` - Server error

---

### Carrier Configuration Endpoints

#### `POST /api/carrier-config`
**Purpose:** Create carrier configuration

**Request Body:**
```json
{
  "customer_id": "abc123xyz",
  "selected_carrier": "DHL Express"
}
```

**Response:**
```json
{
  "id": "config456def"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Missing required fields
- `500` - Server error

---

#### `PUT /api/carrier-config/:id`
**Purpose:** Update carrier details with file uploads

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `account_number` (text)
- `account_manager_name` (text)
- `account_manager_email` (text)
- `account_manager_phone` (text)
- `premium_service` (boolean)
- `contract_file` (file)
- `negotiated_rates` (file)

**Response:**
```json
{
  "message": "Carrier details updated successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Config not found
- `500` - Server error

---

#### `POST /api/carrier-config/:id/tracking-api`
**Purpose:** Save tracking API credentials (encrypted)

**Request Body:**
```json
{
  "api_endpoint": "https://api.dhl.com/v1",
  "api_username": "api_user_12345",
  "api_password": "secret_password",
  "api_key": "sk_live_xxxxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "message": "Tracking API credentials saved securely"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing credentials
- `404` - Config not found
- `500` - Server error

---

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **Styling:** Custom CSS with CSS variables

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express 4
- **File Uploads:** Multer
- **ID Generation:** nanoid
- **Encryption:** Node.js crypto module

### Development
- **Package Manager:** npm
- **TypeScript:** v5.3+
- **Dev Server:** tsx (watch mode)
- **Concurrency:** concurrently

---

## Project Structure

```
senvo-carrier-onboarding/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Welcome.tsx
│   │   │   ├── CarrierSelection.tsx
│   │   │   ├── CarrierDetails.tsx
│   │   │   ├── TrackingAPI.tsx
│   │   │   ├── Invoices.tsx
│   │   │   └── Completion.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API service layer
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript type definitions
│   │   ├── styles/
│   │   │   └── global.css      # Global styles
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   └── index.ts            # Server entry point
│   ├── routes/
│   │   ├── customers.ts        # Customer endpoints
│   │   └── carrierConfig.ts   # Carrier config endpoints
│   ├── models/
│   │   └── database.ts         # Data models
│   ├── middleware/
│   │   └── upload.ts           # File upload middleware
│   ├── utils/
│   │   ├── crypto.ts           # Encryption utilities
│   │   └── email.ts            # Email generation
│   ├── uploads/                # File storage directory
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── package.json                 # Root package.json
└── Senvo_Carrier_Onboarding_spec_2025-10-16.md  # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git (optional)

### Installation Steps

1. **Install root dependencies:**
```bash
npm install
```

2. **Install all project dependencies:**
```bash
npm run install:all
```

3. **Configure environment variables:**
```bash
cd server
cp .env.example .env
# Edit .env and set ENCRYPTION_KEY to a secure random value
```

4. **Start development servers:**
```bash
npm run dev
```

This starts:
- Frontend dev server: `http://localhost:3000`
- Backend API server: `http://localhost:5000`

---

## Development Commands

```bash
# Start both client and server in dev mode
npm run dev

# Start only client
npm run dev:client

# Start only server
npm run dev:server

# Build for production
cd client && npm run build
cd server && npm run build

# Start production server
cd server && npm start
```

---

## Environment Variables

### Server (.env)

```bash
PORT=5000
ENCRYPTION_KEY=your-secure-32-byte-key-here
NODE_ENV=development
```

**Important:** Change `ENCRYPTION_KEY` to a secure random value in production!

---

## Security Considerations

### Credential Storage
- All API credentials are encrypted using AES-256-CBC
- Encryption key must be stored securely (environment variable)
- Never log or display decrypted credentials

### File Uploads
- File type validation (whitelist only)
- File size limits enforced (10MB max)
- Files stored outside web root
- Unique filenames prevent collisions

### Input Validation
- All user inputs validated on backend
- Email format validation
- URL format validation for API endpoints
- SQL injection prevention (use parameterized queries in production)

### Production Recommendations
1. Use a proper database (PostgreSQL, MongoDB)
2. Implement authentication & authorization
3. Use HTTPS only
4. Store encryption keys in secure vault (AWS KMS, HashiCorp Vault)
5. Implement rate limiting
6. Add CSRF protection
7. Sanitize file uploads with antivirus scanning
8. Implement audit logging

---

## Testing Recommendations

### Unit Tests
- API endpoint handlers
- Encryption/decryption functions
- Email generation logic
- Form validation

### Integration Tests
- Complete onboarding flow
- File upload functionality
- Database operations
- API error handling

### E2E Tests
- Full user journey from welcome to completion
- File upload scenarios
- Error state handling
- Navigation guard tests

---

## Change History

### Version 1.0.0 (October 16, 2025)
- **Author:** Claude Code
- **Changes:**
  - Initial implementation of Senvo Carrier Onboarding Interface
  - Created 6-step guided onboarding flow
  - Implemented secure credential storage with AES-256 encryption
  - Added file upload support for contracts and rate sheets
  - Built dynamic invoice email generation
  - Created comprehensive API backend
  - Implemented progress tracking UI
  - Added TypeScript type safety throughout
  - Generated technical specification document

---

## Future Enhancements

### Planned Features
1. **Multi-carrier support** - Allow adding multiple carriers per customer
2. **Email verification** - Send confirmation emails to customer
3. **Dashboard** - Post-onboarding management interface
4. **Invoice parsing** - Automated invoice data extraction
5. **Audit reporting** - Generate overcharge reports
6. **Notifications** - Email/SMS alerts for overcharges found
7. **API testing** - Validate carrier API credentials during onboarding
8. **Progress persistence** - Save draft and resume later

### Technical Improvements
1. Replace in-memory database with PostgreSQL/MongoDB
2. Add Redis for session management
3. Implement proper authentication (JWT, OAuth)
4. Add comprehensive logging (Winston, Pino)
5. Implement monitoring (Prometheus, Grafana)
6. Add CI/CD pipeline
7. Containerize with Docker
8. Deploy to cloud (AWS, GCP, Azure)

---

## Support & Maintenance

### Documentation Updates
This specification should be updated whenever:
- New features are added
- API endpoints change
- Data models are modified
- Security measures are updated
- Deployment configuration changes

### Version Control
- Each change must be documented in the Change History section
- Include timestamp, author, and detailed description
- Tag releases in version control system

---

## License

Copyright © 2025 Senvo. All rights reserved.

---

**End of Specification Document**
