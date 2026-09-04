import { Link } from "wouter";
import {
  Activity,
  BookOpen,
  Flag,
  MessageSquare,
  ShieldCheck,
  UserRound,
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

const steps = [
  {
    number: "01",
    title: "Enter with an invited account",
    description:
      "Use the configured identity provider. Production admission is checked before session issuance.",
    href: "/signin",
    label: "Open sign in",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Configure your profile",
    description:
      "Save a display name, username, bio, and privacy choice against your authenticated account.",
    href: "/profile",
    label: "Open profile",
    icon: UserRound,
  },
  {
    number: "03",
    title: "Record SkySchool progress",
    description:
      "Complete one deterministic lesson and persist that completion to your account.",
    href: "/course-catalog",
    label: "Open SkySchool",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Make one social contribution",
    description:
      "Publish a bounded post so the beta has a real account-owned social record.",
    href: "/activity-feed",
    label: "Open activity feed",
    icon: MessageSquare,
  },
  {
    number: "05",
    title: "Submit actionable feedback",
    description:
      "Record one product observation so the beta generates evidence for the next release.",
    href: "/beta-feedback",
    label: "Open feedback",
    icon: Flag,
  },
] as const;

export default function BetaJourney() {
  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
          <Link href="/" className="text-sm text-white/45 hover:text-white">
            ← Home
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black">Durable Beta Journey</h1>
              <Badge
                variant="outline"
                className="border-emerald-400/40 text-emerald-200"
              >
                Non-financial
              </Badge>
            </div>
            <p className="mt-1 text-xs text-white/40">
              A measurable account activation loop for invited testers
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
              Persisted evidence over page count
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Sign in, configure, learn, contribute, report.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/55">
              These are the same five gates measured by the onboarding
              activation status. Profile configuration, lesson progress, social
              posts, and feedback are account-owned records that should survive
              refresh and later sessions when the beta database is available.
            </p>
          </div>

          <Card className="border-emerald-400/25 bg-emerald-400/[0.05] text-white">
            <CardHeader>
              <Activity className="h-5 w-5 text-emerald-200" />
              <CardTitle className="mt-3">Measure the actual journey</CardTitle>
              <CardDescription className="text-white/50">
                The onboarding route derives completion from persisted records
                instead of a client-side tour counter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/onboarding">
                <Button className="w-full">Open activation dashboard</Button>
              </Link>
              <Link href="/activity-evidence">
                <Button variant="outline" className="w-full">
                  Inspect activity evidence
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="h-full border-white/10 bg-white/[0.025] text-white"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.18em] text-white/30">
                      {step.number}
                    </span>
                    <Icon className="h-5 w-5 text-emerald-200" />
                  </div>
                  <CardTitle className="mt-2 text-base">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="leading-6 text-white/45">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={step.href}>
                    <Button variant="outline" className="w-full">
                      {step.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-sm leading-7 text-white/50">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
          This journey does not issue credentials, token rewards, staking
          rewards, airdrops, payments, wallet custody, signatures, blockchain
          transactions, provider-backed AI output, livestream delivery, or
          production-availability guarantees.
        </section>
      </div>
    </main>
  );
}
