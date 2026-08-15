# Rollback Runbook

Rollback is not verified until it has been drilled in staging. A Git SHA alone is not enough; retain the deployed SHA, previous known-good SHA, build artifact identity, deployment timestamp, and database compatibility decision.

## Procedure

1. Declare the failed release and record its SHA, time, symptoms, and operator.
2. Stop or drain the current deployment if required and preserve logs.
3. Point `/srv/skycoin4444/current` to the previous known-good release directory or deploy the previous reviewed SHA using the same clean deployment process.
4. Restart the systemd service and verify `systemctl is-active skycoin4444.service`.
5. Verify `GET /healthz`, HTTPS, canonical redirects, secure cookies, and the production proxy headers.
6. Verify authentication boundaries, logout, and session behavior.
7. Verify Marketplace catalog/product detail, Profile, Messages, Community, Notifications, and Comments where enabled.
8. Confirm database compatibility. Do not roll back application code across an incompatible migration without an approved forward-fix or database recovery plan.
9. Communicate the rollback result and preserve logs/evidence.

## Staging drill

Use the separate staging systemd and Nginx templates. Deploy a known-good SHA, introduce a controlled release change, execute the rollback, and record start/end times, health result, authentication result, backed-product result, and any database considerations. Mark the drill `VERIFIED` only after the complete sequence succeeds.
