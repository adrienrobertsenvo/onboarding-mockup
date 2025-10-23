# Deploy Now - Fixed API Configuration

## What Changed

✅ **Simplified API** - Removed Express, now pure Vercel serverless function
✅ **Removed unnecessary dependencies** - Only @vercel/node needed
✅ **Fixed routing** - API handles all routes in a single function

## Deploy Steps

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix API for Vercel deployment"
   git push
   ```

2. **Vercel will auto-deploy** (or manually trigger from dashboard)

## Test After Deployment

### 1. Test API Health
```bash
curl https://your-project.vercel.app/api/health
```
Should return:
```json
{"status":"ok","timestamp":"2024-..."}
```

### 2. Test Create Customer
```bash
curl -X POST https://your-project.vercel.app/api/customers \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test Company","customer_email":"test@example.com"}'
```

### 3. Test Frontend
Visit `https://your-project.vercel.app` and complete the onboarding flow

## How It Works Now

**Frontend:**
- Built from `client/` directory
- Deployed as static files to CDN
- All routes handled by React Router

**API:**
- Single serverless function in `api/index.ts`
- Handles all `/api/*` routes
- In-memory storage (resets on each deploy)

**Routing:**
```
/                    → React app (index.html)
/carrier-selection   → React app (index.html)
/api/health          → api/index.ts handler
/api/customers       → api/index.ts handler
```

## Important Notes

⚠️ **Data does NOT persist** - The API uses in-memory storage
- Each deployment resets all data
- For production, you'd need a database

✅ **API and Frontend on same domain** - No CORS issues
✅ **Automatic SSL** - HTTPS enabled by default
✅ **Global CDN** - Fast loading worldwide

## If API Still Returns 404

Check Vercel Function logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Functions" tab
4. Click on "api/index" function
5. View invocation logs

Common issues:
- Function not deployed → Check "Functions" tab
- Wrong path → API expects `/api/health` not `/health`
- Build failed → Check build logs in Deployments

## Alternative: Frontend Only

If you want to deploy just the frontend without API:

1. Remove `api/` directory
2. Update `client/src/services/api.ts` to point to separate backend
3. Deploy just the `client/` directory

This is simpler but requires a separate backend service.
