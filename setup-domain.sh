#!/usr/bin/env bash
set -Eeuo pipefail

readonly APP_DIR="/opt/a2meridian"
readonly COMPOSE_FILE="compose.deploy.yaml"
readonly SITE_NAME="a2meridian"
readonly SITE_FILE="/etc/nginx/sites-available/${SITE_NAME}"
readonly SITE_LINK="/etc/nginx/sites-enabled/${SITE_NAME}"
readonly STATE_DIR="/etc/a2meridian"
readonly STATE_FILE="/etc/a2meridian/domain"
readonly MARKER="# Managed by A2 Meridian setup-domain.sh"

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

config_value() {
  local file="$1" key="$2" line
  [[ -f "$file" ]] || return 0
  line="$(grep -m1 "^${key}=" "$file" || true)"
  printf '%s' "${line#*=}"
}

set_config_value() {
  local file="$1" key="$2" value="$3" temp
  [[ -f "$file" ]] || fail "Required config file is missing: $file"
  temp="$(mktemp "${file}.XXXXXX")"
  awk -F= -v key="$key" -v value="$value" '
    $1 == key { if (!done) print key "=" value; done = 1; next }
    { print }
    END { if (!done) print key "=" value }
  ' "$file" >"$temp"
  chmod 600 "$temp"
  mv -f -- "$temp" "$file"
}

valid_domain() {
  [[ "$1" =~ ^([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$ ]]
}

valid_email() {
  [[ "$1" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$ ]]
}

write_http_site() {
  cat >"$SITE_FILE" <<EOF
$MARKER
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location = /admin { return 308 /admin/; }
    location ^~ /admin/ {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}
EOF
  chmod 644 "$SITE_FILE"
}

write_https_site() {
  local domain="$1"
  cat >"$SITE_FILE" <<EOF
$MARKER
server {
    listen 80;
    listen [::]:80;
    server_name $domain;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $domain;

    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    location = /admin { return 308 /admin/; }
    location ^~ /admin/ {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}
EOF
  chmod 644 "$SITE_FILE"
}

if [[ "${1:-}" == --help || "${1:-}" == -h ]]; then
  printf 'Usage: sudo bash setup-domain.sh\n\nConfigure Nginx and HTTPS for the deployed website and Studio at /admin.\n'
  exit 0
fi
[[ $# -eq 0 ]] || fail 'This script takes no arguments. Use --help.'
[[ "$(id -u)" -eq 0 ]] || fail 'Run on the Ubuntu server: sudo bash setup-domain.sh'
[[ -r /etc/os-release ]] || fail 'This script requires Ubuntu.'
. /etc/os-release
[[ "${ID:-}" == ubuntu ]] || fail "Ubuntu required; detected ${PRETTY_NAME:-unknown OS}."
[[ -d "$APP_DIR/.git" && -f "$APP_DIR/$COMPOSE_FILE" ]] || fail 'Run deploy.sh first; the project is not installed in /opt/a2meridian.'
[[ -f "$APP_DIR/.env.deploy" && -f "$APP_DIR/.env.runtime" ]] || fail 'Deployment env files are missing. Run deploy.sh first.'

if [[ -e "$SITE_FILE" ]] && ! grep -Fqx "$MARKER" "$SITE_FILE"; then
  fail "$SITE_FILE already exists and is not managed by this deployment; refusing to overwrite it."
fi
if [[ -e "$SITE_LINK" && ! -L "$SITE_LINK" ]]; then
  fail "$SITE_LINK is not a symlink; refusing to replace an existing Nginx site."
fi
if [[ -L "$SITE_LINK" ]] && [[ "$(readlink "$SITE_LINK")" != "$SITE_FILE" ]]; then
  fail "$SITE_LINK points to a different Nginx config; refusing to replace it."
fi

CURRENT_DOMAIN="$(cat "$STATE_FILE" 2>/dev/null || true)"
if [[ -n "$CURRENT_DOMAIN" ]]; then
  read -r -p "A2 Meridian is configured for $CURRENT_DOMAIN. Keep this domain? [Y/n]: " keep_domain
  if [[ ! "$keep_domain" =~ ^[Nn]$ ]]; then
    DOMAIN="$CURRENT_DOMAIN"
  else
    read -r -p 'Enter the new UI domain (e.g. a2meridian.example.com): ' DOMAIN
  fi
else
  read -r -p 'Enter the UI domain (e.g. a2meridian.example.com): ' DOMAIN
fi
DOMAIN="${DOMAIN,,}"
valid_domain "$DOMAIN" || fail 'Enter a valid hostname only, without scheme, path, or port.'

DEFAULT_EMAIL="$(config_value "$APP_DIR/.env.deploy" INQUIRY_TO_EMAIL)"
[[ -n "$DEFAULT_EMAIL" ]] || DEFAULT_EMAIL="$(config_value "$APP_DIR/.env.deploy" ACME_EMAIL)"
read -r -p "Email for Let's Encrypt notices${DEFAULT_EMAIL:+ [$DEFAULT_EMAIL]}: " CERT_EMAIL
CERT_EMAIL="${CERT_EMAIL:-$DEFAULT_EMAIL}"
valid_email "$CERT_EMAIL" || fail 'A valid certificate contact email is required.'

getent ahostsv4 "$DOMAIN" >/dev/null || fail "$DOMAIN does not resolve. Point its A record to this server, wait for DNS propagation, then rerun."

printf '\nBefore proceeding, allow inbound TCP 80 and 443 in the VPS firewall.\n'
read -r -p 'Type CONFIGURE to install/update Nginx and request HTTPS: ' confirm
[[ "$confirm" == CONFIGURE ]] || fail 'Domain setup cancelled.'

export DEBIAN_FRONTEND=noninteractive
if command -v nginx >/dev/null 2>&1; then
  printf '\nNginx is already installed; keeping the existing installation.\n'
else
  printf '\nInstalling Nginx and Certbot...\n'
fi
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx curl
systemctl enable --now nginx
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q 'Status: active'; then
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

ln -sfn "$SITE_FILE" "$SITE_LINK"
write_http_site
nginx -t
systemctl reload nginx

printf '\nRequesting/renewing the certificate for %s...\n' "$DOMAIN"
certbot certonly --nginx --non-interactive --agree-tos --no-eff-email \
  --email "$CERT_EMAIL" -d "$DOMAIN"

printf '\nBuilding the domain-specific website and /admin Studio...\n'
set_config_value "$APP_DIR/.env.deploy" NEXT_PUBLIC_SITE_URL "https://$DOMAIN"
set_config_value "$APP_DIR/.env.deploy" SANITY_STUDIO_BASE_PATH "/admin"
set_config_value "$APP_DIR/.env.runtime" NEXT_PUBLIC_SITE_URL "https://$DOMAIN"
set_config_value "$APP_DIR/.env.runtime" SANITY_STUDIO_BASE_PATH "/admin"

cd "$APP_DIR"
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" config -q
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" build --pull website sanity-studio
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" up -d --remove-orphans

write_https_site "$DOMAIN"
nginx -t

set_config_value "$APP_DIR/.env.deploy" BIND_ADDRESS "127.0.0.1"
set_config_value "$APP_DIR/.env.runtime" BIND_ADDRESS "127.0.0.1"
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" up -d --remove-orphans

for attempt in {1..18}; do
  if curl --fail --silent --max-time 10 http://127.0.0.1:3000/ -o /dev/null \
    && curl --fail --silent --max-time 10 http://127.0.0.1:3333/admin/ -o /dev/null; then
    systemctl reload nginx
    break
  fi
  if ((attempt == 18)); then
    docker compose --env-file .env.deploy -f "$COMPOSE_FILE" logs --tail=50 >&2 || true
    fail 'Local website/Studio health check failed; see container logs above.'
  fi
  sleep 5
done

curl --fail --silent --show-error --max-time 20 --resolve "$DOMAIN:443:127.0.0.1" \
  "https://$DOMAIN/" -o /dev/null \
  || fail 'HTTPS website check failed. Inspect Nginx and Certbot logs.'
curl --fail --silent --show-error --max-time 20 --resolve "$DOMAIN:443:127.0.0.1" \
  "https://$DOMAIN/admin/" -o /dev/null \
  || fail 'HTTPS Studio /admin check failed. Inspect Nginx and Studio container logs.'

install -d -m 0755 "$STATE_DIR"
printf '%s\n' "$DOMAIN" >"$STATE_FILE"
chmod 644 "$STATE_FILE"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q 'Status: active'; then
  ufw delete allow 3000/tcp || true
  ufw delete allow 3333/tcp || true
fi

printf '\nDomain deployment complete:\nWebsite: https://%s/\nSanity Studio: https://%s/admin/\n' "$DOMAIN" "$DOMAIN"
printf 'Nginx is serving both apps; Docker app ports are bound to localhost only.\n'
printf 'Add https://%s to Sanity project CORS origins (credentials enabled) if not already present.\n' "$DOMAIN"