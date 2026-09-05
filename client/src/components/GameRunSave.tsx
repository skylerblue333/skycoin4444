import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export type PersistableBetaGameId =
  | "sky-rush"
  | "spark-tap"
  | "crypto-quiz"
  | "block-builder"
  | "arcade-lab";

type Props = {
  gameId: PersistableBetaGameId;
  mode: string;
  score: number;
  sparks: number;
  combo: number;
  durationMs?: number;
  className?: string;
};

function createRunId() {
  return globalThis.crypto.randomUUID();
}

export default function GameRunSave({
  gameId,
  mode,
  score,
  sparks,
  combo,
  durationMs = 0,
  className = "",
}: Props) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [runId] = useState(createRunId);

  const saveRun = trpc.betaGaming.recordRun.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.betaGaming.dashboard.invalidate(),
        utils.betaGaming.recent.invalidate(),
        utils.activityEvidence.list.invalidate(),
      ]);
    },
  });

  if (!isAuthenticated) {
    return (
      <div
        className={
          "rounded-2xl border border-white/10 bg-white/[0.025] p-4 " +
          className
        }
      >
        <ShieldCheck className="h-4 w-4 text-sky-200" />
        <p className="mt-2 text-xs leading-5 text-white/40">
          This run is still local. Sign in if you want to save it to your beta
          account and include it in Activity Evidence and Data Export.
        </p>
        <Link href="/signin">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3 border-white/15 bg-white/[0.03] text-white"
          >
            Sign in to save
          </Button>
        </Link>
      </div>
    );
  }

  if (saveRun.isSuccess) {
    return (
      <div
        className={
          "rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4 " +
          className
        }
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 font-semibold text-emerald-100">
          <CheckCircle2 className="h-4 w-4" />
          Run saved to your account
        </div>
        <p className="mt-1 text-xs leading-5 text-white/40">
          This saved record can now contribute to personal bests, achievements,
          the daily challenge, Activity Evidence, and Data Export.
        </p>
        <Link
          href="/gaming"
          className="mt-3 inline-flex text-xs font-semibold text-emerald-100 hover:text-white"
        >
          View gaming progress
        </Link>
      </div>
    );
  }

  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/[0.025] p-4 " +
        className
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Save this run?
          </p>
          <p className="mt-1 text-xs leading-5 text-white/40">
            Saving is explicit. Anonymous/local play is not written by the
            betaGaming API.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={saveRun.isPending}
          onClick={() =>
            saveRun.mutate({
              runId,
              gameId,
              mode,
              score,
              sparks,
              combo,
              durationMs: Math.max(
                0,
                Math.min(3_600_000, Math.round(durationMs))
              ),
            })
          }
        >
          <Save className="mr-2 h-4 w-4" />
          {saveRun.isPending ? "Saving…" : "Save run"}
        </Button>
      </div>

      {saveRun.error ? (
        <p className="mt-3 text-xs text-rose-200" role="alert">
          This run could not be saved. Your local game result is unchanged.
        </p>
      ) : null}
    </div>
  );
}
