import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
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

export default function SchoolCertificate() {
  const { user, isAuthenticated, loading } = useAuth();
  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });

  const lessonCompletions = (activity.data ?? []).filter(
    event => event.type === "lesson_completed"
  ).length;

  const evidenceSummary = !isAuthenticated
    ? "Sign in with an invited beta account to inspect account-owned learning evidence."
    : activity.isLoading
      ? "Loading account learning evidence…"
      : activity.error
        ? "Learning evidence is temporarily unavailable."
        : `${lessonCompletions} lesson-completion event${lessonCompletions === 1 ? "" : "s"} are currently visible in the bounded activity-evidence feed.`;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <header className="space-y-4 border-b border-white/10 pb-7">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500/15 text-blue-100">SkySchool</Badge>
            <Badge variant="outline" className="border-amber-300/20 text-amber-100">
              Completion evidence — not a credential
            </Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Learning evidence without a fake certificate
          </h1>
          <p className="max-w-3xl text-base leading-7 text-white/50">
            This legacy certificate route now shows the beta's real boundary:
            authored learning plus account-owned completion evidence when available.
            SKYCOIN4444 does not issue an accredited credential or mint a completion
            record to a blockchain in this beta.
          </p>
        </header>

        <Card className="border-blue-300/20 bg-blue-300/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-blue-200" />
              Account learning evidence
            </CardTitle>
            <CardDescription className="text-white/45">
              Evidence is read from the same bounded activity feed used by the
              canonical SkySchool experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p aria-live="polite" className="text-sm leading-6 text-white/65">
              {evidenceSummary}
            </p>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link href="/activity-evidence">
                  <Button>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Inspect activity evidence
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button>
                    Sign in to inspect evidence
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/course-catalog">
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/[0.03] text-white"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Open course catalog
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "No accreditation claim",
              detail:
                "Lesson or quiz completion does not create academic credit, a professional license, or an externally recognized certificate.",
            },
            {
              icon: ShieldCheck,
              title: "No chain-verification claim",
              detail:
                "This beta does not mint learning completion to a blockchain or claim a public immutable verification record.",
            },
            {
              icon: Brain,
              title: "Continue with HopeAI",
              detail:
                "Use HopeAI as a study assistant when configured, while keeping provider availability and execution boundaries explicit.",
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="border-white/10 bg-white/[0.025] text-white"
              >
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 text-emerald-200" />
                  <h2 className="mt-3 font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/sky-school">
            <Button variant="outline" className="border-white/15 text-white">
              Return to SkySchool
            </Button>
          </Link>
          <Link href="/hope-a-i">
            <Button variant="outline" className="border-white/15 text-white">
              <Brain className="mr-2 h-4 w-4" />
              Open HopeAI Coach
            </Button>
          </Link>
        </div>

        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs leading-6 text-white/35">
          Truth boundary: engineering-beta learning evidence only. No accreditation,
          employer verification, identity verification, token reward, blockchain
          minting, on-chain attestation, guaranteed full-history transcript, or
          external certification is claimed.
        </p>
      </div>
    </main>
  );
}
