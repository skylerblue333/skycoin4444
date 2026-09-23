import { describe, expect, it } from "vitest";
import {
  EXECUTABLE_HOPE_TOOL_COUNT,
  HOPE_TOOL_CATALOG,
  HOPE_TOOL_CATALOG_COUNT,
  executeHopeTool,
  getHopeTool,
  toLLMTools,
} from "./hopeAITools";

describe("HopeAI real tool registry", () => {
  it("exposes a meaningful executable set and a larger truth-labeled catalog", () => {
    expect(EXECUTABLE_HOPE_TOOL_COUNT).toBeGreaterThanOrEqual(30);
    expect(HOPE_TOOL_CATALOG_COUNT).toBeGreaterThan(EXECUTABLE_HOPE_TOOL_COUNT);
    expect(new Set(HOPE_TOOL_CATALOG.map(tool => tool.id)).size).toBe(
      HOPE_TOOL_CATALOG_COUNT
    );
    expect(toLLMTools()).toHaveLength(EXECUTABLE_HOPE_TOOL_COUNT);
  });

  it("executes deterministic math and text tools", async () => {
    await expect(
      executeHopeTool("math_operation", {
        operation: "multiply",
        a: 12,
        b: 4,
      })
    ).resolves.toEqual({
      toolId: "math_operation",
      output: { value: 48 },
    });

    const stats = await executeHopeTool("text_stats", {
      text: "one two\nthree",
    });
    expect(stats.output).toMatchObject({
      words: 3,
      lines: 2,
      nonEmptyLines: 2,
    });
  });

  it("provides bounded legal issue-spotting without claiming adequacy", async () => {
    const result = await executeHopeTool("contract_clause_checklist", {
      text: "This agreement names the parties, payment, term, termination, and governing law.",
    });
    expect(result.output).toMatchObject({
      warning:
        "Keyword checklist only; presence or absence does not establish legal adequacy.",
    });
    expect(JSON.stringify(result.output)).toContain("governing_law");
  });

  it("keeps secret-bearing helpers disabled from autonomous model use", () => {
    expect(getHopeTool("password_strength").availability).toBe("disabled");
    expect(getHopeTool("jwt_decode_unverified").availability).toBe("disabled");
    const exposedNames = toLLMTools().map(tool => tool.function.name);
    expect(exposedNames).not.toContain("password_strength");
    expect(exposedNames).not.toContain("jwt_decode_unverified");
  });

  it("rejects obviously expensive regular expressions", async () => {
    await expect(
      executeHopeTool("regex_test", {
        pattern: "(a+)+$",
        text: "a".repeat(1000) + "!",
      })
    ).rejects.toThrow(/potentially expensive/i);
  });

  it("fails closed when an external integration is not connected", async () => {
    expect(getHopeTool("web_search").availability).toBe("integration_required");
    await expect(executeHopeTool("web_search", {})).rejects.toThrow(
      /requires a configured external integration/i
    );
    await expect(executeHopeTool("github_write", {})).rejects.toThrow(
      /requires a configured external integration/i
    );
  });

  it("rejects dangerous arithmetic edge cases and malformed inputs", async () => {
    await expect(
      executeHopeTool("math_operation", {
        operation: "divide",
        a: 1,
        b: 0,
      })
    ).rejects.toThrow("division by zero");

    await expect(
      executeHopeTool("number_stats", { values: [1, Number.NaN] })
    ).rejects.toThrow(/finite numbers/i);
  });
});
