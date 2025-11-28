exports.handler = async (event) => {
  const allowedOrigin = "https://speazyai.netlify.app";

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
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
    const incoming = event.body ? JSON.parse(event.body) : {};
    const { endpoint: _ignored, ...apiBody } = incoming; // strip endpoint if present in body

    // Choose endpoint via query param; default to unscripted
    const qsEndpoint = event.queryStringParameters?.endpoint;
    const targetEndpoint =
      qsEndpoint || "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk";

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.LC_API_KEY,
        "lc-beta-features": "false",
        ...(event.headers["lc-beta-features"] && { "lc-beta-features": event.headers["lc-beta-features"] }),
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
};
