# Production Operator Runbook

## Before deployment

Confirm the reviewed source SHA, EC2 target, OS/runtime versions, process user, private application port, reverse-proxy access, production environment file, database target, database backup, OAuth callback configuration, DNS ownership, certificate plan, monitoring destination, and rollback target. Do not proceed if any required external authorization is missing.

## Clean deployment sequence

```bash
export CONFIRM_PRODUCTION_DEPLOY=YES
export RELEASE_SHA=<reviewed-git-sha>
export BRANCH=manus/pipeline-stabilization-20260814
./deploy/production/scripts/deploy.sh
sudo systemctl status skycoin4444.service --no-pager
sudo journalctl -u skycoin4444.service -n 100 --no-pager
```

The deploy script installs from the lockfile, runs validation, builds the actual application, refuses to run production migrations automatically, updates the release symlink, restarts systemd, verifies that the service is active, and runs local health. It prints the deployed source SHA. The operator must preserve the output as evidence.

## Proxy and TLS

Install the reviewed Nginx template only after certificate files exist and DNS has been verified. Run `sudo nginx -t`, reload Nginx, then execute the domain/TLS runbook. Confirm the Node process is bound only to the intended private interface/security group and that public traffic enters through the proxy.

## Smoke tests

```bash
BASE_URL=https://skycoin4444.com ./deploy/production/scripts/smoke-test.sh
```

The script reports PASS, FAIL, or BLOCKED. It does not create accounts, fabricate data, or claim authenticated tests. Authenticated tests must be performed with authorized test accounts against the deployed backend and recorded separately.

## Evidence retention

For each release retain the source SHA, deployment timestamp, process status, health response, proxy test, DNS/TLS output, database migration output, authentication smoke result, backed-product smoke result, monitoring signal, backup identifier, restore result, and rollback result. Redact secrets and personal data.
