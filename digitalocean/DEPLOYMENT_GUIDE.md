# DigitalOcean Functions Deployment Guide

This guide walks you through deploying each proxy function as a separate serverless function in DigitalOcean.

## Prerequisites

- DigitalOcean account with Functions enabled
- Environment variables ready:
  - `LC_API_KEY` or `SPEECH_API_KEY`
  - `OPENAI_API_KEY`
  - `ALLOWED_ORIGIN` (your domain, e.g., `https://exeleratetechnology.com`)

## Functions to Deploy

1. **speechProxy** - Speech assessment proxy
2. **chatgptProxy** - ChatGPT proxy (multiple modes)
3. **authProxy** - Authentication proxy
4. **pdfProxy** - PDF file proxy
5. **pdfExtractProxy** - PDF text extraction proxy

## Step-by-Step Deployment

### For Each Function:

1. **Go to DigitalOcean Functions Dashboard**
   - Navigate to: https://cloud.digitalocean.com/functions
   - Click "Create Function"

2. **Configure Function Settings**
   - **Function Name**: Use descriptive name (e.g., `speech-proxy`, `chatgpt-proxy`)
   - **Runtime**: Node.js 18 or 20 (recommended: 20)
   - **Source**: Choose "Edit Code" or upload from your repository

3. **Copy Function Code**
   - Open the corresponding file from `digitalocean/functions/` folder
   - Copy the entire contents
   - Paste into the DigitalOcean Functions code editor

4. **Set Environment Variables**
   - Go to the "Settings" tab
   - Add environment variables:
     - `LC_API_KEY` (for speechProxy)
     - `OPENAI_API_KEY` (for chatgptProxy, pdfExtractProxy)
     - `ALLOWED_ORIGIN` (for all functions)

5. **Deploy**
   - Click "Deploy" or "Save"
   - Wait for deployment to complete
   - Copy the function URL (you'll need this for frontend)

6. **Test**
   - Use the "Run" button in the Functions dashboard
   - Or test via the function URL using curl/Postman

## Function URLs

After deployment, you'll get URLs like:
- `https://faas-blr1-xxxxx.doserverless.co/api/v1/web/namespace/function-name`

Save these URLs - you'll need them to update your frontend code.

## Testing Each Function

### 1. speechProxy

**Test Request:**
```bash
curl -X POST https://your-function-url/speech-proxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{"audio": "base64-encoded-audio"}'
```

### 2. chatgptProxy

**Test Request (Chat Mode):**
```bash
curl -X POST https://your-function-url/chatgpt-proxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{
    "mode": "chat",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

**Test Request (IELTS Assessment):**
```bash
curl -X POST https://your-function-url/chatgpt-proxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{
    "question": "What are the benefits of exercise?",
    "answer": "Exercise is good for health.",
    "level": "intermediate"
  }'
```

### 3. authProxy

**Test Request:**
```bash
curl -X POST https://your-function-url/auth-proxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. pdfProxy

**Test Request:**
```bash
curl -X GET "https://your-function-url/pdf-proxy?url=https://example.com/document.pdf" \
  -H "Origin: https://exeleratetechnology.com"
```

### 5. pdfExtractProxy

**Test Request:**
```bash
curl -X POST https://your-function-url/pdf-extract-proxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{
    "extracted_text": "Sample PDF text content here..."
  }'
```

## Deployment Checklist

- [ ] Deploy `speechProxy.js` → Save URL: `_________________`
- [ ] Deploy `chatgptProxy.js` → Save URL: `_________________`
- [ ] Deploy `authProxy.js` → Save URL: `_________________`
- [ ] Deploy `pdfProxy.js` → Save URL: `_________________`
- [ ] Deploy `pdfExtractProxy.js` → Save URL: `_________________`
- [ ] Set environment variables for all functions
- [ ] Test each function
- [ ] Update frontend code with new URLs (see next section)

## Updating Frontend Code

After deploying all functions, you'll need to update your frontend to use the new DigitalOcean Function URLs instead of Netlify function URLs.

### Example Updates:

**Before (Netlify):**
```javascript
const response = await fetch('/.netlify/functions/speechProxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**After (DigitalOcean Functions):**
```javascript
const response = await fetch('https://your-speech-proxy-url', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Origin': 'https://exeleratetechnology.com'
  },
  body: JSON.stringify(data)
});
```

## Troubleshooting

### Function Not Initializing
- Check that you're using ES module format: `export async function main(event)`
- Verify Node.js version is 18 or 20
- Check function logs for errors

### CORS Errors
- Ensure `ALLOWED_ORIGIN` environment variable is set correctly
- Check that your frontend domain matches the `ALLOWED_ORIGIN` value
- Verify CORS headers are being returned in function response

### Module Not Found Errors
- Functions must be self-contained (no npm packages)
- Only use built-in Node.js features
- If you see this error, you're likely trying to use `api-server.js` - use individual functions instead

### API Key Errors
- Verify environment variables are set in Functions dashboard
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for each function that needs them

## Next Steps

1. Deploy all 5 functions following the steps above
2. Test each function to ensure they work
3. Update your frontend code to use the new function URLs
4. Test the full application end-to-end
5. Monitor function logs for any issues

## Support

If you encounter issues:
1. Check the function logs in DigitalOcean dashboard
2. Verify environment variables are set correctly
3. Test functions individually using curl/Postman
4. Ensure your frontend is sending requests with correct headers
