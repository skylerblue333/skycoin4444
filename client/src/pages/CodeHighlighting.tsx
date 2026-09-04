import { useEffect, useMemo, useState } from "react";
import { Code2 } from "lucide-react";
import { tokenizeCodeLine } from "@/lib/betaPresentationLab";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const KEY="skycoin4444-beta-code-highlight-v1";
const starter='export function add(a: number, b: number) {\n  // local demo\n  return a + b;\n}';
const classes={keyword:"font-semibold text-primary",string:"text-emerald-600",number:"text-amber-600",comment:"text-muted-foreground italic",plain:""} as const;
export default function CodeHighlighting(){
 const [source,setSource]=useState(()=>localStorage.getItem(KEY)??starter);
 useEffect(()=>localStorage.setItem(KEY,source),[source]);
 const lines=useMemo(()=>source.replace(/\r\n/g,"\n").split("\n").map(tokenizeCodeLine),[source]);
 return <main className="min-h-screen bg-background p-4 md:p-8"><div className="mx-auto max-w-5xl space-y-6">
  <header><Badge variant="outline">Safe local tokenizer</Badge><h1 className="mt-3 text-3xl font-bold">Code highlighting</h1><p className="mt-2 text-muted-foreground">Preview a small lexical highlighting subset without executing source code.</p></header>
  <div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Source</CardTitle><CardDescription>Saved only in this browser.</CardDescription></CardHeader><CardContent><Textarea className="min-h-[420px] font-mono" value={source} onChange={e=>setSource(e.target.value)}/></CardContent></Card><Card><CardHeader><Code2 className="h-5 w-5 text-primary"/><CardTitle className="mt-2">Highlighted preview</CardTitle><CardDescription>Keywords, strings, numbers, comments, and plain text.</CardDescription></CardHeader><CardContent><pre className="min-h-[420px] overflow-auto rounded-xl bg-muted p-4 text-sm"><code>{lines.map((tokens,lineIndex)=><div key={lineIndex}>{tokens.length?tokens.map((token,index)=><span key={index} className={classes[token.kind]}>{token.text}</span>):" "}</div>)}</code></pre></CardContent></Card></div>
  <p className="text-xs text-muted-foreground">No code is executed, compiled, linted, sent to an AI provider, or uploaded to a server.</p>
 </div></main>;
}
