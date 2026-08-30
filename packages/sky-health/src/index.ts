export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthSignal {
  name: string;
  status: HealthStatus;
  checkedAt: string;
  detail?: string;
}

export interface HealthSummary {
  status: HealthStatus;
  checkedAt: string;
  signals: HealthSignal[];
}

function rank(status: HealthStatus): number {
  return status === 'unhealthy' ? 2 : status === 'degraded' ? 1 : 0;
}

export function normalizeSignal(signal: HealthSignal): HealthSignal {
  const name = signal.name.trim();
  if (!name || name.length > 100) throw new Error('invalid signal name');
  const checkedAt = new Date(signal.checkedAt);
  if (Number.isNaN(checkedAt.getTime())) throw new Error('invalid checkedAt');
  const detail = signal.detail?.trim();
  if (detail && detail.length > 500) throw new Error('detail too long');
  return {
    name,
    status: signal.status,
    checkedAt: checkedAt.toISOString(),
    ...(detail ? { detail } : {}),
  };
}

export function summarizeHealth(signals: readonly HealthSignal[]): HealthSummary {
  if (signals.length === 0) throw new Error('at least one signal is required');
  if (signals.length > 100) throw new Error('too many signals');
  const normalized = signals.map(normalizeSignal).sort((a, b) => a.name.localeCompare(b.name));
  const status = normalized.reduce<HealthStatus>((worst, signal) => rank(signal.status) > rank(worst) ? signal.status : worst, 'healthy');
  const checkedAt = normalized.reduce((latest, signal) => signal.checkedAt > latest ? signal.checkedAt : latest, normalized[0].checkedAt);
  return { status, checkedAt, signals: normalized };
}

export const SKY_HEALTH_SUMMARY_V1 = 'sky.health.summary.v1' as const;

export interface HealthEnvelopeV1 {
  type: typeof SKY_HEALTH_SUMMARY_V1;
  summary: HealthSummary;
  monitoringPerformed: false;
  alertDeliveryPerformed: false;
}

export function createHealthEnvelope(signals: readonly HealthSignal[]): HealthEnvelopeV1 {
  return {
    type: SKY_HEALTH_SUMMARY_V1,
    summary: summarizeHealth(signals),
    monitoringPerformed: false,
    alertDeliveryPerformed: false,
  };
}
