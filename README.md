# Senvo Carrier Onboarding Interface

A guided multi-step onboarding flow for connecting carrier accounts, adding tracking API credentials, and configuring invoice forwarding.

## Features

- **7-Step Guided Flow** with visual progress indicators
- **What to Expect Page** prepares users before starting
- **Back/Next Navigation** allows easy movement between steps
- **Auto-Save & Resume** saves progress every 20 seconds
- **Conditional Fields** for premium service contacts
- **Multiple Carriers** support - add as many carriers as needed
- **Dashboard** to view all connected carriers
- **Carrier Integration** for DHL, UPS, FedEx, DPD, GLS
- **Secure Credential Storage** with AES-256 encryption
- **File Upload Support** for contracts and rate sheets
- **Dynamic Email Generation** for invoice forwarding
- **Responsive Design** with modern UI/UX
- **Full TypeScript** type safety

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies (client + server)
npm run install:all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env and set a secure ENCRYPTION_KEY
```

### 3. Start Development Servers

```bash
# From the root directory
npm run dev
```

This will start:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## Project Structure

```
.
├── client/              # React frontend (Vite + TypeScript)
├── server/              # Express backend (Node.js + TypeScript)
└── Senvo_Carrier_Onboarding_spec_2025-10-16.md  # Full technical spec
```

## Onboarding Flow

### 1. Customer Setup
  - 1.1 Shared Email - Configure email for claiming
  - 1.2 WMS/EOD Report
    - 1.2.1 WMS Example File - Upload sample warehouse management file
    - 1.2.2 WMS File Ingestion - Configure automated file processing
  - 1.3 Invite Other Users - Add team members to your account

### 2. Carrier Setup
  - 2.0 Carrier Selection - Choose your shipping carriers
  - **Per Carrier Configuration:**
    - 2.x.1 Carrier Contacts - Add account manager information
    - 2.x.2 Contract Rates - Upload account numbers and contracts
    - 2.x.3 Data Ingress
      - 2.x.3.1 Tracking API - Configure API credentials
      - 2.x.3.2 Invoices Ingestion - Set up invoice forwarding

### 3. Completion & Dashboard
  - Review setup and access your dashboard

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- React Router 6
- Vite 5
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- Multer (file uploads)
- AES-256 encryption

## Available Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend

# Installation
npm run install:all      # Install all dependencies
```

## Documentation

For complete technical documentation, API specifications, and deployment instructions, see:

**[Senvo_Carrier_Onboarding_spec_2025-10-16.md](./Senvo_Carrier_Onboarding_spec_2025-10-16.md)**

## Security Notes

- All API credentials are encrypted before storage
- Files are validated and size-limited (10MB max)
- Use HTTPS in production
- Change `ENCRYPTION_KEY` in production to a secure random value

## Production Deployment

Before deploying to production:

1. Replace in-memory database with PostgreSQL/MongoDB
2. Set up proper authentication
3. Use environment-specific encryption keys
4. Enable HTTPS only
5. Implement rate limiting
6. Add monitoring and logging

## License

Copyright © 2025 Senvo. All rights reserved.
