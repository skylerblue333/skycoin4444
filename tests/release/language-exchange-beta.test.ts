import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("language exchange beta integration", () => {
  it("routes the language exchange namespace to a real router", () => {
    const routers = readFileSync("server/routers.ts", "utf8");
    expect(routers).toContain('import { languageExchangeRouter } from "./routers/languageExchange";');
    expect(routers).toContain("languageExchange:languageExchangeRouter");
    expect(routers).not.toContain('languageExchange:createUnavailableFeatureRouter("Language Exchange")');
  });

  it("uses persisted partner profiles and existing direct messages in the flagship UI", () => {
    const page = readFileSync("client/src/pages/LanguagePartnerDiscovery.tsx", "utf8");
    expect(page).toContain("trpc.languageExchange.upsertProfile");
    expect(page).toContain("trpc.languageExchange.partners");
    expect(page).toContain("trpc.dm.messages");
    expect(page).toContain("trpc.dm.send");
    expect(page).toContain("MediaRecorder");
  });
});
