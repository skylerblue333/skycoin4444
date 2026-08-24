import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Database, Globe2, Server, Shield, Users } from "lucide-react";

type ReadinessItem = {
  name: string;
  status: "verified" | "partial" | "unverified";
  detail: string;
  icon: React.ElementType;
};

const READINESS: ReadinessItem[] = [
  { name: "Application code", status: "verified", detail: "Repository changes and pull-request evidence are available on GitHub.", icon: CheckCircle2 },
  { name: "Production infrastructure", status: "unverified", detail: "No live cluster, region, reverse-proxy, TLS, autoscaling, or deployment evidence is connected to this screen.", icon: Server },
  { name: "Production database", status: "unverified", detail: "No independently verified production database endpoint, migration state, backup, or restore evidence is connected here.", icon: Database },
  { name: "Security posture", status: "partial", detail: "Application-level hardening exists on review branches; infrastructure security and external controls remain separate gates.", icon: Shield },
  { name: "Global operations", status: "unverified", detail: "Regional traffic, uptime, DAU, growth, and incident telemetry are not available from a verified source.", icon: Globe2 },
  { name: "Community operations", status: "partial", detail: "Community and social surfaces exist, but live membership and moderation telemetry are not connected here.", icon: Users },
];

const statusClass = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  partial: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  unverified: "border-slate-500/30 bg-slate-500/10 text-slate-300",
} as const;

export default function SituationRoom() {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="border-b border-yellow-500/20 pb-5">
          <h1 className="text-2xl font-black tracking-widest">SITUATION ROOM</h1>
          <p className="mt-1 text-sm text-yellow-500/60">Operational readiness and evidence status</p>
        </div>

        <div className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          This page does not synthesize threat levels, platform scores, DAU, agent activity, economic health, governance health, or incident recommendations from unavailable APIs. Those values remain unverified until connected to real telemetry.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {READINESS.map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.name} className="border-white/10 bg-white/5 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-base"><Icon className="h-4 w-4 text-yellow-400" />{item.name}</CardTitle>
                    <Badge variant="outline" className={statusClass[item.status]}>{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent><p className="text-sm text-white/60">{item.detail}</p></CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
