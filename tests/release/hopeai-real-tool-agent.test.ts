import fs from "node:fs";
import { describe, expect, it } from "vitest";

const router = fs.readFileSync("server/routers/hopeAgent.ts", "utf8");
const appRouter = fs.readFileSync("server/routers.ts", "utf8");
const agents = fs.readFileSync("server/features/hopeAIAgents.ts", "utf8");
const tools = fs.readFileSync("server/features/hopeAITools.ts", "utf8");
const workspace = fs.readFileSync("client/src/pages/HopeAIWorkspace.tsx", "utf8");

describe("HopeAI real tool-agent release contract", () => {
  it("wires the real HopeAI agent procedures into the application router", () => {
    expect(appRouter).toContain(
      'import { hopeAgentProcedures } from "./routers/hopeAgent";'
    );
    expect(appRouter).toContain(
      'hopeAI:router({ ...createUnavailableFeatureRecord("HopeAI"), ...hopeAgentProcedures })'
    );
    expect(router).toContain("catalog: publicProcedure.query");
    expect(router).toContain("executeTool: protectedProcedure");
    expect(router).toContain("run: protectedProcedure");
  });

  it("uses native provider tool calls with bounded execution loops", () => {
    expect(router).toContain('toolChoice: "auto"');
    expect(router).toContain("assistant.tool_calls");
    expect(router).toContain("executeHopeTool");
    expect(router).toContain("for (let round = 0; round < 3; round += 1)");
    expect(router).toContain("if (totalCalls > 8)");
  });

  it("ships 100+ specialist profiles including a truth-bounded Lawyer", () => {
    const ids = agents.match(/"id": "[^"]+"/g) ?? [];
    expect(ids.length).toBeGreaterThanOrEqual(101);
    expect(agents).toContain('"name": "Lawyer"');
    expect(agents).toContain("general legal information");
    expect(agents).toContain("Never invent statutes");
  });

  it("keeps external tools truth-labeled and out of the executable set", () => {
    expect(tools).toContain('["web_search", "Web Search"');
    expect(tools).toContain('["github_write", "GitHub Write"');
    expect(tools).toContain('availability: "integration_required" as const');
    expect(tools).toContain(
      'HOPE_TOOL_CATALOG.filter(tool => tool.availability === "executable")'
    );
    expect(tools).toContain('availability: "disabled"');
  });

  it("exposes agent choice and tool execution evidence in the HopeAI workspace", () => {
    expect(workspace).toContain("trpc.hopeAI.catalog.useQuery");
    expect(workspace).toContain("trpc.hopeAI.run.useMutation");
    expect(workspace).toContain('agentId: "lawyer"');
    expect(workspace).toContain('aria-label="HopeAI specialist"');
    expect(workspace).toContain("Tool execution");
    expect(workspace).toContain("message.toolEvents");
  });
});
