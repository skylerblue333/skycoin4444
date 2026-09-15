import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  V4_DEMO_SESSION_KEY,
  getV4DemoProgress,
  getV4DemoTrack,
  getV4DemoTrackSteps,
  markV4DemoStepVisited,
  normalizeV4DemoSession,
  type V4DemoSession,
} from "@/lib/v4Demo";

const hiddenRoutes = new Set(["/beta-workspace", "/signin", "/beta-feedback"]);

function readSession(): V4DemoSession {
  if (typeof window === "undefined") return normalizeV4DemoSession(null);
  try {
    return normalizeV4DemoSession(
      JSON.parse(localStorage.getItem(V4_DEMO_SESSION_KEY) ?? "null")
    );
  } catch {
    return normalizeV4DemoSession(null);
  }
}

function persistSession(session: V4DemoSession) {
  try {
    localStorage.setItem(V4_DEMO_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Navigation guidance remains available in memory when storage is blocked.
  }
}

export default function V4DemoCompanion() {
  const [location] = useLocation();
  const [session, setSession] = useState<V4DemoSession>(readSession);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setSession(readSession());
  }, [location]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === V4_DEMO_SESSION_KEY) setSession(readSession());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const track = getV4DemoTrack(session.trackId);
  const steps = getV4DemoTrackSteps(session.trackId);
  const progress = getV4DemoProgress(session);
  const currentStep = useMemo(
    () => steps.find(step => step.route === location) ?? null,
    [location, steps]
  );

  if (!session.visitedStepIds.length || hiddenRoutes.has(location)) return null;

  function openNext() {
    if (!progress.nextStep) return;
    const next = markV4DemoStepVisited(session, progress.nextStep.id);
    persistSession(next);
    setSession(next);
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-[45] w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cyan-300/25 bg-[#070713]/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl"
      aria-label="V4 demo companion"
    >
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-100">
          <Compass className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <strong className="truncate text-xs text-white/85">{track.name}</strong>
            <span className="shrink-0 text-[10px] font-bold text-white/35">
              {progress.visitedCount}/{progress.totalCount} visited
            </span>
          </div>
          <Progress value={progress.percent} className="mt-2 h-1.5" />
        </div>
        <button
          type="button"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse V4 demo companion" : "Expand V4 demo companion"}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 text-white/45 transition hover:bg-white/[0.06] hover:text-white"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {expanded ? (
        <div className="p-4">
          {currentStep ? (
            <>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/50">
                <Eye className="h-3.5 w-3.5" />
                Current demo moment
              </div>
              <h2 className="mt-2 text-base font-black text-white/90">{currentStep.title}</h2>
              <p className="mt-2 text-xs leading-5 text-white/40">{currentStep.promise}</p>
              <div className="mt-3 rounded-xl border border-violet-300/12 bg-violet-300/[0.035] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-violet-100/45">
                  Proof to look for
                </p>
                <p className="mt-1 text-xs leading-5 text-white/45">{currentStep.proof}</p>
              </div>
            </>
          ) : (
            <div className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-100/60" />
              <p className="text-xs leading-5 text-white/40">
                The V4 demo is paused on a route outside the selected track. Return to
                V4 or open the next guided moment when you are ready.
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/beta-workspace">
              <Button size="sm" variant="outline">
                Back to V4
              </Button>
            </Link>
            {progress.nextStep ? (
              <Link href={progress.nextStep.route} onClick={openNext}>
                <Button size="sm">
                  Next · {progress.nextStep.title}
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/beta-workspace">
                <Button size="sm">
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  Review the demo
                </Button>
              </Link>
            )}
          </div>

          <p className="mt-3 text-[10px] leading-4 text-white/25">
            Companion progress records guided route visits only. It does not mark
            evidence, tester passes, product success, or production readiness.
          </p>
        </div>
      ) : null}
    </aside>
  );
}