# Dependabot Alert #121 Evidence

**Repository:** `skylerblue333/skycoin4444`

**Alert:** GitHub Dependabot #121, esbuild development-server CORS vulnerability.

**Authenticated GitHub evidence observed on 2026-08-16:**

| Field | Value |
|---|---|
| Package | `esbuild` |
| Severity | Moderate, 5.3/10 |
| Affected versions | `<= 0.24.2` |
| Patched version | `0.25.0` |
| Dependency path | Transitive through `drizzle-kit` and direct development tooling |
| GitHub status | Open alert with patch available |

**Repository verification:**

The current `package.json` declares `esbuild` as `^0.28.1`. The committed `pnpm-lock.yaml` applies the repository override `esbuild: 0.25.12`, and the installed dependency graph resolves `esbuild@0.25.12` for the direct package, `drizzle-kit`, Vite, tsx, and Vitest. This is above GitHub's patched version `0.25.0`. `pnpm audit --json` reports zero vulnerabilities across 670 resolved dependencies.

**Remediation status:** The repository contains an earlier remediation commit `d1ff3da` titled `fix: remediate esbuild security advisory`, and the current branch includes its lockfile resolution. Alert #121 should be formally closed or dismissed in GitHub Security by an authorized repository owner as remediated/stale after confirming the current default branch dependency graph. Local audit results alone are not treated as sufficient closure evidence.


## Closure evidence

On 2026-08-16, the authenticated repository owner dismissed alert #121 in GitHub Security using the reason **A fix has already been started** and the comment documenting the current `esbuild` versions and prior remediation commit. GitHub displayed **Successfully dismissed 1 alert** and the alert status changed to **Dismissed**, with a **Reopen alert** control available. The alert was dismissed by `skylerblue333` on Aug 16, 2026.
