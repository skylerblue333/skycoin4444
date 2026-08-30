# SkyTrust (#70)

Engineering-beta deterministic trust assessment domain core for SKYCOIN4444 Wave 2.

`assessTrust` validates bounded 0–100 signals for one subject, validates real UTC instants, rejects signals observed after the assessment time, averages scores deterministically, and derives a simple source-diversity confidence value. The provider-neutral integration contract is `sky.trust.assessed.v1`.

## Boundaries

This library does not perform identity verification, reputation-provider connectivity, fraud determination, authorization, compliance certification, durable persistence, production deployment, or any guarantee that a subject is trustworthy. Scores are advisory inputs only and callers must define their own policy and review process.
