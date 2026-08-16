import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export type FeatureUnavailableProps = {
  title: string;
  description: string;
  capability?: string;
  nextStep?: string;
};

export function FeatureUnavailable({ title, description, capability = "This capability", nextStep = "Return to the launch hub" }: FeatureUnavailableProps) {
  return (
    <main className="min-h-screen bg-[#07050f] px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-purple-500/10 to-cyan-400/10 p-8 shadow-2xl shadow-purple-950/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3"><AlertTriangle className="h-6 w-6 text-amber-300" aria-hidden="true" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">Provider boundary</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
            </div>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/70">{description}</p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
            <span><strong className="text-white">Truthful state:</strong> {capability} is not presented as active, simulated, or financially successful until its provider, authorization, persistence, and monitoring are verified.</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/"><Button className="bg-white text-black hover:bg-white/90">{nextStep}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/dashboard"><Button variant="outline" className="border-white/15 text-white">Open dashboard</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FeatureUnavailable;
