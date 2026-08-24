import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3, CheckCircle2, Globe, Server, Shield, Users } from "lucide-react";

type Gate = {
  name: string;
  status: "verified" | "partial" | "unverified";
  detail: string;
  icon: React.ElementType;
};

const GATES: Gate[] = [
  { name: "Application repository", status: "verified", detail: "GitHub repository and branch evidence are available.", icon: CheckCircle2 },
  { name: "Global regions", status: "unverified", detail: "No production multi-region deployment evidence is connected to this screen.", icon: Globe },
  { name: "Infrastructure health", status: "unverified", detail: "No independently verified production cluster telemetry is connected here.", icon: Server },
  { name: "Security posture", status: "partial", detail: "Application hardening exists, but infrastructure/security-service evidence remains a separate gate.", icon: Shield },
  { name: "Community operations", status: "partial", detail: "Community UI exists; live membership/ambassador operations are not verified here.", icon: Users },
  { name: "Analytics", status: "partial", detail: "Analytics surfaces exist; live global operating metrics are not connected here.", icon: BarChart3 },
];

const statusClass = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  partial: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  unverified: "border-slate-500/30 bg-slate-500/10 text-slate-300",
} as const;

export default function GlobalOperationsCenter() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <div className="flex items-center gap-2"><Globe className="h-6 w-6 text-primary" /><h1 className="text-2xl font-bold">Global Operations Center</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">Evidence-oriented readiness view for ecosystem operations.</p>
        </div>

        <div className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Token registry status, governance results, ambassador counts, regional heatmaps, growth figures, and live infrastructure health are not fabricated on this screen. They remain unverified until a real source is connected.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {GATES.map(gate => {
            const Icon = gate.icon;
            return (
              <Card key={gate.name}>
                <CardHeader className="pb-2"><div className="flex items-start justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><Icon className="h-4 w-4 text-primary" />{gate.name}</CardTitle><Badge variant="outline" className={statusClass[gate.status]}>{gate.status}</Badge></div></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{gate.detail}</p></CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
