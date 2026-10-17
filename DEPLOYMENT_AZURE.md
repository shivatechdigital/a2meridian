# Deploy to Microsoft Azure

This guide deploys the A2 Meridian Next.js website as a Docker container in Azure Container Apps, stores the image in Azure Container Registry (ACR), and reads email credentials from Azure Key Vault. It is written for this repository's root-level `app/` layout and Next.js 16 configuration.

Commands use Azure CLI with Bash syntax (Cloud Shell, WSL, macOS, or Linux). Replace every `<PLACEHOLDER>` before running a command. Azure resources incur charges; review the pricing calculator and set a budget alert before provisioning.

## Deployment Scope

The repository includes `deploy.sh` for an interactive core deployment. From Ubuntu, run `bash deploy.sh azure`; it checks lint and types, builds the Docker image locally, creates or reuses the resource group, Container Apps environment, Container App, ACR, user-assigned managed identity, and Key Vault integration, then deploys and checks the HTTPS endpoint. It prompts for public Sanity/site settings and the Resend values. Each run stores new Key Vault versions for the prompted Resend values.

The script does not create a custom domain, DNS records, CDN, or CI/CD pipeline. The Container Apps HTTPS URL is sufficient for an initial smoke test. Review the steps below for manual deployment options and optional infrastructure.

## 1. Prerequisites and Resource Values

Install Azure CLI and sign in. Ensure the Container Apps CLI extension is current:

```bash
az login
az account set --subscription "<AZURE_SUBSCRIPTION_ID>"
az extension add --name containerapp --upgrade
```

Set resource names. ACR names must be globally unique, lowercase alphanumeric, and 5-50 characters long:

```bash
export LOCATION="centralindia"
export RESOURCE_GROUP="a2-meridian-prod-rg"
export ENVIRONMENT="a2-meridian-prod-env"
export CONTAINER_APP="a2-meridian-web"
export REGISTRY="<UNIQUE_LOWERCASE_ACR_NAME>"
export IDENTITY="a2-meridian-runtime"
export KEY_VAULT="<UNIQUE_KEY_VAULT_NAME>"
export IMAGE="${REGISTRY}.azurecr.io/${CONTAINER_APP}"
export SANITY_PROJECT_ID="<SANITY_PROJECT_ID>"
export SANITY_DATASET="production"
export SITE_URL="https://<YOUR_DOMAIN>"
```

Choose an Azure region close to your users and Sanity data. The example region is not a requirement. Key Vault names are also globally unique and have length/character restrictions.

## 2. Configure Standalone Output

Add `output: "standalone"` to the existing object in `next.config.ts`. Keep the existing `cacheComponents`, image, header, and Turbopack configuration; do not replace the file with a minimal config from another project. For example:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // Keep the existing options below this line.
```

The project uses the Sanity image CDN (`cdn.sanity.io`) and its existing image pattern should be retained. The app's photography is local and does not require `images.unsplash.com` for remote Next Image sources.

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

The build stage installs the complete lockfile dependency set because TypeScript and build tools may be needed by `next build`. The runtime image includes only the standalone server, public assets, and generated static assets. Never copy `.env.local` into the image.

Pass Sanity project ID, dataset, site URL, and optional Search Console verification at image build time. `NEXT_PUBLIC_*` values are inlined into client bundles during the build, so changing them requires a new image build. Google verification is read while metadata is generated; provide it during the build if used.

## 4. Validate the Container Locally

Build using the intended public configuration:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID="$SANITY_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_SANITY_DATASET="$SANITY_DATASET" \
  --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
  -t a2-meridian-web:local .
```

Run using a local ignored env file for the server-side email variables:

```bash
docker run --rm -p 8080:8080 --env-file .env.production.local a2-meridian-web:local
```

Never put real credentials in shell history or commit an env file. Open `http://localhost:8080`; inquiry requests should return HTTP 503 until the required Resend configuration is valid.

## 5. Create Registry, Identity, and Runtime Environment

Create the resource group, ACR, Container Apps environment, and a user-assigned identity:

```bash
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
az acr create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$REGISTRY" \
  --location "$LOCATION" \
  --sku Basic \
  --admin-enabled false

az containerapp env create \
  --name "$ENVIRONMENT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"

az identity create \
  --name "$IDENTITY" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"
```

Give the identity permission to pull from ACR. This command assumes the registry uses the standard registry-level Azure RBAC permission mode:

```bash
export IDENTITY_ID="$(az identity show --name "$IDENTITY" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"
export IDENTITY_PRINCIPAL_ID="$(az identity show --name "$IDENTITY" --resource-group "$RESOURCE_GROUP" --query principalId --output tsv)"
export REGISTRY_ID="$(az acr show --name "$REGISTRY" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"

az role assignment create \
  --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --scope "$REGISTRY_ID" \
  --role AcrPull
```

If ACR uses repository-level ABAC permissions, assign the matching repository-reader role and scope supported by that registry instead of `AcrPull`. Allow time for Azure role assignment propagation before creating the app.

Create a Key Vault using Azure RBAC authorization and grant the runtime identity read access to secrets:

```bash
az keyvault create \
  --name "$KEY_VAULT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --enable-rbac-authorization true

export KEY_VAULT_ID="$(az keyvault show --name "$KEY_VAULT" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"
az role assignment create \
  --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --scope "$KEY_VAULT_ID" \
  --role "Key Vault Secrets User"
```

Enter the following secret values in Azure Portal under **Key Vault > Objects > Secrets > Generate/Import**, or use your organization's approved secret-ingestion process. Use the names exactly as shown:

- `resend-api-key`: the Resend API key
- `inquiry-from-email`: an address on a verified Resend sending domain
- `inquiry-to-email`: the controlled recipient inbox for trade inquiries

Do not put secret values in `az` arguments, source control, deployment YAML, image build arguments, or CI substitutions. Save each Key Vault secret's versionless URI, for example `https://<KEY_VAULT>.vault.azure.net/secrets/resend-api-key`.

The current published Sanity catalog does not require an API token. `lib/queries.ts` uses the public published dataset with the configured project ID and dataset. If the dataset becomes private, implement an appropriate server-only token reader and reference that token from Key Vault; never expose it through a `NEXT_PUBLIC_` variable.

## 6. Build and Push the Image

`az acr build` builds remotely in ACR, so a local Docker daemon is not required for this step. Tag with a commit identifier to support rollback:

```bash
export TAG="$(git rev-parse --short HEAD)"
az acr build \
  --registry "$REGISTRY" \
  --image "${CONTAINER_APP}:${TAG}" \
  --build-arg "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
  --build-arg "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
  --build-arg "NEXT_PUBLIC_SITE_URL=${SITE_URL}" \
  .
```

If using Google Search Console verification, pass `--build-arg GOOGLE_SITE_VERIFICATION=<VERIFICATION_VALUE>` as well. Do not pass any private credentials as build arguments.

## 7. Create and Configure the Container App

Create the Container App with the user-assigned identity, private ACR image, and external HTTP ingress:

```bash
az containerapp create \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT" \
  --user-assigned "$IDENTITY_ID" \
  --registry-server "${REGISTRY}.azurecr.io" \
  --registry-identity "$IDENTITY_ID" \
  --image "${IMAGE}:${TAG}" \
  --target-port 8080 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 5 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --env-vars \
    "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
    "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
    "NEXT_PUBLIC_SANITY_API_VERSION=2026-10-16" \
    "NEXT_PUBLIC_SITE_URL=${SITE_URL}"
```

Define Key Vault references on the app. Use the versionless Key Vault secret URIs gathered above:

```bash
az containerapp secret set \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --secrets \
    "resend-api-key=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/resend-api-key,identityref:${IDENTITY_ID}" \
    "inquiry-from-email=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/inquiry-from-email,identityref:${IDENTITY_ID}" \
    "inquiry-to-email=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/inquiry-to-email,identityref:${IDENTITY_ID}"
```

Reference those secrets as the app's runtime environment variables:

```bash
az containerapp update \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "RESEND_API_KEY=secretref:resend-api-key" \
    "INQUIRY_FROM_EMAIL=secretref:inquiry-from-email" \
    "INQUIRY_TO_EMAIL=secretref:inquiry-to-email"
```

The app currently accepts an optional `INQUIRY_ALLOWED_ORIGIN` for deployments whose proxy origin differs from the browser origin. Set it only to the exact trusted site origin if needed; never use a wildcard.

The scale and resource values above are starting points, not a capacity guarantee. Container Apps replicas have separate ephemeral local caches. Do not place broad CDN caching in front of dynamic HTML or inquiry responses. If scaling to multiple replicas and requiring cross-instance cache consistency, configure and test a shared Next.js cache handler. Monitor memory under real traffic and tune replica bounds accordingly.

Get the HTTPS application URL and check the deployment:

```bash
export APP_URL="$(az containerapp show --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn --output tsv)"
printf 'Application URL: https://%s\n' "$APP_URL"
az containerapp show --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --output table
az containerapp logs show --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --follow false
```

## 8. Custom Domain and TLS (Optional)

Configure a custom hostname through **Container App > Ingress > Custom domains** in Azure Portal or the current `az containerapp hostname` commands. Add the DNS validation and routing records Azure presents, then bind a managed certificate or an approved certificate. Exact record requirements depend on the chosen hostname and environment.

Verify HTTPS and certificate status before switching production DNS. Keep the generated HTTPS endpoint available for rollback until the custom domain is confirmed. Configure redirects in one layer only to avoid loops.

## 9. CI/CD (Optional)

The commands above deploy manually. For automatic deployments, use GitHub Actions or Azure Pipelines with Microsoft Entra workload identity federation (OIDC), not a long-lived client secret. The pipeline should:

1. Build and push an immutable `$GITHUB_SHA` or commit-SHA image to ACR, passing only public build arguments.
2. Deploy that image tag to the existing Container App.
3. Preserve the app's user-assigned registry identity, Key Vault secret references, ingress, scaling, and runtime environment settings.

Grant the CI identity only the required ACR push and Container Apps deployment permissions. Grant `iam`-equivalent role assignment permissions only when the pipeline genuinely provisions identities or role assignments. Never put Key Vault values in workflow variables, build arguments, logs, or checked-in parameter files. Test the workflow against a non-production resource group before enabling production deployments.

## 10. Production Verification

Run the repository checks before release:

```bash
npm run lint
npm exec tsc -- --noEmit
npm run build
npm exec --yes --package=tsx -- tsx --test scripts/inquiry.test.ts
npm exec --yes --package=tsx -- tsx --test scripts/seo.test.ts
```

Smoke-test the deployed site:

```bash
curl -I "https://${APP_URL}"
curl -sS "https://${APP_URL}/robots.txt"
curl -sS "https://${APP_URL}/sitemap.xml"
```

Verify the homepage, products, a product detail, global reach, contact validation, and an invalid URL in a browser. Submit a real inquiry using contact details you control, and confirm both Resend acceptance and inbox delivery. Check Container Apps logs and revision health for startup failures and elevated 5xx responses.

Before launch, confirm canonical `NEXT_PUBLIC_SITE_URL`, DNS/TLS, the verified Resend sender, recipient inbox, contact details, legal/privacy content, and actual Sanity catalog data. The project includes sample catalog records and some company details that must be reviewed before public launch.

## 11. Operations, Rollback, and Cost

```bash
# List revisions and their status
az containerapp revision list --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --output table

# Follow application logs
az containerapp logs show --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --follow true

# Deploy a previously verified image tag
az containerapp update \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --image "${IMAGE}:<KNOWN_GOOD_TAG>"
```

Container Apps consumption charges depend on active/idle resources, requests, and allocated CPU/memory; ACR storage, Key Vault operations, Log Analytics ingestion/retention, networking, and custom domains can add costs. Check the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) for the selected region and workload. Set a budget alert; it is not a spending cap.

For a disposable environment, delete only resources created for this deployment after confirming the resource group contains nothing shared:

```bash
az group delete --name "$RESOURCE_GROUP" --yes --no-wait
```

Deleting the resource group removes all resources in it, including the registry, Key Vault, and logs. Do not run this against a shared production resource group.
