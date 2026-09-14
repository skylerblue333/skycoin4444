import { BarChart3, Database, FileCheck2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const evidenceRows = [
  ["Account-owned activity", "Available on source surfaces", "Posts, lessons, and local mission progress can be inspected where their source records exist."],
  ["Platform-wide audience", "Not measured", "No verified DAU, MAU, viewer, reach, or growth dataset is connected to this beta."],
  ["Revenue and payouts", "Not measured", "Commerce rehearsal and wallet education do not represent settled money or creator earnings."],
  ["Content ranking", "Not measured", "The beta does not claim a production recommendation or ranking pipeline."],
] as const;

export default function Analytics() {
  return (
    <ExperienceShell
      title="Evidence & Analytics"
      subtitle="A truthful view of what this beta can verify today."
      icon={BarChart3}
      accent="violet"
      badge="Evidence room"
      quickLinks={[
        { href: "/activity-feed", label: "Social evidence", detail: "Inspect source activity", icon: Database },
        { href: "/beta-workspace", label: "Tester workspace", detail: "Record observations", icon: FileCheck2 },
        { href: "/route-health", label: "Route health", detail: "Check recovery paths", icon: ShieldCheck },
      ]}
    >
      <SurfaceCard className="border-violet-200 bg-violet-50/70 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
          <div>
            <h2 className="font-black text-violet-950">No fabricated metrics</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-violet-900/75">
              This surface intentionally reports evidence boundaries instead of inventing users, traffic, revenue, engagement, or performance. Use the linked source surfaces to inspect behavior that the beta actually stores or renders.
            </p>
          </div>
        </div>
      </SurfaceCard>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Verified scale", "Not measured", "No production-wide dataset is connected."],
          ["Financial settlement", "Gated", "No payouts or revenue claims are made."],
          ["Local evidence", "Inspectable", "Testers can verify source behavior directly."],
        ].map(([label, value, detail]) => (
          <SurfaceCard key={label} className="p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
            <div className="mt-2 text-xl font-black text-slate-800">{value}</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
          </SurfaceCard>
        ))}
      </div>

      <SurfaceCard className="mt-5 overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-black text-slate-900">Evidence coverage</h2>
          <p className="mt-1 text-sm text-slate-500">Read the boundary before interpreting any number shown elsewhere in the product.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {evidenceRows.map(([area, status, detail]) => (
            <div key={area} className="grid gap-2 p-5 md:grid-cols-[180px_150px_1fr] md:items-start">
              <div className="font-bold text-slate-800">{area}</div>
              <div><span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">{status}</span></div>
              <p className="text-sm leading-6 text-slate-500">{detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
        Need a concrete verification path? <Link href="/beta-workspace" className="font-bold text-violet-700 hover:text-violet-900">Open the tester workspace</Link> and record the exact route, action, and observed result.
      </div>
    </ExperienceShell>
  );
}
