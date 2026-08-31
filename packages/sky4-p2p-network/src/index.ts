export type PeerAddress = Readonly<{
  peerId: string;
  host: string;
  port: number;
}>;

export type PeerRecord = Readonly<PeerAddress & {
  score: number;
  lastSeenMs: number;
}>;

const PEER_RE = /^[a-zA-Z0-9:_-]{3,128}$/;
const HOST_RE = /^(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;

export function validatePeerAddress(peer: PeerAddress): void {
  if (!PEER_RE.test(peer.peerId)) throw new Error('peerId must be 3-128 safe characters');
  if (!HOST_RE.test(peer.host) || peer.host.length > 253) throw new Error('host must be a bounded DNS-style name');
  if (!Number.isInteger(peer.port) || peer.port < 1 || peer.port > 65535) throw new Error('port must be 1-65535');
}

export function upsertPeer(
  peers: ReadonlyMap<string, PeerRecord>,
  input: PeerAddress & { nowMs: number; scoreDelta?: number },
): ReadonlyMap<string, PeerRecord> {
  validatePeerAddress(input);
  if (!Number.isSafeInteger(input.nowMs) || input.nowMs < 0) throw new Error('nowMs must be a non-negative safe integer');
  const delta = input.scoreDelta ?? 0;
  if (!Number.isInteger(delta) || delta < -100 || delta > 100) throw new Error('scoreDelta must be an integer from -100 to 100');
  const current = peers.get(input.peerId);
  const score = Math.max(-1000, Math.min(1000, (current?.score ?? 0) + delta));
  const next = new Map(peers);
  next.set(input.peerId, Object.freeze({
    peerId: input.peerId,
    host: input.host,
    port: input.port,
    score,
    lastSeenMs: input.nowMs,
  }));
  return next;
}

export function selectDialCandidates(
  peers: ReadonlyMap<string, PeerRecord>,
  options: { nowMs: number; maxAgeMs: number; limit: number },
): readonly PeerRecord[] {
  if (!Number.isSafeInteger(options.nowMs) || options.nowMs < 0) throw new Error('nowMs must be non-negative');
  if (!Number.isSafeInteger(options.maxAgeMs) || options.maxAgeMs < 0) throw new Error('maxAgeMs must be non-negative');
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 1000) throw new Error('limit must be 1-1000');
  return Object.freeze([...peers.values()]
    .filter((peer) => peer.score >= 0 && options.nowMs - peer.lastSeenMs <= options.maxAgeMs)
    .sort((a, b) => b.score - a.score || a.peerId.localeCompare(b.peerId))
    .slice(0, options.limit));
}
