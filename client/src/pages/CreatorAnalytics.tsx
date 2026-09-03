/*
 * Creator beta boundary: local planning only. Never fabricate audience,
 * engagement, ratings, revenue, subscriptions, or payout data.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, LockKeyhole, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Draft = { id: string; title: string; brief: string; status: "draft" | "ready"; updatedAt: string };
const STORAGE_KEY = "skycoin4444.creator-drafts.v1";

function readDrafts(): Draft[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Draft[]; } catch { return []; }
}

export default function CreatorAnalytics() {
  const [drafts, setDrafts] = useState<Draft[]>(readDrafts);
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts)); }, [drafts]);
  const readyCount = useMemo(() => drafts.filter(draft => draft.status === "ready").length, [drafts]);

  function saveDraft() {
    if (title.trim().length < 3 || brief.trim().length < 10) return;
    setDrafts(current => [{ id: crypto.randomUUID(), title: title.trim(), brief: brief.trim(), status: "draft", updatedAt: new Date().toISOString() }, ...current]);
    setTitle(""); setBrief(""); setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  }

  function toggleReady(id: string) { setDrafts(current => current.map(draft => draft.id === id ? { ...draft, status: draft.status === "draft" ? "ready" : "draft", updatedAt: new Date().toISOString() } : draft)); }
  function removeDraft(id: string) { setDrafts(current => current.filter(draft => draft.id !== id)); }

  return <main className="min-h-screen bg-[#07050f] text-white">
    <header className="border-b border-white/10 bg-[#07050f]/95"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5"><div className="flex items-center gap-3"><Link href="/beta-workspace" className="text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link><div><div className="flex items-center gap-2"><h1 className="font-black">Creator Evidence Studio</h1><Badge variant="outline" className="border-amber-400/50 text-amber-200">Local beta</Badge></div><p className="mt-1 text-xs text-white/40">Plan publishable work before creator integrations exist</p></div></div><Link href="/beta-feedback" className="text-sm text-amber-200 hover:text-amber-100">Send feedback →</Link></div></header>
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">Creator workflow</p><h2 className="mt-3 text-4xl font-black tracking-tight">Build a clear content brief without pretending to know your audience.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55">Use this local workspace to capture ideas, define the intended outcome, and mark drafts ready for human review. Audience metrics, ratings, revenue, subscriptions, and payouts are intentionally not displayed.</p></div><Card className="border-amber-400/25 bg-amber-400/[0.06] text-white"><CardHeader><LockKeyhole className="h-5 w-5 text-amber-200" /><CardTitle className="mt-3 text-amber-100">Integration boundary</CardTitle><CardDescription className="text-white/55">No creator ledger or payment provider is connected in this beta.</CardDescription></CardHeader><CardContent className="space-y-2 text-sm text-white/60"><p>Analytics: unavailable</p><p>Revenue and payouts: unavailable</p><p>Publishing integrations: unavailable</p></CardContent></Card></section>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-amber-200" />New content brief</CardTitle><CardDescription className="text-white/50">Saved only in this browser until a reviewed persistence contract is added.</CardDescription></CardHeader><CardContent className="space-y-4"><Input value={title} onChange={event => setTitle(event.target.value)} placeholder="Brief title" className="border-white/10 bg-black/20 text-white placeholder:text-white/25" maxLength={120} /><Textarea value={brief} onChange={event => setBrief(event.target.value)} placeholder="What are you making, who is it for, and what should a reviewer verify?" className="min-h-40 border-white/10 bg-black/20 text-white placeholder:text-white/25" maxLength={4000} /><Button onClick={saveDraft} disabled={title.trim().length < 3 || brief.trim().length < 10} className="bg-amber-300 text-black hover:bg-amber-200"><Save className="mr-2 h-4 w-4" />Save local brief</Button>{saved && <p className="text-sm text-emerald-300"><CheckCircle2 className="mr-1 inline h-4 w-4" />Saved locally</p>}</CardContent></Card>
        <Card className="border-white/10 bg-white/[0.03]"><CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-200" />Review queue</CardTitle><CardDescription className="text-white/50">{drafts.length} local briefs · {readyCount} marked ready for review</CardDescription></div><Badge variant="outline" className="border-white/15 text-white/55">No public publishing</Badge></div></CardHeader><CardContent className="space-y-3">{drafts.length === 0 ? <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">No local briefs yet. Create one to start a reviewable creator workflow.</div> : drafts.map(draft => <div key={draft.id} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{draft.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/55">{draft.brief}</p></div><Badge variant="outline" className={draft.status === "ready" ? "border-emerald-400/40 text-emerald-200" : "border-amber-400/40 text-amber-200"}>{draft.status}</Badge></div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => toggleReady(draft.id)} className="border-white/15 text-white/65">{draft.status === "ready" ? "Return to draft" : "Mark ready"}</Button><Button size="sm" variant="ghost" onClick={() => removeDraft(draft.id)} className="text-white/45 hover:text-rose-200"><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button></div></div>)}</CardContent></Card></section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/55"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />Local storage is used only for draft planning. This screen makes no claims about followers, views, engagement, ratings, earnings, subscriptions, or creator growth.</section>
    </div></main>;
}
