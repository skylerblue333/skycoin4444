import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Bot,
  Gamepad2,
  GraduationCap,
  Heart,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const missionIcons = {
  social: MessageCircleMore,
  learn: GraduationCap,
  play: Gamepad2,
  impact: Heart,
} as const;

const activationEvidenceRoutes = [
  { label: "Sign in", href: "/signin" },
  { label: "Profile", href: "/profile" },
  { label: "Course catalog", href: "/course-catalog" },
  { label: "Social activity", href: "/activity-feed" },
  { label: "Beta feedback", href: "/beta-feedback" },
  { label: "Activity evidence", href: "/activity-evidence" },
] as const;

export default function BetaJourney() {
  const { user, loading, isAuthenticated } = useAuth();
  const journey = trpc.charity.journey.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  if (loading) {
    return <main className="min-h-screen bg-[#050510] p-8 text-white">Loading connected journey…</main>;
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="rounded-[2rem] border border-amber-200/12 bg-gradient-to-br from-amber-300/[0.06] via-white/[0.02] to-rose-400/[0.05] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles className="h-7 w-7 text-amber-200" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-100/55">Connected beta journey</p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Social → Learn → Play → Help → HopeAI.</h1>
            </div>
            <Badge variant="outline" className="border-emerald-300/30 text-emerald-100">
              Persisted evidence
            </Badge>
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/50">
            This path is derived from account-owned records instead of a client-side tour counter. Social posts,
            SkySchool lesson completions, synced arcade plays, and SkyHope impact actions all feed one next-step
            contract. HopeAI stays available as the planning assistant without pretending its local chat history is
            server-persisted completion evidence. Persisted evidence over page count.
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/42">
            The durable activation loop remains the same five gates measured by the onboarding. Connected ecosystem paths are optional ways to keep going after those gates: learn, explore, play, help, and ask HopeAI. Learn once, then move somewhere useful.
          </p>
        </header>

        {!isAuthenticated || !user ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04]">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-black">Sign in to measure the real journey</h2>
              <p className="text-sm leading-6 text-white/45">
                Anonymous browsing is still available, but persisted journey status requires an invited beta account.
              </p>
              <Button onClick={() => startLogin()}>Sign in</Button>
            </CardContent>
          </Card>
        ) : journey.data ? (
          <>
            <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <Card className="border-emerald-300/20 bg-emerald-300/[0.035]">
                <CardHeader>
                  <CardTitle>Account progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <strong className="text-6xl font-black text-emerald-100">
                      {journey.data.completionPercent}%
                    </strong>
                    <p className="mt-2 text-sm text-white/40">
                      {journey.data.completedCount} of {journey.data.totalCount} evidence-backed missions complete
                    </p>
                  </div>
                  <Progress value={journey.data.completionPercent} />
                  <Link href={journey.data.nextMission.route}>
                    <Button className="w-full">
                      Continue: {journey.data.nextMission.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs leading-5 text-white/30">
                    SkyHope persistence: {journey.data.impactPersistenceReady ? "ready" : "migration 0015 required"}
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-3 sm:grid-cols-2">
                {journey.data.missions.map(mission => {
                  const Icon = missionIcons[mission.id as keyof typeof missionIcons] ?? Sparkles;
                  return (
                    <Link
                      key={mission.id}
                      href={mission.route}
                      className={
                        "rounded-3xl border p-5 transition hover:-translate-y-0.5 " +
                        (mission.complete
                          ? "border-emerald-300/20 bg-emerald-300/[0.04]"
                          : "border-white/10 bg-white/[0.025] hover:border-amber-200/20")
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/20">
                          <Icon className="h-5 w-5 text-amber-100" />
                        </span>
                        <Badge
                          variant="outline"
                          className={mission.complete ? "border-emerald-300/30 text-emerald-100" : ""}
                        >
                          {mission.complete ? "Complete" : "Open"}
                        </Badge>
                      </div>
                      <h2 className="mt-4 font-black">{mission.label}</h2>
                      <p className="mt-2 text-xs leading-5 text-white/35">{mission.evidence}</p>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Card className="border-violet-300/15 bg-violet-300/[0.035]">
                <CardHeader>
                  <Bot className="h-5 w-5 text-violet-200" />
                  <CardTitle className="mt-2">HopeAI assist</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-white/42">
                    Use the active HopeAI workspace to plan a lesson, debug code, draft outreach, organize a volunteer
                    project, or think through the next ecosystem task.
                  </p>
                  <Link href="/hope-a-i">
                    <Button className="mt-4 w-full" variant="outline">
                      Open HopeAI
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.025]">
                <CardHeader>
                  <ShieldCheck className="h-5 w-5 text-emerald-200" />
                  <CardTitle className="mt-2">Activation evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-white/42">
                    Inspect the broader onboarding and activity evidence used by the invitation-only beta.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {activationEvidenceRoutes.map(route => (
                      <Link key={route.href} href={route.href}>
                        <Button className="w-full" variant={route.href === "/activity-evidence" ? "outline" : "ghost"}>
                          {route.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-rose-300/15 bg-rose-300/[0.035]">
                <CardHeader>
                  <Heart className="h-5 w-5 text-rose-200" />
                  <CardTitle className="mt-2">SkyHope impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-white/42">
                    Record pledge intent or volunteer effort, then bring what you actually did back to Social.
                  </p>
                  <div className="mt-4 grid gap-2">
                    <Link href="/charity"><Button className="w-full">Open SkyHope</Button></Link>
                    <Link href="/activity-feed"><Button className="w-full" variant="ghost">Open Social</Button></Link>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        ) : (
          <Card className="border-white/10 bg-white/[0.025]">
            <CardContent className="p-6 text-sm text-white/45">
              {journey.isLoading
                ? "Loading account evidence…"
                : journey.error?.message ?? "Journey evidence is unavailable."}
            </CardContent>
          </Card>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 text-sm leading-7 text-white/45">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
          Journey completion does not issue credentials, token rewards, charity verification, payment settlement,
          custody, or blockchain transactions. HopeAI still depends on configured AI availability, and this page does not itself process a donation and does not turn game activity into real-value wagering or rewards. It does not prove external-provider or HopeAI execution. There is no guaranteed AI-provider availability, live donation, or real-value gaming implied by this account-owned engineering-beta summary.
        </section>
      </div>
    </main>
  );
}
