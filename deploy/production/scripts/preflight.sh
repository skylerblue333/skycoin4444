#!/usr/bin/env bash
set -Eeuo pipefail

required=(NODE_ENV PORT VITE_APP_ID JWT_SECRET DATABASE_URL OAUTH_SERVER_URL)
missing=0

for key in "${required[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "FAIL missing environment variable: $key" >&2
    missing=$((missing + 1))
  else
    echo "PASS environment variable present: $key"
  fi
done

if [[ "${NODE_ENV:-}" != "production" ]]; then
  echo "FAIL NODE_ENV must be production for this preflight" >&2
  missing=$((missing + 1))
fi

for command_name in node pnpm git curl; do
  if command -v "$command_name" >/dev/null 2>&1; then
    echo "PASS command available: $command_name"
  else
    echo "FAIL command missing: $command_name" >&2
    missing=$((missing + 1))
  fi
done

if (( missing > 0 )); then
  echo "preflight_result=FAIL missing_or_invalid=$missing" >&2
  exit 1
fi

echo "INFO database connectivity, migrations, OAuth, DNS, TLS, monitoring, backups, restore, and rollback require separate real-environment checks."
echo "preflight_result=PASS"
