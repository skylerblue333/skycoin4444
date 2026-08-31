import { describe, expect, it } from 'vitest';
import { selectDialCandidates, upsertPeer } from './index';

describe('Sky4 P2P network core', () => {
  it('upserts and ranks healthy peers deterministically', () => {
    let peers = new Map();
    peers = new Map(upsertPeer(peers, { peerId: 'peer:b', host: 'b.example', port: 4444, nowMs: 1000, scoreDelta: 5 }));
    peers = new Map(upsertPeer(peers, { peerId: 'peer:a', host: 'a.example', port: 4444, nowMs: 1000, scoreDelta: 5 }));
    expect(selectDialCandidates(peers, { nowMs: 1500, maxAgeMs: 1000, limit: 2 }).map((p) => p.peerId))
      .toEqual(['peer:a', 'peer:b']);
  });

  it('filters stale and negatively scored peers', () => {
    let peers = new Map();
    peers = new Map(upsertPeer(peers, { peerId: 'peer:old', host: 'old.example', port: 4444, nowMs: 1, scoreDelta: 10 }));
    peers = new Map(upsertPeer(peers, { peerId: 'peer:bad', host: 'bad.example', port: 4444, nowMs: 1000, scoreDelta: -1 }));
    expect(selectDialCandidates(peers, { nowMs: 2000, maxAgeMs: 500, limit: 10 })).toEqual([]);
  });

  it('caps accumulated scores', () => {
    let peers = new Map();
    for (let i = 0; i < 20; i += 1) {
      peers = new Map(upsertPeer(peers, { peerId: 'peer:cap', host: 'cap.example', port: 4444, nowMs: i, scoreDelta: 100 }));
    }
    expect(peers.get('peer:cap')?.score).toBe(1000);
  });

  it('rejects invalid network coordinates', () => {
    expect(() => upsertPeer(new Map(), { peerId: 'x', host: 'bad host', port: 70000, nowMs: 1 }))
      .toThrow();
  });
});
