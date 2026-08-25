import { describe, expect, it } from "vitest";
import { diffConfig, redactConfig, resolveConfig, validateConfigEntry } from "./index";

describe("SkyConfig", () => {
  it("applies runtime > environment > default precedence", () => {
    const result = resolveConfig({ entries: [
      { key: "API_URL", value: "default", source: "default" },
      { key: "API_URL", value: "env", source: "environment" },
      { key: "API_URL", value: "runtime", source: "runtime" },
    ] });
    expect(result.values.API_URL).toBe("runtime");
    expect(result.sources.API_URL).toBe("runtime");
  });

  it("redacts sensitive values without mutating metadata", () => {
    expect(redactConfig({ entries: [
      { key: "TOKEN", value: "secret", source: "environment", sensitive: true },
    ] })).toEqual([{ key: "TOKEN", value: "[REDACTED]", source: "environment" }]);
  });

  it("reports deterministic changed keys", () => {
    const before = resolveConfig({ entries: [
      { key: "A", value: 1, source: "default" },
      { key: "B", value: true, source: "default" },
    ] });
    const after = resolveConfig({ entries: [
      { key: "A", value: 2, source: "runtime" },
      { key: "B", value: true, source: "default" },
    ] });
    expect(diffConfig(before, after)).toEqual(["A"]);
  });

  it("validates keys and finite numbers", () => {
    expect(validateConfigEntry({ key: "bad-key", value: Number.NaN, source: "runtime" })).toEqual([
      "key must be upper snake case",
      "numeric value must be finite",
    ]);
  });
});
