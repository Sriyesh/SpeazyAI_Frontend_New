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

## Deploy Support Proxy (DigitalOcean)

1. Deploy the `supportProxy` function to DigitalOcean Functions:
   - Copy `digitalocean/functions/supportProxy.js` to your DO Functions project
   - Set the environment variables above in the function settings

2. Add the function URL to your frontend config:
   - Set `VITE_SUPPORT_PROXY_URL` in your build environment to the supportProxy function URL
   - Or update `DIGITALOCEAN_FUNCTIONS.supportProxy` in `src/config/apiConfig.ts`

## Local Development

1. Create `.env` in project root with Jira credentials:
   ```
   JIRA_EMAIL=your@email.com
   JIRA_API_TOKEN=your_api_token
   JIRA_DOMAIN=yourcompany.atlassian.net
   JIRA_PROJECT_KEY=SUP
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

## Email Notification (Optional)

The backend logs ticket creation. To send email to your support team, add your email service (e.g. SendGrid, Nodemailer) in:
- `digitalocean/functions/supportProxy.js` - after `console.log` 
- `supportProxyServer.js` - after `console.log`

Example structure:
```js
await sendSupportEmail({
  to: 'support@exeleratetechnology.com',
  subject: `New ticket: ${issueKey}`,
  body: `Ticket ${issueKey} created. Link: https://${JIRA_DOMAIN}/browse/${issueKey}`,
});
```
