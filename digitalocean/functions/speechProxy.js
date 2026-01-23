// DigitalOcean Serverless Function - Speech Proxy
// This function proxies requests to the Language Confidence API

export async function main(event) {
  // DigitalOcean Functions event structure
  const method = event.http?.method || event.method || 'POST';
  const headers = event.http?.headers || event.headers || {};
  const body = event.http?.body ? (typeof event.http.body === 'string' ? JSON.parse(event.http.body) : event.http.body) : (event.body || {});
  const queryParams = event.http?.query || event.query || {};
  
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
        "Access-Control-Allow-Headers": "Content-Type, lc-beta-features",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const incoming = body || {};
    const { endpoint: _ignored, ...apiBody } = incoming; // strip endpoint if present in body

    // Choose endpoint via query param; default to unscripted
    const qsEndpoint = queryParams.endpoint;
    const targetEndpoint =
      qsEndpoint || "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk";

    // Get API key from environment variable (set in DigitalOcean dashboard)
    const apiKey = process.env.LC_API_KEY || process.env.SPEECH_API_KEY;
    
    if (!apiKey) {
      console.error("API key not found in environment variables");
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": allowedOrigin },
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "lc-beta-features": headers["lc-beta-features"] || "false",
      },
      body: JSON.stringify(apiBody),
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
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": allowedOrigin },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
