# SkyRunbooks — Slot #178

SkyRunbooks is an engineering-beta runbook definition and execution-plan core. It validates ordered operational steps and explicitly identifies approval-gated steps.

## SKYCOIN4444 integration contract

Incident, recovery, support, and operations adapters may store approved runbook definitions and call `planRunbook` before presenting or orchestrating steps.

## Boundaries

This package does not execute shell commands, access infrastructure, approve changes, persist runs, manage secrets, roll back operations, or prove that instructions are safe. Human/automation authorization and production execution remain integration responsibilities.
