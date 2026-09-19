import { describe, expect, it } from "vitest";
import { evaluatePermissions, validatePermissionRule } from "./index";

describe("SkyPermissions", () => {
  it("uses default deny when no rule matches", () => {
    const decision = evaluatePermissions([], {
      subject: { id: "user-1", roles: ["member"] },
      resource: "orders/1",
      action: "read",
    });
    expect(decision).toEqual({ allowed: false, matchedRuleIds: [], reason: "default-deny" });
  });

  it("allows a matching wildcard rule", () => {
    const decision = evaluatePermissions(
      [{ id: "allow-orders", resource: "orders/*", action: "read", effect: "allow" }],
      {
        subject: { id: "user-1", roles: ["member"] },
        resource: "orders/42",
        action: "read",
      },
    );
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("explicit-allow");
  });

  it("gives explicit deny precedence over allow", () => {
    const decision = evaluatePermissions(
      [
        { id: "allow-all", resource: "orders/*", action: "*", effect: "allow" },
        { id: "deny-delete", resource: "orders/*", action: "delete", effect: "deny" },
      ],
      {
        subject: { id: "user-1", roles: ["member"] },
        resource: "orders/42",
        action: "delete",
      },
    );
    expect(decision).toEqual({
      allowed: false,
      matchedRuleIds: ["deny-delete"],
      reason: "explicit-deny",
    });
  });

  it("matches deterministic context conditions", () => {
    const decision = evaluatePermissions(
      [
        {
          id: "tenant-reader",
          resource: "reports/*",
          action: "read",
          effect: "allow",
          conditions: { tenantId: "tenant-a" },
        },
      ],
      {
        subject: { id: "user-2", roles: ["analyst"] },
        resource: "reports/monthly",
        action: "read",
        context: { tenantId: "tenant-a" },
      },
    );
    expect(decision.allowed).toBe(true);
  });

  it("fails closed when context conflicts with subject attributes", () => {
    const decision = evaluatePermissions(
      [
        {
          id: "tenant-reader",
          resource: "reports/*",
          action: "read",
          effect: "allow",
          conditions: { tenantId: "tenant-b" },
        },
      ],
      {
        subject: {
          id: "user-2",
          roles: ["analyst"],
          attributes: { tenantId: "tenant-a" },
        },
        resource: "reports/monthly",
        action: "read",
        context: { tenantId: "tenant-b" },
      },
    );

    expect(decision).toEqual({
      allowed: false,
      matchedRuleIds: [],
      reason: "default-deny",
    });
  });

  it("handles adversarial wildcard patterns without regex backtracking", () => {
    const decision = evaluatePermissions(
      [
        {
          id: "adversarial-pattern",
          resource: "*a*a*a*a*a*a*a*a*a*a*b",
          action: "read",
          effect: "allow",
        },
      ],
      {
        subject: { id: "user-1", roles: ["member"] },
        resource: "a".repeat(10_000),
        action: "read",
      },
    );

    expect(decision.allowed).toBe(false);
  });

  it("validates required rule fields", () => {
    expect(validatePermissionRule({ id: "", resource: "", action: "", effect: "allow" })).toEqual([
      "id is required",
      "resource is required",
      "action is required",
    ]);
  });

  it("rejects unsupported effects at the runtime boundary", () => {
    expect(
      validatePermissionRule({
        id: "rule-1",
        resource: "*",
        action: "*",
        effect: "audit" as "allow",
      }),
    ).toContain("effect must be allow or deny");
  });
});
