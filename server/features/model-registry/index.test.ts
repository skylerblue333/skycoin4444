import { describe, expect, it } from "vitest";
import { registerModel, selectModels, transitionModel, validateModelRecord } from "./index";

const approved = {
  id: "model-a",
  provider: "local",
  model: "alpha",
  version: "1",
  lifecycle: "approved" as const,
  capabilities: ["chat", "embedding"],
};

describe("SkyModelRegistry", () => {
  it("selects approved models by capability deterministically", () => {
    const deprecated = { ...approved, id: "model-b", lifecycle: "deprecated" as const };
    expect(selectModels([deprecated, approved], { capability: "chat" }).map(model => model.id)).toEqual(["model-a"]);
    expect(selectModels([deprecated, approved], { capability: "chat", includeDeprecated: true }).map(model => model.id)).toEqual(["model-a", "model-b"]);
  });

  it("enforces provider allowlists", () => {
    expect(selectModels([approved], { capability: "chat", providerAllowlist: ["other"] })).toEqual([]);
  });

  it("registers unique valid model records", () => {
    expect(registerModel([], approved)[0]?.id).toBe("model-a");
    expect(() => registerModel([approved], approved)).toThrow("model id already exists");
  });

  it("enforces lifecycle transitions", () => {
    expect(transitionModel(approved, "deprecated").lifecycle).toBe("deprecated");
    expect(() => transitionModel({ ...approved, lifecycle: "disabled" }, "approved")).toThrow("invalid lifecycle transition");
  });

  it("validates required fields and token limits", () => {
    expect(validateModelRecord({ ...approved, id: "", maxInputTokens: 0 })).toEqual([
      "id is required",
      "maxInputTokens must be a positive safe integer",
    ]);
  });
});
