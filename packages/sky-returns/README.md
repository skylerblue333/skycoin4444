# SkyReturns (#141)

SkyReturns is a bounded engineering-beta return lifecycle domain core for SKYCOIN4444. It validates return requests, enforces deterministic state transitions, and emits the provider-neutral `sky.returns.decision.v1` integration contract.

## Integration contract

`createReturnDecision()` creates a versioned approval/rejection decision for downstream order, fulfillment, ledger, notification, and support adapters. `transitionReturn()` provides a deterministic reference lifecycle for requested → approved/rejected → received → refunded states.

## Security and product boundaries

This package does not issue refunds, move money, alter live orders, contact carriers, verify physical receipt, authorize users, enforce tenant isolation, perform fraud analysis, calculate taxes, integrate with payment processors, or represent production deployment. Callers must enforce authorization and connect approved lifecycle transitions to separately verified order/payment systems.
