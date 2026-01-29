# Fix 404 on Routes Like /login (SPA on DigitalOcean)

## Problem

Direct visits or refreshes to `exeleratetechnology.com/login`, `/about`, `/my-lessons`, etc. show **404 Not Found**. The app works when you start at `/` and navigate via links, but not when you open or refresh a deep link.

## Cause

The static server looks for a file at `/login` (or similar). No such file exists—your app is a **Single Page Application (SPA)**. All routes are handled by React Router **after** `index.html` loads. The server must serve `index.html` for those paths instead of returning 404.

## Fix (pick the one that matches your setup)

### Option 1: Droplet + nginx (`npm run build` + `deploy.sh`)

You build with `npm run build`, upload to a droplet, and serve with **nginx**. Use the SPA nginx config so nginx serves `index.html` for missing paths.

**One-time setup:**

1. Run the setup script (same server as `deploy.sh`):
   ```bash
   chmod +x setup-droplet-nginx.sh
   ./setup-droplet-nginx.sh
   ```
2. Continue deploying app updates with:
   ```bash
   ./deploy.sh
   ```

The script installs `digitalocean/nginx-spa.conf` on the droplet (backing up your existing default config first). The important directive is `try_files $uri $uri/ /index.html;` in `location /`.

**If you use a custom nginx config** (e.g. SSL, different `server_name`): add this inside your `location /` block:
```nginx
try_files $uri $uri/ /index.html;
```

---

### Option 2: App Platform – Custom Pages (Error Document)

1. Go to **DigitalOcean** → **Apps** → your app (e.g. **exeleratetechnology**).
2. Open the **Settings** tab.
3. Find **Custom Pages** (or **Error Pages**).
4. Set **Error document** (404 fallback) to: **`index.html`**.
5. Save and **redeploy** the app.

This makes the platform serve `index.html` whenever a requested path doesn’t match a static file, so your SPA router can handle `/login`, etc.

### Option 3: App Platform – HTTP Routes + Preserve Path

1. Go to your app → **Settings** → **Components** → your **Static Site** component.
2. Open **HTTP Request Routes** (or **Routes**).
3. Ensure you have a route **Path**: **`/`**.
4. **Check “Preserve Path Prefix”** (or equivalent) for that route.
5. Save and redeploy.

### Option 4: app.yaml (if you use App Platform with app spec)

Your `app.yaml` already includes:

```yaml
static_sites:
  - name: frontend
    # ...
    routes:
      - path: /
    error_document: index.html
```

If your app is created/updated from `app.yaml`, ensure this is in your spec and that you **redeploy** after changing it.

## Verify

1. Redeploy the app.
2. Open `https://exeleratetechnology.com/login` (or your domain) **directly** in a new tab.
3. You should see the login page, not 404.

## Summary

| Setup | Action |
|-------|--------|
| **Droplet + nginx** | Run `./setup-droplet-nginx.sh` once; then use `./deploy.sh` for app updates |
| **App Platform – Custom Pages** | Set Error document to `index.html` |
| **App Platform – HTTP Routes** | Route `/` with **Preserve Path Prefix** checked |
| **app.yaml** | `error_document: index.html` under `static_sites` |
| **Redeploy** | Required after any change (except one-time nginx setup) |
