import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const matches = readFileSync("client/src/pages/DatingMatches.tsx", "utf8");

describe("dating messaging send lock", () => {
  it("locks conversation selection and draft editing during an in-flight send", () => {
    const sendLocks = matches.match(/disabled=\{sending\}/g) ?? [];
    expect(sendLocks.length).toBeGreaterThanOrEqual(2);
    expect(matches).toContain("conversation locked while sending");
  });

  it("keeps the server response as the source of truth before success", () => {
    expect(matches).toContain('fetch("/api/dating/messages"');
    expect(matches).toContain("if (!response.ok)");
    expect(matches).toContain('setSendStatus("Message sent.")');
  });
});
