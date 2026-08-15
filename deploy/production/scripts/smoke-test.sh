#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="${BASE_URL:-https://skycoin4444.com}"

check_http() {
  local label="$1" url="$2" expected="$3"
  local code
  code="$(curl --silent --show-error --location --max-time 15 --output /tmp/skycoin4444-smoke-body --write-out '%{http_code}' "$url" || true)"
  if [[ "$code" == "$expected" ]]; then
    echo "PASS $label status=$code url=$url"
    return 0
  fi
  if [[ "$code" == "000" ]]; then
    echo "BLOCKED — ENVIRONMENT UNAVAILABLE $label url=$url"
  else
    echo "FAIL $label status=$code url=$url"
  fi
  return 1
}

failures=0
check_http health "${BASE_URL%/}/healthz" 200 || failures=$((failures + 1))
check_http homepage "${BASE_URL%/}/" 200 || failures=$((failures + 1))

for host in skycoin4444.com skycoin4444.net skycoin4444.shop skycoin44.token; do
  check_http "domain-$host" "https://$host/healthz" 200 || failures=$((failures + 1))
done

echo "INFO authenticated registration/login/logout/protected-route checks require a deployed environment and approved test credentials."
echo "INFO Marketplace/Profile/Messages/Community/Notifications/Comments checks require a deployed environment and test data authorization."
echo "INFO checkout, payments, escrow, shipping, seller verification, unsupported wallet/blockchain/AI/analytics operations must remain unavailable."

if (( failures > 0 )); then
  echo "smoke_result=FAIL_OR_BLOCKED failures=$failures" >&2
  exit 1
fi

echo "smoke_result=PASS"
