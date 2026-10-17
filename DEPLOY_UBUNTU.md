# Ubuntu VPS Deployment

This deploys the A2 Meridian website from
`https://github.com/shivatechdigital/a2meridian.git` to an Ubuntu server. Docker
Compose builds the repository's production Dockerfile. Caddy provides HTTPS and
proxies public traffic to the app; Node.js and npm are not required on the host.

## Requirements

- Ubuntu server with a public IPv4 or IPv6 address and root/sudo access.
- A domain or subdomain you control. Create DNS A/AAAA records pointing to this
  server before deployment and wait until the name resolves.
- Allow inbound TCP ports 80 and 443 in the VPS/cloud provider firewall. The
  script opens these UFW ports only if UFW is already active; it does not enable
  UFW or alter provider firewall rules.
- Sanity project ID and dataset.
- Resend API key, verified sender address, and inquiry recipient address.

The server needs enough memory and disk space for a Next.js production image
build. If Docker's build is killed, increase server resources and retry. Check
your provider's billing before creating a VPS.

## Deploy

SSH into Ubuntu and run:

```bash
sudo apt-get update
sudo apt-get install -y git ca-certificates curl
git clone https://github.com/shivatechdigital/a2meridian.git
cd a2meridian
sudo bash deploy.sh
```

The script installs Docker Engine and Docker Compose from Docker's official
Ubuntu apt repository when Docker is missing. It prompts for the domain, Sanity
settings, optional Google verification value, Resend settings, and an email for
HTTPS certificate notices. The Resend key is entered without terminal echo and
stored in `/opt/a2meridian/.env.runtime` with root-only mode `600`; it is not a
Docker build argument or printed by the script.

Review the DNS/firewall reminders and type `DEPLOY` to approve system changes.
The script clones or fast-forwards the GitHub default branch in
`/opt/a2meridian`, builds and starts the app and Caddy containers with restart
policies, and checks the public HTTPS URL. On later runs it uses
`git pull --ff-only`; it will not reset tracked edits or overwrite an unrelated
directory. Existing Resend credentials are kept by default; answer `n` to rotate
them.

## Operations

Open the printed HTTPS URL. Useful commands on the server:

```bash
cd /opt/a2meridian
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml ps
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f app
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f caddy
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml restart app
```

Do not publish `.env.runtime`, paste it into support requests, or commit it.
Rerun `sudo bash deploy.sh` to apply source/config changes. Build-time public
Sanity and site URL values are embedded in the image and require a rebuild.

The Sanity dataset is public. This deployment does **not** enable inquiry storage
in Sanity; the inquiry endpoint still depends on valid Resend configuration. The
Sanity Studio is not deployed or exposed by this script.

## Troubleshooting

- For HTTPS errors, verify DNS points to this server and the provider firewall
  permits TCP 80/443, then inspect Caddy logs with the command above.
- If the domain is not resolving, finish DNS setup and rerun `sudo bash deploy.sh`
  from the checkout.
- For a killed Docker build, inspect `free -h` and `df -h`, increase server
  resources, and retry.
- Docker Compose 2.30+ is required to load runtime secrets literally. The script
  checks for this before starting the app.
- If inquiry email delivery fails, verify the Resend key and sender-domain status,
  then rerun the script and choose to replace the credentials.