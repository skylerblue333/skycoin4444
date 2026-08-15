# SKYCOIN4444 Deployment Package

This package prepares the canonical monolith for an authorized EC2 deployment. It contains operational templates and runbooks, not evidence that production infrastructure exists. No file in this directory creates DNS records, issues certificates, connects to a production database, or claims a successful deployment.

## Current source

The source of truth is the Git branch `manus/pipeline-stabilization-20260814`. The package was prepared from source SHA `d3b412e`; the application runtime hardening is in `4310420`. The production deployed SHA remains **NONE**.

## Target architecture

```text
Approved domains
  -> DNS
  -> Nginx HTTPS termination and redirects
  -> private Node upstream on 127.0.0.1:3000
  -> NODE_ENV=production node dist/index.js
  -> MySQL/TiDB via DATABASE_URL
```

The recommended canonical hostname is `https://skycoin4444.com`. The current Nginx template redirects `.net`, `.shop`, and `.token` to the canonical hostname. This strategy must be reviewed against domain ownership and tested after DNS/TLS configuration; the template is not operational proof.

## Required host assumptions

The package assumes Ubuntu-like Linux, Node.js compatible with the repository lockfile, pnpm, Git, Nginx, systemd, curl, and a MySQL/TiDB-compatible production database. The application directory is `/srv/skycoin4444`, the service user is `skycoin`, the private upstream port is `3000`, and the environment files are `/etc/skycoin4444/production.env` and `/etc/skycoin4444/staging.env`. Change these only through an approved infrastructure change review.

## Deployment sequence

1. Confirm EC2, DNS, database, certificate, and secret-management authorization. Do not begin with production credentials in chat.
2. Create the `skycoin` user, `/srv/skycoin4444`, `/etc/skycoin4444`, and secure environment files with mode `0600`.
3. Install the systemd unit from `production/systemd/skycoin4444.service` and review its hardening paths.
4. Confirm the production database backup exists and the migration plan is approved. The deployment script refuses to run migrations automatically.
5. Run `CONFIRM_PRODUCTION_DEPLOY=YES RELEASE_SHA=<reviewed-sha> ./production/scripts/deploy.sh` from a trusted checkout or operator workstation with the required Git and host access.
6. Install and validate `production/nginx/skycoin4444.conf` only after DNS and certificate paths are real. Run `nginx -t`, reload Nginx, and confirm the Node process is not directly exposed by the security group.
7. Execute `production/health/healthcheck.sh http://127.0.0.1:3000/healthz`, then the domain smoke test after HTTPS is active.
8. Perform the authenticated smoke-test sequence with approved test accounts and test records. The repository script does not fabricate credentials or backend results.

## Files

| Path | Purpose |
|---|---|
| `production/systemd/skycoin4444.service` | Production process manager unit |
| `staging/systemd/skycoin4444-staging.service` | Staging process manager unit for rollback drills |
| `production/nginx/skycoin4444.conf` | Four-host HTTPS, redirect, proxy, WebSocket, and health template |
| `staging/nginx/skycoin4444-staging.conf` | Staging proxy template |
| `production/.env.example` | Sanitized production variable names |
| `staging/.env.example` | Sanitized staging variable names |
| `production/scripts/deploy.sh` | Clean checkout, frozen install, validation, build, release, restart |
| `production/health/healthcheck.sh` | Direct liveness check with explicit failure/block behavior |
| `production/scripts/smoke-test.sh` | Domain and critical-route smoke-test scaffold |
| `docs/domains-and-tls.md` | DNS, canonical-domain, certificate, and verification procedure |
| `docs/database-migrations.md` | Safe migration and schema verification procedure |
| `docs/backup-restore.md` | Backup, retention, restore, and evidence procedure |
| `docs/rollback.md` | Application rollback and staging-drill procedure |
| `docs/monitoring.md` | Monitoring, logs, metrics, and alert requirements |
| `docs/production-runbook.md` | Operator runbook and external evidence checklist |

## Safety rules

The package intentionally does not include production secrets, database credentials, DNS API tokens, certificate private keys, fake monitoring, fake backup artifacts, or simulated smoke-test passes. The application’s unsupported checkout, payment, escrow, shipping, seller-verification, wallet, blockchain, AI-agent, analytics, and economy functionality remains unavailable.

## Current evidence state

This package is **IMPLEMENTED — NOT YET DEPLOYED**. The overall project remains **RED — DO NOT LAUNCH** until the external evidence requirements in the runbooks are completed.
