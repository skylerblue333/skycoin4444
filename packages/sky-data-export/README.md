# SkyDataExport — Slot #174

SkyDataExport is an engineering-beta export planning/manifest core. It validates a bounded dataset/field request and produces a deterministic export manifest.

## SKYCOIN4444 integration contract

Privacy, profile, analytics, and storage adapters may authorize a request, call `planExport`, then execute the resulting manifest against their own data stores.

## Boundaries

This package does not read data, serialize files, sign URLs, authenticate users, enforce privacy rights, redact sensitive fields, or provide storage/delivery infrastructure. Authorization and data handling remain integration responsibilities.
