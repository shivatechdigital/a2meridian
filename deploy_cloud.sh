#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
  cat <<'EOF'
Usage: ./deploy.sh <gcp|azure>

Deploy this Next.js app to Google Cloud Run or Azure Container Apps.
The script creates core container-hosting resources and prompts for the
Resend secrets. Custom domains, DNS, CDN/load balancer, and CI/CD triggers
are deliberately not provisioned automatically.

Prerequisites:
  Common: Node.js/npm, Docker Engine, git, curl
  GCP:    Google Cloud CLI (gcloud), authenticated account, project permissions
  Azure:  Azure CLI (az), authenticated account, subscription permissions

Examples:
  ./deploy.sh gcp
  ./deploy.sh azure
EOF
}

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

need_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

prompt_value() {
  local prompt="$1" default="${2:-}" value
  if [[ -n "$default" ]]; then
    read -r -p "$prompt [$default]: " value
    printf '%s' "${value:-$default}"
  else
    read -r -p "$prompt: " value
    [[ -n "$value" ]] || fail "$prompt is required"
    printf '%s' "$value"
  fi
}

prompt_secret() {
  local prompt="$1" value
  read -r -s -p "$prompt: " value
  printf '\n' >&2
  [[ -n "$value" ]] || fail "$prompt is required"
  printf '%s' "$value"
}

prompt_optional() {
  local prompt="$1" value
  read -r -p "$prompt (leave blank to skip): " value
  printf '%s' "$value"
}

confirm_deployment() {
  printf '\nThis will create or update billable cloud resources.\n'
  read -r -p "Type DEPLOY to continue: " answer
  [[ "$answer" == "DEPLOY" ]] || fail "Deployment cancelled"
}

set_image_tag() {
  local revision
  revision="$(git rev-parse --short=8 HEAD 2>/dev/null || printf 'nogit')"
  IMAGE_TAG="$(date -u +%Y%m%d%H%M%S)-${revision}"
}

run_preflight() {
  need_command npm
  need_command docker
  need_command git
  need_command curl

  printf '\nRunning lint and type checks...\n'
  npm run lint
  npm exec tsc -- --noEmit

  printf '\nBuilding the production container image...\n'
  docker build \
    --build-arg "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
    --build-arg "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
    --build-arg "NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION}" \
    --build-arg "NEXT_PUBLIC_SITE_URL=${SITE_URL}" \
    --build-arg "GOOGLE_SITE_VERIFICATION=${GOOGLE_SITE_VERIFICATION}" \
    -t "${IMAGE}:${IMAGE_TAG}" .
}

ensure_gcp_secret() {
  local name="$1" value="$2"
  if gcloud secrets describe "$name" --project "$PROJECT_ID" >/dev/null 2>&1; then
    printf '%s' "$value" | gcloud secrets versions add "$name" \
      --project "$PROJECT_ID" --data-file=- >/dev/null
  else
    gcloud secrets create "$name" \
      --project "$PROJECT_ID" \
      --replication-policy=automatic >/dev/null
    printf '%s' "$value" | gcloud secrets versions add "$name" \
      --project "$PROJECT_ID" --data-file=- >/dev/null
  fi
}

deploy_gcp() {
  need_command gcloud
  need_command docker

  PROJECT_ID="$(prompt_value 'Google Cloud project ID')"
  REGION="$(prompt_value 'Cloud Run region' 'asia-south1')"
  REPOSITORY="$(prompt_value 'Artifact Registry repository' 'a2-meridian-repo')"
  SERVICE="$(prompt_value 'Cloud Run service name' 'a2-meridian-web')"
  RUNTIME_SA="$(prompt_value 'Cloud Run runtime service account name' 'a2-meridian-runtime')"

  gcloud auth list --filter=status:ACTIVE --format='value(account)' | grep -q . \
    || fail 'No active gcloud identity. Run: gcloud auth login'
  gcloud config set project "$PROJECT_ID" >/dev/null

  IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}"
  set_image_tag
  confirm_deployment
  run_preflight

  printf '\nEnabling Google Cloud APIs...\n'
  gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    iam.googleapis.com \
    --project "$PROJECT_ID" >/dev/null

  if ! gcloud artifacts repositories describe "$REPOSITORY" \
    --location "$REGION" --project "$PROJECT_ID" >/dev/null 2>&1; then
    gcloud artifacts repositories create "$REPOSITORY" \
      --repository-format=docker \
      --location="$REGION" \
      --description='A2 Meridian website images' \
      --project "$PROJECT_ID" >/dev/null
  fi

  if ! gcloud iam service-accounts describe \
    "${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com" \
    --project "$PROJECT_ID" >/dev/null 2>&1; then
    gcloud iam service-accounts create "$RUNTIME_SA" \
      --display-name='A2 Meridian Cloud Run runtime' \
      --project "$PROJECT_ID" >/dev/null
  fi
  RUNTIME_SA_EMAIL="${RUNTIME_SA}@${PROJECT_ID}.iam.gserviceaccount.com"

  printf '\nEnter Resend settings. The API key will not be echoed.\n'
  RESEND_API_KEY="$(prompt_secret 'Resend API key')"
  INQUIRY_FROM_EMAIL="$(prompt_value 'Verified Resend sender email')"
  INQUIRY_TO_EMAIL="$(prompt_value 'Inquiry recipient email')"

  ensure_gcp_secret RESEND_API_KEY "$RESEND_API_KEY"
  ensure_gcp_secret INQUIRY_FROM_EMAIL "$INQUIRY_FROM_EMAIL"
  ensure_gcp_secret INQUIRY_TO_EMAIL "$INQUIRY_TO_EMAIL"
  unset RESEND_API_KEY

  for secret in RESEND_API_KEY INQUIRY_FROM_EMAIL INQUIRY_TO_EMAIL; do
    gcloud secrets add-iam-policy-binding "$secret" \
      --project "$PROJECT_ID" \
      --member="serviceAccount:${RUNTIME_SA_EMAIL}" \
      --role=roles/secretmanager.secretAccessor \
      --quiet >/dev/null
  done

  printf '\nAuthenticating Docker to Artifact Registry and pushing image...\n'
  gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet >/dev/null
  docker push "${IMAGE}:${IMAGE_TAG}"

  printf '\nDeploying to Cloud Run...\n'
  gcloud run deploy "$SERVICE" \
    --image "${IMAGE}:${IMAGE_TAG}" \
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
    --set-secrets 'RESEND_API_KEY=RESEND_API_KEY:latest,INQUIRY_FROM_EMAIL=INQUIRY_FROM_EMAIL:latest,INQUIRY_TO_EMAIL=INQUIRY_TO_EMAIL:latest' \
    --set-env-vars "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID},NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET},NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION},NEXT_PUBLIC_SITE_URL=${SITE_URL}"

  SERVICE_URL="$(gcloud run services describe "$SERVICE" \
    --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)')"
  verify_deployment "$SERVICE_URL"
  printf '\nDeployment complete.\nURL: %s\nImage: %s:%s\n' "$SERVICE_URL" "$IMAGE" "$IMAGE_TAG"
}

write_azure_secret_file() {
  local value="$1" path="$2"
  printf '%s' "$value" >"$path"
  chmod 600 "$path"
}

deploy_azure() {
  need_command az
  need_command docker

  SUBSCRIPTION_ID="$(prompt_value 'Azure subscription ID')"
  LOCATION="$(prompt_value 'Azure region' 'centralindia')"
  RESOURCE_GROUP="$(prompt_value 'Resource group name' 'a2-meridian-prod-rg')"
  ENVIRONMENT="$(prompt_value 'Container Apps environment name' 'a2-meridian-prod-env')"
  CONTAINER_APP="$(prompt_value 'Container App name' 'a2-meridian-web')"
  REGISTRY="$(prompt_value 'Globally unique lowercase ACR name')"
  IDENTITY="$(prompt_value 'User-assigned identity name' 'a2-meridian-runtime')"
  KEY_VAULT="$(prompt_value 'Globally unique Key Vault name')"

  [[ "$REGISTRY" =~ ^[a-z0-9]{5,50}$ ]] || fail 'ACR name must be 5-50 lowercase letters/numbers'
  [[ "$KEY_VAULT" =~ ^[a-zA-Z][a-zA-Z0-9-]{1,22}[a-zA-Z0-9]$ ]] || fail 'Key Vault name must be 3-24 letters, numbers, or hyphens; start with a letter and end with a letter/number'

  az account set --subscription "$SUBSCRIPTION_ID"
  az extension add --name containerapp --upgrade --only-show-errors
  for provider in Microsoft.App Microsoft.OperationalInsights Microsoft.ContainerRegistry Microsoft.ManagedIdentity Microsoft.KeyVault; do
    az provider register --namespace "$provider" --wait --only-show-errors
  done
  IMAGE="${REGISTRY}.azurecr.io/${CONTAINER_APP}"
  set_image_tag
  confirm_deployment
  run_preflight

  printf '\nCreating or reusing Azure resources...\n'
  az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

  if ! az acr show --name "$REGISTRY" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az acr create \
      --resource-group "$RESOURCE_GROUP" \
      --name "$REGISTRY" \
      --location "$LOCATION" \
      --sku Basic \
      --admin-enabled false \
      --output none
  fi

  if ! az containerapp env show --name "$ENVIRONMENT" \
    --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az containerapp env create \
      --name "$ENVIRONMENT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --output none
  fi

  if ! az identity show --name "$IDENTITY" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az identity create \
      --name "$IDENTITY" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --output none
  fi
  IDENTITY_ID="$(az identity show --name "$IDENTITY" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"
  IDENTITY_PRINCIPAL_ID="$(az identity show --name "$IDENTITY" --resource-group "$RESOURCE_GROUP" --query principalId --output tsv)"
  REGISTRY_ID="$(az acr show --name "$REGISTRY" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"

  if ! az role assignment list --scope "$REGISTRY_ID" --assignee "$IDENTITY_PRINCIPAL_ID" \
    --query "[?roleDefinitionName=='AcrPull'] | length(@)" --output tsv | grep -q '^1$'; then
    az role assignment create \
      --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
      --assignee-principal-type ServicePrincipal \
      --scope "$REGISTRY_ID" \
      --role AcrPull \
      --output none
  fi

  if ! az keyvault show --name "$KEY_VAULT" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az keyvault create \
      --name "$KEY_VAULT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --enable-rbac-authorization true \
      --output none
  fi
  KEY_VAULT_ID="$(az keyvault show --name "$KEY_VAULT" --resource-group "$RESOURCE_GROUP" --query id --output tsv)"
  if ! az role assignment list --scope "$KEY_VAULT_ID" --assignee "$IDENTITY_PRINCIPAL_ID" \
    --query "[?roleDefinitionName=='Key Vault Secrets User'] | length(@)" --output tsv | grep -q '^1$'; then
    az role assignment create \
      --assignee-object-id "$IDENTITY_PRINCIPAL_ID" \
      --assignee-principal-type ServicePrincipal \
      --scope "$KEY_VAULT_ID" \
      --role 'Key Vault Secrets User' \
      --output none
  fi

  printf '\nEnter Resend settings. The API key will not be echoed.\n'
  RESEND_API_KEY="$(prompt_secret 'Resend API key')"
  INQUIRY_FROM_EMAIL="$(prompt_value 'Verified Resend sender email')"
  INQUIRY_TO_EMAIL="$(prompt_value 'Inquiry recipient email')"

  local secret_dir
  secret_dir="$(mktemp -d)"
  chmod 700 "$secret_dir"
  trap 'rm -rf -- "$secret_dir"' EXIT
  write_azure_secret_file "$RESEND_API_KEY" "$secret_dir/resend-api-key"
  write_azure_secret_file "$INQUIRY_FROM_EMAIL" "$secret_dir/inquiry-from-email"
  write_azure_secret_file "$INQUIRY_TO_EMAIL" "$secret_dir/inquiry-to-email"
  unset RESEND_API_KEY

  az keyvault secret set --vault-name "$KEY_VAULT" --name resend-api-key \
    --file "$secret_dir/resend-api-key" --output none
  az keyvault secret set --vault-name "$KEY_VAULT" --name inquiry-from-email \
    --file "$secret_dir/inquiry-from-email" --output none
  az keyvault secret set --vault-name "$KEY_VAULT" --name inquiry-to-email \
    --file "$secret_dir/inquiry-to-email" --output none
  rm -rf -- "$secret_dir"
  trap - EXIT

  printf '\nAuthenticating Docker to ACR and pushing image...\n'
  az acr login --name "$REGISTRY"
  docker push "${IMAGE}:${IMAGE_TAG}"

  printf '\nCreating or updating Container App...\n'
  if ! az containerapp show --name "$CONTAINER_APP" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az containerapp create \
      --name "$CONTAINER_APP" \
      --resource-group "$RESOURCE_GROUP" \
      --environment "$ENVIRONMENT" \
      --user-assigned "$IDENTITY_ID" \
      --registry-server "${REGISTRY}.azurecr.io" \
      --registry-identity "$IDENTITY_ID" \
      --image "${IMAGE}:${IMAGE_TAG}" \
      --target-port 8080 \
      --ingress external \
      --min-replicas 0 \
      --max-replicas 5 \
      --cpu 1.0 \
      --memory 2.0Gi \
      --env-vars \
        "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
        "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
        "NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION}" \
        "NEXT_PUBLIC_SITE_URL=${SITE_URL}"
  else
    az containerapp identity assign \
      --name "$CONTAINER_APP" \
      --resource-group "$RESOURCE_GROUP" \
      --user-assigned "$IDENTITY_ID" \
      --output none
    az containerapp registry set \
      --name "$CONTAINER_APP" \
      --resource-group "$RESOURCE_GROUP" \
      --server "${REGISTRY}.azurecr.io" \
      --identity "$IDENTITY_ID" \
      --output none
    az containerapp update \
      --name "$CONTAINER_APP" \
      --resource-group "$RESOURCE_GROUP" \
      --image "${IMAGE}:${IMAGE_TAG}" \
      --set-env-vars \
        "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
        "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
        "NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION}" \
        "NEXT_PUBLIC_SITE_URL=${SITE_URL}"
  fi

  az containerapp secret set \
    --name "$CONTAINER_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --secrets \
      "resend-api-key=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/resend-api-key,identityref:${IDENTITY_ID}" \
      "inquiry-from-email=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/inquiry-from-email,identityref:${IDENTITY_ID}" \
      "inquiry-to-email=keyvaultref:https://${KEY_VAULT}.vault.azure.net/secrets/inquiry-to-email,identityref:${IDENTITY_ID}"
  az containerapp update \
    --name "$CONTAINER_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --set-env-vars \
      "NEXT_PUBLIC_SANITY_PROJECT_ID=${SANITY_PROJECT_ID}" \
      "NEXT_PUBLIC_SANITY_DATASET=${SANITY_DATASET}" \
      "NEXT_PUBLIC_SANITY_API_VERSION=${SANITY_API_VERSION}" \
      "NEXT_PUBLIC_SITE_URL=${SITE_URL}" \
      'RESEND_API_KEY=secretref:resend-api-key' \
      'INQUIRY_FROM_EMAIL=secretref:inquiry-from-email' \
      'INQUIRY_TO_EMAIL=secretref:inquiry-to-email'

  APP_URL="$(az containerapp show --name "$CONTAINER_APP" \
    --resource-group "$RESOURCE_GROUP" \
    --query properties.configuration.ingress.fqdn --output tsv)"
  verify_deployment "https://${APP_URL}"
  printf '\nDeployment complete.\nURL: https://%s\nImage: %s:%s\n' "$APP_URL" "$IMAGE" "$IMAGE_TAG"
}

verify_deployment() {
  local url="$1" attempt
  printf '\nWaiting for the public endpoint to respond...\n'
  for attempt in {1..18}; do
    if curl --fail --silent --show-error --output /dev/null "$url" 2>/dev/null; then
      printf 'HTTP endpoint is responding: %s\n' "$url"
      return 0
    fi
    sleep 10
  done
  printf 'The deployment command succeeded, but the endpoint did not return a successful response in 3 minutes: %s\n' "$url" >&2
  printf 'Inspect provider logs before retrying.\n' >&2
  return 1
}

if [[ $# -ne 1 ]]; then
  usage >&2
  exit 2
fi

PROVIDER="${1,,}"
if [[ "$PROVIDER" == "--help" || "$PROVIDER" == "-h" ]]; then
  usage
  exit 0
fi

SANITY_PROJECT_ID="$(prompt_value 'Sanity public project ID')"
SANITY_DATASET="$(prompt_value 'Sanity dataset' 'production')"
SANITY_API_VERSION="$(prompt_value 'Sanity API version' '2026-10-16')"
SITE_URL="$(prompt_value 'Canonical public site URL' 'https://a2meridian.com')"
GOOGLE_SITE_VERIFICATION="$(prompt_optional 'Google Search Console verification value')"

[[ "$SITE_URL" =~ ^https://[^/]+/?$ ]] || fail 'Canonical site URL must be an HTTPS origin without a path'

case "$PROVIDER" in
  gcp) deploy_gcp ;;
  azure) deploy_azure ;;
  *) usage >&2; fail "Unsupported provider: $PROVIDER (choose gcp or azure)" ;;
esac
