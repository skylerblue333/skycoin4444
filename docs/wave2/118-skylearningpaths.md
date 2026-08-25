# SkyLearningPaths (#118)

SkyLearningPaths is an engineering-beta learning progression domain core.

## Capability
- validates step identifiers, durations, and prerequisite references
- resolves deterministic available/blocked next steps from a progress snapshot
- calculates completion percentage using known path steps only

## Integration contract
Callers provide a `LearningPath` and externally persisted `ProgressSnapshot`. The module returns deterministic progression decisions and does not mutate learner records.

## Important limitations
No LMS provider, accreditation, grading authority, instructor verification, durable learner persistence, recommendation model, or production deployment is provided or claimed.
