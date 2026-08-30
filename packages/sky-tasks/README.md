# SkyTasks (#127)

Bounded engineering-beta task lifecycle domain core for Wave 2 Lane 13.

Capabilities: normalized task creation, immutable project references, assignment, deterministic todo → in-progress → done lifecycle, cancellation rules, optimistic version increments, focused tests, and provider-neutral event identifier `sky.task.changed.v1`.

Boundaries: no durable task database, background scheduler, reminders, worker execution, authentication, tenant isolation, external project mutation, notifications, production deployment, or compliance guarantee.
