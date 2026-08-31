export type ThreatSignal = Readonly<{
  signalId: string;
  category: 'auth' | 'network' | 'transaction' | 'integrity';
  severity: number;
  confidenceBps: number;
}>;

export type ThreatAssessment = Readonly<{
  riskScore: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  acceptedSignals: number;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{3,128}$/;

export function assessThreat(signals: readonly ThreatSignal[]): ThreatAssessment {
  if (signals.length > 10_000) throw new Error('signal limit exceeded');
  const seen = new Set<string>();
  let weighted = 0;
  let count = 0;
  for (const signal of signals) {
    if (!ID_RE.test(signal.signalId)) throw new Error('invalid signal id');
    if (seen.has(signal.signalId)) throw new Error('duplicate signal id');
    seen.add(signal.signalId);
    if (!Number.isInteger(signal.severity) || signal.severity < 0 || signal.severity > 100) throw new Error('severity must be 0-100');
    if (!Number.isInteger(signal.confidenceBps) || signal.confidenceBps < 0 || signal.confidenceBps > 10_000) throw new Error('confidenceBps must be 0-10000');
    weighted += Math.floor((signal.severity * signal.confidenceBps) / 10_000);
    count += 1;
  }
  const riskScore = count === 0 ? 0 : Math.min(100, Math.floor(weighted / count));
  const level = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
  return Object.freeze({ riskScore, level, acceptedSignals: count });
}
