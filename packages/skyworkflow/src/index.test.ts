import { describe, expect, it } from "vitest";
import { applyWorkflowEvent, startWorkflow, validateWorkflow } from "./index";

const approval = {
  name: "approval",
  initial: "draft",
  states: ["draft", "review", "approved", "rejected"] as const,
  transitions: [
    { from: "draft", event: "submit", to: "review" },
    { from: "review", event: "approve", to: "approved" },
    { from: "review", event: "reject", to: "rejected" },
  ],
};

describe("SkyWorkflow domain core", () => {
  it("starts at the declared initial state and increments revisions", () => {
    const started = startWorkflow(approval);
    const review = applyWorkflowEvent(approval, started, "submit");
    expect(review).toMatchObject({ state: "review", revision: 1 });
    expect(applyWorkflowEvent(approval, review, "approve")).toMatchObject({ state: "approved", revision: 2 });
  });

  it("rejects undeclared transitions", () => {
    expect(() => applyWorkflowEvent(approval, startWorkflow(approval), "approve")).toThrow();
  });

  it("rejects ambiguous same-state event definitions", () => {
    expect(() => validateWorkflow({ ...approval, transitions: [...approval.transitions, { from: "review", event: "approve", to: "rejected" }] })).toThrow();
  });

  it("rejects invalid states and cross-definition instances", () => {
    expect(() => validateWorkflow({ name: "bad", initial: "missing", states: ["ok"], transitions: [] })).toThrow();
    expect(() => applyWorkflowEvent(approval, { definition: "other", state: "draft", revision: 0 }, "submit")).toThrow();
  });
});
