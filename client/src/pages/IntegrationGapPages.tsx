import { useState, type ReactNode } from "react";
import { ShieldCheck, WalletCards, Sparkles, GraduationCap, Gamepad2, CheckCircle2 } from "lucide-react";

function Shell({ title, eyebrow, icon: Icon, children }: { title: string; eyebrow: string; icon: typeof ShieldCheck; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300"><Icon className="h-7 w-7" /></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1></div>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AutonomousAgentWallets() {
  return <Shell title="Autonomous Agent Wallets" eyebrow="Pro/Core integration layer" icon={WalletCards}>
    <div className="grid gap-5 md:grid-cols-3">{[["Programmatic wallet", "Dedicated execution identity for HopeAI agents."], ["Policy gates", "Human and protocol limits remain explicit before settlement."], ["Audit trail", "Every proposed action exposes provenance, nonce, and settlement state."]].map(([label, text]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><h2 className="font-semibold text-emerald-300">{label}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{text}</p></div>)}</div>
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-300">Execution is intentionally shown as a control surface rather than claiming a live wallet or blockchain transaction.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{['IDENTITY READY', 'POLICY REQUIRED', 'SETTLEMENT GATED'].map((status) => <div key={status} className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-mono text-slate-300">{status}</div>)}</div></div>
  </Shell>;
}

export function ZKMLVerificationCenter() {
  const [verified, setVerified] = useState(false);
  return <Shell title="ZKML Verification Center" eyebrow="Verifiable intelligence" icon={ShieldCheck}>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><h2 className="text-xl font-semibold">Inference verification pipeline</h2><div className="mt-6 space-y-3 text-sm">{['Model commitment', 'Input commitment', 'Proof artifact', 'Verifier decision'].map((step, i) => <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">{i + 1}</span><span className="text-slate-200">{step}</span>{i < 3 && <span className="ml-auto text-xs text-slate-500">READY</span>}</div>)}</div><button onClick={() => setVerified(true)} className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500">{verified ? 'VERIFICATION STATE RECORDED' : 'VERIFY TEST ARTIFACT'}</button></div>
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6"><CheckCircle2 className="h-8 w-8 text-emerald-300" /><h2 className="mt-4 text-xl font-semibold">Trust boundary</h2><p className="mt-2 text-sm leading-6 text-slate-300">The UI separates proof presence from actual cryptographic verification so production claims are not fabricated.</p></div>
    </div>
  </Shell>;
}

export function ProvablyFairGaming() {
  return <Shell title="Provably Fair Gaming" eyebrow="SkyGaming integration layer" icon={Gamepad2}>
    <div className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><Sparkles className="h-7 w-7 text-amber-300" /><h2 className="mt-4 text-xl font-semibold">Round commitment</h2><p className="mt-2 text-sm leading-6 text-slate-300">Expose server-seed commitment, client seed, nonce, and verification status for each future game round.</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><Gamepad2 className="h-7 w-7 text-emerald-300" /><h2 className="mt-4 text-xl font-semibold">Game orchestration</h2><p className="mt-2 text-sm leading-6 text-slate-300">Provides a shared control surface for Blackjack, Crash, Plinko, Roulette, Mines, and additional game modules.</p></div></div>
  </Shell>;
}

export function SkySchoolCredentialing() {
  return <Shell title="SkySchool Credentialing" eyebrow="Learn-to-earn Pro/Core screen" icon={GraduationCap}>
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Verified learning track</h2><p className="mt-1 text-sm text-slate-400">Adaptive learning → assessment → credential evidence</p></div><span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-300">PRO CORE</span></div><div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[82%] rounded-full bg-indigo-500" /></div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>82% track completion</span><span>Credential gate pending</span></div><div className="mt-6 grid gap-3 md:grid-cols-3">{['Adaptive path', 'Assessment proof', 'Credential registry'].map((item) => <div key={item} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">{item}</div>)}</div></div>
  </Shell>;
}
