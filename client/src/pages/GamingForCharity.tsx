import { Link } from "wouter";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  Brain,
  Gamepad2,
  HandCoins,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  WalletCards,
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

const financeScope = [
  {
    title: "Deposits + withdrawals",
    icon: Landmark,
    detail:
      "Reserved for a verified charity beneficiary and an approved external provider. SKYCOIN4444 does not hold or move the funds.",
  },
  {
    title: "Real-money wagering",
    icon: BadgeDollarSign,
    detail:
      "Charity-only scope with additional age, region, legal, and regulated-gaming-provider gates.",
  },
  {
    title: "Custody + token settlement",
    icon: WalletCards,
    detail:
      "Any future custody or blockchain settlement must execute through an approved external provider after the policy gates pass.",
  },
  {
    title: "Redeemable crypto rewards",
    icon: HandCoins,
    detail:
      "A future redeemable reward must resolve through the verified charity-beneficiary path rather than a personal player payout.",
  },
] as const;

export default function GamingForCharity() {
  const missions = trpc.charity.missions.useQuery(undefined, { retry: false });
  const boundary = trpc.charity.boundary.useQuery(undefined, { retry: false });

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-56 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_340px] lg:items-end">
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
                Server-backed mission catalog
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Play can support an impact mission without pretending the score is money.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              The game layer stays demo-only. SkyHope missions connect games to
              authored learning and HopeAI planning, while the real-value policy
              remains fail-closed behind verified-charity and external-provider
              gates.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href="/gaming">
              <Button size="lg" className="w-full">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Open Games Center
              </Button>
            </Link>
            <Link href="/charity">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <HeartHandshake className="mr-2 h-5 w-5" />
                Open SkyHope Impact
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Impact missions",
              value: missions.data?.length ?? "…",
            },
            {
              label: "Finance actions modeled",
              value: boundary.data?.allowedActions.length ?? "…",
            },
            {
              label: "Live financial execution",
              value: "Off",
            },
          ].map(item => (
            <Card
              key={item.label}
              className="border-white/10 bg-white/[0.035] text-white"
            >
              <CardContent className="p-5">
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {item.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/60">
              Server-authored mission paths
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Every mission has a learning step, HopeAI step, and practice step.
            </h2>
          </div>

          {missions.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map(index => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
                />
              ))}
            </div>
          ) : missions.error ? (
            <Card className="border-rose-300/20 bg-rose-300/[0.04] text-white">
              <CardContent className="p-6">
                Impact missions are temporarily unavailable.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(missions.data ?? []).map((mission, index) => {
                const Icon =
                  [BookOpen, Brain, Gamepad2, HeartHandshake][index % 4] ??
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
                            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                            Learn
                          </Button>
                        </Link>
                        <Link href={mission.coachRoute}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-white/10 bg-white/[0.02] text-white"
                          >
                            <Brain className="mr-1.5 h-3.5 w-3.5" />
                            Coach
                          </Button>
                        </Link>
                        <Link href={mission.practiceRoute}>
                          <Button size="sm" className="w-full">
                            <Gamepad2 className="mr-1.5 h-3.5 w-3.5" />
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

        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200/60">
              Charity-only finance policy
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Future real-value rails are gated, not implied.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {financeScope.map(item => {
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
                What must exist before a real-value handoff?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-white/45">
              <p>• Verified charity beneficiary</p>
              <p>• Approved external payment/custody/settlement provider</p>
              <p>• Legal review and region eligibility</p>
              <p>• Age gate + regulated gaming provider for real-money gaming</p>
              <p>• Durable receipts, idempotency, failure handling, and audit evidence</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-emerald-200" />
              <CardTitle className="mt-2 text-white">
                Current beta boundary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/45">
              <p>Sparks, XP, scores, ranks, and demo credits have no monetary value.</p>
              <p>No wallet, token payout, donation, settlement, or blockchain write occurs here.</p>
              <p>SKYCOIN4444 does not currently hold charity funds or execute wagers.</p>
              <p>
                The server policy layer only simulates whether self-attested
                inputs would pass the modeled gates. It never authorizes a
                provider handoff and does not make the provider or charity real.
              </p>
              <Link
                href="/sky-school"
                className="inline-flex items-center font-semibold text-sky-200"
              >
                Continue in SkySchool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
