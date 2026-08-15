# Monitoring and Alerting Runbook

Monitoring must observe the real deployed service rather than exist only as unused configuration. The minimum launch signals are application availability, `/healthz`, HTTP 5xx rate, process status/restarts, CPU, memory, disk, database connectivity, and application error logs.

## Required signals

| Signal | Suggested source | Alert condition |
|---|---|---|
| Application liveness | HTTPS probe to `/healthz` | Consecutive non-200 or timeout |
| HTTP failures | Nginx/access logs or edge metrics | Sustained 5xx rate or sudden spike |
| Process state | systemd/CloudWatch agent | Service inactive or repeated restarts |
| CPU | EC2/CloudWatch | Sustained threshold agreed by operator |
| Memory | CloudWatch agent or host exporter | Sustained threshold or OOM event |
| Disk | EC2/CloudWatch agent | Low free space threshold |
| Database | Provider health/connection probe | Unavailable or repeated connection failures |
| Application errors | journal/Nginx structured logs | Error-rate threshold and high-severity events |

Configure notifications to an approved operational channel. Do not log passwords, JWTs, access tokens, seed phrases, private keys, or sensitive personal information. Retain logs according to the approved policy and restrict access.

## Verification

After installation, deliberately verify at least one healthy probe, one observable application log, one process-restart signal, and one alert delivery path. Record the monitoring provider, metric names, alarm identifiers, and timestamps. Until these signals are observed from the real host, status remains `BLOCKED — EXTERNAL ACCESS REQUIRED`.
