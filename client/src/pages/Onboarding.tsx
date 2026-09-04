import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Flag,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
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

const activationSteps = [
  {
    id: "account",
    title: "Enter the invitation beta",
    detail:
      "Authenticate through the configured identity provider. Production access remains invite-only.",
    route: "/signin",
    action: "Sign in",
    icon: ShieldCheck,
  },
  {
    id: "profile",
    title: "Configure your profile",
    detail:
      "Save a display name, username, bio, and privacy choice against your authenticated account.",
    route: "/profile",
    action: "Open profile",
    icon: UserRound,
  },
  {
    id: "learning",
    title: "Complete a SkySchool lesson",
    detail:
      "Answer one deterministic lesson question correctly and record the completion to durable course progress.",
    route: "/course-catalog",
    action: "Open SkySchool",
    icon: BookOpen,
  },
  {
    id: "social",
    title: "Publish one social post",
    detail:
      "Create one bounded social post so your account has a real persisted contribution in the beta.",
    route: "/activity-feed",
    action: "Open social feed",
    icon: MessageSquare,
  },
  {
    id: "feedback",
    title: "Submit beta feedback",
    detail:
      "Record one actionable product observation so the beta produces evidence that can drive the next release.",
    route: "/beta-feedback",
    action: "Submit feedback",
    icon: Flag,
  },
] as const;

export default function Onboarding() {
  const { isAuthenticated, loading } = useAuth();
  const activation = trpc.activation.status.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const persistedStatus = new Map(
    activation.data?.steps.map(step => [step.id, step.complete]) ?? []
  );
  const isComplete = (id: (typeof activationSteps)[number]["id"]) =>
    id === "account"
      ? isAuthenticated
      : Boolean(persistedStatus.get(id));

  const completedCount =
    activation.data?.completedCount ?? (isAuthenticated ? 1 : 0);
  const percent =
    activation.data?.percent ?? Math.round((completedCount / activationSteps.length) * 100);
  const activated = activation.data?.activated ?? false;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        Loading invitation status…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <Badge
              variant="outline"
              className="border-emerald-400/40 text-emerald-200"
            >
              Durable activation journey
            </Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Turn an invited account into a real beta user.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/55">
              Progress here comes from account-owned database records, not from
              clicking “next.” Configure your identity, finish a lesson, publish
              a post, and submit feedback. Refresh the page and completed steps
              should remain complete.
            </p>
          </div>

          <Card className="border-emerald-400/25 bg-emerald-400/[0.05] text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Activation evidence</CardTitle>
                  <CardDescription className="text-white/50">
                    {completedCount}/{activationSteps.length} persisted gates complete
                  </CardDescription>
                </div>
                <span className="text-3xl font-black text-emerald-200">
                  {percent}%
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={percent} className="h-2" />
              <p className="mt-4 text-xs leading-5 text-white/40">
                {activated
                  ? "All activation gates are backed by persisted account evidence."
                  : isAuthenticated
                    ? "Complete the remaining account-owned actions below."
                    : "Sign in with an invited identity to begin writing durable beta evidence."}
              </p>
            </CardContent>
          </Card>
        </header>

        {!isAuthenticated && (
          <section className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-400/[0.05] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-amber-100">
                  Invitation admission is the first gate
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  The beta does not accept a SKYCOIN4444 password or fabricate a
                  browser login. Admission is checked before a production session
                  is issued.
                </p>
              </div>
              <Button type="button" onClick={() => startLogin()}>
                Sign in with provider
              </Button>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-4 lg:grid-cols-5">
          {activationSteps.map((step, index) => {
            const complete = isComplete(step.id);
            const Icon = step.icon;
            return (
              <Card
                key={step.id}
                className={
                  "h-full text-white " +
                  (complete
                    ? "border-emerald-400/25 bg-emerald-400/[0.04]"
                    : "border-white/10 bg-white/[0.025]")
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold tracking-[0.18em] text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {complete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/20" />
                    )}
                  </div>
                  <span
                    className={
                      "mt-2 grid h-10 w-10 place-items-center rounded-xl " +
                      (complete
                        ? "bg-emerald-300/10 text-emerald-200"
                        : "bg-white/[0.05] text-white/55")
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
                  <CardDescription className="leading-6 text-white/45">
                    {step.detail}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  {step.id === "account" && !isAuthenticated ? (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => startLogin()}
                    >
                      {step.action}
                    </Button>
                  ) : (
                    <Link href={step.route}>
                      <Button
                        type="button"
                        variant={complete ? "ghost" : "outline"}
                        className="w-full"
                      >
                        {complete ? "Review evidence" : step.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        {activation.error && isAuthenticated && (
          <section className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/[0.05] p-5 text-sm text-rose-100">
            Activation evidence is unavailable: {activation.error.message}
          </section>
        )}

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
              <div>
                <h2 className="font-bold">Inspect the underlying records</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
                  Activity Evidence combines your persisted lesson completions,
                  posts, feedback, discovery actions, and creator briefs. It is
                  an evidence log—not a popularity, revenue, uptime, or blockchain
                  analytics claim.
                </p>
              </div>
            </div>
          </div>
          <Link href="/activity-evidence">
            <Button type="button" variant="outline" className="w-full lg:w-auto">
              Open activity evidence
            </Button>
          </Link>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 p-5 text-xs leading-6 text-white/40">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
          This activation path does not grant token rewards, airdrops,
          certificates, staking rewards, payment capability, wallet custody,
          provider-backed AI, livestream delivery, or blockchain execution.
        </section>
      </div>
    </main>
  );
}
