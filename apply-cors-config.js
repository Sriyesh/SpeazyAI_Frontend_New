/**
 * DigitalOcean Spaces CORS Configuration Script
 * 
 * This script applies CORS configuration to your DigitalOcean Spaces bucket
 * to allow direct browser uploads from your frontend.
 * 
 * Usage:
 *   1. Set environment variables:
 *      export DO_SPACES_KEY="your-access-key"
 *      export DO_SPACES_SECRET="your-secret-key"
 * 
 *   2. Run the script:
 *      node apply-cors-config.js
 * 
 * Or pass credentials as arguments:
 *   node apply-cors-config.js --key YOUR_KEY --secret YOUR_SECRET
 */

const AWS = require('aws-sdk');

// Parse command line arguments
const args = process.argv.slice(2);
let accessKey = process.env.DO_SPACES_KEY;
let secretKey = process.env.DO_SPACES_SECRET;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--key' && args[i + 1]) {
    accessKey = args[i + 1];
    i++;
  } else if (args[i] === '--secret' && args[i + 1]) {
    secretKey = args[i + 1];
    i++;
  }
}

if (!accessKey || !secretKey) {
  console.error('❌ Error: Missing credentials');
  console.log('\nPlease provide DigitalOcean Spaces credentials:');
  console.log('  Option 1: Set environment variables');
  console.log('    export DO_SPACES_KEY="your-key"');
  console.log('    export DO_SPACES_SECRET="your-secret"');
  console.log('\n  Option 2: Pass as arguments');
  console.log('    node apply-cors-config.js --key YOUR_KEY --secret YOUR_SECRET');
  process.exit(1);
}

// Configure DigitalOcean Spaces endpoint
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  signatureVersion: 'v4',
  region: 'sgp1'
});

// CORS Configuration
// CRITICAL: Must include OPTIONS method for preflight requests!
const corsConfig = {
  CORSRules: [
    {
      AllowedOrigins: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://*.netlify.app',
        'https://speazyai.netlify.app'
      ],
      // OPTIONS is REQUIRED for browser preflight requests!
      AllowedMethods: ['OPTIONS', 'PUT', 'GET', 'HEAD', 'POST'],
      AllowedHeaders: ['*'],
      ExposeHeaders: [
        'ETag',
        'x-amz-request-id',
        'x-amz-version-id',
        'Content-Length'
      ],
      MaxAgeSeconds: 3000
    }
  ]
};

const bucketName = 'exeleratetechnology';

console.log('🚀 Applying CORS configuration to DigitalOcean Spaces...');
console.log(`📦 Bucket: ${bucketName}`);
console.log(`🌍 Region: sgp1`);
console.log('\n📋 CORS Configuration:');
console.log(JSON.stringify(corsConfig, null, 2));

s3.putBucketCors({
  Bucket: bucketName,
  CORSConfiguration: corsConfig
}, (err, data) => {
  if (err) {
    console.error('\n❌ Error applying CORS configuration:');
    console.error(err.message);
    if (err.code === 'AccessDenied') {
      console.error('\n💡 Tip: Make sure your credentials have permission to modify bucket CORS settings.');
    }
    process.exit(1);
  } else {
    console.log('\n✅ CORS configuration applied successfully!');
    console.log('\n🔍 Verifying configuration...');
    
    // Verify the configuration
    s3.getBucketCors({ Bucket: bucketName }, (verifyErr, verifyData) => {
      if (verifyErr) {
        console.warn('⚠️  Could not verify CORS configuration:', verifyErr.message);
      } else {
        console.log('\n✅ Verified CORS Configuration:');
        console.log(JSON.stringify(verifyData, null, 2));
      }
      
      console.log('\n✨ Next steps:');
      console.log('  1. Test the upload from your frontend');
      console.log('  2. If you still see CORS errors, clear your browser cache');
      console.log('  3. Wait 1-2 minutes for changes to propagate');
      console.log('\n📝 Note: CORS changes may take a few minutes to take effect.');
    });
  }
});

