import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM, type Message } from "../_core/llm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  DEFAULT_HOPE_AGENT_ID,
  HOPE_AGENT_PROFILES,
  HOPE_AGENT_PROFILE_COUNT,
  getHopeAgentProfile,
} from "../features/hopeAIAgents";
import {
  EXECUTABLE_HOPE_TOOL_COUNT,
  HOPE_TOOL_CATALOG,
  HOPE_TOOL_CATALOG_COUNT,
  executeHopeTool,
  toLLMTools,
} from "../features/hopeAITools";

const historySchema = z
  .array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(8_000),
    })
  )
  .max(12)
  .default([]);

const argsSchema = z.record(z.string(), z.unknown());

const responseText = (
  content: string | Array<{ type: string; text?: string }> | null
): string => {
  if (content === null) return "";
  if (typeof content === "string") return content;
  return content.map(part => part.text ?? "").join("\n").trim();
};

const providerError = (error: unknown): TRPCError =>
  new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: error instanceof Error ? error.message : "HopeAI agent request failed",
  });

type ToolEvent = {
  toolId: string;
  status: "success" | "error";
  output?: unknown;
  error?: string;
};

async function runToolAgent(input: {
  agentId: string;
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  model?: string;
}) {
  const profile = getHopeAgentProfile(input.agentId);
  const tools = toLLMTools();
  const events: ToolEvent[] = [];
  const messages: Message[] = [
    {
      role: "system",
      content: [
        profile.systemPrompt,
        "You have access only to the listed executable tools.",
        "Use tools when calculation, parsing, transformation, inspection, or deterministic checking would improve the answer.",
        "Never claim integration-required tools ran.",
        "For legal work, tools can organize and spot issues but do not establish legal sufficiency or current law.",
        "When a tool result matters, explain what it actually showed.",
      ].join(" "),
    },
    ...input.history,
    { role: "user", content: input.message },
  ];

  let resolvedModel = input.model ?? "";
  let totalCalls = 0;

  for (let round = 0; round < 3; round += 1) {
    const result = await invokeLLM({
      model: input.model,
      messages,
      tools,
      toolChoice: "auto",
      maxTokens: 4_000,
    });

    resolvedModel = result.model;
    const assistant = result.choices[0]?.message;
    if (!assistant) throw new Error("AI provider returned no assistant message");

    const calls = (assistant.tool_calls ?? []).slice(0, 4);
    if (!calls.length) {
      const reply = responseText(assistant.content);
      if (!reply) throw new Error("AI provider returned no text");
      return {
        reply,
        model: resolvedModel,
        agent: {
          id: profile.id,
          name: profile.name,
          category: profile.category,
        },
        toolEvents: events,
      };
    }

    totalCalls += calls.length;
    if (totalCalls > 8) throw new Error("HopeAI tool-call limit exceeded");

    messages.push({
      role: "assistant",
      content: assistant.content ?? "",
      tool_calls: calls,
    });

    for (const call of calls) {
      const toolId = call.function.name;
      try {
        const parsed = JSON.parse(call.function.arguments || "{}");
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("tool arguments must be a JSON object");
        }
        const execution = await executeHopeTool(
          toolId,
          parsed as Record<string, unknown>
        );
        const event: ToolEvent = {
          toolId,
          status: "success",
          output: execution.output,
        };
        events.push(event);
        messages.push({
          role: "tool",
          name: toolId,
          tool_call_id: call.id,
          content: JSON.stringify({ ok: true, output: execution.output }),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "tool execution failed";
        events.push({
          toolId,
          status: "error",
          error: message,
        });
        messages.push({
          role: "tool",
          name: toolId,
          tool_call_id: call.id,
          content: JSON.stringify({ ok: false, error: message }),
        });
      }
    }
  }

  const final = await invokeLLM({
    model: input.model,
    messages: [
      ...messages,
      {
        role: "system",
        content:
          "Tool rounds are complete. Give the user the best final answer now. Do not claim any tool or external action beyond the recorded tool results.",
      },
    ],
    toolChoice: "none",
    maxTokens: 4_000,
  });
  const reply = final.choices[0]?.message
    ? responseText(final.choices[0].message.content)
    : "";
  if (!reply) throw new Error("AI provider returned no final text");

  return {
    reply,
    model: final.model || resolvedModel,
    agent: {
      id: profile.id,
      name: profile.name,
      category: profile.category,
    },
    toolEvents: events,
  };
}

export const hopeAgentProcedures = {
  catalog: publicProcedure.query(() => ({
    defaultAgentId: DEFAULT_HOPE_AGENT_ID,
    agentCount: HOPE_AGENT_PROFILE_COUNT,
    toolCount: HOPE_TOOL_CATALOG_COUNT,
    executableToolCount: EXECUTABLE_HOPE_TOOL_COUNT,
    agents: HOPE_AGENT_PROFILES.map(profile => ({
      id: profile.id,
      name: profile.name,
      category: profile.category,
      description: profile.description,
    })),
    tools: HOPE_TOOL_CATALOG,
  })),

  executeTool: protectedProcedure
    .input(
      z.object({
        toolId: z.string().trim().min(1).max(120),
        args: argsSchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await executeHopeTool(input.toolId, input.args);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error ? error.message : "tool execution failed",
        });
      }
    }),

  run: protectedProcedure
    .input(
      z.object({
        agentId: z.string().trim().min(1).max(120).default(DEFAULT_HOPE_AGENT_ID),
        message: z.string().trim().min(1).max(8_000),
        model: z.string().trim().min(1).max(120).optional(),
        history: historySchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await runToolAgent(input);
      } catch (error) {
        throw providerError(error);
      }
    }),
};

export const hopeAgentRouter = router(hopeAgentProcedures);
