import { describe, expect, it } from "vitest";
import {
  registerModel,
  selectModels,
  transitionModel,
  validateModelRecord,
} from "./index";

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
    const deprecated = {
      ...approved,
      id: "model-b",
      lifecycle: "deprecated" as const,
    };
    expect(
      selectModels([deprecated, approved], { capability: "chat" }).map(
        model => model.id,
      ),
    ).toEqual(["model-a"]);
    expect(
      selectModels([deprecated, approved], {
        capability: "chat",
        includeDeprecated: true,
      }).map(model => model.id),
    ).toEqual(["model-a", "model-b"]);
  });

  it("enforces provider allowlists", () => {
    expect(
      selectModels([approved], {
        capability: "chat",
        providerAllowlist: ["other"],
      }),
    ).toEqual([]);
  });

  it("rejects malformed selection requests without throwing", () => {
    expect(
      selectModels([approved], null as unknown as { capability: string }),
    ).toEqual([]);
    expect(
      selectModels([approved], {
        capability: "chat",
        providerAllowlist: "local" as unknown as string[],
      }),
    ).toEqual([]);
  });

  it("rejects blank selection capabilities", () => {
    expect(selectModels([approved], { capability: "   " })).toEqual([]);
  });

  it("filters malformed externally loaded records during selection", () => {
    const malformed = {
      ...approved,
      id: "model-b",
      lifecycle: "retired" as "approved",
    };
    expect(
      selectModels(
        [null as unknown as typeof approved, malformed, approved],
        { capability: "chat" },
      ).map(model => model.id),
    ).toEqual(["model-a"]);
  });

  it("registers unique valid model records", () => {
    expect(registerModel([], approved)[0]?.id).toBe("model-a");
    expect(() => registerModel([approved], approved)).toThrow(
      "model id already exists",
    );
  });

  it("rejects malformed existing registry state", () => {
    expect(() =>
      registerModel(
        [null as unknown as typeof approved],
        approved,
      ),
    ).toThrow("existing model records are invalid");
  });

  it("rejects unsupported lifecycle values during registration", () => {
    expect(() =>
      registerModel([], {
        ...approved,
        lifecycle: "retired" as "approved",
      }),
    ).toThrow("lifecycle is invalid");
  });

  it("rejects blank capability entries during registration", () => {
    expect(() =>
      registerModel([], {
        ...approved,
        capabilities: ["chat", "   "],
      }),
    ).toThrow("capabilities must be non-empty strings");
  });

  it("validates malformed runtime records without throwing", () => {
    expect(
      validateModelRecord(null as unknown as typeof approved),
    ).toEqual(["model record is required"]);
    expect(
      validateModelRecord({
        ...approved,
        provider: null as unknown as string,
      }),
    ).toContain("provider is required");
    expect(
      validateModelRecord({
        ...approved,
        metadata: { region: 42 as unknown as string },
      }),
    ).toContain("metadata must contain non-empty keys and string values");
  });

  it("enforces lifecycle transitions with controlled runtime errors", () => {
    expect(transitionModel(approved, "deprecated").lifecycle).toBe(
      "deprecated",
    );
    expect(() =>
      transitionModel({ ...approved, lifecycle: "disabled" }, "approved"),
    ).toThrow("invalid lifecycle transition");
    expect(() =>
      transitionModel(
        { ...approved, lifecycle: "retired" as "approved" },
        "disabled",
      ),
    ).toThrow("invalid current lifecycle: retired");
    expect(() =>
      transitionModel(
        null as unknown as typeof approved,
        "disabled",
      ),
    ).toThrow("model record is required");
  });

  it("validates required fields and token limits", () => {
    expect(
      validateModelRecord({ ...approved, id: "", maxInputTokens: 0 }),
    ).toEqual([
      "id is required",
      "maxInputTokens must be a positive safe integer",
    ]);
  });
});
