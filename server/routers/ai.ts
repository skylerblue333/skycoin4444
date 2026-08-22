import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM, listLLMModels } from "../_core/llm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const historySchema = z.array(
  z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8_000) }),
).max(12).default([]);

const providerError = (error: unknown): TRPCError => new TRPCError({
  code: "INTERNAL_SERVER_ERROR",
  message: error instanceof Error ? error.message : "AI provider request failed",
});

const responseText = (content: string | Array<{ type: string; text?: string }>): string => {
  if (typeof content === "string") return content;
  return content.map(part => part.text ?? "").join("\n").trim();
};

const runTextTask = async (system: string, user: string) => {
  try {
    const result = await invokeLLM({
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      maxTokens: 4_000,
    });
    const content = result.choices[0]?.message.content;
    if (!content) throw new Error("AI provider returned no text");
    return responseText(content);
  } catch (error) {
    throw providerError(error);
  }
};

export const aiRouter = router({
  getModels: publicProcedure.query(async () => {
    try {
      const result = await listLLMModels();
      return result.data.map(model => ({ id: model.id, name: model.id, owner: model.owned_by }));
    } catch {
      return [];
    }
  }),

  chat: protectedProcedure
    .input(z.object({
      message: z.string().trim().min(1).max(8_000),
      model: z.string().trim().min(1).max(120).optional(),
      history: historySchema,
      systemPrompt: z.string().trim().max(4_000).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const result = await invokeLLM({
          model: input.model,
          messages: [
            ...(input.systemPrompt ? [{ role: "system" as const, content: input.systemPrompt }] : []),
            ...input.history,
            { role: "user" as const, content: input.message },
          ],
          maxTokens: 4_000,
        });
        const content = result.choices[0]?.message.content;
        if (!content) throw new Error("AI provider returned no text");
        return { reply: responseText(content), model: result.model };
      } catch (error) {
        throw providerError(error);
      }
    }),

  learnTopic: protectedProcedure
    .input(z.object({ topic: z.string().trim().min(1).max(4_000) }))
    .mutation(async ({ input }) => ({
      lesson: await runTextTask("You are a careful Web3 educator. Explain the requested topic for a beginner, distinguish established facts from risks or uncertainty, and do not provide personalized financial advice.", input.topic),
    })),

  generateCode: protectedProcedure
    .input(z.object({ prompt: z.string().trim().min(1).max(8_000), language: z.string().trim().min(1).max(40) }))
    .mutation(async ({ input }) => ({
      code: await runTextTask(`You are a careful ${input.language} coding assistant. Return only code unless a short explanation is essential. Do not claim that code was executed or tested.`, input.prompt),
    })),

  debugCode: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(20_000), error: z.string().max(8_000).optional() }))
    .mutation(async ({ input }) => ({
      fixed: await runTextTask("You are a debugging assistant. Return corrected code and do not claim it was executed.", `Code:\n${input.code}\n\nReported error:\n${input.error ?? "None provided"}`),
      issues: [] as string[],
    })),

  reviewCode: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(20_000) }))
    .mutation(async ({ input }) => ({
      review: await runTextTask("You are a code-review assistant. Identify concrete correctness, security, and maintainability concerns. Do not assign a numeric score unless evidence is supplied.", input.code),
      score: null,
      suggestions: [] as string[],
    })),

  optimizeCode: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(20_000) }))
    .mutation(async ({ input }) => ({
      optimized: await runTextTask("You are a performance-focused coding assistant. Return improved code and state assumptions separately; do not claim measured speedups.", input.code),
    })),
});
