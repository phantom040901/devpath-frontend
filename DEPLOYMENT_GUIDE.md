# DevPath Deployment Guide

This guide will help you fix the API connection error and deploy your application properly.

## Problem

When deployed on Vercel, your frontend tries to connect to `http://localhost:8000`, which doesn't work because:
1. Localhost only works on your local machine
2. The FastAPI backend needs to be publicly accessible
3. Vercel's environment needs the correct API URL

## Solution

### Step 1: Configure Environment Variables (Already Done!)

Your `.env` file now has:
```
VITE_API_URL=https://devpath-backend.onrender.com
```

And the code has been updated to use it:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const response = await fetch(`${apiUrl}/predict`, { ... });
```

### Step 2: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://devpath-backend.onrender.com`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### Step 3: Redeploy on Vercel

After adding the environment variable, you need to redeploy:

**Option A: Via Git (Recommended)**
```bash
git add .
git commit -m "Add environment variable for API URL"
git push
```

**Option B: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯) menu
4. Click **Redeploy**

### Step 4: Verify Your Backend is Running

Make sure your FastAPI backend on Render is:
1. **Active** (not sleeping)
2. **Publicly accessible**
3. **Has CORS configured**

Check your backend CORS settings in `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app",  # Add your Vercel domain
        "https://*.vercel.app"  # Allow all Vercel preview domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

### Test Locally
```bash
# Set to local backend
VITE_API_URL=http://localhost:8000 npm run dev
```

### Test Production
Your Vercel deployment should now use the environment variable automatically.

## Common Issues

### Issue 1: Still seeing localhost error
**Solution**: Clear your browser cache or do a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

### Issue 2: CORS errors
**Solution**: Update your FastAPI backend CORS settings to include your Vercel domain

### Issue 3: Backend is sleeping (Render free tier)
**Solution**:
- First request may take 30-60 seconds to wake up the server
- Consider upgrading to a paid plan for instant availability
- Or use Railway/Fly.io which have better free tiers

## Backend Deployment Options

If you haven't deployed your FastAPI backend yet:

### Option 1: Render (Current)
- Already using: `https://devpath-backend.onrender.com`
- Free tier sleeps after inactivity
- First request takes 30-60 seconds

### Option 2: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 3: Fly.io
```bash
# Install flyctl
# Deploy
fly launch
fly deploy
```

### Option 4: Google Cloud Run
```bash
gcloud run deploy devpath-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Environment Variables for Different Environments

### Local Development
```bash
# .env.local
VITE_API_URL=http://localhost:8000
```

### Production (Vercel)
```bash
# Set in Vercel Dashboard
VITE_API_URL=https://devpath-backend.onrender.com
```

### Staging/Preview
```bash
# Set in Vercel Dashboard for preview deployments
VITE_API_URL=https://devpath-backend-staging.onrender.com
```

## Troubleshooting

### Check if API is accessible
```bash
curl https://devpath-backend.onrender.com/predict
```

### Check environment variables in Vercel
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Verify `VITE_API_URL` is set correctly

### View logs
- **Frontend**: Vercel Dashboard → Deployments → View Function Logs
- **Backend**: Render Dashboard → Your Service → Logs

## Next Steps

1. ✅ Environment variable configured
2. ✅ Code updated to use environment variable
3. 🔲 Set environment variable in Vercel dashboard
4. 🔲 Redeploy on Vercel
5. 🔲 Test the prediction feature
6. 🔲 Verify backend CORS settings
7. 🔲 Monitor logs for any issues

## Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Check Vercel deployment logs
3. Check Render backend logs
4. Verify environment variables are set correctly

---

**Last Updated**: $(date)
