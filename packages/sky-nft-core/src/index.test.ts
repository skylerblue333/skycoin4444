import { describe, expect, it } from "vitest";
import { applyTransfer, createNFTRecord, planTransfer } from "./index";

describe("SkyNFTCore", () => {
  it("plans and applies deterministic local ownership transitions", () => {
    const record = createNFTRecord("token-1","alice","ipfs://metadata-1");
    const transfer = planTransfer(record,"bob",1);
    expect(transfer.chainExecutionPerformed).toBe(false);
    expect(applyTransfer(record,transfer)).toEqual({ tokenId:"token-1", ownerId:"bob", metadataUri:"ipfs://metadata-1", version:2 });
  });
  it("rejects stale versions and no-op transfers", () => {
    const record = createNFTRecord("token-1","alice","meta");
    expect(()=>planTransfer(record,"bob",2)).toThrow("version mismatch");
    expect(()=>planTransfer(record,"alice",1)).toThrow("must differ");
  });
});
