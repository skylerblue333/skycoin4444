import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Gauge, Hash, Play, ShieldCheck, Timer } from "lucide-react";

type BenchmarkResult = {
  mode: "local-sha256-benchmark";
  hashes: number;
  difficultyHexZeros: number;
  shares: number;
  bestNonce: number;
  bestHash: string;
  bestLeadingHexZeros: number;
  elapsedMs: number;
  hashRateHps: number;
  payout: null;
  networkSubmission: false;
  note: string;
};

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300/70";

function formatRate(value: number) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + " MH/s";
  if (value >= 1_000) return (value / 1_000).toFixed(2) + " kH/s";
  return value.toLocaleString() + " H/s";
}

export default function MiningDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [iterations, setIterations] = useState("50000");
  const [difficultyHexZeros, setDifficultyHexZeros] = useState("3");
  const [seed, setSeed] = useState("skycoin4444-mining-lab");
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const runBenchmark = async () => {
    setWorking(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/crypto-lab/mining/benchmark", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          iterations,
          difficultyHexZeros,
          seed,
        }),
      });
      const body = (await response.json()) as BenchmarkResult & { error?: string };
      if (!response.ok) throw new Error(body.error || "Mining benchmark failed");
      setResult(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Mining benchmark failed");
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#08100d] p-8 text-white">Loading account state…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08100d] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#0e1713]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-300" />
              Mining Workbench
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              Sign in to run bounded server-side SHA-256 work.
            </p>
            <Button className="w-full" onClick={() => startLogin()}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08100d] p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Cpu className="h-8 w-8 text-emerald-300" />
            <h1 className="text-3xl font-black">SKYCOIN4444 Mining Workbench</h1>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-200">
              Real SHA-256 work
            </Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-zinc-400">
            Run a bounded hashing job on the server and measure actual hashes, elapsed time, hash rate,
            local shares, and the best digest found. This is an engineering benchmark—not pooled mining,
            not a coin faucet, and not a claim of BTC, TRUMP, SKY444, or USD earnings.
          </p>
        </header>

        <Card className="border-white/10 bg-[#0e1713]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-emerald-300" />
              Hashing job
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-xs text-zinc-400">
                Iterations (1,000–200,000)
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={iterations}
                  onChange={event => setIterations(event.target.value)}
                />
              </label>
              <label className="text-xs text-zinc-400">
                Local target: leading hex zeros (1–5)
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={difficultyHexZeros}
                  onChange={event => setDifficultyHexZeros(event.target.value)}
                />
              </label>
              <label className="text-xs text-zinc-400">
                Seed
                <input
                  className={inputClass}
                  value={seed}
                  onChange={event => setSeed(event.target.value)}
                />
              </label>
            </div>
            <Button onClick={() => void runBenchmark()} disabled={working}>
              <Play className="mr-2 h-4 w-4" />
              {working ? "Hashing…" : "Run hashing benchmark"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-emerald-400/20 bg-[#0e1713]">
              <CardContent className="p-5">
                <Hash className="mb-3 h-5 w-5 text-emerald-300" />
                <div className="text-2xl font-black">{result.hashes.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">SHA-256 hashes computed</div>
              </CardContent>
            </Card>
            <Card className="border-sky-400/20 bg-[#0e1713]">
              <CardContent className="p-5">
                <Gauge className="mb-3 h-5 w-5 text-sky-300" />
                <div className="text-2xl font-black">{formatRate(result.hashRateHps)}</div>
                <div className="text-xs text-zinc-500">Measured process rate</div>
              </CardContent>
            </Card>
            <Card className="border-violet-400/20 bg-[#0e1713]">
              <CardContent className="p-5">
                <Timer className="mb-3 h-5 w-5 text-violet-300" />
                <div className="text-2xl font-black">{result.elapsedMs.toLocaleString()} ms</div>
                <div className="text-xs text-zinc-500">Elapsed server time</div>
              </CardContent>
            </Card>
            <Card className="border-amber-400/20 bg-[#0e1713]">
              <CardContent className="p-5">
                <ShieldCheck className="mb-3 h-5 w-5 text-amber-300" />
                <div className="text-2xl font-black">{result.shares.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">
                  Local target matches at difficulty {result.difficultyHexZeros}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <Card className="border-white/10 bg-[#0e1713]">
            <CardHeader>
              <CardTitle>Best proof found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500">Nonce:</span> {result.bestNonce}
              </div>
              <div>
                <span className="text-zinc-500">Leading hex zeros:</span> {result.bestLeadingHexZeros}
              </div>
              <div>
                <span className="text-zinc-500">Digest:</span>{" "}
                <span className="break-all font-mono text-emerald-200">{result.bestHash}</span>
              </div>
              <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.05] p-3 text-amber-100">
                {result.note}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-400/30 bg-red-400/[0.06]">
            <CardContent className="p-4 text-sm text-red-200">{error}</CardContent>
          </Card>
        )}

        <Card className="border-white/10 bg-[#0e1713]">
          <CardContent className="p-5 text-sm text-zinc-400">
            <strong className="text-white">Pool status:</strong> no external mining pool is configured by this screen.
            A production pool integration would require a dedicated miner/Stratum adapter, credentials outside the
            browser, worker isolation, payout verification, resource limits, and environment-specific testing.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
