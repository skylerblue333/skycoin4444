import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Gamepad2,
  HeartHandshake,
  ShieldCheck,
  Target,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CharityLeaderboard() {
  const boundary = trpc.charity.boundary.useQuery(undefined, { retry: false });
  const missions = trpc.charity.missions.useQuery(undefined, { retry: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        backHref="/charity"
        title="SkyHope Mission Index"
        subtitle="Packaged service-learning missions and the evidence boundary behind them"
        icon={HeartHandshake}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-300/15 bg-emerald-300/[0.04]">
          <CardContent className="p-5">
            <Target className="h-5 w-5 text-emerald-500" />
            <p className="mt-4 text-3xl font-black">
              {boundary.data?.missionCount ?? missions.data?.length ?? "—"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              packaged missions
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-300/15 bg-amber-300/[0.04]">
          <CardContent className="p-5">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <p className="mt-4 text-2xl font-black">
              {boundary.data?.liveDonationExecution === false ? "Off" : "—"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              live donation execution
            </p>
          </CardContent>
        </Card>

        <Card className="border-violet-300/15 bg-violet-300/[0.04]">
          <CardContent className="p-5">
            <HeartHandshake className="h-5 w-5 text-violet-500" />
            <p className="mt-4 text-2xl font-black">Charity-only</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              future finance scope
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
            Learn → coach → practice → verify
          </p>
          <h2 className="mt-2 text-2xl font-black">Impact missions</h2>
        </div>

        {missions.isLoading ? (
          <Card className="p-8 text-center text-muted-foreground">
            Loading packaged missions…
          </Card>
        ) : missions.error ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] p-6">
            <p className="font-semibold">Mission service is temporarily unavailable.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The main SkyHope planner remains usable on-device.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {(missions.data ?? []).map(mission => (
              <Card key={mission.id} className="border-border/50">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">{mission.theme}</Badge>
                    <Badge
                      variant="outline"
                      className="border-emerald-300/20 text-emerald-600"
                    >
                      non-financial
                    </Badge>
                  </div>
                  <CardTitle>{mission.title}</CardTitle>
                  <CardDescription className="leading-6">
                    {mission.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
                    <strong className="text-foreground">Evidence boundary:</strong>{" "}
                    {mission.evidence}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link href={mission.learningRoute}>
                      <Button variant="outline" size="sm" className="w-full">
                        <BookOpen className="mr-1 h-3.5 w-3.5" />
                        Learn
                      </Button>
                    </Link>
                    <Link href={mission.coachRoute}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Bot className="mr-1 h-3.5 w-3.5" />
                        Coach
                      </Button>
                    </Link>
                    <Link href={mission.practiceRoute}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Gamepad2 className="mr-1 h-3.5 w-3.5" />
                        Practice
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="mt-8 border-white/10">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">No donor leaderboard is shown in this beta.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Ranking people by invented donation totals would be fake progress.
              Real financial reporting requires verified provider receipts and
              beneficiary records that are not part of the current release.
            </p>
          </div>
          <Link href="/charity">
            <Button className="shrink-0">
              Open SkyHope planner
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
