/*
 * Operational readiness philosophy: evidence first. Render only values returned
 * by approved endpoints; never infer uptime, traffic, revenue, or chain health.
 */
import { useCallback, useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, Database, LockKeyhole, RefreshCw, Server, ShieldCheck, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CheckState = "ok" | "degraded" | "unavailable" | "unknown";
type EndpointState = { state: CheckState; detail: string; observedAt?: string };

function stateFromResponse(response: Response, body: Record<string, unknown>): EndpointState {
  if (!response.ok) return { state: "unavailable", detail: `HTTP ${response.status}; service did not report readiness` };
  const status = String(body.status ?? "unknown");
  return { state: status === "ok" || status === "ready" ? "ok" : status === "degraded" ? "degraded" : "unknown", detail: status, observedAt: String(body.generatedAt ?? new Date().toISOString()) };
}

function StateIcon({ state }: { state: CheckState }) {
  if (state === "ok") return <CheckCircle2 className="h-5 w-5 text-emerald-300" />;
  if (state === "degraded") return <AlertTriangle className="h-5 w-5 text-amber-300" />;
  if (state === "unavailable") return <XCircle className="h-5 w-5 text-rose-300" />;
  return <Activity className="h-5 w-5 text-white/35" />;
}

function StateBadge({ state }: { state: CheckState }) { return <Badge variant="outline" className={state === "ok" ? "border-emerald-400/40 text-emerald-200" : state === "degraded" ? "border-amber-400/40 text-amber-200" : state === "unavailable" ? "border-rose-400/40 text-rose-200" : "border-white/15 text-white/45"}>{state}</Badge>; }

export default function OperationalReadiness() {
  const [health, setHealth] = useState<EndpointState>({ state: "unknown", detail: "not checked" });
  const [readiness, setReadiness] = useState<EndpointState>({ state: "unknown", detail: "not checked" });
  const [database, setDatabase] = useState<EndpointState>({ state: "unknown", detail: "not checked" });
  const [observedAt, setObservedAt] = useState<string>();
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [healthResult, readinessResult] = await Promise.allSettled([fetch("/api/beta/health", { cache: "no-store" }), fetch("/api/beta/readiness", { cache: "no-store" })]);
    const parse = async (result: PromiseSettledResult<Response>): Promise<EndpointState> => {
      if (result.status === "rejected") return { state: "unavailable", detail: "network request failed" };
      try { return stateFromResponse(result.value, await result.value.json() as Record<string, unknown>); } catch { return { state: "unavailable", detail: "invalid response" }; }
    };
    const healthState = await parse(healthResult); const readinessState = await parse(readinessResult);
    setHealth(healthState); setReadiness(readinessState); setDatabase(readinessState.state === "ok" ? { state: "ok", detail: "database probe passed" } : readinessState.state === "unavailable" ? { state: "unavailable", detail: "database probe unavailable" } : { state: "unknown", detail: "database state not independently verified" }); setObservedAt(new Date().toISOString()); setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  const states = [{ label: "Beta health endpoint", icon: Server, value: health }, { label: "Database readiness", icon: Database, value: database }, { label: "Release readiness", icon: ShieldCheck, value: readiness }];
  return <main className="min-h-screen bg-[#050510] text-white"><header className="border-b border-white/10 bg-[#050510]/95"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5"><div className="flex items-center gap-3"><Link href="/beta-workspace" className="text-sm text-white/45 hover:text-white">← Beta workspace</Link><div className="h-4 w-px bg-white/15" /><div><div className="flex items-center gap-2"><h1 className="font-black">Operational Readiness</h1><Badge variant="outline" className="border-cyan-400/40 text-cyan-200">Evidence view</Badge></div><p className="mt-1 text-xs text-white/40">Observed service state for the engineering beta</p></div></div><Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading} className="border-white/15 text-white/70"><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button></div></header><div className="mx-auto max-w-6xl space-y-8 px-4 py-10"><section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">Release operations</p><h2 className="mt-3 text-4xl font-black tracking-tight">Know what is ready before you call it live.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55">This page reports only approved endpoint responses. It does not estimate uptime, traffic, capacity, revenue, user activity, wallet balances, or blockchain status.</p></div><Card className="border-rose-400/25 bg-rose-400/[0.05] text-white"><CardHeader><LockKeyhole className="h-5 w-5 text-rose-200" /><CardTitle className="mt-3 text-rose-100">High-risk boundary</CardTitle><CardDescription className="text-white/55">Financial settlement, custody, signing, transfer, and production-chain execution remain disabled.</CardDescription></CardHeader><CardContent className="text-sm text-white/60">Readiness is not authorization. A healthy API does not promote gated capabilities.</CardContent></Card></section><section className="grid gap-4 md:grid-cols-3">{states.map(({ label, icon: Icon, value }) => <Card key={label} className="border-white/10 bg-white/[0.03]"><CardHeader className="pb-3"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-cyan-200" /><StateBadge state={value.state} /></div><CardTitle className="mt-3 text-base">{label}</CardTitle><CardDescription className="text-white/50">{value.detail}</CardDescription></CardHeader><CardContent className="text-xs text-white/35">{value.observedAt ? `Observed ${new Date(value.observedAt).toLocaleString()}` : "Awaiting observation"}</CardContent></Card>)}</section><section className="grid gap-5 lg:grid-cols-[1fr_1fr]"><Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-amber-200" />Local test procedure</CardTitle><CardDescription className="text-white/50">Run the same checks on the canonical backend before testing persisted journeys.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-white/60"><p><span className="font-semibold text-white">1.</span> Start the backend with its local MySQL dependency.</p><p><span className="font-semibold text-white">2.</span> Open `/api/beta/health` and `/api/beta/readiness` directly.</p><p><span className="font-semibold text-white">3.</span> Confirm readiness returns `ready` and database returns `ok`.</p><p><span className="font-semibold text-white">4.</span> Run `pnpm local:smoke` and record failures rather than treating the shell as evidence.</p></CardContent></Card><Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-200" />Evidence interpretation</CardTitle><CardDescription className="text-white/50">The status cards are intentionally conservative.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-white/60"><p><StateIcon state={health.state} /><span className="ml-2">Health reports whether the approved beta endpoint responded.</span></p><p><StateIcon state={readiness.state} /><span className="ml-2">Readiness reports whether the database probe completed.</span></p><p><StateIcon state="unavailable" /><span className="ml-2">Unavailable means “do not infer”; it is not a degraded success.</span></p>{observedAt && <p className="border-t border-white/10 pt-3 text-xs text-white/35">Last check completed {new Date(observedAt).toLocaleString()}</p>}</CardContent></Card></section></div></main>;
}
