# Domains, DNS, and TLS Runbook

## Approved domains

The exact approved set is `skycoin4444.com`, `skycoin4444.net`, `skycoin4444.shop`, and `skycoin44.token`. The recommended canonical domain is `https://skycoin4444.com`; the Nginx template redirects the other three to it. This choice requires owner approval and must not be installed blindly.

## DNS procedure

Before changing records, export or document the existing records for each zone and confirm ownership with the registrar/DNS provider. Point the selected production hostnames to the real EC2 public endpoint using the provider-appropriate A/AAAA/CNAME records. Do not overwrite unrelated records. Wait for propagation and verify from more than one resolver.

Example verification commands after authorization:

```bash
for host in skycoin4444.com skycoin4444.net skycoin4444.shop skycoin44.token; do
  echo "=== $host ==="
  dig +short A "$host"
  dig +short AAAA "$host"
  curl -I --max-time 15 "http://$host/healthz"
done
```

A domain is not verified merely because a DNS panel displays a record. Record the resolved target, resolver, timestamp, and HTTP result in `PRODUCTION_READINESS.md`.

## TLS procedure

Use an approved certificate authority, such as Certbot/Let’s Encrypt, only after all four hostnames resolve to the authorized proxy and port 80/443 access is permitted. The certificate must include every hostname that will terminate on the proxy. Store private keys outside Git with restrictive permissions.

After issuance, test both the certificate and application behavior:

```bash
for host in skycoin4444.com skycoin4444.net skycoin4444.shop skycoin44.token; do
  echo "=== $host ==="
  curl -I --max-time 15 "https://$host/healthz"
  openssl s_client -connect "$host:443" -servername "$host" </dev/null 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
  curl -I --max-time 15 "http://$host/healthz"
done
```

Require a successful HTTPS response, a valid hostname-matching certificate, and an intentional HTTP-to-HTTPS/canonical redirect. Record failures as `FAILED`; never convert them into a configuration-only pass.
