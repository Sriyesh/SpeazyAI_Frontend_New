# App Platform HTTP Routes Configuration

## What to Configure in App Platform

For the **HTTP Request Routes** screen you're seeing:

### ✅ Correct Configuration:

1. **Route Path**: `/` 
   - Keep this as is - it routes all requests to your static site

2. **Rewrite Path**: (Leave empty)
   - Not needed for a static site

3. **Preserve Path Prefix**: ✅ **CHECK THIS BOX**
   - This is important for SPA (Single Page Application) routing
   - Without this, direct URL access (like `/login`) will return 404
   - With this checked, all routes will be handled by your React app

4. **Configure CORS**: ❌ **DON'T CONFIGURE HERE**
   - This only affects CORS headers served by your static site
   - It does NOT affect the DigitalOcean Functions CORS
   - Your Functions CORS issue needs to be fixed in the Functions dashboard

5. **Click "Save"**

## Important: This Won't Fix Your Functions CORS Error

The CORS error you're seeing:
```
Access-Control-Allow-Origin header contains multiple values '*, https://exeleratetechnology-app-89gdq.ondigitalocean.app'
```

This is coming from **DigitalOcean Functions** (`faas-blr1-8177d592.doserverless.co`), NOT from your App Platform static site.

## To Fix the Functions CORS Error:

You need to:

1. **Go to DigitalOcean Functions Dashboard** (NOT App Platform):
   - Navigate to: https://cloud.digitalocean.com/functions
   - Click on each function (`authProxy`, `chatgptProxy`, etc.)

2. **Check for Platform CORS Settings**:
   - Look for any "CORS" or "Headers" configuration in the function settings
   - Disable any platform-level CORS if present
   - Ensure the function code is using the updated CORS logic

3. **Redeploy Functions**:
   - Make sure all 5 functions are redeployed with the updated code
   - The code should handle `.ondigitalocean.app` origins

## Fix 404 on /login, /about, etc. (SPA routes)

If direct access to `/login` or other client-side routes returns **404 Not Found**, you need to serve `index.html` for missing paths. See **[SPA_404_FIX.md](./SPA_404_FIX.md)** for step-by-step instructions (Custom Pages → Error document = `index.html`, and/or `error_document` in app.yaml).

## Summary

**In App Platform HTTP Routes:**
- ✅ Route Path: `/`
- ✅ Preserve Path Prefix: **CHECKED**
- ❌ Don't configure CORS here (it won't help)

**For 404 on SPA routes:**
- Set **Custom Pages → Error document** to `index.html`, or use `error_document: index.html` in app.yaml. Then redeploy.

**For Functions CORS:**
- Go to Functions Dashboard
- Check/disable platform CORS settings
- Redeploy functions with updated code
