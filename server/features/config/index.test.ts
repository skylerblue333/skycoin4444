import { describe, expect, it } from "vitest";
import {
  diffConfig,
  redactConfig,
  resolveConfig,
  validateConfigEntry,
} from "./index";

describe("SkyConfig", () => {
  it("applies runtime > environment > default precedence", () => {
    const result = resolveConfig({
      entries: [
        { key: "API_URL", value: "default", source: "default" },
        { key: "API_URL", value: "env", source: "environment" },
        { key: "API_URL", value: "runtime", source: "runtime" },
      ],
    });
    expect(result.values.API_URL).toBe("runtime");
    expect(result.sources.API_URL).toBe("runtime");
  });

  it("redacts sensitive values without mutating metadata", () => {
    expect(
      redactConfig({
        entries: [
          {
            key: "TOKEN",
            value: "secret",
            source: "environment",
            sensitive: true,
          },
        ],
      }),
    ).toEqual([
      { key: "TOKEN", value: "[REDACTED]", source: "environment" },
    ]);
  });

  it("redacts every source for a key when any source marks it sensitive", () => {
    expect(
      redactConfig({
        entries: [
          {
            key: "TOKEN",
            value: "safe-default",
            source: "default",
          },
          {
            key: "TOKEN",
            value: "secret",
            source: "environment",
            sensitive: true,
          },
        ],
      }),
    ).toEqual([
      { key: "TOKEN", value: "[REDACTED]", source: "default" },
      { key: "TOKEN", value: "[REDACTED]", source: "environment" },
    ]);
  });

  it("reports deterministic changed keys", () => {
    const before = resolveConfig({
      entries: [
        { key: "A", value: 1, source: "default" },
        { key: "B", value: true, source: "default" },
      ],
    });
    const after = resolveConfig({
      entries: [
        { key: "A", value: 2, source: "runtime" },
        { key: "B", value: true, source: "default" },
      ],
    });
    expect(diffConfig(before, after)).toEqual(["A"]);
  });

  it("validates keys, sources, primitive values, and sensitivity metadata", () => {
    expect(
      validateConfigEntry({
        key: "bad-key",
        value: Number.NaN,
        source: "file" as "runtime",
        sensitive: "yes" as unknown as boolean,
      }),
    ).toEqual([
      "key must be upper snake case",
      "source must be default, environment, or runtime",
      "value must be a string, boolean, or finite number",
      "sensitive must be boolean when provided",
    ]);
  });

  it("rejects unsupported runtime sources before precedence resolution", () => {
    expect(() =>
      resolveConfig({
        entries: [
          {
            key: "API_URL",
            value: "unsafe",
            source: "file" as "runtime",
          },
        ],
      }),
    ).toThrow("source must be default, environment, or runtime");
  });

  it("rejects invalid values before diagnostic redaction", () => {
    expect(() =>
      redactConfig({
        entries: [
          {
            key: "TOKEN",
            value: { raw: "secret" } as unknown as string,
            source: "runtime",
            sensitive: true,
          },
        ],
      }),
    ).toThrow("value must be a string, boolean, or finite number");
  });
});
