# DigitalOcean Spaces CORS Configuration Fix

## Why This CORS Error Happens

When your browser makes a **PUT request** to DigitalOcean Spaces using a pre-signed URL, the browser first sends a **preflight OPTIONS request** to check if the cross-origin request is allowed. 

**The error occurs because:**
1. Browser sends OPTIONS preflight to `https://exeleratetechnology.sgp1.digitaloceanspaces.com`
2. DigitalOcean Spaces doesn't have CORS configured
3. Spaces doesn't return `Access-Control-Allow-Origin` header
4. Browser blocks the actual PUT request

**This is a security feature** - the storage bucket must explicitly allow your frontend origin.

---

## DigitalOcean Spaces CORS Configuration

### Exact CORS Configuration JSON

Create a file named `cors-config.json`:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://*.netlify.app",
      "https://speazyai.netlify.app"
    ],
    "AllowedMethods": [
      "OPTIONS",
      "PUT",
      "GET",
      "HEAD",
      "POST"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-request-id",
      "x-amz-version-id"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

**For Production (more restrictive):**
```json
[
  {
    "AllowedOrigins": [
      "https://speazyai.netlify.app",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": [
      "OPTIONS",
      "PUT",
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "Content-Type",
      "x-amz-acl",
      "x-amz-*"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-request-id"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

---

## How to Apply CORS Configuration

### Method 1: DigitalOcean Dashboard (Easiest)

1. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com/spaces)
2. Navigate to **Spaces** → Select your space: `exeleratetechnology`
3. Click on **Settings** tab
4. Scroll to **CORS Configurations** section
5. Click **Edit CORS Configuration**
6. Paste the JSON configuration above
7. Click **Save**

### Method 2: Using AWS CLI (s3cmd equivalent)

Since DigitalOcean Spaces is S3-compatible, you can use AWS CLI:

```bash
# Install AWS CLI if not installed
# macOS: brew install awscli
# Linux: apt-get install awscli

# Configure credentials
aws configure --profile do-spaces
# Access Key ID: <your-spaces-key>
# Secret Access Key: <your-spaces-secret>
# Default region: sgp1
# Default output: json

# Apply CORS configuration
aws s3api put-bucket-cors \
  --bucket exeleratetechnology \
  --cors-configuration file://cors-config.json \
  --endpoint https://sgp1.digitaloceanspaces.com \
  --profile do-spaces
```

### Method 3: Using s3cmd

```bash
# Install s3cmd
pip install s3cmd

# Configure
s3cmd --configure

# Apply CORS
s3cmd setcors cors-config.json s3://exeleratetechnology
```

### Method 4: Using Node.js Script

Create `apply-cors.js`:

```javascript
const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

const corsConfig = {
  CORSRules: [
    {
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://*.netlify.app',
        'https://speazyai.netlify.app'
      ],
      AllowedMethods: ['PUT', 'GET', 'HEAD', 'POST'],
      AllowedHeaders: ['*'],
      ExposeHeaders: ['ETag', 'x-amz-request-id', 'x-amz-version-id'],
      MaxAgeSeconds: 3000
    }
  ]
};

s3.putBucketCors({
  Bucket: 'exeleratetechnology',
  CORSConfiguration: corsConfig
}, (err, data) => {
  if (err) {
    console.error('Error applying CORS:', err);
  } else {
    console.log('CORS configuration applied successfully!');
  }
});
```

Run: `node apply-cors.js`

---

## Signed URL Headers Requirements

### Critical: Headers Must Match

When generating the signed URL, **ALL headers that will be sent in the PUT request MUST be included in the signature**. Otherwise, the signature will be invalid.

**Required headers in signed URL:**
1. ✅ `Content-Type: application/pdf` - **MUST be included**
2. ✅ `x-amz-acl: public-read` - **MUST be included if using ACL**

### Node.js Backend Code (Updated)

Your Node.js backend should generate the signed URL like this:

```javascript
const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  signatureVersion: 'v4',
  region: 'sgp1'
});

app.post('/generate-upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    // Generate unique key
    const key = `pdfs/${Date.now()}-${Math.random().toString(36).substring(7)}-${fileName}`;
    
    // Parameters for signed URL
    const params = {
      Bucket: 'exeleratetechnology',
      Key: key,
      ContentType: fileType, // 'application/pdf'
      ACL: 'public-read',
      Expires: 3600, // 1 hour
    };
    
    // Generate pre-signed PUT URL
    // CRITICAL: Include ContentType and ACL in the signed URL
    const uploadUrl = s3.getSignedUrl('putObject', params);
    
    // Public CDN URL (after upload)
    const publicUrl = `https://exeleratetechnology.sgp1.cdn.digitaloceanspaces.com/${key}`;
    
    res.json({
      uploadUrl,
      publicUrl,
      key
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});
```

**Important Notes:**
- ✅ `ContentType` is included in params → will be in signature
- ✅ `ACL: 'public-read'` is included → will be in signature
- ✅ The signed URL will include these as query parameters
- ✅ Frontend MUST send these exact headers

---

## Frontend Code (Updated)

Your frontend PUT request should match the signed headers:

```javascript
// Step 2: Upload PDF to storage
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": "application/pdf",
    // DO NOT add x-amz-acl here - it's already in the signed URL
    // DO NOT add Authorization - it's in the signed URL
  },
  body: selectedFile,
});

if (!uploadResponse.ok) {
  throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
}
```

**Key Points:**
- ✅ Send `Content-Type: application/pdf`
- ❌ **DO NOT** send `x-amz-acl` header (it's in the signed URL query params)
- ❌ **DO NOT** send `Authorization` header (it's in the signed URL)
- ✅ Just send the file as body

---

## Verification Steps

### 1. Check CORS Configuration

```bash
# Using AWS CLI
aws s3api get-bucket-cors \
  --bucket exeleratetechnology \
  --endpoint https://sgp1.digitaloceanspaces.com \
  --profile do-spaces
```

### 2. Test Preflight Request

```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  "https://exeleratetechnology.sgp1.digitaloceanspaces.com/pdfs/test.pdf"
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: PUT, GET, HEAD
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3000
```

### 3. Test Actual Upload

After CORS is configured, your frontend upload should work.

---

## Troubleshooting

### Issue: Still getting CORS error after configuration

**Solutions:**
1. **Clear browser cache** - CORS responses are cached
2. **Check origin matches exactly** - `http://localhost:3000` ≠ `http://localhost:3000/`
3. **Verify CORS config was saved** - Check in DigitalOcean dashboard
4. **Wait a few minutes** - CORS changes can take 1-2 minutes to propagate

### Issue: Signature mismatch error

**Cause:** Headers in PUT request don't match signed headers

**Solution:** Ensure your Node.js backend includes `ContentType` and `ACL` in the `getSignedUrl` params, and frontend sends `Content-Type` header.

### Issue: File uploaded but not publicly accessible

**Cause:** ACL not set correctly

**Solution:** Ensure `ACL: 'public-read'` is in the signed URL params, and the bucket allows public ACLs.

---

## Production Checklist

- [ ] CORS configured for production domain
- [ ] Signed URL includes `ContentType` and `ACL`
- [ ] Frontend sends `Content-Type` header
- [ ] Tested in production environment
- [ ] CDN URL works for public access
- [ ] Error handling in place

---

## Summary

1. **Apply CORS configuration** to DigitalOcean Spaces bucket
2. **Ensure signed URL includes** `ContentType` and `ACL` in params
3. **Frontend sends** `Content-Type: application/pdf` header
4. **No Authorization header** needed (it's in signed URL)
5. **Test and verify** the upload works

This is the **correct, production-ready solution** that maintains security while allowing direct browser uploads.

