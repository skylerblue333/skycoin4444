import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  Bot,
  Gamepad2,
  HandCoins,
  HeartHandshake,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  evaluateImpactAllocation,
  IMPACT_PLAY_RECOMMENDED,
  type ImpactAllocation,
} from "@/lib/impactPlayLab";

const missionThemes = [
  {
    name: "Education",
    detail:
      "Use knowledge games and lesson completion as a themed mission. No donation is triggered.",
    href: "/game-crypto-quiz",
    icon: BookOpen,
  },
  {
    name: "Clean water",
    detail:
      "Use Spark Tap as a themed awareness challenge. Sparks are game-only values.",
    href: "/game-token-tap",
    icon: Sparkles,
  },
  {
    name: "Community build",
    detail:
      "Use Block Builder as a themed teamwork/puzzle session. No funds or tokens move.",
    href: "/game-block-builder",
    icon: Gamepad2,
  },
] as const;

const charityFinanceScope = [
  {
    title: "Deposits + withdrawals",
    icon: Landmark,
    detail:
      "Reserved for verified charity beneficiaries through an approved payment provider. SKYCOIN4444 does not hold or move funds itself in the current beta.",
  },
  {
    title: "Real-money wagering",
    icon: BadgeDollarSign,
    detail:
      "Charity-only scope. It additionally requires age and region gates plus an approved regulated gaming provider before it can be enabled.",
  },
  {
    title: "Custody + token settlement",
    icon: WalletCards,
    detail:
      "Any custody or blockchain settlement must be delegated to an approved external provider with verified beneficiary records and legal review.",
  },
  {
    title: "Redeemable crypto rewards",
    icon: HandCoins,
    detail:
      "If introduced, redeemable crypto value must resolve to the verified charity beneficiary path rather than a personal player payout.",
  },
] as const;

const allocationLabels: Array<{
  key: keyof ImpactAllocation;
  label: string;
  detail: string;
}> = [
  {
    key: "needs",
    label: "Needs discovery",
    detail: "Understand the problem, people, consent, and baseline before designing the intervention.",
  },
  {
    key: "evidence",
    label: "Evidence",
    detail: "Decide what would demonstrate progress without exaggerating outcomes.",
  },
  {
    key: "delivery",
    label: "Delivery",
    detail: "Plan staffing, access, logistics, handoffs, and failure recovery.",
  },
  {
    key: "safeguards",
    label: "Safeguards",
    detail: "Protect privacy, accessibility, eligibility, safety, and reporting boundaries.",
  },
];

const presets: Array<{ label: string; value: ImpactAllocation }> = [
  { label: "Balanced", value: IMPACT_PLAY_RECOMMENDED },
  {
    label: "Evidence-heavy",
    value: { needs: 25, evidence: 35, delivery: 20, safeguards: 20 },
  },
  {
    label: "Delivery-heavy",
    value: { needs: 25, evidence: 20, delivery: 35, safeguards: 20 },
  },
];

export default function GamingForCharity() {
  const [allocation, setAllocation] = useState<ImpactAllocation>(
    IMPACT_PLAY_RECOMMENDED,
  );

  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const result = useMemo(() => {
    if (total !== 100) return null;
    return evaluateImpactAllocation(allocation);
  }, [allocation, total]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-56 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">
                Impact Play Lab
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300/25 text-amber-100"
              >
                No live donations
              </Badge>
              <Badge
                variant="outline"
                className="border-violet-300/25 text-violet-100"
              >
                Charity-only finance policy
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Play with impact planning without pretending the game moves money.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              This lab adds a deterministic planning game beside the existing
              themed missions. The score is practice feedback only: it has no cash
              or token value, does not trigger a donation, and does not predict
              real-world charitable impact.
            </p>
          </div>
          <div className="grid gap-2">
            <Link href="/charity">
              <Button size="lg" className="w-full">
                <HeartHandshake className="mr-2 h-5 w-5" />
                Open SkyHope planner
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/sky-school">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn
                </Button>
              </Link>
              <Link href="/hope-a-i">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  HopeAI
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-emerald-300/15 bg-emerald-300/[0.035] text-white">
            <CardHeader>
              <Target className="h-6 w-6 text-emerald-200" />
              <CardTitle className="mt-2 text-2xl text-white">
                Impact allocation drill
              </CardTitle>
              <CardDescription className="leading-6 text-white/45">
                Allocate exactly 100 practice points. The game rewards balance
                across needs, evidence, delivery, and safeguards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {presets.map(preset => (
                  <Button
                    key={preset.label}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-white/15 bg-white/[0.03] text-white"
                    onClick={() => setAllocation(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setAllocation(IMPACT_PLAY_RECOMMENDED)}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>

              <div className="space-y-5">
                {allocationLabels.map(item => (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="mt-1 max-w-2xl text-xs leading-5 text-white/35">
                          {item.detail}
                        </p>
                      </div>
                      <span className="min-w-12 text-right text-xl font-black text-emerald-100">
                        {allocation[item.key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={5}
                      value={allocation[item.key]}
                      aria-label={item.label + " allocation"}
                      onChange={event =>
                        setAllocation(current => ({
                          ...current,
                          [item.key]: Number(event.target.value),
                        }))
                      }
                      className="w-full accent-emerald-400"
                    />
                  </div>
                ))}
              </div>

              <div
                className={
                  total === 100
                    ? "rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.035] p-4"
                    : "rounded-2xl border border-amber-300/20 bg-amber-300/[0.035] p-4"
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Allocated points</span>
                  <span className="text-2xl font-black">{total}/100</span>
                </div>
                {total !== 100 ? (
                  <p className="mt-2 text-xs leading-5 text-amber-100/70">
                    Rebalance the sliders until the total is exactly 100 to get
                    practice feedback.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <Gamepad2 className="h-6 w-6 text-violet-200" />
              <CardTitle className="mt-2 text-white">
                Game-only planning score
              </CardTitle>
              <CardDescription className="text-white/45">
                Deterministic feedback on allocation balance—not a claim about
                program effectiveness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-white/10 text-center text-sm text-white/35">
                  Allocate exactly 100 points to score the practice round.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.035] p-5 text-center">
                    <p className="text-6xl font-black text-violet-100">
                      {result.practiceScore}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/30">
                      practice score / 100
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-white/50">{result.message}</p>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                      Strengths this round
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.strengths.map(strength => (
                        <Badge
                          key={strength}
                          variant="outline"
                          className="border-emerald-300/20 text-emerald-100"
                        >
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4 text-xs leading-5 text-white/35">
                    No wallet, token payout, donation, settlement, or blockchain
                    write occurs from this drill. A high score does not verify a
                    charity or predict real-world impact.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {missionThemes.map(theme => {
            const Icon = theme.icon;
            return (
              <Card
                key={theme.name}
                className="border-white/10 bg-white/[0.035] text-white"
              >
                <CardHeader>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-3 text-white">{theme.name}</CardTitle>
                  <CardDescription className="leading-6 text-white/45">
                    {theme.detail}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={theme.href}>
                    <Button
                      variant="outline"
                      className="w-full border-white/15 bg-white/[0.03] text-white"
                    >
                      Play themed mission
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200/60">
              Charity-only financial scope
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Future real-value rails are gated, not implied.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {charityFinanceScope.map(item => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border-violet-300/15 bg-violet-300/[0.035] text-white"
                >
                  <CardHeader>
                    <Icon className="h-6 w-6 text-violet-200" />
                    <CardTitle className="mt-2 text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-white/45">
                    {item.detail}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardHeader>
              <HeartHandshake className="h-6 w-6 text-violet-200" />
              <CardTitle className="mt-2 text-white">
                What makes a charity transaction eligible?
              </CardTitle>
              <CardDescription className="text-white/45">
                A financial action must pass every applicable gate before the
                system can create an external-provider handoff plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-white/45">
              <p>• Verified charity beneficiary identifier</p>
              <p>• Approved payment/custody/settlement provider</p>
              <p>• Legal review and region eligibility</p>
              <p>• Age gate + regulated gaming provider for real-money wagering</p>
              <p>• Idempotency, receipts, failure/refund handling, and audit evidence</p>
              <p>• Tests proving game scores alone cannot fabricate money movement</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-emerald-200" />
              <CardTitle className="mt-2 text-white">
                Current beta boundary
              </CardTitle>
              <CardDescription className="text-white/45">
                The policy is implemented; live financial execution is not.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>Sparks, XP, scores, ranks, demo credits, and combos remain game-only values.</p>
              <p>No wallet, token payout, donation, settlement, or blockchain write occurs today.</p>
              <p>SKYCOIN4444 does not currently hold charity funds or execute wagers.</p>
              <p>Approved integrations must execute externally; the platform policy layer only authorizes or blocks the handoff.</p>
              <Link
                href="/beta-feedback"
                className="inline-flex items-center font-semibold text-sky-200"
              >
                Suggest a future impact mission
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
