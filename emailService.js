/**
 * SendGrid email service for support ticket notifications.
 * Sends HTML email FROM support@exeleratetechnology.com TO the notify list.
 * Uses env: SENDGRID_API_KEY, SUPPORT_EMAIL, SUPPORT_NOTIFY_EMAILS, JIRA_DOMAIN (never exposed to frontend).
 */

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@exeleratetechnology.com';
const JIRA_DOMAIN = process.env.JIRA_DOMAIN || '';

/** Parse SUPPORT_NOTIFY_EMAILS (comma, semicolon, or newline separated). */
function getNotifyEmails() {
  const raw = String(process.env.SUPPORT_NOTIFY_EMAILS || '').trim();
  if (!raw) return [];
  return raw
    .split(/[\s,;]+/)
    .map((e) => String(e).trim().toLowerCase())
    .filter((e) => e && e.includes('@') && e.length > 5);
}

/**
 * Escape user input for safe insertion into HTML (prevent XSS).
 * @param {string} str - Raw string from user or diagnostic data
 * @returns {string} - HTML-safe string
 */
function escapeHtml(str) {
  if (str == null || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build HTML body for support notification email.
 * @param {Object} params
 * @param {string} params.issueKey - Jira ticket ID (e.g. SUP-42)
 * @param {string} params.summary - Ticket summary
 * @param {string} params.description - Full description (steps to reproduce, etc.)
 * @param {string} [params.userEmail] - User email if provided
 * @param {string} [params.environment] - Browser / OS info
 * @param {string} [params.errors] - Auto-captured JS errors
 * @param {string} params.jiraBrowseUrl - Link to Jira ticket
 * @returns {string} - HTML string
 */
function buildSupportEmailHtml({ issueKey, summary, description, userEmail, environment, errors }) {
  const e = escapeHtml;
  const jiraLink = JIRA_DOMAIN && issueKey ? `https://${e(JIRA_DOMAIN)}/browse/${e(issueKey)}` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Support ticket: ${e(issueKey)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 640px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 1.25rem; margin-bottom: 16px;">New support ticket created</h1>

  <p style="margin-bottom: 16px;"><strong>Jira ticket:</strong> ${e(issueKey)}</p>
  <p style="margin-bottom: 16px;"><strong>Summary:</strong> ${e(summary)}</p>
  ${userEmail ? `<p style="margin-bottom: 16px;"><strong>User email:</strong> ${e(userEmail)}</p>` : ''}

  ${jiraLink ? `<p style="margin-bottom: 24px;"><a href="${jiraLink}" style="color: #2563eb;">Open in Jira →</a></p>` : ''}

  <h2 style="font-size: 1rem; margin-top: 24px; margin-bottom: 8px;">Steps to reproduce / description</h2>
  <pre style="background: #f8fafc; padding: 12px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; font-size: 13px;">${e(description || '(none)')}</pre>

  ${environment ? `
  <h2 style="font-size: 1rem; margin-top: 24px; margin-bottom: 8px;">Browser / environment</h2>
  <pre style="background: #f8fafc; padding: 12px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; font-size: 13px;">${e(environment)}</pre>
  ` : ''}

  ${errors ? `
  <h2 style="font-size: 1rem; margin-top: 24px; margin-bottom: 8px;">Auto-captured errors</h2>
  <pre style="background: #fef2f2; padding: 12px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; font-size: 13px;">${e(errors)}</pre>
  ` : ''}

  <p style="margin-top: 24px; font-size: 12px; color: #64748b;">This email was sent by the support chatbot backend after a Jira ticket was created.</p>
</body>
</html>
`.trim();
}

/**
 * Send support notification: FROM support@exeleratetechnology.com TO SUPPORT_NOTIFY_EMAILS list.
 * Called only after Jira ticket creation succeeds. Failure is logged and does not affect API response.
 *
 * @param {Object} params
 * @param {string} params.issueKey - Jira ticket ID (e.g. SUP-42)
 * @param {string} params.summary - Ticket summary
 * @param {string} params.description - Full description (steps, transcript, etc.)
 * @param {string} [params.userEmail] - User email if provided
 * @param {string} [params.environment] - Browser / OS info
 * @param {string} [params.errors] - Auto-captured JS errors
 * @returns {Promise<void>} - Resolves when send is attempted; never throws.
 */
export async function sendSupportEmail({ issueKey, summary, description, userEmail, environment, errors }) {
  if (!SENDGRID_API_KEY) {
    console.warn('[emailService] SENDGRID_API_KEY not set; skipping support email');
    return;
  }

  const toEmails = getNotifyEmails();
  if (toEmails.length === 0) {
    console.warn('[emailService] SUPPORT_NOTIFY_EMAILS empty or invalid (use comma-separated emails); skipping');
    return;
  }

  const fromEmail = SUPPORT_EMAIL;
  const html = buildSupportEmailHtml({
    issueKey,
    summary,
    description,
    userEmail,
    environment,
    errors,
  });

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send({
      to: toEmails,
      from: fromEmail,
      subject: `[Support] ${issueKey} - ${summary.slice(0, 60)}${summary.length > 60 ? '…' : ''}`,
      html,
    });
    console.log('[emailService] Support email sent to', toEmails.length, 'recipient(s)');
  } catch (err) {
    // Log without exposing API key or sensitive data; do not rethrow.
    console.error('[emailService] SendGrid send failed:', err.message || err);
  }
}
