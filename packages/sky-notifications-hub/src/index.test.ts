import { describe, expect, it } from "vitest";
import { planNotification } from "./index";

describe("planNotification", () => {
  it("normalizes and de-duplicates provider-neutral plans", () => {
    expect(planNotification({
      id: "n1",
      recipientId: "user-1",
      template: "welcome",
      channels: ["push", "email", "push"],
      variables: { name: "Skyler", code: "4444" },
    })).toEqual({
      contract: "sky.notifications.plan.v1",
      id: "n1",
      recipientId: "user-1",
      template: "welcome",
      channels: ["email", "push"],
      variables: { code: "4444", name: "Skyler" },
    });
  });

  it("rejects missing identifiers, templates, channels and unsupported channels", () => {
    expect(() => planNotification({ id: "", recipientId: "u", template: "t", channels: ["email"] })).toThrow("id");
    expect(() => planNotification({ id: "n", recipientId: "", template: "t", channels: ["email"] })).toThrow("recipientId");
    expect(() => planNotification({ id: "n", recipientId: "u", template: "", channels: ["email"] })).toThrow("template");
    expect(() => planNotification({ id: "n", recipientId: "u", template: "t", channels: [] })).toThrow("channels");
    expect(() => planNotification({ id: "n", recipientId: "u", template: "t", channels: ["fax" as never] })).toThrow("unsupported channel");
  });
});
