import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Gamepad2,
  HandHeart,
  LockKeyhole,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const missionIcons = {
  social: MessageSquare,
  learn: BookOpen,
  play: Gamepad2,
  impact: HandHeart,
} as const;

export default function EcosystemJourneyCard() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const journeyQuery = trpc.charity.journey.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    staleTime: 15_000,
  });

  const journey = journeyQuery.data;

  return (
    <section
      className="rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.045] p-6"
      aria-label="SKYCOIN4444 ecosystem journey"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/65">
            Persisted journey evidence
          </p>
          <h3 className="mt-2 text-xl font-black text-white">
            Make progress that connects
          </h3>
        </div>
        <Badge
          variant="outline"
          className="border-emerald-300/25 text-emerald-100"
        >
          Non-financial beta
        </Badge>
      </div>

      {!authLoading && !isAuthenticated ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4">
          <div className="flex gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
            <div>
              <p className="font-bold text-white">Sign in to track the loop</p>
              <p className="mt-1 text-sm leading-6 text-white/48">
                Social posts, completed lessons, synced arcade plays, pledge intent,
                and volunteer time are read from your account when persistence is
                available.
              </p>
              <Link href="/signin">
                <Button size="sm" className="mt-3">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : journeyQuery.isLoading || authLoading ? (
        <div className="mt-5 h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.025]" />
      ) : journeyQuery.error ? (
        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.045] p-4 text-sm leading-6 text-amber-50/70">
          Journey evidence is temporarily unavailable. The product links still work,
          and this surface does not invent completion when the backend cannot prove it.
        </div>
      ) : journey ? (
        <>
          <div className="mt-5 flex items-center gap-4">
            <Progress value={journey.completionPercent} className="h-2 flex-1" />
            <strong className="text-sm text-white">
              {journey.completedCount}/{journey.totalCount}
            </strong>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {journey.missions.map(mission => {
              const Icon = missionIcons[mission.id];
              return (
                <Link
                  key={mission.id}
                  href={mission.route}
                  className={
                    "group rounded-2xl border p-3 transition " +
                    (mission.complete
                      ? "border-emerald-300/20 bg-emerald-300/[0.055]"
                      : "border-white/10 bg-white/[0.025] hover:border-amber-300/20")
                  }
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl " +
                        (mission.complete
                          ? "bg-emerald-300/10 text-emerald-200"
                          : "bg-white/[0.05] text-white/45")
                      }
                    >
                      {mission.complete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-white/88">
                        {mission.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-white/38">
                        {mission.evidence}
                      </span>
                    </span>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/55" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/60">
              Next useful step
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-white">{journey.nextMission.label}</p>
                <p className="mt-1 text-xs text-white/42">
                  Completion comes from recorded evidence, not a client-only tour flag.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={journey.nextMission.route}>
                  <Button size="sm">Go now</Button>
                </Link>
                <Link href="/hope-a-i">
                  <Button size="sm" variant="outline">
                    <Bot className="mr-1.5 h-4 w-4" />
                    Ask HopeAI
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-white/30">
            SkyHope records pledge intent and volunteer activity only. This card does
            not claim payment execution, custody, blockchain transfer, tax
            deductibility, beneficiary verification, or autonomous HopeAI action.
          </p>
        </>
      ) : null}
    </section>
  );
}
