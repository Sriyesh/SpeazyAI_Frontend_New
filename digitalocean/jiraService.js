/**
 * Jira Service - Creates Bug tickets via Jira Cloud REST API
 * Uses Jira API token from environment variables (never exposed to frontend)
 */

// ESM compatibility
const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'bearer',
  'token',
  'set-cookie',
];

/**
 * Sanitize HAR file content - remove Authorization, Cookies, Tokens from entries
 * Returns sanitized HAR object
 */
export function sanitizeHar(harJson) {
  try {
    const har = typeof harJson === 'string' ? JSON.parse(harJson) : harJson;
    if (!har.log?.entries) return har;

    for (const entry of har.log.entries) {
      // Sanitize request headers
      if (entry.request?.headers) {
        entry.request.headers = entry.request.headers.filter((h) => {
          const name = (h.name || '').toLowerCase();
          return !SENSITIVE_HEADERS.some((s) => name.includes(s));
        });
      }
      // Sanitize response headers
      if (entry.response?.headers) {
        entry.response.headers = entry.response.headers.filter((h) => {
          const name = (h.name || '').toLowerCase();
          return !SENSITIVE_HEADERS.some((s) => name.includes(s));
        });
      }
      // Remove cookies from request
      if (entry.request?.cookies) {
        entry.request.cookies = [];
      }
    }
    return har;
  } catch (e) {
    console.error('HAR sanitization error:', e);
    return harJson;
  }
}

/**
 * Create a Jira Bug issue via REST API
 */
export async function createJiraBug(payload) {
  const {
    projectKey = process.env.JIRA_PROJECT_KEY || 'SUP',
    summary,
    description,
    attachments = [],
  } = payload;

  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  const jiraDomain = process.env.JIRA_DOMAIN; // e.g. your-domain.atlassian.net

  if (!jiraEmail || !jiraApiToken || !jiraDomain) {
    throw new Error('Jira credentials not configured (JIRA_EMAIL, JIRA_API_TOKEN, JIRA_DOMAIN)');
  }

  const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');
  const baseUrl = `https://${jiraDomain}/rest/api/3`;

  const issuePayload = {
    fields: {
      project: { key: projectKey },
      summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: description }],
          },
        ],
      },
      issuetype: { name: 'Bug' },
    },
  };

  const createRes = await fetch(`${baseUrl}/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(issuePayload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Jira create failed: ${createRes.status} - ${errText}`);
  }

  const created = await createRes.json();
  const issueKey = created.key;

  for (const att of attachments) {
    try {
      const fd = new FormData();
      fd.append('file', att.blob, att.filename);

      const attRes = await fetch(`${baseUrl}/issue/${issueKey}/attachments`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'X-Atlassian-Token': 'no-check',
        },
        body: fd,
      });

      if (!attRes.ok) {
        console.warn(`Attachment ${att.filename} failed:`, await attRes.text());
      }
    } catch (attErr) {
      console.warn(`Attachment ${att.filename} error:`, attErr);
    }
  }

  return issueKey;
}
