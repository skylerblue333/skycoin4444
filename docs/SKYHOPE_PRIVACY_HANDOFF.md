# HopeAI Impact private planning handoff

## Purpose

HopeAI includes Impact organizer-planning and contribution-intent surfaces. These surfaces are engineering-beta planning tools. They do not execute donations, move money, verify beneficiaries, verify nonprofit status, issue tax receipts, provide custody, or settle transactions.

## Branding compatibility

HopeAI is the only public Hope-branded product. The legacy `SkyHope` file name, storage key, type names, and `source=skyhope` handoff marker remain temporarily as internal compatibility identifiers so existing drafts and links are not broken. They must not be presented as a separate product in user-facing navigation or copy.

## Private HopeAI handoff

User-authored HopeAI Impact planning details must not be embedded directly in HopeAI route query parameters.

Why:

- query strings can be retained in browser history;
- query strings may appear in request/access logs;
- copied URLs can unintentionally carry user-authored details;
- referrer behavior can expose URL content to other destinations.

The HopeAI Impact surfaces therefore open the HopeAI workspace with a generic bounded review prompt. The detailed organizer or contribution brief is copied only after an explicit clipboard action, and the user decides whether to paste it into HopeAI.

## Browser draft storage

Fundraiser drafts use explicit browser-local storage only after domain validation.

The UI and implementation:

- apply the same domain limits used by campaign-plan generation before persistence;
- cap the serialized saved draft;
- discard malformed or oversized saved state;
- expose a clear-draft control;
- warn that browser storage is not encrypted beneficiary-record storage;
- discourage names, precise addresses, contact details, medical information, account identifiers, and other sensitive beneficiary data.

## Security and product boundary

This hardening reduces accidental disclosure and malformed local-state persistence. It does not establish encrypted storage, regulated records handling, external AI-provider availability, charity verification, payment execution, tax deductibility, identity verification, compliance certification, or production security certification.
