export type DatingSafetySignal =
  | "money_or_crypto"
  | "credentials_or_secrets"
  | "gift_cards"
  | "secrecy_or_isolation"
  | "threats_or_pressure";

export type DateSafetyPlanInput = {
  publicPlace: string;
  transportation: string;
  checkInPlan: string;
  startTime: string;
  endTime: string;
  exitPlan: string;
};

const safetyPatterns: ReadonlyArray<{
  signal: DatingSafetySignal;
  pattern: RegExp;
  label: string;
}> = [
  {
    signal: "money_or_crypto",
    pattern: /\b(send|wire|transfer|pay|loan|borrow|crypto|bitcoin|btc|eth|solana|wallet)\b/i,
    label: "Money or crypto request",
  },
  {
    signal: "credentials_or_secrets",
    pattern: /\b(password|passcode|private key|seed phrase|recovery phrase|security code|2fa|otp)\b/i,
    label: "Credential or secret request",
  },
  {
    signal: "gift_cards",
    pattern: /\b(gift card|steam card|apple card|google play card|prepaid card)\b/i,
    label: "Gift-card request",
  },
  {
    signal: "secrecy_or_isolation",
    pattern: /\b(don't tell|do not tell|keep (this|it) secret|only trust me|delete (the|our) messages)\b/i,
    label: "Secrecy or isolation language",
  },
  {
    signal: "threats_or_pressure",
    pattern: /\b(or else|right now|immediately|you must|i'll hurt|i will hurt|threat|blackmail)\b/i,
    label: "Threat or pressure language",
  },
];

export function detectDatingSafetySignals(text: string) {
  return safetyPatterns
    .filter(item => item.pattern.test(text))
    .map(item => ({ signal: item.signal, label: item.label }));
}

export function dateSafetyPlanReadiness(plan: DateSafetyPlanInput) {
  const checks = [
    {
      ready: plan.publicPlace.trim().length >= 3,
      missing: "Choose a public meeting place",
    },
    {
      ready: plan.transportation.trim().length >= 3,
      missing: "Plan independent transportation",
    },
    {
      ready: plan.checkInPlan.trim().length >= 3,
      missing: "Set a check-in plan with someone you trust",
    },
    {
      ready: Boolean(plan.startTime.trim()),
      missing: "Set an approximate start time",
    },
    {
      ready: Boolean(plan.endTime.trim()),
      missing: "Set an approximate end/check-out time",
    },
    {
      ready: plan.exitPlan.trim().length >= 3,
      missing: "Write an exit plan",
    },
  ];

  const complete = checks.filter(item => item.ready).length;
  return {
    percent: Math.round((complete / checks.length) * 100),
    missing: checks.filter(item => !item.ready).map(item => item.missing),
  };
}

export function buildDateSafetySummary(plan: DateSafetyPlanInput) {
  const lines = [
    "Date safety plan",
    `Public meeting place: ${plan.publicPlace.trim() || "not set"}`,
    `Transportation: ${plan.transportation.trim() || "not set"}`,
    `Check-in plan: ${plan.checkInPlan.trim() || "not set"}`,
    `Start time: ${plan.startTime.trim() || "not set"}`,
    `End/check-out time: ${plan.endTime.trim() || "not set"}`,
    `Exit plan: ${plan.exitPlan.trim() || "not set"}`,
    "",
    "Reminder: do not share passwords, private keys, recovery phrases, or money/crypto because someone pressures you.",
  ];
  return lines.join("\n");
}
