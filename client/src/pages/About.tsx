import { ArrowRight, BookOpen, Gamepad2, Lock, MessageSquare, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const areas = [
  {
    title: "Social & community",
    detail:
      "Account-backed profiles, posts, communities, discovery, notification preferences, and activity evidence.",
    icon: Users,
  },
  {
    title: "SkySchool",
    detail:
      "Authored deterministic lessons with account-scoped progress and no credential issuance claim.",
    icon: BookOpen,
  },
  {
    title: "Gaming",
    detail:
      "Local deterministic arcade experiences with no wagering, custody, token payout, or chain settlement.",
    icon: Gamepad2,
  },
  {
    title: "Creator & exploration",
    detail:
      "Local creator/live-planning labs, language exchange, dating profile setup, and evidence-led discovery.",
    icon: Sparkles,
  },
  {
    title: "Privacy & identity",
    detail:
      "Invite-only OAuth admission, profile privacy, self-data export, and durable deletion-request intake.",
    icon: Lock,
  },
  {
    title: "Beta operations",
    detail:
      "Feedback, readiness checks, exact-head CI, evidence registries, and explicit unavailable boundaries.",
    icon: ShieldCheck,
  },
] as const;

export default function About() {
  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14">
        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <Badge
              variant="outline"
              className="border-emerald-400/40 text-emerald-200"
            >
              Invitation-only engineering beta
            </Badge>
            <h1 className="mt-5 text-5xl font-black tracking-tight">
              SKYCOIN4444 is being built as one connected digital ecosystem.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/60">
              The repository combines social, learning, gaming, creator,
              discovery, privacy, local productivity tools, and controlled
              Web3/commerce labs. The beta promotes only routes with explicit
              implementation and evidence; historical screens are not counted
              as working merely because a page exists.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/beta-workspace">
                <Button>
                  Open beta workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button variant="outline">Start activation journey</Button>
              </Link>
            </div>
          </div>

          <Card className="border-amber-400/25 bg-amber-400/[0.05] text-white">
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-amber-200" />
              <CardTitle className="mt-2">Evidence before claims</CardTitle>
              <CardDescription className="text-white/55">
                Launchable routes have a capability, persistence model, tests,
                and a written boundary in the beta evidence registry.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/operational-readiness">
                <Button variant="outline" className="w-full">
                  Review operational readiness
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
            What the beta actually covers
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {areas.map(area => {
              const Icon = area.icon;
              return (
                <Card
                  key={area.title}
                  className="border-white/10 bg-white/[0.025] text-white"
                >
                  <CardHeader>
                    <Icon className="h-5 w-5 text-emerald-200" />
                    <CardTitle className="mt-2 text-base">
                      {area.title}
                    </CardTitle>
                    <CardDescription className="leading-6 text-white/50">
                      {area.detail}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.025] text-white">
            <CardHeader>
              <CardTitle>How a tester creates value</CardTitle>
              <CardDescription className="text-white/50">
                The durable activation loop measures real account-owned records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/60">
              <p>1. Enter through invitation-only OAuth admission.</p>
              <p>2. Configure a persisted profile and privacy setting.</p>
              <p>3. Complete one persisted SkySchool lesson.</p>
              <p>4. Publish one bounded social contribution.</p>
              <p>5. Submit durable beta feedback and inspect activity evidence.</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.025] text-white">
            <CardHeader>
              <MessageSquare className="h-5 w-5 text-sky-200" />
              <CardTitle className="mt-2">What is not being claimed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-6 text-white/60">
              <p>No public user-count, revenue, donation, or usage-scale claims.</p>
              <p>No live banking, payment settlement, custody, signing, or token payouts.</p>
              <p>No production blockchain writes, staking, mining, or DeFi execution.</p>
              <p>No provider-backed AI or livestream infrastructure unless separately configured and verified.</p>
              <p>No regulatory, compliance, privacy, or security certification.</p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6">
          <h2 className="text-xl font-bold">Current release direction</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-white/55">
            The highest-value milestone is a reachable invitation-only beta
            backed by a dedicated managed MySQL database, verified OAuth,
            durable activation evidence, privacy controls, and hosted smoke
            tests. Deployment remains a separate evidence gate; repository
            readiness is not described as a live public service.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/privacy-settings">
              <Button variant="outline">Privacy center</Button>
            </Link>
            <Link href="/beta-feedback">
              <Button variant="outline">Beta feedback</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
