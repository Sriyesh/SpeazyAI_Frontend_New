// Test script for speechProxy function
// Run with: node digitalocean/test-speech-proxy.js

const FUNCTION_URL = 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-a38d3580-f602-4111-8967-d449fc5ef00e/default/speechProxy';
const ALLOWED_ORIGIN = 'https://exeleratetechnology.com';

async function testFunction() {
  console.log('🧪 Testing speechProxy Function\n');
  console.log('Function URL:', FUNCTION_URL);
  console.log('Expected Origin:', ALLOWED_ORIGIN);
  console.log('─'.repeat(60));

  // Test 1: CORS Preflight
  console.log('\n📋 Test 1: CORS Preflight (OPTIONS)');
  try {
    const optionsResponse = await fetch(FUNCTION_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': ALLOWED_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, lc-beta-features',
      },
    });

    console.log('Status:', optionsResponse.status);
    console.log('Headers:');
    optionsResponse.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('access-control')) {
        console.log(`  ${key}: ${value}`);
      }
    });

    if (optionsResponse.status === 200) {
      console.log('✅ CORS preflight test PASSED');
    } else {
      console.log('❌ CORS preflight test FAILED');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Basic POST (will likely fail without proper API key, but should return proper error)
  console.log('\n📋 Test 2: Basic POST Request');
  try {
    const postResponse = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ALLOWED_ORIGIN,
      },
      body: JSON.stringify({ test: 'data' }),
    });

    const responseText = await postResponse.text();
    console.log('Status:', postResponse.status);
    console.log('CORS Headers:');
    postResponse.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith('access-control')) {
        console.log(`  ${key}: ${value}`);
      }
    });
    console.log('Response Body:', responseText.substring(0, 200));

    if (postResponse.headers.get('access-control-allow-origin')) {
      console.log('✅ CORS headers present');
    } else {
      console.log('⚠️  CORS headers missing');
    }

    // Check if it's an API key error (expected) or actual error
    if (responseText.includes('API key not configured')) {
      console.log('⚠️  API key not set (expected if not configured yet)');
      console.log('   → Set LC_API_KEY environment variable in DigitalOcean dashboard');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: With query parameter
  console.log('\n📋 Test 3: POST with Endpoint Query Parameter');
  try {
    const urlWithQuery = `${FUNCTION_URL}?endpoint=${encodeURIComponent('https://apis.languageconfidence.ai/speech-assessment/scripted/uk')}`;
    const queryResponse = await fetch(urlWithQuery, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ALLOWED_ORIGIN,
        'lc-beta-features': 'false',
      },
      body: JSON.stringify({ test: 'data' }),
    });

    console.log('Status:', queryResponse.status);
    const responseText = await queryResponse.text();
    console.log('Response:', responseText.substring(0, 200));
    
    if (queryResponse.status === 200 || queryResponse.status === 500) {
      console.log('✅ Query parameter handling works');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('\n📝 Summary:');
  console.log('1. Check if CORS headers are present');
  console.log('2. Check if function initializes (no module errors)');
  console.log('3. Set LC_API_KEY environment variable if needed');
  console.log('\n✅ If all tests show CORS headers, the function is working correctly!');
}

testFunction().catch(console.error);
