import { motion } from "framer-motion";
import { Coins, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const DEMO_STAKES = [5, 10, 25, 50, 100] as const;

export function formatDemoCredits(value: number): string {
  return Math.max(0, value).toFixed(2);
}

export function GamingBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-[-12rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/15 blur-3xl" />
      <div className="absolute right-[-10rem] top-12 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-15rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
    </div>
  );
}

export function GameStage({
  eyebrow,
  title,
  description,
  accent = "from-fuchsia-500/15 via-transparent to-cyan-500/10",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-[#080a11]/95 text-white shadow-2xl shadow-black/35">
      <div className={"pointer-events-none absolute inset-0 bg-gradient-to-br " + accent} />
      <CardContent className="relative p-0">
        <div className="border-b border-white/10 px-5 py-5 sm:px-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/45">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/42">{description}</p>
        </div>
        <div className="p-5 sm:p-7">{children}</div>
      </CardContent>
    </Card>
  );
}

export function DemoBankroll({
  credits,
  onReset,
  disabled = false,
}: {
  credits: number;
  onReset: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">Demo credits</p>
        <div className="mt-0.5 flex items-center gap-2 text-2xl font-black">
          <Coins className="h-5 w-5 text-amber-300" />
          {formatDemoCredits(credits)}
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="ml-auto border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
        onClick={onReset}
        disabled={disabled}
      >
        Reset
      </Button>
    </div>
  );
}

export function StakeSelector({
  stake,
  onChange,
  disabled = false,
  values = DEMO_STAKES,
}: {
  stake: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  values?: readonly number[];
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.17em] text-white/30">Demo stake</p>
      <div className="flex flex-wrap gap-2">
        {values.map(value => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={stake === value ? "default" : "outline"}
            className={
              stake === value
                ? "shadow-lg shadow-primary/15"
                : "border-white/10 bg-white/[0.025] text-white hover:bg-white/[0.08]"
            }
            onClick={() => onChange(value)}
            disabled={disabled}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DemoBoundary({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.035] p-4 text-xs leading-5 text-white/40">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/80" />
      <p>
        {compact
          ? "Browser-local demo credits only. No deposit, withdrawal, wallet wagering, custody, token settlement, or redeemable reward."
          : "All stakes, chips, multipliers, credits, and payouts on these screens are browser-local demo state with no cash or token value. No deposit, withdrawal, wallet wagering, custody, blockchain settlement, or redeemable reward is implemented."}
      </p>
    </div>
  );
}

export function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: string | number;
  suffix?: string;
}) {
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: 6, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className="tabular-nums"
    >
      {value}{suffix}
    </motion.span>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "win" | "loss" | "live";
}) {
  const className =
    tone === "win"
      ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-100"
      : tone === "loss"
        ? "border-rose-300/20 bg-rose-300/[0.06] text-rose-100"
        : tone === "live"
          ? "border-fuchsia-300/20 bg-fuchsia-300/[0.06] text-fuchsia-100"
          : "border-white/10 bg-white/[0.03] text-white/55";
  return <Badge variant="outline" className={className}>{children}</Badge>;
}
