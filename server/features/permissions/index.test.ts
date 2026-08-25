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

  it("validates required rule fields", () => {
    expect(validatePermissionRule({ id: "", resource: "", action: "", effect: "allow" })).toEqual([
      "id is required",
      "resource is required",
      "action is required",
    ]);
  });
});
