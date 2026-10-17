# Ubuntu VPS Deployment

Deploy in two stages. First `deploy.sh` installs Docker and runs the project;
then `setup-domain.sh` installs/configures Nginx and Certbot for the domain.
The final URLs are:

- Website: `https://YOUR_DOMAIN/`
- Sanity Studio: `https://YOUR_DOMAIN/admin/`

Node.js runs inside Docker images. Docker Compose keeps both app services running
after reboot, so PM2 is not used or needed. Nginx is the public reverse proxy;
after domain setup the app ports bind to localhost only. The initial IP stage
serves HTTP directly on ports 3000 and 3333 until Nginx/HTTPS is configured.

## Before Running

- Create an Ubuntu VPS with a public IPv4 address and SSH/root access.
- Initially allow inbound TCP `22`, `3000`, and `3333` for the first deployment.
  Before running the domain setup, allow TCP `80` and `443` in the VPS provider
  firewall. The scripts can update active UFW rules but cannot change your
  provider's firewall/security group.
- Create an A record for the chosen domain pointing to this VPS public IPv4 and
  wait for DNS to resolve before requesting the Let's Encrypt certificate.
- Have the Sanity project ID and dataset ready.
- Resend is optional during deployment. Without its key/from/to values, the site
  runs but inquiry email delivery remains unavailable until configured.

The server needs enough RAM and disk for two production image builds. If a build
is killed, increase VPS memory and disk capacity, then rerun the script.

## Stage 1: App and Studio

SSH to Ubuntu and run this command. It installs Git/curl, downloads the deploy
script from GitHub, and runs it as root; the script clones the project into
`/opt/a2meridian`, installs Docker/Compose if needed, builds both images, starts
both containers, and checks their IP-based URLs.

Push the deployment files to GitHub `main` before running the bootstrap. It
downloads `deploy.sh` from that branch and clones the code from the same branch.

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl git && curl -fsSL https://raw.githubusercontent.com/shivatechdigital/a2meridian/main/deploy.sh -o /tmp/a2-meridian-deploy.sh && sudo bash /tmp/a2-meridian-deploy.sh
```

Enter the server's public IPv4 and Sanity values when prompted, then type
`DEPLOY`. The script clones/fast-forwards the GitHub default branch at
`/opt/a2meridian`; it refuses to overwrite an unrelated directory or reset local
tracked changes. Runtime values are stored in root-owned
`/opt/a2meridian/.env.runtime` with mode `600`. The Resend API key is entered
without terminal echo and is not used as a Docker build argument.

Stage 1 prints temporary direct-IP URLs for ports `3000` and `3333`. Use them
only until Stage 2 is complete; after the domain setup, use HTTPS and close
provider-firewall access to `3000/3333`.

You can also clone the repository manually and run `sudo bash deploy.sh` from
that checkout; the deployed working copy is still `/opt/a2meridian`.

## Stage 2: Domain, Nginx, and SSL

Point the domain's A record to the VPS address and allow TCP `80` and `443` in
the provider firewall. Then run:

```bash
sudo bash /opt/a2meridian/setup-domain.sh
```

The script detects an existing managed A2 Meridian Nginx setup and asks whether
to keep its domain or enter a replacement. It installs Nginx/Certbot if needed,
requests a Let's Encrypt certificate, rebuilds the Studio at `/admin`, configures
Nginx routes, and finally binds Docker ports `3000/3333` to localhost only. It
tests Nginx and both HTTPS routes before reporting success. Certbot's system
timer handles certificate renewal.

The script preserves the current bind address while the certificate and Nginx
configuration are being prepared. Once both containers pass their local checks,
it switches them to localhost-only and reloads the Nginx site.

For Sanity login, add the website origin `https://YOUR_DOMAIN` in Sanity Manage
under API > CORS origins, with credentials enabled. The browser origin does not
include `/admin`. Editing still requires Sanity authentication. Do not add a
write token to this deployment or browser environment.

If a different Nginx app already owns `/etc/nginx/sites-available/a2meridian`,
the script stops instead of overwriting it. Existing unrelated Nginx sites are
left in place. When changing domain, the previous certificate is left unused;
it is not automatically deleted.

## Operations

```bash
cd /opt/a2meridian
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml ps
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f website
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f sanity-studio
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml restart website
sudo nginx -t
sudo certbot renew --dry-run
```

Rerun `sudo bash deploy.sh` to fetch the latest fast-forwardable GitHub commit
and rebuild/restart both services; it preserves the domain, `/admin` path, and
localhost binding after Stage 2. Rerun `sudo bash /opt/a2meridian/setup-domain.sh`
when changing the domain. Public Sanity settings and the site origin are compiled
into the images. Keep `.env.runtime` private and never commit it.

The Sanity dataset in this project is public. This deployment does not enable
inquiry storage in Sanity. Resend email delivery requires valid credentials.
PM2 is intentionally not used: Docker Compose `restart: unless-stopped` keeps
both app containers running across service failures and server reboots.

## Troubleshooting

- If a URL does not open, check `sudo docker compose --env-file .env.deploy -f
  compose.deploy.yaml ps`, container logs, and `sudo nginx -t`.
- Confirm the provider firewall permits `80/443`. After Stage 2, ports `3000` and
  `3333` should be closed in the provider firewall; the containers bind only to
  localhost. If UFW is active, check `sudo ufw status` too.
- If Studio loads but sign-in fails, add the exact `https://YOUR_DOMAIN` origin
  to Sanity CORS settings with credentials enabled.
- If Certbot fails, confirm the domain A record resolves to this VPS and that
  inbound TCP port `80` is reachable from the internet.
- Compose version `2.30+` is required for literal handling of runtime env-file
  values; the deploy script checks this before starting.