# Quick Start: Deploy to DigitalOcean

## 🚀 Fast Track (5 Steps)

### 1. Verify Functions Are Deployed
✅ All 5 functions should already be deployed:
- speechProxy
- chatgptProxy  
- authProxy
- pdfProxy
- pdfExtractProxy

### 2. Create App in DigitalOcean
1. Go to: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Connect your GitHub repository
4. Select branch: `master`

### 3. Configure Build
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Node Version**: `20`

### 4. Add Environment Variables
In App Platform → Settings → Environment Variables, add:

```env
VITE_API_PROVIDER=digitalocean
VITE_SPEECH_PROXY_URL=https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy
VITE_CHATGPT_PROXY_URL=https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/chatgptProxy
VITE_AUTH_PROXY_URL=https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/authProxy
VITE_PDF_PROXY_URL=https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/pdfProxy
VITE_PDF_EXTRACT_PROXY_URL=https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/pdfExtractProxy
```

### 5. Add Domain & Deploy
1. Add domain: `exeleratetechnology.com`
2. Update DNS records (DigitalOcean will show you what to add)
3. Click **"Create Resources"** to deploy
4. Wait 5-10 minutes for SSL certificate

## ✅ That's It!

Your app will be live at `https://exeleratetechnology.com`

## 📚 Need More Details?

- **Full Guide**: See `FULL_APP_DEPLOYMENT.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Function Deployment**: See `DEPLOYMENT_GUIDE.md`

## 🔧 Troubleshooting

**Build fails?**
- Check build logs
- Verify Node.js version matches `.nvmrc`

**404 on routes?**
- `public/_redirects` file should have: `/*    /index.html   200`

**CORS errors?**
- Set `ALLOWED_ORIGIN=https://exeleratetechnology.com` in all functions

**Env vars not working?**
- Must start with `VITE_` prefix
- Set in App Platform, not in code
