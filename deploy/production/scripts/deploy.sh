#!/usr/bin/env bash
set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/srv/skycoin4444}"
REPO_URL="${REPO_URL:-https://github.com/skylerblue333/skycoin4444.git}"
BRANCH="${BRANCH:-manus/pipeline-stabilization-20260814}"
RELEASE_SHA="${RELEASE_SHA:-$(git rev-parse HEAD 2>/dev/null || true)}"
SERVICE_NAME="${SERVICE_NAME:-skycoin4444.service}"

if [[ "${CONFIRM_PRODUCTION_DEPLOY:-}" != "YES" ]]; then
  echo "Refusing deployment: set CONFIRM_PRODUCTION_DEPLOY=YES after reviewing the release and database plan." >&2
  exit 2
fi

if [[ -z "$RELEASE_SHA" ]]; then
  echo "RELEASE_SHA is required when running outside a Git checkout." >&2
  exit 2
fi

command -v git >/dev/null || { echo "git is required" >&2; exit 1; }
command -v pnpm >/dev/null || { echo "pnpm is required" >&2; exit 1; }
command -v node >/dev/null || { echo "node is required" >&2; exit 1; }

"$(dirname "$0")/preflight.sh"

mkdir -p "$APP_ROOT/releases" "$APP_ROOT/shared"
release_dir="$APP_ROOT/releases/$RELEASE_SHA"

git clone --branch "$BRANCH" --single-branch "$REPO_URL" "$release_dir"
cd "$release_dir"
git checkout --detach "$RELEASE_SHA"
pnpm install --frozen-lockfile
pnpm run validate
pnpm build

if [[ "${RUN_PRODUCTION_MIGRATIONS:-NO}" == "YES" ]]; then
  echo "Migration execution is intentionally not automated by this script." >&2
  echo "Run the reviewed, provider-approved migration procedure separately after a verified backup." >&2
  exit 3
fi

ln -sfn "$release_dir" "$APP_ROOT/current.next"
ln -sfn "$release_dir" "$APP_ROOT/current"
sudo systemctl daemon-reload
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl is-active --quiet "$SERVICE_NAME"

"$APP_ROOT/current/deploy/production/health/healthcheck.sh" "${HEALTH_URL:-http://127.0.0.1:3000/healthz}"
printf 'deployed_source_sha=%s\n' "$RELEASE_SHA"
