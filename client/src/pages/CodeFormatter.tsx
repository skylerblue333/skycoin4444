import { useState } from "react";
import { Braces, Copy, FileText } from "lucide-react";
import { formatJsonSource, normalizePlainText } from "@/lib/betaUtilityLab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CodeFormatter() {
  const [mode, setMode] = useState<"json" | "text">("json");
  const [source, setSource] = useState('{"beta":true,"routes":43}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      setOutput(mode === "json" ? formatJsonSource(source, 2) : normalizePlainText(source));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON. Fix the source and try again.");
    }
  };

  return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <header><Badge variant="outline">Local formatter</Badge><h1 className="mt-3 text-3xl font-bold">Code formatter</h1><p className="mt-2 text-muted-foreground">Format JSON or normalize plain text entirely in the browser.</p></header>
    <div className="flex gap-2">{(["json","text"] as const).map(value=><Button key={value} type="button" variant={mode===value?"default":"outline"} onClick={()=>setMode(value)}>{value.toUpperCase()}</Button>)}</div>
    <div className="grid gap-5 lg:grid-cols-2">
      <Card><CardHeader><FileText className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Source</CardTitle><CardDescription>No upload or remote formatter is used.</CardDescription></CardHeader><CardContent><Textarea className="min-h-[420px] font-mono" value={source} onChange={e=>setSource(e.target.value)}/><Button className="mt-4" onClick={format}>Format locally</Button>{error&&<p className="mt-3 text-sm text-destructive">{error}</p>}</CardContent></Card>
      <Card><CardHeader><Braces className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Output</CardTitle><CardDescription>Deterministic browser output.</CardDescription></CardHeader><CardContent><Textarea className="min-h-[420px] font-mono" readOnly value={output}/><Button className="mt-4" variant="outline" disabled={!output} onClick={()=>navigator.clipboard.writeText(output)}><Copy className="mr-2 h-4 w-4"/>Copy output</Button></CardContent></Card>
    </div>
    <p className="text-xs text-muted-foreground">This is not a compiler, linter, transpiler, IDE, or server-backed code service.</p>
  </div></main>;
}
