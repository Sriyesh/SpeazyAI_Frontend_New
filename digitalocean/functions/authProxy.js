// DigitalOcean Serverless Function - Auth Proxy
// This function proxies authentication requests to your backend API

export async function main(event) {
  // DigitalOcean Functions event structure
  const method = event.http?.method || event.method || 'POST';
  const headers = event.http?.headers || event.headers || {};
  const body = event.http?.body ? (typeof event.http.body === 'string' ? JSON.parse(event.http.body) : event.http.body) : (event.body || {});
  
  // CORS: Determine allowed origin (single value only)
  const requestOrigin = headers.origin || headers.Origin || "";
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN || "https://exeleratetechnology.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  
  // Use request origin if it's in allowed list, otherwise use production origin
  // Never return "*" as it causes issues when combined with credentials
  const allowedOrigin = allowedOrigins.includes(requestOrigin) 
    ? requestOrigin 
    : (process.env.ALLOWED_ORIGIN || "https://exeleratetechnology.com");

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const requestBody = body || {};
    
    // Target API endpoint
    const targetEndpoint = "https://api.exeleratetechnology.com/api/auth/login.php";

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Auth proxy error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": allowedOrigin },
      body: JSON.stringify({ 
        success: false,
        message: error.message || "An error occurred during authentication"
      }),
    };
  }
}
