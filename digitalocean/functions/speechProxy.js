// DigitalOcean Serverless Function - Speech Proxy
// Proxies requests to Language Confidence API

export async function main(event) {
  const method = event?.__ow_method || event?.http?.method || event?.method || "POST";

  if (method === "OPTIONS") {
    return { statusCode: 204 };
  }

  const inHeaders = event?.__ow_headers || event?.http?.headers || event?.headers || {};

  try {
    // ---- 1. GET BODY (handle all DO/OpenWhisk variants) ----
    let body = {};
    let raw = event?.__ow_body ?? event?.http?.body ?? event?.body ?? null;

    if (raw != null) {
      if (event?.__ow_isBase64Encoded && typeof raw === "string") {
        try {
          raw = Buffer.from(raw, "base64").toString("utf8");
        } catch {
          raw = null;
        }
      }
      if (typeof raw === "string" && raw.trim()) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = {};
        }
      } else if (typeof raw === "object") {
        body = raw;
      }
    }

    // Fallback: DO sometimes merges body params as top-level event keys
    if (!body.audio_base64 && !body.audio_format && (event.audio_base64 || event.audio_format)) {
      body = {
        audio_base64: event.audio_base64,
        audio_format: event.audio_format,
        ...(event.expected_text != null && { expected_text: event.expected_text }),
      };
    }

    // Fallback: nested http.body when it's an object with audio fields
    if (!body.audio_base64 && !body.audio_format && event?.http?.body && typeof event.http.body === "object") {
      if (event.http.body.audio_base64 || event.http.body.audio_format) {
        body = { ...event.http.body };
      }
    }

    // Fallback: envelope { body: "{\"audio_base64\":...}" }
    if (!body.audio_base64 && !body.audio_format && body.body) {
      try {
        const inner = typeof body.body === "string" ? JSON.parse(body.body) : body.body;
        if (inner && (inner.audio_base64 || inner.audio_format)) {
          body = inner;
        }
      } catch (_) {}
    }

    // Strip __ow_* keys if present in body
    const stripped = {};
    for (const [k, v] of Object.entries(body)) {
      if (!k.startsWith("__ow_")) stripped[k] = v;
    }
    body = stripped;

    // ---- 2. BUILD API BODY (endpoint + expected_text → script) ----
    const { endpoint: _e, expected_text: expectedText, ...rest } = body;
    let apiBody = { ...rest };

    let query = event?.__ow_query ?? event?.http?.query ?? event?.query ?? {};
    if (typeof query === "string") {
      const q = {};
      for (const p of query.split("&")) {
        const i = p.indexOf("=");
        const k = i >= 0 ? decodeURIComponent(p.slice(0, i).replace(/\+/g, " ")) : decodeURIComponent(p.replace(/\+/g, " "));
        const v = i >= 0 ? decodeURIComponent((p.slice(i + 1) || "").replace(/\+/g, " ")) : "";
        if (k) q[k] = v;
      }
      query = q;
    }

    const qsEndpoint = query.endpoint;
    const targetEndpoint =
      qsEndpoint || "https://apis.languageconfidence.ai/speech-assessment/unscripted/uk";
    const isScripted = typeof targetEndpoint === "string" && targetEndpoint.includes("speech-assessment/scripted");

    // Language Confidence scripted API: send only whitelisted fields to avoid upstream 400.
    // Try "reference_text" first (docs: "expected/reference text"). Use LC_SCRIPT_FIELD=script to override.
    const refField = process.env.LC_SCRIPT_FIELD || "reference_text";
    if (isScripted && expectedText != null && String(expectedText).trim() !== "") {
      apiBody[refField] = typeof expectedText === "string" ? expectedText : String(expectedText);
    }
    const refValue = apiBody[refField];
    delete apiBody.expected_text;
    delete apiBody.script;

    // For scripted, send only fields the API accepts (avoid extra_forbidden / generic 400)
    if (isScripted) {
      apiBody = {
        audio_base64: apiBody.audio_base64,
        audio_format: apiBody.audio_format,
        ...(refValue && { [refField]: refValue }),
      };
    }

    // ---- 3. VALIDATE ----
    if (!apiBody.audio_base64 || !apiBody.audio_format) {
      const keys = Object.keys(body);
      console.error("speechProxy: missing audio_base64/audio_format. Keys seen:", keys.join(", ") || "(none)");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields: audio_base64, audio_format",
          hint: "Request body must be JSON with audio_base64 and audio_format. Check that the request reaches the function (e.g. size limits).",
        }),
      };
    }

    // ---- 4. API KEY ----
    const apiKey = process.env.LC_API_KEY || process.env.SPEECH_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const beta = inHeaders["lc-beta-features"] || inHeaders["Lc-Beta-Features"] || "false";

    const audioLen = apiBody.audio_base64 ? String(apiBody.audio_base64).length : 0;
    const refLen = apiBody.reference_text ? String(apiBody.reference_text).length : (apiBody.script ? String(apiBody.script).length : 0);
    console.log("speechProxy: calling upstream", targetEndpoint, "audio_base64 length", audioLen, "ref length", refLen, "format", apiBody.audio_format);

    // ---- 5. FORWARD TO LANGUAGE CONFIDENCE ----
    const resp = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "lc-beta-features": beta,
      },
      body: JSON.stringify(apiBody),
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error("speechProxy: upstream error", resp.status, text);
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // If upstream 400, add a hint so we can distinguish from our validation 400
    if (resp.status === 400 && data?.error && !data?.hint) {
      data.hint = "Language Confidence API rejected the request. Check audio format (e.g. webm), size, and that script/reference_text is valid. Try LC_SCRIPT_FIELD=script if using reference_text.";
    }

    return {
      statusCode: resp.status,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("speechProxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Proxy failure",
        details: err?.message || "Server error",
      }),
    };
  }
}
