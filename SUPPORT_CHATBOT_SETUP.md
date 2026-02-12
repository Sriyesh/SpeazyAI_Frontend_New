# Support Chatbot Setup

The guided "Need Support" chatbot creates Jira Bug tickets with diagnostic info. Configure the following for it to work.

## Environment Variables (Backend)

Add these to your DigitalOcean Function / server environment:

| Variable | Description |
|----------|-------------|
| `JIRA_EMAIL` | Your Jira account email |
| `JIRA_API_TOKEN` | Jira API token (create at https://id.atlassian.com/manage-profile/security/api-tokens) |
| `JIRA_DOMAIN` | Your Jira domain (e.g. `yourcompany.atlassian.net`) |
| `JIRA_PROJECT_KEY` | Project key for new bugs (e.g. `SUP`). Default: `SUP` |
| `ALLOWED_ORIGIN` | CORS origin for your frontend (e.g. `https://exeleratetechnology.com`) |
| `SENDGRID_API_KEY` | SendGrid API key for support notification emails |
| `SUPPORT_EMAIL` | From address (e.g. `support@exeleratetechnology.com`) |
| `SUPPORT_NOTIFY_EMAILS` | Comma-separated list of recipients (e.g. `sriyesh.m@gmail.com,other@example.com`) |

## Deploy Support Proxy (DigitalOcean)

1. Deploy the `supportProxy` function to DigitalOcean Functions:
   - Copy `digitalocean/functions/supportProxy.js` to your DO Functions project
   - Set the environment variables above in the function settings

2. Add the function URL to your frontend config:
   - Set `VITE_SUPPORT_PROXY_URL` in your build environment to the supportProxy function URL
   - Or update `DIGITALOCEAN_FUNCTIONS.supportProxy` in `src/config/apiConfig.ts`

## Local Development

1. Create `.env` in project root with Jira and (optional) SendGrid credentials:
   ```
   JIRA_EMAIL=your@email.com
   JIRA_API_TOKEN=your_api_token
   JIRA_DOMAIN=yourcompany.atlassian.net
   JIRA_PROJECT_KEY=SUP
   SENDGRID_API_KEY=SG.xxx
   SUPPORT_EMAIL=support@exeleratetechnology.com
   SUPPORT_NOTIFY_EMAILS=sriyesh.m@gmail.com,other@example.com
   ```

2. Run the support proxy:
   ```bash
   npm run proxy:support
   ```
   This starts the server on port 4002.

3. With `VITE_API_PROVIDER=local`, the frontend will call `http://localhost:4002/supportProxy`.

## API Server (DigitalOcean Droplet)

If you run `digitalocean/api-server.js` on a Droplet, the support route is at:
- `POST /api/support-ticket` (JSON body with payload + base64 attachments)

Point `VITE_SUPPORT_PROXY_URL` to `https://your-api-server.com/api/support-ticket` and set the Jira env vars on the server.

## Email Notification

Emails are sent **from** `SUPPORT_EMAIL` (e.g. `support@exeleratetechnology.com`) **to** everyone listed in `SUPPORT_NOTIFY_EMAILS` after a Jira ticket is created.

Set these in your environment (local `.env` or DigitalOcean function env):

- `SENDGRID_API_KEY` – Your SendGrid API key
- `SUPPORT_EMAIL` – From address (e.g. `support@exeleratetechnology.com`). The domain must be verified in SendGrid.
- `SUPPORT_NOTIFY_EMAILS` – Comma-separated recipients, e.g. `sriyesh.m@gmail.com,other@example.com`

If `SUPPORT_NOTIFY_EMAILS` is missing or empty, no email is sent (ticket creation still succeeds).

**SendGrid sender verification:** To send from `support@exeleratetechnology.com`, you must verify that domain (or single sender) in SendGrid: [Sender Authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication). Until verified, SendGrid may reject the request or drop the email. Check your DigitalOcean function logs after submitting a ticket: you should see either `Support email sent to N recipient(s)` or `SendGrid failed: <status> <body>` with SendGrid’s error message.
