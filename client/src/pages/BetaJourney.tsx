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
  BookOpen,
  ClipboardCheck,
  Flag,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";

const steps = [
  {
    number: "01",
    title: "Review the beta boundary",
    description:
      "Read what is available, what is test-only, and what remains unavailable before starting.",
    href: "/beta-catalog",
    label: "Open area catalog",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Complete the curated course",
    description:
      "Choose one authored SkySchool track and complete its deterministic lesson questions in this session.",
    href: "/course-catalog",
    label: "Open course catalog",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Review your result",
    description:
      "Confirm that progress and scoring behave as expected. This beta path does not issue credentials or claim durable persistence.",
    href: "/mission-control",
    label: "Return to Mission Control",
    icon: ClipboardCheck,
  },
];

export default function BetaJourney() {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Home
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">
                Mission Control Beta Journey
              </h1>
              <Badge
                variant="outline"
                className="border-amber-400/50 text-amber-200"
              >
                Non-financial
              </Badge>
            </div>
            <p className="text-[11px] text-white/40">
              One verified learning journey for invited testers
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <section className="max-w-3xl">
          <Badge
            variant="outline"
            className="border-amber-400/50 text-amber-200"
          >
            Engineering beta workflow
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            Explore, learn, verify, and report
          </h2>
          <p className="mt-3 text-base leading-7 text-white/60">
            This is the first concrete Skycoin ecosystem beta journey. It uses
            authored course content and deterministic quizzes only. No payments,
            wallets, token actions, blockchain execution, provider-backed AI, or
            credential issuance is performed.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="border-white/10 bg-white/[0.02]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-amber-200/70">
                      {step.number}
                    </span>
                    <Icon className="h-5 w-5 text-amber-200" />
                  </div>
                  <CardTitle className="text-base text-white">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="leading-6 text-white/50">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={step.href}>
                    <Button
                      variant="outline"
                      className="w-full border-white/15 text-white/80"
                    >
                      {step.label}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card className="border-sky-400/30 bg-sky-400/[0.05]">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sky-200" />
                <h3 className="font-semibold text-sky-100">
                  Beta feedback is part of the journey
                </h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Record the route, expected result, actual result, and whether
                the issue affects privacy, authorization, data integrity, or
                availability. Send security-sensitive reports through
                `SECURITY.md`.
              </p>
            </div>
            <Link href="/bug-reporting">
              <Button className="shrink-0">Report feedback</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
