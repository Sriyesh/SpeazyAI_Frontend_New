# Backend Signed URL Generation - Reference

## Critical Requirements for Signed PUT URLs

When generating pre-signed PUT URLs for DigitalOcean Spaces, **ALL headers that will be sent in the PUT request MUST be included in the signature parameters**.

## Required Node.js Backend Code

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
    
    // ✅ CRITICAL: Include ContentType and ACL in params
    // These will be included in the signed URL signature
    const params = {
      Bucket: 'exeleratetechnology',
      Key: key,
      ContentType: fileType,        // MUST: 'application/pdf'
      ACL: 'public-read',           // MUST: For public access
      Expires: 3600,                // 1 hour validity
    };
    
    // Generate pre-signed PUT URL
    const uploadUrl = s3.getSignedUrl('putObject', params);
    
    // Public CDN URL (after upload completes)
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

## Key Points

### ✅ DO Include in `getSignedUrl` params:
- `ContentType: 'application/pdf'` - Frontend will send this header
- `ACL: 'public-read'` - Makes file publicly accessible
- `Expires: 3600` - URL validity period

### ❌ DO NOT:
- Add headers that won't be sent by frontend
- Use `x-amz-*` in params unless frontend will send them
- Forget to include headers that frontend sends

## Frontend Request Headers

The frontend will send:
```javascript
{
  "Content-Type": "application/pdf"
}
```

**DO NOT send:**
- `x-amz-acl` (already in signed URL query params)
- `Authorization` (already in signed URL query params)

## Testing the Signed URL

You can test the signed URL manually:

```bash
# Generate a signed URL via your API
curl -X POST https://api.exeleratetechnology.com/generate-upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.pdf","fileType":"application/pdf"}'

# Use the returned uploadUrl to upload
curl -X PUT "<uploadUrl>" \
  -H "Content-Type: application/pdf" \
  --data-binary "@test.pdf"
```

## Common Issues

### Issue: SignatureDoesNotMatch error
**Cause:** Headers in PUT request don't match signed headers

**Solution:** Ensure `ContentType` and `ACL` are in `getSignedUrl` params

### Issue: AccessDenied error
**Cause:** ACL not set or bucket policy doesn't allow public ACLs

**Solution:** 
1. Ensure `ACL: 'public-read'` is in params
2. Check bucket policy allows public ACLs

### Issue: CORS error (even after CORS config)
**Cause:** CORS not configured or origin mismatch

**Solution:** 
1. Apply CORS config (see `CORS_FIX_GUIDE.md`)
2. Ensure origin matches exactly (no trailing slashes)
3. Wait 1-2 minutes for propagation

## Verification Checklist

- [ ] `ContentType` is in `getSignedUrl` params
- [ ] `ACL: 'public-read'` is in params
- [ ] CORS is configured on Spaces bucket
- [ ] Frontend sends `Content-Type` header
- [ ] Frontend does NOT send `x-amz-acl` or `Authorization`
- [ ] Tested with actual file upload
- [ ] Public URL works after upload

