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
    expect(page).toContain("trpc.dm.markRead");
    expect(page).toContain("saveProfile.reset()");
    expect(page).toContain("correctionStorageKey(user.id)");
    expect(page).toContain("MediaRecorder");
  });

  it("includes persisted language profile data in self-service account exports", () => {
    const privacy = readFileSync("server/routers/privacy.ts", "utf8");
    expect(privacy).toContain('"language_exchange"');
    expect(privacy).toContain("languageExchangeProfiles");
    expect(privacy).toContain("output.languageExchange");
  });

  it("filters compatible profiles in SQL before applying the requested result limit", () => {
    const router = readFileSync("server/routers/languageExchange.ts", "utf8");
    expect(router).toContain("or(");
    expect(router).toContain("own.learningLanguage");
    expect(router).toContain("own.nativeLanguage");
    expect(router).not.toContain(".limit(100)");
  });
});
