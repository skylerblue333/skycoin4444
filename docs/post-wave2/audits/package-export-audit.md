# Package export audit

Scope: verify completed Wave-2 domain APIs intended for reuse are actually reachable through their package/module entry points and are not stranded as unexported implementation files.

Acceptance criteria:
- inventory intended public APIs;
- detect missing or stale exports;
- identify accidental internal-only exposure;
- define import-level smoke tests;
- keep public API boundaries minimal and explicit.
