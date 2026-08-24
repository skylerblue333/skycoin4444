import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, Code2, GitBranch, Shield, Sparkles, Wrench } from "lucide-react";

type EvidenceItem = {
  title: string;
  status: "verified" | "in-progress" | "unverified";
  detail: string;
  icon: React.ElementType;
};

const EVIDENCE: EvidenceItem[] = [
  { title: "GitHub engineering work", status: "verified", detail: "Current branch work and pull-request commits are stored in the project repository.", icon: GitBranch },
  { title: "Core API contract cleanup", status: "verified", detail: "Compatibility endpoints no longer fabricate successful backend behavior when a service is unavailable.", icon: Code2 },
  { title: "Strict TypeScript recovery", status: "in-progress", detail: "The active gate branch is reducing the pre-existing strict-TypeScript backlog before merge.", icon: Wrench },
  { title: "Authentication hardening", status: "in-progress", detail: "Session/app binding and fail-closed signing configuration are implemented on dedicated review branches.", icon: Shield },
  { title: "Production launch", status: "unverified", detail: "This page does not claim production deployment, live infrastructure, revenue, users, token activity, or external-service success.", icon: Sparkles },
];

const statusClass = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "in-progress": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  unverified: "border-slate-500/30 bg-slate-500/10 text-slate-300",
} as const;

export default function LegendaryStatus() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_280)] p-6 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <Award className="mx-auto mb-3 h-10 w-10 text-yellow-400" />
          <h1 className="text-3xl font-black">Engineering Evidence Status</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">Achievement-style claims are intentionally replaced with concrete repository and validation status until measurable evidence exists.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {EVIDENCE.map(item => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-white/10 bg-white/5 text-white">
                <CardHeader className="pb-2"><div className="flex items-start justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><Icon className="h-4 w-4 text-yellow-400" />{item.title}</CardTitle><Badge variant="outline" className={statusClass[item.status]}>{item.status}</Badge></div></CardHeader>
                <CardContent><p className="text-sm text-white/60">{item.detail}</p></CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />This page now favors verifiable engineering checkpoints over fabricated ranks, audience numbers, achievements, or platform metrics.
        </div>
      </div>
    </div>
  );
}
