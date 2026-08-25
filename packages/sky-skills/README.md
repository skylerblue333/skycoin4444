# SkySkills — Wave 2 #121 (Lane 07)

SkySkills is an **engineering-beta skills taxonomy library** for careers, education, mentoring, and talent modules. It validates skill records, prevents ambiguous aliases, resolves normalized caller-supplied skill labels, and emits a deterministic profile-update contract.

## Integration
The `skills.profile_updated` event can be consumed by SkyTalent, SkyJobs, SkyMentorship, SkyCourses, or recommendation systems. Consumers remain responsible for authorization and persistence.

## Boundaries
This package does not infer skills from resumes, verify credentials, rank people, make hiring decisions, or claim AI assessment. Taxonomy curation, localization, persistence, consent, and consequential-decision controls belong to surrounding applications.
