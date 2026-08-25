# SkyJobs (#122)

SkyJobs is an engineering-beta job-posting and skill-matching domain core for SKYCOIN4444. It validates postings, normalizes skills, calculates a deterministic transparent overlap score, and defines a minimal posting lifecycle.

## Integration
Use `validateJobPosting()` for posting validation, `matchCandidate()` only as an informational skill-overlap helper, and `canTransitionJob()` for bounded lifecycle checks.

## Limitations
This package does not publish jobs, store applications, verify identities, contact applicants, rank people for employment decisions, or make hiring decisions. It has no external provider connectivity or production deployment. Callers remain responsible for persistence, authentication, authorization, privacy, accessibility, moderation, and human review.
