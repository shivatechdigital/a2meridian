#!/usr/bin/env bash
set -Eeuo pipefail

readonly REPO="https://github.com/shivatechdigital/a2meridian.git"
readonly APP_DIR="/opt/a2meridian"
readonly COMPOSE_FILE="compose.deploy.yaml"

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
usage() {
  printf 'Usage: sudo bash deploy.sh\n\nInstall Git/Docker, clone the project, and run the website on :3000 and Sanity Studio on :3333.\n'
}
config_value() {
  local file="$1" key="$2" line
  [[ -f "$file" ]] || return 0
  line="$(grep -m1 "^${key}=" "$file" || true)"
  printf '%s' "${line#*=}"
}
prompt_value() {
  local label="$1" default="${2:-}" value
  read -r -p "$label${default:+ [$default]}: " value
  value="${value:-$default}"
  [[ -n "$value" ]] || fail "$label is required"
  printf '%s' "$value"
}
prompt_optional() {
  local label="$1" default="${2:-}" value
  read -r -p "$label${default:+ [$default]} (Enter to skip): " value
  printf '%s' "${value:-$default}"
}
prompt_secret() {
  local label="$1" value
  read -r -s -p "$label: " value
  printf '\n' >&2
  [[ -n "$value" ]] || fail "$label is required"
  printf '%s' "$value"
}
prompt_optional_secret() {
  local label="$1" value
  read -r -s -p "$label (press Enter to skip): " value
  printf '\n' >&2
  printf '%s' "$value"
}
valid_ipv4() {
  [[ "$1" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || return 1
  local octet
  IFS=. read -r -a octets <<<"$1"
  for octet in "${octets[@]}"; do
    ((10#$octet <= 255)) || return 1
  done
}

install_docker() {
  if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
    printf '\nInstalling Docker Engine and the Compose plugin...\n'
    apt-get update
    apt-get install -y ca-certificates curl git
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    . /etc/os-release
    local codename="${UBUNTU_CODENAME:-${VERSION_CODENAME:-}}"
    [[ -n "$codename" ]] || fail 'Could not determine the Ubuntu release codename.'
    printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu %s stable\n' \
      "$(dpkg --print-architecture)" "$codename" >/etc/apt/sources.list.d/docker.list
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  fi
  systemctl enable --now docker
  local version major minor
  version="$(docker compose version --short 2>/dev/null || true)"
  [[ "$version" =~ ^v?([0-9]+)\.([0-9]+) ]] || fail 'Docker Compose v2 is required.'
  major="${BASH_REMATCH[1]}"
  minor="${BASH_REMATCH[2]}"
  ((major > 2 || (major == 2 && minor >= 30))) || fail 'Docker Compose 2.30+ is required.'
}

if [[ "${1:-}" == --help || "${1:-}" == -h ]]; then usage; exit 0; fi
[[ $# -eq 0 ]] || fail 'No arguments are supported. Use --help for usage.'
[[ "$(id -u)" -eq 0 ]] || fail 'Run on the Ubuntu server as root: sudo bash deploy.sh'
[[ -r /etc/os-release ]] || fail 'This script requires Ubuntu Linux.'
. /etc/os-release
[[ "${ID:-}" == ubuntu ]] || fail "Ubuntu required; detected ${PRETTY_NAME:-unknown OS}."

defaults_file=''
runtime_file=''
if [[ -f "$APP_DIR/package.json" ]]; then
  defaults_file="$APP_DIR/.env.deploy"
  runtime_file="$APP_DIR/.env.runtime"
fi
printf 'A2 Meridian deployment\nRepository: %s\nTarget: %s\n\n' "$REPO" "$APP_DIR"

public_ip="$(prompt_value 'Server public IPv4 address' "$(config_value "$defaults_file" SERVER_PUBLIC_IP)")"
valid_ipv4 "$public_ip" || fail 'Enter the server public IPv4 address, e.g. 203.0.113.10.'
project="$(prompt_value 'Sanity project ID' "$(config_value "$defaults_file" NEXT_PUBLIC_SANITY_PROJECT_ID)")"
[[ "$project" =~ ^[a-z0-9-]+$ ]] || fail 'Invalid Sanity project ID.'
dataset="$(prompt_value 'Sanity dataset' "$(config_value "$defaults_file" NEXT_PUBLIC_SANITY_DATASET)")"
[[ "$dataset" =~ ^[A-Za-z0-9_-]+$ ]] || fail 'Invalid Sanity dataset.'
api_version_default="$(config_value "$defaults_file" NEXT_PUBLIC_SANITY_API_VERSION)"
api_version="$(prompt_value 'Sanity API version' "${api_version_default:-2026-10-16}")"
[[ "$api_version" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || fail 'API version must be YYYY-MM-DD.'
verification="$(prompt_optional 'Google verification token' "$(config_value "$defaults_file" GOOGLE_SITE_VERIFICATION)")"
[[ "$verification" =~ ^[A-Za-z0-9_-]*$ ]] || fail 'Invalid Google verification token.'

key=''
from_email=''
to_email=''
keep_existing=false
if [[ -f "$runtime_file" ]]; then
  keep="$(prompt_value 'Keep existing Resend credentials? [Y/n]' Y)"
  if [[ ! "$keep" =~ ^[Nn]$ ]]; then
    key="$(config_value "$runtime_file" RESEND_API_KEY)"
    from_email="$(config_value "$runtime_file" INQUIRY_FROM_EMAIL)"
    to_email="$(config_value "$runtime_file" INQUIRY_TO_EMAIL)"
    [[ -n "$key" && -n "$from_email" && -n "$to_email" ]] && keep_existing=true
  fi
fi
if [[ "$keep_existing" == false ]]; then
  printf 'Resend is optional for deployment; inquiry email will remain unavailable until configured.\n'
  key="$(prompt_optional_secret 'Resend API key')"
  if [[ -n "$key" ]]; then
    from_email="$(prompt_value 'Verified Resend sender email')"
    to_email="$(prompt_value 'Inquiry recipient email')"
    [[ "$from_email" == *@*.* && "$to_email" == *@*.* ]] || fail 'Enter valid sender and recipient email addresses.'
  fi
fi

printf '\nAllow inbound TCP ports 3000 and 3333 in your VPS provider firewall.\n'
read -r -p 'Type DEPLOY to install/update Docker and start both containers: ' answer
[[ "$answer" == DEPLOY ]] || fail 'Deployment cancelled.'
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git

if [[ -d "$APP_DIR/.git" ]]; then
  origin="$(git -C "$APP_DIR" remote get-url origin)"
  [[ "${origin%.git}" == "${REPO%.git}" ]] || fail "$APP_DIR belongs to a different Git repository."
  git -C "$APP_DIR" pull --ff-only
elif [[ -e "$APP_DIR" ]]; then
  fail "$APP_DIR exists but is not the expected Git checkout; move it aside manually."
else
  git clone "$REPO" "$APP_DIR"
fi
install_docker
cd "$APP_DIR"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q 'Status: active'; then
  ufw allow 22/tcp
  ufw allow 3000/tcp
  ufw allow 3333/tcp
fi

umask 077
cat >.env.deploy <<EOF
SERVER_PUBLIC_IP=$public_ip
NEXT_PUBLIC_SANITY_PROJECT_ID=$project
NEXT_PUBLIC_SANITY_DATASET=$dataset
NEXT_PUBLIC_SANITY_API_VERSION=$api_version
NEXT_PUBLIC_SITE_URL=http://$public_ip:3000
GOOGLE_SITE_VERIFICATION=$verification
EOF
runtime_temp="$(mktemp .env.runtime.XXXXXX)"
trap 'rm -f -- "$runtime_temp"' EXIT
{
  printf 'NEXT_PUBLIC_SANITY_PROJECT_ID=%s\n' "$project"
  printf 'NEXT_PUBLIC_SANITY_DATASET=%s\n' "$dataset"
  printf 'NEXT_PUBLIC_SANITY_API_VERSION=%s\n' "$api_version"
  printf 'NEXT_PUBLIC_SITE_URL=http://%s:3000\n' "$public_ip"
  printf 'GOOGLE_SITE_VERIFICATION=%s\n' "$verification"
  printf 'RESEND_API_KEY=%s\nINQUIRY_FROM_EMAIL=%s\nINQUIRY_TO_EMAIL=%s\n' "$key" "$from_email" "$to_email"
} >"$runtime_temp"
chmod 600 "$runtime_temp"
mv -f -- "$runtime_temp" .env.runtime
chmod 600 .env.deploy
trap - EXIT

docker compose --env-file .env.deploy -f "$COMPOSE_FILE" config -q
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" build --pull website
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" build --pull sanity-studio
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" up -d --remove-orphans

printf '\nWaiting for website and Studio on %s ...\n' "$public_ip"
for attempt in {1..18}; do
  if curl --fail --silent --show-error --max-time 10 http://127.0.0.1:3000/ -o /dev/null \
    && curl --fail --silent --show-error --max-time 10 http://127.0.0.1:3333/ -o /dev/null; then
    printf '\nDeployment complete:\nWebsite: http://%s:3000\nSanity Studio: http://%s:3333\n' "$public_ip" "$public_ip"
    docker compose --env-file .env.deploy -f "$COMPOSE_FILE" ps
    exit 0
  fi
  sleep 10
done
printf '\nContainers started, but one/both HTTP checks failed. Check provider firewall ports 3000/3333 and container logs.\n' >&2
docker compose --env-file .env.deploy -f "$COMPOSE_FILE" logs --tail=40 >&2 || true
exit 1