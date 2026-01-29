// DigitalOcean Serverless Function - PDF Proxy
// Proxies PDF fetches to avoid CORS (frontend calls ?url=...)

function parseQuery(q) {
  if (q == null) return {};
  if (typeof q === "object" && !Array.isArray(q)) return q;
  const str = typeof q === "string" ? q : String(q);
  const out = {};
  for (const part of str.split("&")) {
    const i = part.indexOf("=");
    const k = i >= 0 ? decodeURIComponent(part.slice(0, i).replace(/\+/g, " ")) : decodeURIComponent(part.replace(/\+/g, " "));
    const v = i >= 0 ? decodeURIComponent((part.slice(i + 1) || "").replace(/\+/g, " ")) : "";
    if (k) out[k] = v;
  }
  return out;
}

export async function main(event) {
  const method = event?.__ow_method ?? event?.http?.method ?? event?.method ?? "GET";

  if (method === "OPTIONS") {
    return { statusCode: 204 };
  }

  try {
    const query = parseQuery(event?.__ow_query ?? event?.http?.query ?? event?.query);
    // url can be in query (?url=...) or top-level (web:true merge)
    let pdfUrl = query.url ?? query.URL ?? event?.url ?? event?.URL;
    if (!pdfUrl && event?.http?.url) {
      try {
        const u = new URL(event.http.url);
        pdfUrl = u.searchParams.get("url") ?? u.searchParams.get("URL");
      } catch (_) {}
    }

    if (!pdfUrl || typeof pdfUrl !== "string" || !pdfUrl.trim()) {
      const keys = Object.keys(event || {}).filter((k) => !k.startsWith("__ow") || k === "__ow_query");
      const qs = typeof event?.__ow_query === "string" ? event.__ow_query.slice(0, 200) : String(event?.__ow_query ?? "");
      console.error("pdfProxy: missing url. Query keys:", Object.keys(query).join(", "), "| event.url:", !!event?.url, "| __ow_query snippet:", qs || "(none)", "| event keys:", keys.join(", "));
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "PDF URL is required",
          hint: "Use GET ?url=<encoded-pdf-url>. Check function logs for received query.",
        }),
      };
    }

    const url = pdfUrl.trim();
    console.log("pdfProxy: fetching", url.slice(0, 80) + (url.length > 80 ? "..." : ""));

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; pdfProxy/1.0)" },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Failed to fetch PDF: ${response.status} ${response.statusText}`,
        }),
      };
    }

    const pdfBuffer = await response.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=3600",
      },
      body: pdfBase64,
      binary: true,
    };
  } catch (err) {
    console.error("pdfProxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Proxy failure",
        details: err?.message || "Server error",
      }),
    };
  }
}
