# Vercel Deployment Guide

This project is configured for deployment on Vercel with both frontend (React/Vite) and backend (Express API) serverless functions.

## Project Structure

```
onboarding-mockup/
├── client/              # React frontend (Vite)
├── api/                 # Serverless API functions
├── server/              # Local development server (not deployed)
└── vercel.json          # Vercel configuration
```

## Deployment Steps

### 1. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

### 3. Deploy via CLI (Alternative)

```bash
# From the project root
vercel
```

Follow the prompts to link your project and deploy.

## Configuration

### vercel.json

The project uses a `vercel.json` file that configures:
- **Frontend**: Built from `client/` directory using Vite
- **API**: Serverless functions from `api/` directory
- **Routes**:
  - `/api/*` → Serverless functions
  - `/*` → Static frontend files

### Environment Variables

No environment variables are required for the demo. The API uses in-memory storage.

For production, you may want to add:
- `DATABASE_URL` - Database connection string
- `API_SECRET` - API authentication secret

Set these in the Vercel Dashboard under Settings → Environment Variables.

## Build Process

Vercel will:
1. Install client dependencies (`client/package.json`)
2. Build the React app (`npm run vercel-build`)
3. Deploy static files to CDN
4. Deploy API functions as serverless endpoints

## API Endpoints

All API endpoints are available at `/api/*`:

- `POST /api/customers` - Create customer
- `GET /api/customers/:id/invoice-email` - Get invoice email
- `POST /api/carrier-config` - Create carrier config
- `PUT /api/carrier-config/:id` - Update carrier config
- `POST /api/carrier-config/:id/tracking-api` - Save tracking API
- `GET /api/health` - Health check

## Local Development

For local development, continue using the existing setup:

```bash
npm run dev
```

This runs both the client (port 3000) and local server (port 5001) concurrently.

## Troubleshooting

### Build Fails

- Check the Vercel build logs in the dashboard
- Ensure all dependencies are listed in `package.json`
- Verify TypeScript compilation succeeds locally

### API Not Working

- Check API logs in Vercel dashboard
- Verify routes in `vercel.json` are correct
- Test endpoints with `/api/health`

### 404 Errors

- Add a `_redirects` file or update `vercel.json` routes
- For SPA routing, all routes should redirect to `index.html`

## Monitoring

After deployment:
- View logs in Vercel Dashboard → Deployment → Functions
- Monitor performance in Analytics tab
- Set up alerts for errors

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Notes

- The API uses in-memory storage (data resets on each deployment)
- For production, integrate a proper database (PostgreSQL, MongoDB, etc.)
- Consider adding authentication for production use
- File uploads are stored in memory (not persisted)
