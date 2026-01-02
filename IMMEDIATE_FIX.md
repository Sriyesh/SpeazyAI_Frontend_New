# 🚨 IMMEDIATE FIX - CORS Configuration

## The Problem

Your current CORS config shows:
- ✅ Origins: `http://localhost:3000` 
- ❌ Methods: `GET, PUT, POST` ← **MISSING `OPTIONS`!**
- ❌ Max Age: `0s` ← **Too low!**

**The browser sends an OPTIONS preflight request BEFORE the PUT request. Without OPTIONS in your CORS config, the preflight fails and the browser blocks the PUT.**

## Exact Fix Steps (DigitalOcean Dashboard)

### Step 1: Edit CORS Rule
1. Go to DigitalOcean Dashboard
2. Spaces → `exeleratetechnology` bucket
3. Settings tab
4. Scroll to **CORS Configurations**
5. Click **Edit** on the existing rule

### Step 2: Update Configuration

**Origins:** (Keep as is or add more)
```
http://localhost:3000
http://localhost:5173
https://*.netlify.app
https://speazyai.netlify.app
```

**Allowed Methods:** ⚠️ **CRITICAL CHANGE**
```
OPTIONS, PUT, GET, HEAD, POST
```
**MUST include `OPTIONS` first!**

**Allowed Headers:**
```
*
```
Or if wildcard not supported:
```
Content-Type
x-amz-acl
x-amz-*
host
```

**Exposed Headers:**
```
ETag
x-amz-request-id
x-amz-version-id
```

**Access Control Max Age:** ⚠️ **IMPORTANT**
```
3000
```
(Change from `0` to `3000` seconds = 50 minutes)

### Step 3: Save
Click **Save** and wait 1-2 minutes for changes to propagate.

### Step 4: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select **"Empty Cache and Hard Reload"**
4. Or press `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

## Quick Test

After updating, test with this curl command:

```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  "https://exeleratetechnology.sgp1.digitaloceanspaces.com/pdfs/test.pdf" \
  2>&1 | grep -i "access-control"
```

**Expected output:**
```
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: OPTIONS, PUT, GET, HEAD, POST
< Access-Control-Allow-Headers: *
< Access-Control-Max-Age: 3000
```

If you see these headers, CORS is working! ✅

## Why OPTIONS is Required

When your frontend does:
```javascript
fetch(uploadUrl, {
  method: "PUT",
  headers: { "Content-Type": "application/pdf" },
  body: file
})
```

The browser automatically sends:
1. **OPTIONS request** (preflight) → Checks if PUT is allowed
2. **PUT request** (actual upload) → Only sent if OPTIONS succeeds

Without `OPTIONS` in CORS config, step 1 fails, so step 2 never happens.

## Still Not Working?

1. **Wait 2-3 minutes** - CORS changes need time to propagate
2. **Check exact origin** - Must match exactly (no trailing slash)
3. **Verify in browser console** - Look for the exact error message
4. **Test with curl** - Use the command above to verify
5. **Check backend** - Ensure signed URL includes `ContentType` and `ACL`

## Summary

**Change this:**
- Methods: `GET, PUT, POST` ❌
- Max Age: `0s` ❌

**To this:**
- Methods: `OPTIONS, PUT, GET, HEAD, POST` ✅
- Max Age: `3000` ✅

That's it! The `OPTIONS` method is the missing piece.

