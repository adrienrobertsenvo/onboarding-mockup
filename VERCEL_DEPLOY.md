# Quick Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your project is now configured for Vercel deployment with:

- ✅ `vercel.json` - Vercel configuration
- ✅ `api/` - Serverless API functions
- ✅ `api/package.json` - API dependencies
- ✅ `.gitignore` - Ignore unnecessary files
- ✅ `.vercelignore` - Vercel-specific ignores
- ✅ `client/package.json` - Updated with `vercel-build` script

## 🚀 Deploy Now

### Option 1: Via Vercel Dashboard (Easiest)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Deploy" (no configuration needed!)

### Option 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /Users/adrienrobert/gitrepo/onboarding-mockup
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy: `Y`
   - Scope: Choose your account
   - Link to existing project: `N`
   - Project name: `onboarding-mockup` (or your choice)
   - Directory: `.` (current directory)
   - Override settings: `N`

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## 📁 What Gets Deployed

**Frontend (Static Files):**
- Built from `client/` directory
- Deployed to global CDN
- Accessible at: `https://your-project.vercel.app`

**API (Serverless Functions):**
- From `api/index.ts`
- Accessible at: `https://your-project.vercel.app/api/*`

## 🧪 Test Your Deployment

After deployment, test these URLs:

1. **Frontend:** `https://your-project.vercel.app`
2. **API Health:** `https://your-project.vercel.app/api/health`
3. **Create Customer:**
   ```bash
   curl -X POST https://your-project.vercel.app/api/customers \
     -H "Content-Type: application/json" \
     -d '{"customer_name":"Test","customer_email":"test@example.com"}'
   ```

## 🔧 Configuration Details

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.ts" },
    { "src": "/(.*)", "dest": "/client/dist/$1" }
  ]
}
```

### Build Process
1. Vercel installs client dependencies
2. Runs `npm run vercel-build` in client/
3. Outputs to `client/dist/`
4. Deploys API as serverless function
5. Serves everything through CDN

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs in dashboard
- Verify local build works: `cd client && npm run build`
- Ensure all dependencies are in package.json

### API Returns 404
- Check Vercel Functions logs
- Verify `/api/health` endpoint
- Check routes in `vercel.json`

### Frontend Shows Blank Page
- Check browser console for errors
- Verify build output exists
- Check routing configuration

## 📊 After Deployment

1. **View Logs:** Vercel Dashboard → Your Project → Functions
2. **Monitor:** Analytics tab for performance metrics
3. **Custom Domain:** Settings → Domains
4. **Environment Variables:** Settings → Environment Variables

## 🔄 Continuous Deployment

Once connected to Git:
- Every push to `main` → Auto-deploy to production
- Pull requests → Auto-generate preview deployments
- View deployment status in GitHub/GitLab

## 📝 Notes

- **Data Storage:** API uses in-memory storage (resets on deploy)
- **File Uploads:** Not persisted (in-memory only)
- **For Production:** Add database (PostgreSQL, MongoDB, etc.)
- **Scaling:** Automatic with Vercel's infrastructure

## 🎉 You're Ready!

Your project is fully configured for Vercel. Just run `vercel` or connect via dashboard!

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
