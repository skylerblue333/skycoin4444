#!/usr/bin/env bash
set -Eeuo pipefail

URL="${1:-http://127.0.0.1:3000/healthz}"
status="$(curl --silent --show-error --max-time 10 --output /tmp/skycoin4444-health-body --write-out '%{http_code}' "$URL" || true)"

if [[ "$status" == "200" ]] && grep -q '"ok":true' /tmp/skycoin4444-health-body; then
  echo "PASS healthz url=$URL status=$status"
  exit 0
fi

if [[ -z "$status" || "$status" == "000" ]]; then
  echo "BLOCKED — ENVIRONMENT UNAVAILABLE healthz url=$URL" >&2
else
  echo "FAIL healthz url=$URL status=$status" >&2
fi
exit 1
