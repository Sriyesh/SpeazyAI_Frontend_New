// DigitalOcean Serverless Function - PDF Proxy
// This function proxies PDF file requests

export async function main(event) {
  // DigitalOcean Functions event structure
  const method = event.http?.method || event.method || 'GET';
  const headers = event.http?.headers || event.headers || {};
  const queryParams = event.http?.query || event.query || {};
  
  // CORS: Determine allowed origin (single value only)
  const requestOrigin = headers.origin || headers.Origin || "";
  const productionOrigin = process.env.ALLOWED_ORIGIN || "https://exeleratetechnology.com";
  
  // Check if origin is allowed
  let allowedOrigin = productionOrigin; // Default to production
  
  if (requestOrigin) {
    // Allow localhost for development
    if (requestOrigin === "http://localhost:3000" || requestOrigin === "http://127.0.0.1:3000") {
      allowedOrigin = requestOrigin;
    }
    // Allow DigitalOcean App Platform URLs (*.ondigitalocean.app)
    else if (requestOrigin.includes(".ondigitalocean.app")) {
      allowedOrigin = requestOrigin;
    }
    // Allow exact production domain match
    else if (requestOrigin === productionOrigin) {
      allowedOrigin = requestOrigin;
    }
  }
  
  // NEVER return "*" - always return a specific origin

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  try {
    // Get PDF URL from query parameter
    const pdfUrl = queryParams.url || event.url;

    if (!pdfUrl) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: "PDF URL is required" }),
      };
    }

    // Fetch the PDF from the source
    const response = await fetch(pdfUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
        },
        body: JSON.stringify({ error: `Failed to fetch PDF: ${response.statusText}` }),
      };
    }

    // Get the PDF as array buffer
    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    // Return the PDF with proper headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
      },
      body: pdfBase64,
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("PDF Proxy error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
