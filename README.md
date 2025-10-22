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

1. **Welcome** - Enter your name to personalize the experience
2. **What to Expect** - Review what you'll need (with autosave notification)
3. **Carrier Selection** - Choose shipping carrier
4. **Carrier Details** - Add account info, upload contracts, and premium service contacts
5. **Tracking API** - Securely save API credentials
6. **Invoice Setup** - Configure email forwarding
7. **Completion** - Confirm successful setup
8. **Dashboard** - View all carriers and add more

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
