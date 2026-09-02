import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clipboard, FileText, LockKeyhole, ScanSearch, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SAMPLE =
  "We need a clear beta plan for the Skycoin ecosystem. The team should test the education flow locally before inviting members. Keep payment, custody, and chain execution disabled until independent evidence is approved.";

type Operation = "outline" | "actions" | "safety";

function runLocalOperation(input: string, operation: Operation) {
  const text = input.trim();
  if (!text) return "Add a short product note to generate a local draft.";
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (operation === "outline") {
    return sentences.slice(0, 6).map((sentence, index) => `${index + 1}. ${sentence}`).join("\n");
  }
  if (operation === "actions") {
    const actions = sentences.filter(sentence => /\b(need|must|should|ship|test|review|keep|add|build|create)\b/i.test(sentence));
    return actions.length ? actions.map(sentence => `□ ${sentence}`).join("\n") : "No action-shaped sentences found. Try words such as must, should, test, or ship.";
  }
  const sensitiveTerms = ["seed phrase", "private key", "password", "api key", "secret", "custody", "transfer"];
  const matches = sensitiveTerms.filter(term => text.toLowerCase().includes(term));
  return matches.length
    ? `Review required before sharing:\n${matches.map(term => `• Sensitive term detected: ${term}`).join("\n")}\n\nThis local scan does not transmit or store your text.`
    : "No configured sensitive terms detected. This local scan is a heuristic, not a security review.";
}

const LOCAL_TOOLS = [
  { icon: Wand2, label: "Draft helper", detail: "Turn product notes into a local outline or action list." },
  { icon: ScanSearch, label: "Safety scan", detail: "Find common secret and custody terms before sharing text." },
  { icon: FileText, label: "Evidence note", detail: "Prepare a concise release or reproduction note without provider calls." },
];

export default function AIToolsHub() {
  const [input, setInput] = useState(SAMPLE);
  const [operation, setOperation] = useState<Operation>("outline");
  const output = useMemo(() => runLocalOperation(input, operation), [input, operation]);

  async function copyOutput() {
    await navigator.clipboard?.writeText(output);
    toast.success("Local draft copied");
  }

  return (
    <div className="min-h-screen bg-[#07050f] text-white">
      <header className="border-b border-white/10 bg-[#07050f]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <Link href="/mission-control" className="text-white/45 hover:text-white" aria-label="Back to Mission Control">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-300" /><h1 className="font-black tracking-tight">Local AI Sandbox</h1><Badge variant="outline" className="border-amber-400/40 text-amber-200">Test only</Badge></div>
              <p className="mt-1 text-xs text-white/45">Useful drafting tools that never call an external provider</p>
            </div>
          </div>
          <Link href="/beta-feedback" className="text-sm text-amber-200 hover:text-amber-100">Report a problem →</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">Provider boundary</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight">Work with the idea before you wire the model.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">This sandbox is intentionally local and deterministic. It helps you prepare notes, inspect sensitive wording, and create evidence without pretending that an AI provider is connected.</p>
          </div>
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-5">
            <LockKeyhole className="h-5 w-5 text-amber-200" />
            <h3 className="mt-4 font-semibold text-amber-100">No external calls</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">Text stays in this browser tab. Provider-backed generation, memory, voice, image generation, and agent actions remain unavailable until separately configured and approved.</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.2em] text-white/35">Input</p><h3 className="mt-2 text-xl font-bold">Product note</h3></div><Badge variant="outline" className="border-white/15 text-white/55">Browser local</Badge></div>
            <Textarea value={input} onChange={event => setInput(event.target.value)} className="mt-5 min-h-56 resize-y border-white/10 bg-black/20 text-white placeholder:text-white/25" placeholder="Write a note, requirement, or reproduction…" maxLength={12000} />
            <div className="mt-4 flex flex-wrap gap-2">
              {(["outline", "actions", "safety"] as Operation[]).map(item => (
                <Button key={item} size="sm" variant={operation === item ? "default" : "outline"} onClick={() => setOperation(item)} className={operation === item ? "bg-amber-300 text-black hover:bg-amber-200" : "border-white/15 text-white/65"}>
                  {item === "outline" ? "Outline" : item === "actions" ? "Extract actions" : "Safety scan"}
                </Button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.2em] text-white/35">Output</p><h3 className="mt-2 text-xl font-bold">Local result</h3></div><Button size="sm" variant="outline" onClick={copyOutput} className="border-white/15 text-white/65"><Clipboard className="mr-2 h-3.5 w-3.5" />Copy</Button></div>
            <pre className="mt-5 min-h-56 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-6 text-amber-100/85">{output}</pre>
            <p className="mt-3 text-xs leading-5 text-white/35">Generated locally from your current input. Treat it as a draft, not an AI assurance or security verdict.</p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-white/35">Sandbox modules</p><h3 className="mt-2 text-2xl font-bold">Small tools, clear boundaries</h3></div><Link href="/beta-catalog" className="text-sm text-amber-200 hover:text-amber-100">View beta status →</Link></div>
          <div className="grid gap-4 md:grid-cols-3">{LOCAL_TOOLS.map(tool => { const Icon = tool.icon; return <div key={tool.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon className="h-5 w-5 text-amber-200" /><h4 className="mt-4 font-semibold">{tool.label}</h4><p className="mt-2 text-sm leading-6 text-white/45">{tool.detail}</p></div>; })}</div>
        </section>
      </main>
    </div>
  );
}
