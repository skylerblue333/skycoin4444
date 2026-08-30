export type NFTRecord = { tokenId: string; ownerId: string; metadataUri: string; version: number };
export type NFTTransfer = { contract: "sky.nft.transfer.v1"; tokenId: string; fromOwnerId: string; toOwnerId: string; nextVersion: number; chainExecutionPerformed: false };

const required = (v: string, field: string) => { const x=v.trim(); if(!x) throw new Error(`${field} is required`); return x; };

export function createNFTRecord(tokenId: string, ownerId: string, metadataUri: string): NFTRecord {
  return { tokenId: required(tokenId,"tokenId"), ownerId: required(ownerId,"ownerId"), metadataUri: required(metadataUri,"metadataUri"), version: 1 };
}

export function planTransfer(record: NFTRecord, toOwnerIdInput: string, expectedVersion: number): NFTTransfer {
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion !== record.version) throw new Error("version mismatch");
  const toOwnerId = required(toOwnerIdInput,"toOwnerId");
  if (toOwnerId === record.ownerId) throw new Error("new owner must differ");
  return { contract: "sky.nft.transfer.v1", tokenId: record.tokenId, fromOwnerId: record.ownerId, toOwnerId, nextVersion: record.version + 1, chainExecutionPerformed: false };
}

export function applyTransfer(record: NFTRecord, transfer: NFTTransfer): NFTRecord {
  if (transfer.tokenId !== record.tokenId || transfer.fromOwnerId !== record.ownerId || transfer.nextVersion !== record.version + 1) throw new Error("transfer does not match record");
  return { ...record, ownerId: transfer.toOwnerId, version: transfer.nextVersion };
}
