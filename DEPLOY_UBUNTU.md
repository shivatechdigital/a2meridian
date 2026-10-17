# Ubuntu IP Deployment

`deploy.sh` deploys the GitHub project to a fresh Ubuntu server and runs two
Docker containers:

- Website: `http://SERVER_PUBLIC_IP:3000`
- Sanity Studio: `http://SERVER_PUBLIC_IP:3333`

The host needs Git, curl, and Docker/Compose. Node.js is installed inside the
Docker build/runtime images, not on Ubuntu itself. This direct-IP setup uses HTTP
without TLS; use a domain and HTTPS reverse proxy before collecting real user
data or treating the site as a production-grade secure endpoint.

## Before Running

- Create an Ubuntu VPS with a public IPv4 address and SSH/root access.
- In the VPS provider firewall/security group, allow inbound TCP `22`, `3000`, and
  `3333`. The script adds ports `3000` and `3333` to UFW only if UFW is already
  active; it does not alter provider-level firewall settings.
- Have the Sanity project ID and dataset ready.
- Resend is optional during deployment. Without its key/from/to values, the site
  runs but inquiry email delivery remains unavailable until configured.

The server needs enough RAM and disk for two production image builds. If a build
is killed, increase VPS memory and disk capacity, then rerun the script.

## One-Command Bootstrap

SSH to Ubuntu and run this command. It installs Git/curl, downloads the deploy
script from GitHub, and runs it as root; the script then clones the full project
into `/opt/a2meridian`, installs Docker if needed, builds both images, opens
active UFW rules, starts both containers, and checks both URLs.

First commit and push this deploy script, the Dockerfile, Compose file, and
documentation changes to the repository's `main` branch. The bootstrap downloads
the script from GitHub and the deployment clones the code from that same branch.

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl git && curl -fsSL https://raw.githubusercontent.com/shivatechdigital/a2meridian/main/deploy.sh -o /tmp/a2-meridian-deploy.sh && sudo bash /tmp/a2-meridian-deploy.sh
```

Enter the server's public IPv4 and Sanity values when prompted, then type
`DEPLOY`. The script clones/fast-forwards the GitHub default branch at
`/opt/a2meridian`; it refuses to overwrite an unrelated directory or reset local
tracked changes. Runtime values are stored in root-owned
`/opt/a2meridian/.env.runtime` with mode `600`. The Resend API key is entered
without terminal echo and is not used as a Docker build argument.

You can also clone the repository manually and run `sudo bash deploy.sh` from
that checkout; the deployed working copy is still `/opt/a2meridian`.

## Sanity Studio Access

The Studio is exposed on port `3333` as requested. Sanity login still protects
editing, but the Studio login page is public to anyone who can reach that port.
In Sanity Manage, add the origin `http://SERVER_PUBLIC_IP:3333` to the project's
CORS origins (with credentials enabled) so browser authentication works. Do not
put a Sanity write token in this script or in browser-visible environment
variables. Restrict port `3333` to your own IP in the VPS firewall when possible.

## Operations

```bash
cd /opt/a2meridian
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml ps
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f website
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml logs -f sanity-studio
sudo docker compose --env-file .env.deploy -f compose.deploy.yaml restart website
```

Rerun `sudo bash deploy.sh` to fetch the latest fast-forwardable GitHub commit
and rebuild/restart both services. Public Sanity settings and the site origin are
compiled into the images. Keep `.env.runtime` private and never commit it.

The Sanity dataset in this project is public. This deployment does not enable
inquiry storage in Sanity. Resend email delivery requires valid credentials, and
direct HTTP/IP deployment does not provide encrypted browser-to-server traffic.

## Troubleshooting

- If a URL does not open, check `sudo docker compose --env-file .env.deploy -f
  compose.deploy.yaml ps` and the container logs above.
- Confirm the VPS provider firewall allows the relevant TCP port. If UFW is
  active, verify `sudo ufw status` includes `3000/tcp` and `3333/tcp`.
- If Studio loads but sign-in fails, add the exact `http://IP:3333` origin to
  Sanity CORS settings with credentials enabled.
- Compose version `2.30+` is required for literal handling of runtime env-file
  values; the deploy script checks this before starting.