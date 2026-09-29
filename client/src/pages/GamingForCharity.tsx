import { Link } from "wouter";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  Gamepad2,
  HandCoins,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Sparkles,
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

export default function GamingForCharity() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-56 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_320px] lg:items-end">
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
              Real-value gaming rails belong to charity only.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              The flagship games stay demo-only. If deposits, withdrawals,
              real-money wagering, custody, token settlement, or redeemable
              crypto rewards are introduced, this route is the only permitted
              product scope for them—and only after verified charity,
              provider, legal, age, and region gates are satisfied.
            </p>
          </div>
          <Link href="/gaming">
            <Button size="lg" className="w-full">
              <Gamepad2 className="mr-2 h-5 w-5" />
              Open Games Center
            </Button>
          </Link>
        </header>

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
                  <CardTitle className="mt-3 text-white">
                    {theme.name}
                  </CardTitle>
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
                    <CardTitle className="mt-2 text-white">
                      {item.title}
                    </CardTitle>
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
