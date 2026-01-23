# IMMEDIATE FIX: "Missing script: start" Error

## The Problem
DigitalOcean is trying to run `npm start` because it thinks your app is a **Web Service**, not a **Static Site**.

## Solution: Change Component Type in Dashboard

### Step-by-Step Fix:

1. **Go to DigitalOcean Dashboard**
   - Navigate to: https://cloud.digitalocean.com/apps
   - Click on your app name

2. **Edit the Component**
   - You should see a component (probably named "frontend" or similar)
   - Click on the component name or the **"Edit"** button (pencil icon)

3. **Change Resource Type**
   - Look for **"Resource Type"** or **"Component Type"** dropdown
   - It probably says **"Web Service"** or **"Service"**
   - **Change it to "Static Site"**
   - Click **"Save"** or **"Update"**

4. **Remove Run Command** (if present)
   - In the component settings, look for **"Run Command"** or **"Start Command"**
   - **DELETE/REMOVE this field** (leave it empty)
   - Static sites don't need a run command

5. **Verify Settings**:
   - ✅ **Resource Type**: Static Site
   - ✅ **Build Command**: `npm run build`
   - ✅ **Output Directory**: `build`
   - ❌ **Run Command**: (should be EMPTY)
   - ❌ **Dockerfile**: (should be EMPTY or not set)

6. **Redeploy**
   - Click **"Save Changes"** or **"Deploy"**
   - The app will rebuild as a static site

## Alternative: Delete and Recreate Component

If you can't change the type:

1. **Delete the current component** (or the entire app)
2. **Create a new app**:
   - Connect your repository
   - When it shows the component preview, **BEFORE clicking "Create"**:
     - Make sure it says **"Static Site"** in the component type
     - If it says "Web Service", click "Edit" and change it
   - Then proceed with configuration

## Why This Happens

DigitalOcean auto-detects app types based on:
- Presence of `package.json` with a `start` script → Web Service
- Presence of `Dockerfile` → Web Service
- Other indicators

Since your `package.json` doesn't have a `start` script, but DigitalOcean still detected it as a Web Service, you need to manually override this in the dashboard.

## Verification

After fixing, your component should:
- ✅ Show "Static Site" as the type
- ✅ Have build command: `npm run build`
- ✅ Have output directory: `build`
- ❌ NOT have a run/start command
- ❌ NOT have a Dockerfile

The build logs should show:
- `npm run build` executing
- Files being copied to `build` directory
- NO attempt to run `npm start`
- NO health check failures

## Still Not Working?

If the dashboard doesn't let you change the type:

1. **Check if `app.yaml` is being used**:
   - Go to App Settings
   - Look for "Use app.yaml" or "Import from app.yaml"
   - Enable it if available

2. **Contact DigitalOcean Support**:
   - They can help change the component type
   - Or guide you through the correct configuration

3. **Try using DigitalOcean Spaces + CDN**:
   - As an alternative, you could deploy the built files to Spaces
   - But App Platform Static Site is the recommended approach
