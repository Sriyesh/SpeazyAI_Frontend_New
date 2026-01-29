# Immediate CORS Fix Steps

## Current Issues in Your CORS Configuration

Based on the screenshot, your current CORS config has:
- ✅ Origins: `http://localhost:3000` (correct)
- ❌ Methods: `GET, PUT, POST` (missing `OPTIONS` and `HEAD`)
- ❌ Max Age: `0s` (too low, should be 3000)
- ❓ AllowedHeaders: Not visible (might be missing `*` or specific headers)

## Exact CORS Configuration to Apply
### Option 1: Via DigitalOcean Dashboard (Recommended)

1. Go to DigitalOcean Dashboard → Spaces → `exeleratetechnology` bucket
2. Click **Settings** tab
3. Scroll to **CORS Configurations**
4. Click **Edit** on the existing rule (or delete and create new)
5. Configure as follows:

**Origins:**
```
http://localhost:3000
http://localhost:5173
https://*.netlify.app
https://speazyai.netlify.app
```

**Allowed Methods:**
```
OPTIONS, GET, PUT, HEAD, POST
```
⚠️ **CRITICAL:** Must include `OPTIONS` for preflight requests!

**Allowed Headers:**
```
*
```
Or specifically:
```
Content-Type
x-amz-acl
x-amz-*
```

**Exposed Headers:**
```
ETag
x-amz-request-id
x-amz-version-id
```

**Access Control Max Age:**
```
3000
```
(Not 0!)

6. Click **Save**

### Option 2: Using the Node.js Script

Run the provided script:
```bash
export DO_SPACES_KEY="your-key"
export DO_SPACES_SECRET="your-secret"
node apply-cors-config.js
```

## Verify CORS is Working

After applying, test with this command:

```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  "https://exeleratetechnology.sgp1.digitaloceanspaces.com/pdfs/test.pdf" \
  2>&1 | grep -i "access-control"
```

You should see:
```
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: OPTIONS, GET, PUT, HEAD, POST
< Access-Control-Allow-Headers: *
< Access-Control-Max-Age: 3000
```

## Clear Browser Cache

After updating CORS:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

## Common Mistakes to Avoid

❌ **Don't forget `OPTIONS` method** - Browsers require this for preflight
❌ **Don't set Max Age to 0** - Causes preflight on every request
❌ **Don't forget wildcard headers** - Use `*` or list all needed headers
❌ **Don't forget trailing slashes** - `http://localhost:3000/` ≠ `http://localhost:3000`

## Still Not Working?

1. **Wait 2-3 minutes** - CORS changes can take time to propagate
2. **Check browser console** - Look for the exact CORS error message
3. **Verify origin matches exactly** - No trailing slashes, correct port
4. **Test with curl** - Use the curl command above to verify CORS response
5. **Check signed URL** - Ensure backend includes `ContentType` and `ACL` in params

