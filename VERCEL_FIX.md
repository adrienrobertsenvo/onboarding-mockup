# Fix for 404 Error on Vercel

## Changes Made

1. **Simplified `vercel.json`** to just specify build settings
2. **Updated `client/vite.config.ts`** with proper base path and build settings
3. API routes will be handled by the `api/` directory automatically

## Redeploy Steps

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Vercel will auto-deploy** from the git push

   OR manually redeploy:
   - Go to Vercel dashboard
   - Click "Redeploy" on your project

## What Changed

### Before:
- Complex routing configuration that confused Vercel
- Incorrect output directory paths

### After:
- Simple configuration pointing to `client/dist`
- API automatically detected in `api/` directory
- Proper SPA routing handled by index.html fallback

## Testing

After redeployment, test:

1. **Homepage:** `https://your-project.vercel.app/`
   - Should show the Welcome page

2. **API Health:** `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Navigation:** Try clicking through the onboarding flow
   - All routes should work without 404

## If Still Getting 404

### Option 1: Check Build Logs
- Go to Vercel Dashboard → Deployments → Click on latest
- Check "Building" logs for errors
- Check "Functions" logs for API errors

### Option 2: Manual Configuration in Vercel Dashboard
If automatic detection doesn't work:

1. Go to Project Settings → General
2. Set:
   - **Framework Preset:** Other
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/dist`
   - **Install Command:** `cd client && npm install && cd ../api && npm install`

3. Redeploy

## Alternative: Deploy Client Only (Simpler)

If you want to deploy just the frontend without the API:

1. Create a new Vercel project
2. Point it to `client/` directory only
3. Update API calls to use a separate backend URL

## Need Help?

Check Vercel logs for specific errors:
- Dashboard → Your Project → Deployments → Latest → View Function Logs
