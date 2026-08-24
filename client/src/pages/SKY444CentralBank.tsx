import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Banknote, Coins, Landmark, ShieldCheck } from "lucide-react";

type PlanningArea = {
  name: string;
  status: "draft" | "unverified";
  detail: string;
};

const PLANNING_AREAS: PlanningArea[] = [
  { name: "Token registry", status: "draft", detail: "Token names, supplies, circulation, and roles must come from deployed contracts or an approved tokenomics specification before they are presented as facts." },
  { name: "Monetary policy", status: "draft", detail: "Emission, treasury, staking, burns, and reward policy require explicit governance and contract rules." },
  { name: "Market state", status: "unverified", detail: "No verified market-price, liquidity, volume, or exchange feed is connected to this page." },
  { name: "Treasury", status: "unverified", detail: "No production treasury balances, custody accounts, or on-chain reserves are verified here." },
  { name: "Digital-nation economy", status: "draft", detail: "Economy/governance simulation concepts remain product design until their backend and governance rules are implemented." },
];

export default function SKY444CentralBank() {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="border-b border-yellow-500/20 pb-5">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500/10"><Landmark className="h-5 w-5 text-yellow-400" /></div><div><h1 className="text-2xl font-black tracking-wide">SKY444 Economic Planning</h1><p className="text-sm text-yellow-500/60">Tokenomics and treasury design status — not a live central bank.</p></div></div>
        </div>

        <div className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />The previous screen contained hard-coded supplies, circulating amounts, market health, and emission data. Those values are no longer presented as live or verified.</div>

        <div className="grid gap-4 md:grid-cols-2">
          {PLANNING_AREAS.map(area => (
            <Card key={area.name} className="border-white/10 bg-white/5 text-white">
              <CardHeader className="pb-2"><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">{area.name}</CardTitle><Badge variant="outline" className={area.status === "draft" ? "border-yellow-500/30 text-yellow-300" : "border-slate-500/30 text-slate-300"}>{area.status}</Badge></div></CardHeader>
              <CardContent><p className="text-sm text-white/60">{area.detail}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><Coins className="mb-2 h-5 w-5 text-yellow-400" /><p className="font-medium">Contracts</p><p className="mt-1 text-xs text-white/50">Required before token supply/circulation is authoritative.</p></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><Banknote className="mb-2 h-5 w-5 text-emerald-400" /><p className="font-medium">Treasury evidence</p><p className="mt-1 text-xs text-white/50">Required before balances/reserves are displayed.</p></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="mb-2 h-5 w-5 text-blue-400" /><p className="font-medium">Governance</p><p className="mt-1 text-xs text-white/50">Required before economic-policy changes are executable.</p></div>
        </div>
      </div>
    </div>
  );
}
