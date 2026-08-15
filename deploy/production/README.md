# SKYCOIN4444 Production Deployment

This directory contains templates for deploying the real application to an authorized EC2 host. It is **IMPLEMENTED — NOT YET DEPLOYED**.

Use `../README.md` for the full sequence. The production service runs `node dist/index.js` with `NODE_ENV=production` supplied by the environment file. The proxy template expects a private Node listener on `127.0.0.1:3000` and certificates managed outside Git.

Required operator review before installation:

- Confirm the source SHA and database compatibility.
- Create the production environment file through approved secret management.
- Confirm DNS ownership and certificate issuance.
- Review the Nginx canonical-domain redirects.
- Confirm monitoring, backups, restore target, and rollback target.
- Preserve command output and timestamps as launch evidence.
