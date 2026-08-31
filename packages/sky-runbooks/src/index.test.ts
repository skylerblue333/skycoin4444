import { describe, expect, it } from "vitest";
import { planRunbook } from "./index";

describe("SkyRunbooks", () => {
  it("preserves deterministic step order and approval boundaries", () => {
    expect(
      planRunbook({
        id: "db-recovery",
        steps: [
          { id: "inspect", instruction: "Inspect replica health." },
          { id: "promote", instruction: "Promote the verified replica.", requiresApproval: true },
        ],
      })
    ).toEqual({
      runbookId: "db-recovery",
      stepIds: ["inspect", "promote"],
      approvalStepIds: ["promote"],
    });
  });

  it("rejects duplicate steps", () => {
    expect(() =>
      planRunbook({
        id: "db-recovery",
        steps: [
          { id: "inspect", instruction: "One" },
          { id: "inspect", instruction: "Two" },
        ],
      })
    ).toThrow("duplicate step id");
  });

  it("rejects empty instructions", () => {
    expect(() => planRunbook({ id: "db-recovery", steps: [{ id: "inspect", instruction: " " }] })).toThrow("invalid instruction");
  });
});
