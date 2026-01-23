# Testing DigitalOcean Functions

## ALLOWED_ORIGIN Value

Set `ALLOWED_ORIGIN` to your production domain:
- `https://exeleratetechnology.com` (if you use the root domain)
- `https://www.exeleratetechnology.com` (if you use www subdomain)
- Or both: `https://exeleratetechnology.com,https://www.exeleratetechnology.com`

**For now, use:** `https://exeleratetechnology.com`

## Testing speechProxy Function

Your function URL: `https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy`

### Test 1: CORS Preflight (OPTIONS request)

```bash
curl -X OPTIONS https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy \
  -H "Origin: https://exeleratetechnology.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response:**
- Status: 200
- Headers should include:
  - `Access-Control-Allow-Origin: https://exeleratetechnology.com`
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, lc-beta-features`

### Test 2: Basic POST Request (without audio - will fail but should return proper error)

```bash
curl -X POST https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -d '{}' \
  -v
```

**Expected Response:**
- Status: 200 (if API key is set) or 500 (if API key is missing)
- Should include CORS headers
- Body should contain either API response or error message

### Test 3: With Endpoint Query Parameter

```bash
curl -X POST "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy?endpoint=https://apis.languageconfidence.ai/speech-assessment/scripted/uk" \
  -H "Content-Type: application/json" \
  -H "Origin: https://exeleratetechnology.com" \
  -H "lc-beta-features: false" \
  -d '{"audio": "test"}' \
  -v
```

### Test 4: Using DigitalOcean Functions Dashboard

1. Go to your function in DigitalOcean dashboard
2. Click "Test Parameters" or "Run"
3. Use this test payload:
```json
{
  "http": {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Origin": "https://exeleratetechnology.com",
      "lc-beta-features": "false"
    },
    "body": "{\"audio\": \"test\"}",
    "query": {
      "endpoint": "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk"
    }
  }
}
```

## What to Check

✅ **Function Initializes**: No "ERR_MODULE_NOT_FOUND" errors
✅ **CORS Headers**: Response includes proper CORS headers
✅ **API Key**: Function can access `LC_API_KEY` environment variable
✅ **Request Handling**: Function correctly parses event structure
✅ **Error Handling**: Returns proper error messages if API key is missing

## Common Issues

### Issue: CORS Error
**Solution**: Make sure `ALLOWED_ORIGIN` environment variable matches the Origin header in your request

### Issue: API Key Not Configured
**Solution**: 
1. Go to Function Settings → Environment Variables
2. Add `LC_API_KEY` with your Language Confidence API key
3. Redeploy the function

### Issue: Function Not Found
**Solution**: Check the function URL is correct and the function is deployed

### Issue: Wrong Event Structure
**Solution**: DigitalOcean Functions use `event.http.method`, `event.http.headers`, `event.http.body`, `event.http.query`

## Next Steps After Testing

If all tests pass:
1. ✅ Note the working function URL
2. ✅ Document the environment variables used
3. ✅ Proceed to deploy the other 4 functions
4. ✅ Update frontend code with the function URLs
