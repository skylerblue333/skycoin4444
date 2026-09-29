import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Gamepad2,
  Globe2,
  HandHeart,
  HeartHandshake,
  Map,
  ShieldCheck,
  Users,
} from "lucide-react";

const impactPaths = [
  {
    title: "Gaming for Charity",
    description: "Play non-financial missions and review the policy gates required before any real-value charity rail could exist.",
    href: "/gaming-for-charity",
    icon: Gamepad2,
  },
  {
    title: "SkySchool",
    description: "Use the learning beta for skills, quizzes, and education paths that can support future community programs.",
    href: "/sky-school",
    icon: BookOpen,
  },
  {
    title: "Community",
    description: "Organize discussion and volunteer-style coordination around causes without fabricating donor or impact metrics.",
    href: "/community",
    icon: Users,
  },
  {
    title: "Impact Map",
    description: "Explore the existing impact-mapping surface while keeping external verification and provider boundaries explicit.",
    href: "/impact-map",
    icon: Map,
  },
] as const;

const executionRequirements = [
  "Verified beneficiary and legal entity",
  "Approved external payment or settlement provider",
  "Region and eligibility policy",
  "Idempotent execution contract",
  "Receipt and reconciliation evidence",
  "Refund and failure handling",
  "Auditable authorization trail",
] as const;

export default function Charity() {
  const { isAuthenticated } = useAuth();
  const campaigns = trpc.charity.campaigns.useQuery({});
  const stats = trpc.charity.stats.useQuery();
  const prepareContribution = trpc.charity.prepareContribution.useMutation();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [amount, setAmount] = useState("25");

  const selectedCampaign = useMemo(
    () => campaigns.data?.find(campaign => campaign.id === selectedCampaignId),
    [campaigns.data, selectedCampaignId],
  );

  const numericAmount = Number(amount);
  const canPlan =
    isAuthenticated &&
    Boolean(selectedCampaignId) &&
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= 100_000 &&
    !prepareContribution.isPending;

  const plan = prepareContribution.data;

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_32%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge className="border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
            SkyHope · Engineering beta
          </Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                Build trustworthy giving infrastructure before moving money.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/55 sm:text-lg">
                SkyHope now exposes real campaign-planning contracts and a bounded
                contribution planner. It does not claim a live charity,
                payment provider, custody system, donor ledger, or blockchain
                settlement that has not been integrated and verified.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/gaming-for-charity">
                  <Button className="bg-emerald-300 text-slate-950 hover:bg-emerald-200">
                    Explore impact missions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sky-school">
                  <Button variant="outline" className="border-white/15 bg-white/[0.03] text-white">
                    Open SkySchool
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-emerald-300/20 bg-emerald-300/[0.04] text-white">
              <CardHeader>
                <ShieldCheck className="h-7 w-7 text-emerald-200" />
                <CardTitle className="mt-2">Current execution boundary</CardTitle>
                <CardDescription className="text-white/45">
                  Planning is implemented. Financial execution is deliberately disabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/55">
                <p>Live funds moved: <strong className="text-white">$0</strong></p>
                <p>Live donors recorded: <strong className="text-white">0</strong></p>
                <p>Blockchain writes: <strong className="text-white">disabled</strong></p>
                <p>Custody: <strong className="text-white">not provided</strong></p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Campaign scenarios", String(stats.data?.totalCampaigns ?? "—")],
              ["Live funds raised", "$0"],
              ["Live donors", "0"],
              ["Execution", "Disabled"],
            ].map(([label, value]) => (
              <Card key={label} className="border-white/10 bg-white/[0.035] text-white">
                <CardContent className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/35">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200/70">
              Campaign readiness
            </p>
            <h2 className="mt-2 text-3xl font-black">Plan causes without inventing impact.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
              These records are engineering-beta planning scenarios. Their goal
              amounts are test inputs, not claims that a real charity campaign
              has launched or received funds.
            </p>
          </div>

          {campaigns.isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map(index => (
                <div key={index} className="h-72 animate-pulse rounded-2xl bg-white/[0.04]" />
              ))}
            </div>
          ) : campaigns.error ? (
            <Card className="border-red-300/20 bg-red-300/[0.04] text-white">
              <CardContent className="p-6 text-sm text-red-100">
                Charity planning data is unavailable right now. No financial action was attempted.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {(campaigns.data ?? []).map(campaign => (
                <Card
                  key={campaign.id}
                  className={
                    "border-white/10 bg-white/[0.035] text-white transition " +
                    (selectedCampaignId === campaign.id ? "border-emerald-300/40 bg-emerald-300/[0.05]" : "")
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className="border-white/15 text-white/60">
                        {campaign.category}
                      </Badge>
                      <Badge className="bg-amber-300/10 text-amber-100">Planning only</Badge>
                    </div>
                    <CardTitle className="mt-3 text-white">{campaign.title}</CardTitle>
                    <CardDescription className="leading-6 text-white/45">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/40">Planning goal</span>
                        <span className="font-bold">
                          ${campaign.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/40">Live raised</span>
                        <span className="font-bold">$0</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/40">Beneficiary verification</span>
                        <span className="font-semibold text-amber-200">Not connected</span>
                      </div>
                    </div>

                    {isAuthenticated ? (
                      <Button
                        className="w-full bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                        onClick={() => {
                          setSelectedCampaignId(campaign.id);
                          prepareContribution.reset();
                        }}
                      >
                        Plan contribution
                      </Button>
                    ) : (
                      <Link href="/signin">
                        <Button variant="outline" className="w-full border-white/15 bg-white/[0.03] text-white">
                          Sign in to plan
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-emerald-300/20 bg-emerald-300/[0.035] text-white">
            <CardHeader>
              <HeartHandshake className="h-7 w-7 text-emerald-200" />
              <CardTitle className="mt-2">Contribution planner</CardTitle>
              <CardDescription className="text-white/45">
                Creates a request-only readiness plan. It never charges, transfers, broadcasts, or stores a donation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCampaign ? (
                <>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="font-bold">{selectedCampaign.title}</p>
                    <p className="mt-1 text-xs text-white/40">
                      No beneficiary or settlement provider is connected.
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Planning amount (USD)</label>
                    <Input
                      inputMode="decimal"
                      value={amount}
                      onChange={event => setAmount(event.target.value)}
                      className="border-white/10 bg-black/30 text-white"
                      aria-label="Planning amount in USD"
                    />
                    <p className="mt-2 text-xs text-white/35">
                      Accepted planning range: more than $0 and at most $100,000.
                    </p>
                  </div>
                  <Button
                    disabled={!canPlan}
                    onClick={() =>
                      prepareContribution.mutate({
                        campaignId: selectedCampaign.id,
                        amount: numericAmount,
                      })
                    }
                    className="w-full bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                  >
                    {prepareContribution.isPending ? "Creating plan…" : "Create non-executing plan"}
                  </Button>

                  {prepareContribution.error ? (
                    <p className="rounded-xl border border-red-300/20 bg-red-300/[0.04] p-3 text-sm text-red-100">
                      {prepareContribution.error.message}
                    </p>
                  ) : null}

                  {plan ? (
                    <div className="space-y-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4 text-sm">
                      <div className="flex items-center gap-2 font-bold text-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                        Plan created — no money moved
                      </div>
                      <p className="break-all text-xs text-white/45">Plan ID: {plan.planId}</p>
                      <p className="text-white/55">
                        ${plan.amount.toLocaleString()} planning amount · {plan.executionStatus}
                      </p>
                      <p className="text-white/45">
                        Money moved: no · Blockchain write: no · Custody: no · Persistence: request only
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
                  Choose a campaign scenario above to create a contribution readiness plan.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <ShieldCheck className="h-7 w-7 text-violet-200" />
              <CardTitle className="mt-2">What blocks live execution?</CardTitle>
              <CardDescription className="text-white/45">
                Every requirement below needs real implementation and evidence before a financial rail can be enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {executionRequirements.map(item => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-300" />
                  <span className="text-sm leading-6 text-white/55">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200/70">
              Connected impact paths
            </p>
            <h2 className="mt-2 text-3xl font-black">Make SkyHope part of the wider ecosystem.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {impactPaths.map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.href} className="border-white/10 bg-white/[0.035] text-white">
                  <CardHeader>
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-300/10 text-violet-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="mt-3 text-white">{item.title}</CardTitle>
                    <CardDescription className="leading-6 text-white/45">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href}>
                      <Button variant="outline" className="w-full border-white/15 bg-white/[0.03] text-white">
                        Open
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: HandHeart,
              title: "No fake donor leaderboard",
              body: "Until persisted contribution records exist, SkyHope reports zero live donors instead of seeded names or invented badges.",
            },
            {
              icon: Globe2,
              title: "No fake partner verification",
              body: "No charity, NGO, payment provider, or government partnership is implied by the planning scenarios.",
            },
            {
              icon: ShieldCheck,
              title: "No fake on-chain proof",
              body: "The beta does not claim blockchain receipts, smart-contract distribution, custody, or settlement without executed provider evidence.",
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-white/10 bg-white/[0.025] text-white">
                <CardHeader>
                  <Icon className="h-6 w-6 text-emerald-200" />
                  <CardTitle className="mt-2 text-lg text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-white/45">{item.body}</CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
