# DigitalOcean Deployment Checklist

Use this checklist to ensure a smooth migration from Netlify to DigitalOcean.

## Pre-Deployment

- [ ] All code changes committed and pushed to repository
- [ ] Local build test successful: `npm run build`
- [ ] All 5 functions deployed to DigitalOcean Functions
- [ ] Function URLs documented and verified
- [ ] Function environment variables set (API keys, ALLOWED_ORIGIN)
- [ ] Frontend code updated to use `apiConfig.ts`
- [ ] No hardcoded Netlify URLs remaining in code

## Function Deployment

- [ ] `speechProxy` deployed and tested
- [ ] `chatgptProxy` deployed and tested
- [ ] `authProxy` deployed and tested
- [ ] `pdfProxy` deployed and tested
- [ ] `pdfExtractProxy` deployed and tested
- [ ] All functions have `ALLOWED_ORIGIN` set to `https://exeleratetechnology.com`
- [ ] All functions have required API keys set (LC_API_KEY, OPENAI_API_KEY)

## DigitalOcean App Platform Setup

- [ ] App created in DigitalOcean dashboard
- [ ] Repository connected (GitHub/GitLab/Bitbucket)
- [ ] Branch selected (master/main)
- [ ] Build command set: `npm run build`
- [ ] Output directory set: `build`
- [ ] Node.js version set: `20` (or `18`)

## Environment Variables

Add these in App Platform → Settings → Environment Variables:

- [ ] `VITE_API_PROVIDER=digitalocean`
- [ ] `VITE_SPEECH_PROXY_URL=[your function URL]`
- [ ] `VITE_CHATGPT_PROXY_URL=[your function URL]`
- [ ] `VITE_AUTH_PROXY_URL=[your function URL]`
- [ ] `VITE_PDF_PROXY_URL=[your function URL]`
- [ ] `VITE_PDF_EXTRACT_PROXY_URL=[your function URL]`

## Domain Configuration

- [ ] Domain added in App Platform: `exeleratetechnology.com`
- [ ] DNS records updated at domain registrar
- [ ] SSL certificate provisioned (automatic, wait 5-10 min)
- [ ] HTTPS working: `https://exeleratetechnology.com`

## SPA Routing

- [ ] `public/_redirects` file exists with: `/*    /index.html   200`
- [ ] Or App Platform routing configured for SPA
- [ ] Test direct URL access (e.g., `/dashboard`) doesn't return 404

## Testing After Deployment

- [ ] Homepage loads correctly
- [ ] User authentication (login/logout)
- [ ] Speech recording and assessment
- [ ] ChatGPT chat functionality
- [ ] PDF viewing and text extraction
- [ ] IELTS speaking tasks
- [ ] IELTS writing assessment
- [ ] Reading assessment
- [ ] Writing practice questions
- [ ] Client-side routing (navigate between pages)
- [ ] No CORS errors in browser console
- [ ] All API calls succeed

## Post-Deployment

- [ ] Monitor app for 24-48 hours
- [ ] Check DigitalOcean App Platform logs for errors
- [ ] Verify function invocations are working
- [ ] Check costs in DigitalOcean dashboard
- [ ] Set up monitoring/alerts (optional)
- [ ] Update any documentation with new URLs

## Rollback Plan

If issues occur:

- [ ] Keep Netlify deployment active during migration
- [ ] Can switch DNS back to Netlify if needed
- [ ] Or temporarily set `VITE_API_PROVIDER=netlify` in App Platform

## Cleanup (After Successful Migration)

- [ ] Remove Netlify deployment (optional)
- [ ] Remove `netlify.toml` file (optional)
- [ ] Archive Netlify functions (optional)
