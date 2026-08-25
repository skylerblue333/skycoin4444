# SkyCredentials — Slot #116 / Lane 02

SkyCredentials is an **engineering-beta education credential metadata and lifecycle library**.

It validates issuer, subject, and achievement identifiers; issuance and optional expiration timestamps; issued/revoked state; and an optional caller-supplied SHA-256-style evidence digest.

## Integration contract

A SkyCourses or SkyClassroom integration may supply a verified course-completion record and create an `EducationCredential` that references the relevant achievement. Downstream display or eligibility logic may call `isCredentialActive` with an explicit evaluation time.

## Security and truth boundaries

SkyCredentials does not verify a learner's identity, accredit a course, cryptographically sign credentials, contact an educational institution, anchor records on a blockchain, or prove that an evidence hash corresponds to authentic source material. Those responsibilities require separately verified integrations and governance.

The current implementation is a deterministic local domain core with tests for lifecycle state, expiration, revocation, and digest-format validation.
