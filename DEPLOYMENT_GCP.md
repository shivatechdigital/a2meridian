# Deploy to Google Cloud Platform

This guide deploys the A2 Meridian Next.js website as a Docker container on Cloud Run, stores images in Artifact Registry, and keeps email credentials in Secret Manager. Cloud Build CI/CD is an optional separate setup. It is written for this repository's root-level `app/` layout and Next.js 16 configuration.

The commands below use Bash syntax (Cloud Shell, WSL, macOS, or Linux). Replace every `<PLACEHOLDER>` before running a command. Review estimated costs and billing alerts in your Google Cloud project first.

## Deployment Scope

The repository includes `deploy_cloud.sh` for an interactive GCP deployment. From Ubuntu, run `bash deploy_cloud.sh gcp`; it checks lint and types, builds the Docker image locally, creates or reuses Artifact Registry, Secret Manager, and Cloud Run resources, then deploys and checks the generated HTTPS endpoint. It prompts for public Sanity/site settings and the Resend values. Each run adds new Secret Manager versions for the prompted Resend values. For a regular Ubuntu VPS with Docker Compose/Caddy, use [deploy.sh](deploy.sh) instead.

The script does not create a load balancer, CDN, DNS records, custom domain, or Cloud Build trigger. Cloud Run's generated HTTPS URL is sufficient for an initial smoke test. Review the steps below for manual deployment options and optional infrastructure.

## 1. Prerequisites and Project Values

Install Docker (or use Cloud Build), the Google Cloud CLI, and authenticate:

```bash
gcloud auth login
gcloud auth configure-docker <REGION>-docker.pkg.dev
gcloud config set project <GCP_PROJECT_ID>
```

Set the project-specific values for the commands that follow:

```bash
export PROJECT_ID="<GCP_PROJECT_ID>"
export REGION="asia-south1"
export REPOSITORY="a2-meridian-repo"
export SERVICE="a2-meridian-web"
export IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}"
export SANITY_PROJECT_ID="<SANITY_PROJECT_ID>"
export SANITY_DATASET="production"
export SITE_URL="https://<YOUR_DOMAIN>"
```

Choose a region close to your users and Sanity data. The sample region is Mumbai; it is not a requirement.

## 2. Configure Standalone Output

Add `output: "standalone"` to the existing object in `next.config.ts`. Keep the existing `cacheComponents`, image, header, and Turbopack configuration; do not replace the file with a minimal config from another project. For example:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // Keep the existing options below this line.
```

The project uses the Sanity image CDN (`cdn.sanity.io`) and its current image pattern should be retained. This project does not require `images.unsplash.com` for remote Next Image sources because its photography is stored locally.

## 3. Add Docker Build Files

Create `.dockerignore` in the repository root:

```dockerignore
node_modules
.next
.git
.gitignore
*.md
.env
.env.*
!.env.example
.vscode
.idea
coverage
```

Create `Dockerfile` in the repository root:

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_SANITY_API_VERSION=2026-10-16
ARG NEXT_PUBLIC_SITE_URL
ARG GOOGLE_SITE_VERIFICATION
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_API_VERSION=$NEXT_PUBLIC_SANITY_API_VERSION
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
```

The builder runs `npm ci` with development dependencies because TypeScript and build tooling may be needed by `next build`. The runtime image contains only the standalone server output, public files, and generated static assets. Never copy `.env.local` into an image.

Set the Sanity project ID, dataset, site URL, and optional Google Search Console verification value at build time. `NEXT_PUBLIC_*` values are embedded in client bundles at build time; rebuilding is required when they change. Google verification is also read while metadata is generated, so provide it during the build if used.

## 4. Validate the Container Locally

Build using the same public configuration intended for production:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID="$SANITY_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_SANITY_DATASET="$SANITY_DATASET" \
  --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
  -t a2-meridian-web:local .
```

Run the image with the private email settings supplied at runtime. Prefer a local ignored env file for this step; do not put real credentials in shell history or commit an env file:

```bash
docker run --rm -p 8080:8080 --env-file .env.production.local a2-meridian-web:local
```

Open `http://localhost:8080` and submit an inquiry only with test contact details you control. The app should return HTTP 503 for inquiry submissions until all three Resend settings are valid.

## 5. Create Cloud Resources

Enable the required APIs and create an Artifact Registry Docker repository:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com

gcloud artifacts repositories create "$REPOSITORY" \
  --repository-format=docker \
  --location="$REGION" \
  --description="A2 Meridian website container images"
```

Create a dedicated Cloud Run runtime service account and grant it access to only the email secrets:

```bash
export RUNTIME_SA="${SERVICE}-runtime"
gcloud iam service-accounts create "$RUNTIME_SA" \
  --display-name="A2 Meridian Cloud Run runtime"
export RUNTIME_SA_EMAIL="${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com"
```

Create the Resend secrets interactively so secret values are not placed in command arguments or shell history:

```bash
gcloud secrets create RESEND_API_KEY --replication-policy=automatic
gcloud secrets versions add RESEND_API_KEY --data-file=-
# Paste the value, then press Ctrl+D (Ctrl+Z then Enter on Windows terminals).

gcloud secrets create INQUIRY_FROM_EMAIL --replication-policy=automatic
gcloud secrets versions add INQUIRY_FROM_EMAIL --data-file=-
# Paste the verified sender address, then end input.

gcloud secrets create INQUIRY_TO_EMAIL --replication-policy=automatic
gcloud secrets versions add INQUIRY_TO_EMAIL --data-file=-
# Paste the recipient address, then end input.
```

Grant the runtime identity secret access:

```bash
for secret in RESEND_API_KEY INQUIRY_FROM_EMAIL INQUIRY_TO_EMAIL; do
  gcloud secrets add-iam-policy-binding "$secret" \
    --member="serviceAccount:${RUNTIME_SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor"
done
```

Do not create a `SANITY_API_READ_TOKEN` for the current public published catalog. `lib/queries.ts` uses the published perspective against the configured public Sanity project and dataset. If the Sanity dataset is made private in the future, implement a server-only token reader and grant that token as a secret; never use a `NEXT_PUBLIC_` token.

## 6. Build, Push, and Deploy

Create `cloudbuild.yaml` in the repository root. It passes only public configuration values into the image build and publishes an immutable commit tag:

```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - --build-arg
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${_SANITY_PROJECT_ID}
      - --build-arg
      - NEXT_PUBLIC_SANITY_DATASET=${_SANITY_DATASET}
      - --build-arg
      - NEXT_PUBLIC_SITE_URL=${_SITE_URL}
      - --build-arg
      - GOOGLE_SITE_VERIFICATION=${_GOOGLE_SITE_VERIFICATION}
      - -t
      - ${_REGION}-docker.pkg.dev/${PROJECT_ID}/${_REPO}/${_SERVICE}:${_IMAGE_TAG}
      - .
images:
  - ${_REGION}-docker.pkg.dev/${PROJECT_ID}/${_REPO}/${_SERVICE}:${_IMAGE_TAG}
substitutions:
  _REGION: asia-south1
  _REPO: a2-meridian-repo
  _SERVICE: a2-meridian-web
  _IMAGE_TAG: local
  _SANITY_PROJECT_ID: replace-with-project-id
  _SANITY_DATASET: production
  _SITE_URL: https://example.com
  _GOOGLE_SITE_VERIFICATION: ""
options:
  logging: CLOUD_LOGGING_ONLY
```

Submit the build with values for this environment. Cloud Build pushes the image listed under `images` to Artifact Registry; a local Docker daemon is not required:

```bash
export TAG="$(git rev-parse --short HEAD)"
export GOOGLE_SITE_VERIFICATION="<OPTIONAL_SEARCH_CONSOLE_VALUE>"
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions="_REGION=${REGION},_REPO=${REPOSITORY},_SERVICE=${SERVICE},_IMAGE_TAG=${TAG},_SANITY_PROJECT_ID=${SANITY_PROJECT_ID},_SANITY_DATASET=${SANITY_DATASET},_SITE_URL=${SITE_URL},_GOOGLE_SITE_VERIFICATION=${GOOGLE_SITE_VERIFICATION}"
```

If Search Console verification is not configured yet, leave `GOOGLE_SITE_VERIFICATION` empty or omit the related build argument and substitution. For a Git-triggered build, set `_IMAGE_TAG` to the trigger's `$COMMIT_SHA` substitution. Do not use a mutable `latest` tag for production rollback.

Deploy the revision. Port 8080 matches the Docker image and Cloud Run's container port:

```bash
gcloud run deploy "$SERVICE" \
  --image "${IMAGE}:${TAG}" \
  --region "$REGION" \
  --platform managed \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min 0 \
  --max 5 \
  --concurrency 40 \
  --timeout 300 \
  --service-account "$RUNTIME_SA_EMAIL" \
  --allow-unauthenticated \
  --set-secrets "RESEND_API_KEY=RESEND_API_KEY:latest,INQUIRY_FROM_EMAIL=INQUIRY_FROM_EMAIL:latest,INQUIRY_TO_EMAIL=INQUIRY_TO_EMAIL:latest" \
  --set-env-vars "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID},NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET},NEXT_PUBLIC_SANITY_API_VERSION=2026-10-16,NEXT_PUBLIC_SITE_URL=${SITE_URL}"
```

`--allow-unauthenticated` makes the public website accessible. Do not use it for a private preview service. Adjust CPU, memory, concurrency, and instance bounds after observing real traffic and memory use; these values are starting points, not a capacity guarantee. The site uses Cache Components and runtime Sanity requests. Cloud Run instances have independent ephemeral local caches; do not put a CDN in front of dynamic HTML or inquiry responses with broad cache rules. If you scale to multiple instances and need cache consistency, configure and test a shared Next.js cache handler.

Get the generated service URL and inspect the latest revision:

```bash
export SERVICE_URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
printf 'Service URL: %s\n' "$SERVICE_URL"
gcloud run services describe "$SERVICE" --region "$REGION"
gcloud run services logs read "$SERVICE" --region "$REGION" --limit 50
```

## 7. Configure a Custom Domain (Optional)

For a first production launch, use Cloud Run's generated HTTPS URL or follow Google's current Cloud Run domain-mapping/custom-domain guidance for the selected region and domain. A global external Application Load Balancer is an optional separate architecture, not required for Cloud Run HTTPS.

If creating an external Application Load Balancer, configure its serverless NEG and backend according to current Google Cloud instructions. Restrict caching to immutable `/_next/static/` assets and other deliberately public static files. Do not enable `CACHE_ALL_STATIC` or cache inquiry/API paths or dynamic HTML without validating Next.js cache headers and cache-key behavior. Avoid adding HSTS `preload` until you control every subdomain and have reviewed preload requirements.

Point DNS only after the cloud resource provides the required target. If using Cloudflare as DNS, ensure its SSL mode and proxy behavior are compatible with the origin certificate and avoid two competing redirect policies.

## 8. Cloud Build CI/CD (Optional)

The first deployment above is manual. For automatic deployment, create a Cloud Build trigger for the protected `main` branch and configure non-secret substitutions for region, repository, service, Sanity project ID, dataset, and canonical site URL. The trigger build should:

1. Build and tag the Docker image with `$COMMIT_SHA`, passing public build arguments.
2. Push the image to Artifact Registry.
3. Deploy that immutable tag to Cloud Run with the same runtime service account, secret references, ingress, port, and scaling configuration used above.

Use a dedicated Cloud Build service account with least-privilege Artifact Registry writer and Cloud Run deploy permissions, and grant it `iam.serviceAccountUser` on the Cloud Run runtime identity. Do not put Resend credentials in substitutions, `cloudbuild.yaml`, build arguments, or source control. Add or update secrets through Secret Manager and refer to their names at deploy time. Test the trigger against a non-production service before enabling production auto-deploy.

## 9. Production Verification

Run the repository checks before release:

```bash
npm run lint
npm exec tsc -- --noEmit
npm run build
npm exec --yes --package=tsx -- tsx --test scripts/inquiry.test.ts
npm exec --yes --package=tsx -- tsx --test scripts/seo.test.ts
```

Smoke-test the deployed service:

```bash
curl -I "$SERVICE_URL"
curl -sS "$SERVICE_URL/robots.txt"
curl -sS "$SERVICE_URL/sitemap.xml"
```

Verify in a browser that the homepage, products, a product detail, global reach, contact form validation, and an invalid URL behave correctly. Submit one real inquiry using controlled test contact information; confirm provider acceptance and inbox delivery separately. Check Cloud Run logs for startup errors and the service's 5xx rate. A successful HTTP response from Resend does not itself prove inbox delivery.

Before launch, set `GOOGLE_SITE_VERIFICATION` for the build if Search Console verification is needed. Confirm `NEXT_PUBLIC_SITE_URL`, DNS, Resend verified sender, contact information, legal/privacy text, and published Sanity content. The project currently contains sample catalog content and some company details that require review.

## 10. Operations and Rollback

```bash
# List revisions
gcloud run revisions list --service "$SERVICE" --region "$REGION"

# View recent service logs
gcloud run services logs read "$SERVICE" --region "$REGION" --limit 100

# Deploy a previously known-good immutable image tag
gcloud run deploy "$SERVICE" --image "${IMAGE}:<KNOWN_GOOD_TAG>" --region "$REGION"
```

Use Secret Manager secret version rotation and redeploy/revise the service when credentials change. Keep a known-good image tag and monitor Cloud Run, Cloud Build, Secret Manager, and Resend alerts.

## 11. Cost and Cleanup

Cloud Run may scale to zero, but Artifact Registry storage, logging, load balancers, domains, and network egress can create charges. A global external Application Load Balancer has a standing cost, so do not create one solely because the earlier estimate listed it. Check the [Google Cloud pricing calculator](https://cloud.google.com/products/calculator) and configure a budget alert; a budget alert is not a spending cap.

For a disposable test environment, delete only resources created for this deployment after confirming they are not shared:

```bash
gcloud run services delete "$SERVICE" --region "$REGION"
gcloud artifacts repositories delete "$REPOSITORY" --location "$REGION"
```

Delete runtime service accounts and secrets only after confirming no other service or deployment uses them. Secret deletion can be subject to recovery and retention policies.
