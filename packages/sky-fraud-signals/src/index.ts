export interface TransactionSignalInput {
  transactionId: string;
  amountMinor: number;
  currency: string;
  accountAgeDays: number;
  failedAttempts24h: number;
  countryChanged: boolean;
}

export interface FraudSignalResult {
  transactionId: string;
  score: number;
  band: "low" | "review" | "elevated";
  signals: string[];
}

const ID = /^[A-Za-z0-9][A-Za-z0-9:_-]{2,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

export function evaluateFraudSignals(input: TransactionSignalInput): FraudSignalResult {
  if (!ID.test(input.transactionId)) throw new Error("transactionId is invalid");
  if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor < 0 || input.amountMinor > 1_000_000_000) throw new Error("amountMinor is invalid");
  if (!CURRENCY.test(input.currency)) throw new Error("currency must be an ISO-style uppercase code");
  if (!Number.isInteger(input.accountAgeDays) || input.accountAgeDays < 0 || input.accountAgeDays > 36500) throw new Error("accountAgeDays is invalid");
  if (!Number.isInteger(input.failedAttempts24h) || input.failedAttempts24h < 0 || input.failedAttempts24h > 1000) throw new Error("failedAttempts24h is invalid");

  const signals: string[] = [];
  let score = 0;
  if (input.amountMinor >= 500_000) { score += 35; signals.push("high_amount"); }
  if (input.accountAgeDays < 7) { score += 25; signals.push("new_account"); }
  if (input.failedAttempts24h >= 3) { score += Math.min(30, input.failedAttempts24h * 5); signals.push("repeated_failures"); }
  if (input.countryChanged) { score += 20; signals.push("country_change"); }
  score = Math.min(100, score);
  return { transactionId: input.transactionId, score, band: score >= 70 ? "elevated" : score >= 35 ? "review" : "low", signals };
}

export function toFraudSignalEvent(result: FraudSignalResult) {
  return { type: "fraud.signals_evaluated" as const, transactionId: result.transactionId, score: result.score, band: result.band, signals: [...result.signals] };
}
