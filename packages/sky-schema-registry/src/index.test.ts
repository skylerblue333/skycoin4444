import { describe, expect, it } from "vitest";
import { isBackwardCompatible, validateSchema } from "./index";

const v1 = {
  name: "profile",
  version: 1,
  fields: [{ name: "displayName", type: "string" as const, required: true }],
};

describe("SkySchemaRegistry", () => {
  it("allows additive optional fields", () => {
    expect(
      isBackwardCompatible(v1, {
        name: "profile",
        version: 2,
        fields: [
          ...v1.fields,
          { name: "verified", type: "boolean", required: false },
        ],
      })
    ).toBe(true);
  });

  it("rejects removed or changed required fields", () => {
    expect(
      isBackwardCompatible(v1, { name: "profile", version: 2, fields: [] })
    ).toBe(false);
  });

  it("rejects duplicate fields", () => {
    expect(() =>
      validateSchema({
        name: "profile",
        version: 1,
        fields: [
          { name: "id", type: "string", required: true },
          { name: "id", type: "string", required: false },
        ],
      })
    ).toThrow("duplicate field name");
  });

  it("rejects invalid runtime field values from untyped callers", () => {
    expect(() =>
      validateSchema({
        name: "profile",
        version: 1,
        fields: [{ name: "id", type: "object" as never, required: true }],
      })
    ).toThrow("invalid field type");

    expect(() =>
      validateSchema({
        name: "profile",
        version: 1,
        fields: [{ name: "id", type: "string", required: "yes" as never }],
      })
    ).toThrow("invalid field required");
  });
});
