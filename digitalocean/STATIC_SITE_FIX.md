# Fix: Static Site Configuration Error

## Problem
You're getting this error:
```
ERROR: failed to launch: determine start command: when there is no default process a command is required
ERROR failed health checks after 1 attempts with error Readiness probe failed: dial tcp 100.127.7.193:8080: connect: connection refused
```

This happens when DigitalOcean App Platform detects your app as a **Web Service** instead of a **Static Site**.

## Solution

### Option 1: Fix in DigitalOcean Dashboard (Recommended)

1. **Go to your App in DigitalOcean Dashboard**
   - Navigate to: https://cloud.digitalocean.com/apps
   - Click on your app

2. **Edit the Component**
   - Click on the component (likely named "frontend" or similar)
   - Click "Edit" or the settings icon

3. **Change Component Type**
   - Look for "Component Type" or "Resource Type"
   - Change from **"Web Service"** to **"Static Site"**
   - Save changes

4. **Verify Settings** (for Static Site):
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **HTTP Port**: Leave empty or `8080` (not required for static sites)
   - **Run Command**: **REMOVE THIS** (static sites don't need a run command)
   - **Dockerfile**: **REMOVE THIS** (not needed)

5. **Redeploy**
   - Click "Save" or "Deploy"
   - The app should rebuild as a static site

### Option 2: Delete and Recreate (If Option 1 doesn't work)

1. **Delete the current app** (or just the component)
2. **Create a new app** and:
   - When connecting your repository, DigitalOcean will auto-detect
   - **IMPORTANT**: When it shows the component, make sure it says **"Static Site"** not "Web Service"
   - If it shows "Web Service", click "Edit" and change to "Static Site"
   - Configure:
     - Build Command: `npm run build`
     - Output Directory: `build`
     - **DO NOT** add a Run Command
     - **DO NOT** add a Dockerfile

### Option 3: Use app.yaml (If you prefer config file)

1. **Update `app.yaml`** in your repository (already done)
2. **In DigitalOcean Dashboard**:
   - Go to App Settings
   - Enable "Use app.yaml" or "Import from app.yaml"
   - This will use the `app.yaml` file from your repo

## Key Differences

### Static Site (Correct) ✅
- Component Type: **Static Site**
- Has: Build Command, Output Directory
- Does NOT have: Run Command, Dockerfile, Start Command
- Serves pre-built static files

### Web Service (Wrong) ❌
- Component Type: **Web Service**
- Requires: Run Command or Dockerfile
- Expects: A running server process
- This is why you got the error!

## Verification

After fixing, your component should show:
- ✅ Type: Static Site
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `build`
- ❌ No Run Command
- ❌ No Dockerfile

## Still Having Issues?

If DigitalOcean keeps detecting it as a Web Service:

1. **Check your repository structure**:
   - Make sure there's no `Dockerfile` in the root
   - Make sure there's no `Procfile` or similar
   - The presence of these files can trigger Web Service detection

2. **Explicitly set in dashboard**:
   - Even if auto-detected wrong, you can manually change it
   - Go to Component Settings → Change Type to "Static Site"

3. **Contact Support**:
   - If the dashboard doesn't allow changing the type
   - You may need to delete and recreate the component
