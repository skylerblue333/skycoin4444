# Engineering-Beta Code-Debt and Credential-Pattern Audit

## Scope

This release-hardening check covers the **current tracked Git tree**. It is intentionally narrower than a full secret-management, Git-history, or security audit.

## Credential-pattern scan

`pnpm run check:secrets` scans tracked, text-like files for a small set of high-confidence credential/private-key patterns. The scanner reports only a rule identifier and repository path. It does **not** print matched credential text.

Current high-confidence rule families include:

- PEM private-key headers;
- AWS `AKIA` access-key identifiers;
- GitHub token prefixes;
- Slack token prefixes.

A match fails CI so it must be reviewed. A confirmed credential must be rotated/revoked as appropriate; removing it from the current file is not proof that Git history or downstream systems are clean.

### Deliberate limitations

The scan does not establish:

- Git-history cleanup;
- entropy-based secret discovery;
- provider-side credential validity/revocation;
- production secret-store configuration;
- absence of all possible credential formats.

## Explicit debt-marker audit

`pnpm run audit:markers` classifies explicit `TODO`, `FIXME`, `HACK`, `XXX`, `MOCK:`, and `PLACEHOLDER:` tags in tracked text files.

Classifications:

- **blocker** — marker is in a high-risk security, identity, financial, persistence, migration, storage, workflow, or CI path;
- **accepted-beta** — marker is in a clearly test/fixture/example/demo-oriented path;
- **cleanup** — explicit debt elsewhere that should be tracked but does not by itself fail the engineering-beta gate.

Blocker markers fail CI. Accepted-beta and cleanup markers remain visible in CI output so they cannot silently disappear from release review.

Ordinary UI `placeholder=` properties or general prose using the word `mock` are intentionally not treated as debt; only explicit marker tags are classified.

## Release interpretation

A green result means the current tracked tree has no high-confidence credential-pattern findings under the listed rules and no explicit debt markers in the classified high-risk paths. It is not a production security certification and does not replace manual review, history scanning, threat modeling, penetration testing, or provider/deployment verification.
