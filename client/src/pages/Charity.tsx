import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Gamepad2,
  HandHeart,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SkyHopePersonalPlanner from "@/components/SkyHopePersonalPlanner";

type FinanceAction =
  | "deposit"
  | "withdrawal"
  | "real-money-wager"
  | "custody"
  | "token-settlement"
  | "redeemable-crypto-reward";

const actionLabels: Record<FinanceAction, string> = {
  deposit: "Donation deposit",
  withdrawal: "Charity withdrawal",
  "real-money-wager": "Charity-only real-money gaming",
  custody: "Charity custody",
  "token-settlement": "Token settlement",
  "redeemable-crypto-reward": "Redeemable crypto reward",
};

const reasonCopy: Record<string, string> = {
  "allowed-for-charity-provider-handoff":
    "Every self-attested modeled gate passed. This is only a policy simulation; no external-provider handoff is authorized and no money movement occurs.",
  "beneficiary-required":
    "A bounded charity beneficiary identifier is required before any handoff can be considered.",
  "beneficiary-not-verified":
    "A real charity beneficiary must be verified outside this beta before financial handoff can be considered.",
  "charity-only-required":
    "Real-value gaming and financial rails are restricted to the charity-only scope.",
  "payment-provider-not-approved":
    "An approved external payment, custody, or settlement provider is required.",
  "legal-review-required":
    "Legal review must approve the proposed flow before external handoff.",
  "region-not-allowed":
    "The proposed region is not approved for this financial flow.",
  "age-gate-required":
    "Real-money gaming requires an age gate before provider handoff.",
  "regulated-gaming-provider-required":
    "Real-money gaming requires an approved regulated gaming provider.",
};

const gateDefinitions = [
  {
    key: "beneficiaryVerified",
    label: "Beneficiary verified",
    detail: "A real charity beneficiary has been verified outside this beta.",
  },
  {
    key: "paymentProviderApproved",
    label: "Provider approved",
    detail: "An external payment/custody/settlement provider is approved.",
  },
  {
    key: "legalReviewApproved",
    label: "Legal review",
    detail: "The proposed flow has passed the required legal review.",
  },
  {
    key: "regionAllowed",
    label: "Region allowed",
    detail: "The proposed user/beneficiary region is approved.",
  },
  {
    key: "ageGatePassed",
    label: "Age gate",
    detail: "Required only when the action is real-money gaming.",
  },
  {
    key: "regulatedGamingProviderApproved",
    label: "Gaming provider",
    detail: "Required only when the action is real-money gaming.",
  },
] as const;

type GateKey = (typeof gateDefinitions)[number]["key"];

export default function Charity() {
  const boundary = trpc.charity.boundary.useQuery();
  const missions = trpc.charity.missions.useQuery();
  const [action, setAction] = useState<FinanceAction>("deposit");
  const [beneficiaryId, setBeneficiaryId] = useState(
    "charity:readiness-demo"
  );
  const [gates, setGates] = useState<Record<GateKey, boolean>>({
    beneficiaryVerified: false,
    paymentProviderApproved: false,
    legalReviewApproved: false,
    regionAllowed: false,
    ageGatePassed: false,
    regulatedGamingProviderApproved: false,
  });

  const evaluation = trpc.charity.evaluateFinance.useQuery(
    {
      action,
      beneficiaryId,
      beneficiaryVerified: gates.beneficiaryVerified,
      charityOnly: true,
      paymentProviderApproved: gates.paymentProviderApproved,
      legalReviewApproved: gates.legalReviewApproved,
      regionAllowed: gates.regionAllowed,
      ageGatePassed: gates.ageGatePassed,
      regulatedGamingProviderApproved:
        gates.regulatedGamingProviderApproved,
    },
    {
      enabled: beneficiaryId.trim().length > 0,
      retry: false,
    }
  );

  const requiredGates = evaluation.data?.requiredGates ?? [];
  const passedGateCount = useMemo(
    () => requiredGates.filter(gate => gate.passed).length,
    [requiredGates]
  );
  const readinessPercent = requiredGates.length
    ? Math.round((passedGateCount / requiredGates.length) * 100)
    : 0;
  const financeDecision = evaluation.data?.hypotheticalDecision;

  function toggleGate(key: GateKey) {
    setGates(current => ({ ...current, [key]: !current[key] }));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute right-[-10rem] top-56 h-[30rem] w-[30rem] rounded-full bg-violet-500/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">
                SkyHope Impact
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300/25 text-amber-100"
              >
                No live donations
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Policy simulation · self-attested
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Turn learning, AI, games, and creator work into impact missions.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              SkyHope now has a real beta workflow: choose an authored mission,
              learn in SkySchool, plan with HopeAI, practice in the game layer,
              and inspect hypothetical financial gates that would be required
              before any future external charity provider could move value.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/hope-a-i">
              <Button size="lg" className="w-full">
                <Brain className="mr-2 h-4 w-4" />
                Plan with HopeAI
              </Button>
            </Link>
            <Link href="/sky-school">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Open SkySchool
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Authored impact missions",
              value: missions.data?.length ?? "…",
              icon: HeartHandshake,
            },
            {
              label: "Charity finance actions",
              value: boundary.data?.allowedActions.length ?? "…",
              icon: HandHeart,
            },
            {
              label: "Live donation execution",
              value: "Off",
              icon: ShieldCheck,
            },
            {
              label: "SKYCOIN4444 custody",
              value: "Off",
              icon: ShieldCheck,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="border-white/10 bg-white/[0.035] text-white"
            >
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-emerald-200" />
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/60">
                Mission loop
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Learn → coach → practice → document.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
                These are authored beta missions, not claims that an outside
                charity, school, or community program participated.
              </p>
            </div>
            <Link
              href="/gaming-for-charity"
              className="inline-flex items-center text-sm font-semibold text-emerald-200"
            >
              Open Impact Play Lab
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {missions.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map(index => (
                <div
                  key={index}
                  className="h-60 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              ))}
            </div>
          ) : missions.error ? (
            <Card className="border-rose-300/20 bg-rose-300/[0.04] text-white">
              <CardContent className="p-6 text-sm text-rose-100">
                Impact missions are temporarily unavailable.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(missions.data ?? []).map((mission, index) => {
                const Icon =
                  [BookOpen, ShieldCheck, Users, Sparkles][index % 4] ??
                  HeartHandshake;
                return (
                  <Card
                    key={mission.id}
                    className="border-white/10 bg-white/[0.035] text-white"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-100">
                          <Icon className="h-5 w-5" />
                        </span>
                        <Badge
                          variant="outline"
                          className="border-white/10 text-white/35"
                        >
                          {mission.theme}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3 text-white">
                        {mission.title}
                      </CardTitle>
                      <CardDescription className="leading-6 text-white/45">
                        {mission.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Link href={mission.learningRoute}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-white/10 bg-white/[0.02] text-white"
                          >
                            Learn
                          </Button>
                        </Link>
                        <Link href={mission.coachRoute}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-white/10 bg-white/[0.02] text-white"
                          >
                            Coach
                          </Button>
                        </Link>
                        <Link href={mission.practiceRoute}>
                          <Button size="sm" className="w-full">
                            Practice
                          </Button>
                        </Link>
                      </div>
                      <p className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.035] p-3 text-xs leading-5 text-white/45">
                        {mission.evidence}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <SkyHopePersonalPlanner />

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-violet-300/20 bg-violet-300/[0.035] text-white">
            <CardHeader>
              <CardTitle className="text-white">
                Charity finance readiness simulator
              </CardTitle>
              <CardDescription className="leading-6 text-white/45">
                This calls deterministic server-side policy logic with
                self-attested toggles. It cannot verify anything externally,
                authorize a provider handoff, or execute a transaction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-[1fr_1.2fr]">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                    Proposed action
                  </span>
                  <select
                    value={action}
                    onChange={event =>
                      setAction(event.target.value as FinanceAction)
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0b16] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-300/30"
                  >
                    {(
                      Object.keys(actionLabels) as FinanceAction[]
                    ).map(value => (
                      <option key={value} value={value}>
                        {actionLabels[value]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                    Beneficiary readiness ID
                  </span>
                  <input
                    value={beneficiaryId}
                    onChange={event => setBeneficiaryId(event.target.value)}
                    maxLength={128}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0b16] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-300/30"
                    aria-label="Beneficiary readiness ID"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {gateDefinitions.map(gate => {
                  const active = gates[gate.key];
                  const onlyForGaming =
                    (gate.key === "ageGatePassed" ||
                      gate.key ===
                        "regulatedGamingProviderApproved") &&
                    action !== "real-money-wager";
                  return (
                    <button
                      key={gate.key}
                      type="button"
                      onClick={() => toggleGate(gate.key)}
                      disabled={onlyForGaming}
                      className={
                        "rounded-2xl border p-4 text-left transition " +
                        (onlyForGaming
                          ? "cursor-not-allowed border-white/[0.05] bg-white/[0.015] opacity-40"
                          : active
                            ? "border-emerald-300/25 bg-emerald-300/[0.06]"
                            : "border-white/10 bg-black/20 hover:border-white/20")
                      }
                    >
                      <div className="flex items-center gap-2">
                        {active && !onlyForGaming ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                        ) : (
                          <XCircle className="h-4 w-4 text-white/25" />
                        )}
                        <span className="font-semibold">{gate.label}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-white/35">
                        {onlyForGaming
                          ? "Not required for the selected action."
                          : gate.detail}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-white/40">
                  <span>Modeled readiness gates</span>
                  <span>
                    {passedGateCount}/{requiredGates.length || 0}
                  </span>
                </div>
                <Progress value={readinessPercent} className="h-2" />
              </div>

              <div
                className={
                  "rounded-2xl border p-4 " +
                  (financeDecision?.allowed
                    ? "border-emerald-300/25 bg-emerald-300/[0.05]"
                    : "border-amber-300/20 bg-amber-300/[0.04]")
                }
              >
                <p className="font-semibold">
                  {evaluation.isLoading
                    ? "Evaluating policy…"
                    : evaluation.error
                      ? "Policy evaluation unavailable"
                      : financeDecision?.allowed
                        ? "Hypothetical gates pass — no handoff authorized"
                        : "Hypothetical policy blocked"}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {financeDecision
                    ? reasonCopy[financeDecision.reason] ??
                      financeDecision.reason
                    : "Set a beneficiary ID and readiness gates to inspect the policy."}
                </p>
                <p className="mt-2 text-xs text-white/30">
                  Simulation only. No provider handoff is authorized even when every modeled gate passes.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-emerald-300/20 bg-emerald-300/[0.035] text-white">
              <CardHeader>
                <ShieldCheck className="h-6 w-6 text-emerald-200" />
                <CardTitle className="mt-2 text-white">
                  Current verified boundary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-white/45">
                <p>• No live donation or payment execution.</p>
                <p>• No SKYCOIN4444 custody or blockchain broadcast.</p>
                <p>• No verified charity-partner claims in this screen.</p>
                <p>• No invented donor totals, votes, impact counts, or leaderboards.</p>
                <p>• No game score, XP, Spark, or demo credit becomes money.</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-white">
                  Continue the impact loop
                </CardTitle>
                <CardDescription className="text-white/45">
                  Move through the strongest currently implemented product paths.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  {
                    label: "HopeAI workspace",
                    href: "/hope-a-i",
                    icon: Brain,
                  },
                  {
                    label: "SkySchool",
                    href: "/sky-school",
                    icon: BookOpen,
                  },
                  {
                    label: "Games Center",
                    href: "/gaming",
                    icon: Gamepad2,
                  },
                  {
                    label: "Impact Play Lab",
                    href: "/gaming-for-charity",
                    icon: HeartHandshake,
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3 text-sm font-semibold transition hover:border-emerald-300/20 hover:bg-emerald-300/[0.03]"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-emerald-200" />
                        {item.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/30" />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
