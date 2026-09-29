import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workspace = fs.readFileSync(
  "client/src/pages/HopeAIWorkspace.tsx",
  "utf8"
);

describe("HopeAI failed-request recovery", () => {
  it("keeps raw mutation errors out of the user-facing toast", () => {
    expect(workspace).toContain(
      'toast.error("HopeAI request failed. Your draft was restored. Try again.")'
    );
    expect(workspace).not.toContain(
      'error instanceof Error ? error.message : "AI provider request failed."'
    );
  });

  it("rolls back the optimistic message and restores the retry draft", () => {
    expect(workspace).toContain(
      "messages: thread.messages.filter(message => message.id !== userMessage.id)"
    );
    expect(workspace).toContain(
      "setInput(current => (current.trim() ? current : text));"
    );
    expect(workspace).toContain(
      "setAttachments(current => [...sentAttachments, ...current].slice(0, 3));"
    );
  });

  it("restores the prior conversation title when the first request fails", () => {
    expect(workspace).toContain(
      "title: currentMessages.length === 0 ? activeThread.title : thread.title"
    );
  });
});
