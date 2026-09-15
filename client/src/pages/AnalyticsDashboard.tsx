import { Activity, Database, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const readiness = [
  ["API latency and throughput", "Not measured", "No production telemetry source is connected to this beta."],
  ["Database and cache health", "Not measured", "Operational dashboards require a verified deployment telemetry contract."],
  ["Error rate and uptime", "Not measured", "Build success and local tests are not uptime or availability evidence."],
  ["Engine-level monitoring", "Not measured", "The beta does not claim monitoring across strategic engines or providers."],
] as const;

export default function AnalyticsDashboard() {
  return (
    <ExperienceShell
      title="Operational Readiness"
      subtitle="A truthful boundary for deployment and runtime evidence."
      icon={Activity}
      accent="indigo"
      badge="Control room"
      quickLinks={[
        { href: "/analytics", label: "Evidence analytics", detail: "Review product boundaries", icon: FileCheck2 },
        { href: "/route-health", label: "Route health", detail: "Inspect recovery paths", icon: ShieldCheck },
        { href: "/beta-workspace", label: "Tester workspace", detail: "Record observations", icon: Database },
      ]}
    >
      <SurfaceCard className="border-cyan-200 bg-cyan-50/70 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
          <div>
            <h2 className="font-black text-cyan-950">Deployment evidence is separate from build evidence</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-cyan-950/75">A successful local build and passing tests establish engineering checks, not production traffic, uptime, latency, cache behavior, or database health. Those claims stay unavailable until a verified telemetry source is connected.</p>
          </div>
        </div>
      </SurfaceCard>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {readiness.map(([label, status, detail]) => <SurfaceCard key={label} className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-bold text-slate-900">{label}</h2><span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">{status}</span></div><p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p></SurfaceCard>)}
      </div>
      <SurfaceCard className="mt-5 p-5"><h2 className="font-black text-slate-900">What is verified in this beta</h2><ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 md:grid-cols-2"><li>• TypeScript validation and production bundling.</li><li>• Deterministic release and recovery tests.</li><li>• Route registry and user-facing recovery paths.</li><li>• Explicit boundaries around money, custody, identity, and scale.</li></ul><p className="mt-5 text-sm text-slate-500">For a product-facing evidence view, open <Link href="/analytics" className="font-bold text-cyan-700 hover:text-cyan-900">Evidence & Analytics</Link>.</p></SurfaceCard>
    </ExperienceShell>
  );
}
