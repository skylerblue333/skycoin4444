# SkyRecoveryControl (#163)

Bounded engineering-beta recovery-plan control domain core for Wave 2 Lane 13.

Capabilities: normalized recovery-plan creation, explicit approval gate, deterministic execution record with strict UTC timestamp validation, cancellation rules, version increments, focused tests, and provider-neutral `sky.recovery.plan.changed.v1` identifier.

Boundaries: no backup creation, restore execution, infrastructure failover, cloud/provider calls, credential access, destructive mutation, incident automation, production deployment, disaster-recovery certification, or compliance guarantee.
