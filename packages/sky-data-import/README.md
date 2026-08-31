# SkyDataImport — Slot #175

SkyDataImport is an engineering-beta import validation/planning core. It validates source metadata, record counts, formats, and SHA-256-shaped checksums before returning a bounded import plan.

## SKYCOIN4444 integration contract

Storage, profile, catalog, and migration adapters may verify an uploaded object independently, then call `planImport` before schema mapping and persistence.

## Boundaries

This package does not upload, parse, scan, decrypt, verify checksum contents, map schemas, authorize writes, or persist records. Malware scanning, content validation, durable transactions, and rollback remain integration responsibilities.
