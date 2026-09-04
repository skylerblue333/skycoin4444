# Fatal Runtime Monitoring

## Purpose

SKYCOIN4444 records a minimal synchronous diagnostic when the Node.js process reaches an uncaught fatal JavaScript exception.

This feature is observation only. It is deliberately not a crash-recovery mechanism.

## Node fatal boundary

The canonical entry point registers:

`uncaughtExceptionMonitor`

Node emits this monitor event before its normal uncaught-exception handling. Registering the monitor does not replace the default fatal behavior when no `uncaughtException` recovery listener is installed.

Under Node's default unhandled-rejection mode, an unhandled rejection that becomes an uncaught exception is reported with origin `unhandledRejection`.

SKYCOIN4444 intentionally does **not** register:

- `uncaughtException`;
- `unhandledRejection`;
- an uncaught-exception capture callback;
- an async cleanup/recovery workflow from the fatal monitor.

The process therefore remains under Node's normal fatal-exception termination semantics.

## Synchronous record

The fatal monitor writes synchronously to stderr.

The record contains only:

- contract: `skycoin4444.runtime-fatal.v1`;
- origin: `uncaughtException` or `unhandledRejection`;
- bounded sanitized error summary;
- timestamp;
- `recoveryAttempted=false`;
- `defaultCrashBehaviorPreserved=true`.

No stack trace is added by the SKYCOIN4444 record.

Node may still print its own normal fatal stack trace as part of default crash handling; this module does not suppress or replace that behavior.

## Redaction

The application record reuses the bounded startup-error sanitizer.

It redacts:

- URI username/password credential segments;
- common `password`, `passwd`, and `pwd` query values.

The summary is flattened to one line and bounded in length.

This is targeted redaction, not a proof that every possible secret shape can never appear in a Node-generated stack trace or third-party error.

## Logging failure

The monitor catches failures from its own synchronous writer.

A failure to emit the application record must not throw a second exception from the monitor and interfere with Node's original fatal path.

## Restart boundary

This repository does not attempt to restart the process after an uncaught exception.

If automatic crash restart is required, use and verify an external process supervisor or hosting-platform restart policy.

Repository source cannot prove that such an external restart policy is configured.

## Difference from startup failure

Caught startup errors are handled by `handleStartupFailure()`, which sets a nonzero exit code and attempts canonical MySQL-pool cleanup.

An uncaught runtime exception is not treated as a normal startup/shutdown condition and is not routed into asynchronous graceful cleanup.

## Verification

Focused tests assert:

- fatal summaries redact URI/password material;
- records omit application-added stack traces;
- monitoring registers only `uncaughtExceptionMonitor`;
- no `uncaughtException` listener is installed;
- no `unhandledRejection` listener is installed;
- monitor-writer failure does not throw;
- `unhandledRejection` origin can be represented through the monitor event.

Canonical exact-head CI remains the repository-wide typecheck, lint, test, integration, build, marker, credential-scan, and dependency-audit gate.

## Limitations

This feature does not establish:

- a deployed external error-monitoring provider;
- durable crash-log retention;
- automatic process restart;
- crash-loop protection;
- core-dump management;
- complete secret scrubbing of Node or third-party output;
- graceful recovery from corrupt in-memory state;
- production availability certification.
