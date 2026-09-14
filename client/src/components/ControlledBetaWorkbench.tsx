import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Props = { title: string; description: string; boundary: string; steps: string[]; recovery?: Array<{ label: string; href: string }>; };

export function ControlledBetaWorkbench({ title, description, boundary, steps, recovery = [{ label: "Home", href: "/" }, { label: "Route Health", href: "/route-health" }] }: Props) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const progress = useMemo(() => Math.round((completed.length / steps.length) * 100), [completed.length, steps.length]);
  const toggle = (index: number) => setCompleted(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-5xl space-y-6">
    <header><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">Controlled engineering beta</Badge><Badge variant="outline">No external side effects</Badge></div><h1 className="mt-4 text-4xl font-black tracking-tight">{title}</h1><p className="mt-3 max-w-3xl text-muted-foreground">{description}</p></header>
    <Card className="border-sky-400/30 bg-sky-400/[0.04]"><CardContent className="flex gap-3 p-5 text-sm leading-6"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" /><span>{boundary}</span></CardContent></Card>
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" />Tester workbench</CardTitle><CardDescription>Complete the observable local steps to evaluate this surface.</CardDescription></CardHeader><CardContent className="space-y-3">{steps.map((step, index) => <button type="button" key={step} onClick={() => toggle(index)} className="flex w-full items-center gap-3 rounded-xl border p-4 text-left hover:bg-muted/40"><span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full " + (completed.includes(index) ? "bg-emerald-500 text-white" : "bg-muted")}>{completed.includes(index) ? <CheckCircle2 className="h-4 w-4" /> : index + 1}</span><span className={completed.includes(index) ? "text-muted-foreground line-through" : ""}>{step}</span></button>)}<div className="pt-3"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Local verification progress</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></div></CardContent></Card>
    <Card><CardHeader><CardTitle>Tester note</CardTitle><CardDescription>Stored only in this browser. Do not enter secrets or personal data.</CardDescription></CardHeader><CardContent className="space-y-3"><Textarea value={note} maxLength={1000} onChange={event => { setNote(event.target.value); setSaved(false); }} placeholder="What did you observe?" /><Button type="button" onClick={() => { localStorage.setItem(`sky4444.workbench.${title}`, note); setSaved(true); }}>{saved ? "Saved locally" : "Save local note"}</Button></CardContent></Card></div>
    <div className="flex flex-wrap gap-2">{recovery.map(item => <Link key={item.href} href={item.href}><Button variant="outline">{item.label}</Button></Link>)}</div>
  </div></main>;
}
export default ControlledBetaWorkbench;
