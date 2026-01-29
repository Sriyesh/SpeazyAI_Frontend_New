#!/bin/bash
# One-time setup: install nginx config for SPA routing on the droplet.
# Run this after initial droplet setup. Uses same SERVER as deploy.sh.
# Run from project root: ./setup-droplet-nginx.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

SERVER="deploy@134.209.152.144"
NGINX_CONF="digitalocean/nginx-spa.conf"

echo "📋 Backing up existing nginx default config on server..."
ssh $SERVER 'sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak.$(date +%Y%m%d%H%M%S)'

echo "📤 Uploading SPA nginx config..."
scp "$NGINX_CONF" $SERVER:/tmp/nginx-spa.conf

echo "🔧 Installing nginx config..."
ssh $SERVER << 'EOF'
  sudo cp /tmp/nginx-spa.conf /etc/nginx/sites-available/default
  sudo nginx -t
  sudo systemctl reload nginx
EOF

echo "✅ Nginx SPA config installed. /login, /about, etc. should now work."
echo "   Run ./deploy.sh to deploy app updates."
