import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, KeyRound, RefreshCw, Server, ShieldCheck, WalletCards } from "lucide-react";

type ProviderStatus = {
  contract: string;
  stratum: { configured: boolean; shareSubmissionEnabled: boolean };
  miningPayouts: { configured: boolean };
  dex: { provider: string; configured: boolean; liveQuoteEnabled: boolean; serverExecutionEnabled: false };
  mainnetPolicy: { enabled: boolean; allowedChainIds: string[]; destinationAllowlistCount: number };
  custody: {
    openBaoConfigured: boolean;
    openBaoSigningEnabled: boolean;
    mpcGatewayConfigured: boolean;
    mpcSigningEnabled: boolean;
  };
  reconciliation: {
    evmRpcConfigured: boolean;
    solanaRpcConfigured: boolean;
    bitcoinRpcConfigured: boolean;
    durableEventLedgerConfigured: boolean;
  };
};

type StratumProbe = {
  configured: boolean;
  connected: boolean;
  authorized: boolean;
  tls?: boolean;
  host?: string;
  port?: number;
  latencyMs?: number;
  shareSubmissionEnabled: boolean;
};

type ShareResult = {
  provider: string;
  submitted: boolean;
  accepted: boolean;
  latencyMs: number;
  shareRef: string;
  persisted: boolean;
};

type Payout = {
  id: string;
  asset: string;
  amountAtomic: string;
  txHash: string | null;
  status: string;
  createdAt: string | null;
};

type PayoutResponse = {
  provider: string;
  payouts: Payout[];
  persistedCount: number;
};

type PayoutReconciliation = {
  provider: string;
  reconciliation: {
    expectedAtomic: string;
    settledAtomic: string;
    pendingAtomic: string;
    varianceAtomic: string;
    balanced: boolean;
  };
  payouts: Payout[];
};

type SignResult = {
  provider: string;
  keyRef: string;
  digestHex: string;
  signature: string;
  privateKeyExposed: false;
  persisted: boolean;
};

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/70";

async function jsonRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || "Provider request failed");
  return payload;
}

export default function CryptoProviderOps() {
  const { user, loading, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [stratum, setStratum] = useState<StratumProbe | null>(null);
  const [share, setShare] = useState<ShareResult | null>(null);
  const [payouts, setPayouts] = useState<PayoutResponse | null>(null);
  const [reconciliation, setReconciliation] = useState<PayoutReconciliation | null>(null);
  const [signResult, setSignResult] = useState<SignResult | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [jobId, setJobId] = useState("");
  const [extraNonce2, setExtraNonce2] = useState("");
  const [ntime, setNtime] = useState("");
  const [nonce, setNonce] = useState("");
  const [expectedAtomic, setExpectedAtomic] = useState("0");
  const [digestHex, setDigestHex] = useState("00".repeat(32));

  const loadStatus = async () => {
    setStatusError(null);
    try {
      setStatus(await jsonRequest<ProviderStatus>("/api/crypto-provider/status", { cache: "no-store" }));
    } catch (error) {
      setStatusError(error instanceof Error ? error.message : "Unable to load provider status");
    }
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  const runAdminOperation = async <T,>(
    task: () => Promise<T>,
    setter: (value: T) => void,
  ) => {
    setBusy(true);
    setOperationError(null);
    try {
      setter(await task());
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Provider operation failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#080b10] p-8 text-white">Loading provider controls…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b10] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#10151d]">
          <CardHeader><CardTitle>Crypto Provider Operations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">Sign in to inspect provider configuration.</p>
            <Button className="w-full" onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <main className="min-h-screen bg-[#080b10] p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Server className="h-8 w-8 text-amber-300" />
            <h1 className="text-3xl font-black">Crypto Provider Operations</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">
              Operator gated
            </Badge>
          </div>
          <p className="max-w-4xl text-sm leading-6 text-zinc-400">
            Inspect real provider readiness and, for administrators, exercise Stratum connectivity, payout
            reconciliation, and external signing adapters. Secrets remain server-side and are never rendered.
          </p>
        </header>

        <Card className="border-white/10 bg-[#10151d]">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Provider readiness</CardTitle>
            <Button variant="outline" size="sm" onClick={() => void loadStatus()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <StatusTile label="Stratum" ready={status.stratum.configured} detail={status.stratum.shareSubmissionEnabled ? "share submit enabled" : "probe only"} />
                <StatusTile label="Mining payout API" ready={status.miningPayouts.configured} detail="server-side provider" />
                <StatusTile label="0x Swap API v2" ready={status.dex.configured} detail={status.dex.liveQuoteEnabled ? "live quotes" : "not configured"} />
                <StatusTile label="Mainnet policy" ready={status.mainnetPolicy.enabled} detail={status.mainnetPolicy.allowedChainIds.join(", ") || "no chains"} />
                <StatusTile label="OpenBao Transit" ready={status.custody.openBaoConfigured && status.custody.openBaoSigningEnabled} detail="external key signer" />
                <StatusTile label="MPC gateway" ready={status.custody.mpcGatewayConfigured && status.custody.mpcSigningEnabled} detail="external signer gateway" />
                <StatusTile label="Chain reconciliation" ready={status.reconciliation.evmRpcConfigured || status.reconciliation.solanaRpcConfigured || status.reconciliation.bitcoinRpcConfigured} detail="RPC-backed" />
                <StatusTile label="Provider event ledger" ready={status.reconciliation.durableEventLedgerConfigured} detail="MySQL persistence" />
              </div>
            ) : (
              <div className="text-sm text-zinc-500">{statusError || "Loading status…"}</div>
            )}
          </CardContent>
        </Card>

        {!isAdmin && (
          <Card className="border-amber-400/20 bg-amber-400/[0.05]">
            <CardContent className="p-5 text-sm text-amber-100">
              Provider status is visible, but operational Stratum, payout, and external signer actions require an administrator account.
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-[#10151d]">
                <CardHeader><CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-emerald-300" />Stratum pool</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() =>
                      void runAdminOperation(
                        () => jsonRequest<StratumProbe>("/api/crypto-provider/stratum/probe", { method: "POST" }),
                        setStratum,
                      )
                    }
                    disabled={busy}
                  >
                    Probe subscribe + authorize
                  </Button>
                  {stratum && (
                    <ResultBox>
                      Connected: {stratum.connected ? "yes" : "no"} · authorized: {stratum.authorized ? "yes" : "no"}
                      {typeof stratum.latencyMs === "number" && <div>Latency: {stratum.latencyMs} ms</div>}
                      <div>Share submission: {stratum.shareSubmissionEnabled ? "enabled" : "disabled"}</div>
                    </ResultBox>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs text-zinc-400">Job ID<input className={inputClass} value={jobId} onChange={event => setJobId(event.target.value)} /></label>
                    <label className="text-xs text-zinc-400">Extra nonce 2<input className={inputClass} value={extraNonce2} onChange={event => setExtraNonce2(event.target.value)} /></label>
                    <label className="text-xs text-zinc-400">ntime (8 hex)<input className={inputClass} value={ntime} onChange={event => setNtime(event.target.value)} /></label>
                    <label className="text-xs text-zinc-400">nonce (8 hex)<input className={inputClass} value={nonce} onChange={event => setNonce(event.target.value)} /></label>
                  </div>
                  <Button
                    variant="outline"
                    disabled={busy || !jobId || !extraNonce2 || !ntime || !nonce}
                    onClick={() =>
                      void runAdminOperation(
                        () =>
                          jsonRequest<ShareResult>("/api/crypto-provider/stratum/submit-share", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ jobId, extraNonce2, ntime, nonce }),
                          }),
                        setShare,
                      )
                    }
                  >
                    Submit share to configured pool
                  </Button>
                  {share && (
                    <ResultBox>
                      Submitted: {share.submitted ? "yes" : "no"} · accepted: {share.accepted ? "yes" : "no"} · persisted: {share.persisted ? "yes" : "no"}
                    </ResultBox>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#10151d]">
                <CardHeader><CardTitle className="flex items-center gap-2"><WalletCards className="h-5 w-5 text-sky-300" />Mining payouts</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() =>
                      void runAdminOperation(
                        () => jsonRequest<PayoutResponse>("/api/crypto-provider/mining/payouts"),
                        setPayouts,
                      )
                    }
                    disabled={busy}
                  >
                    Fetch provider payouts
                  </Button>
                  {payouts && (
                    <ResultBox>
                      Provider: {payouts.provider} · records: {payouts.payouts.length} · persisted: {payouts.persistedCount}
                    </ResultBox>
                  )}
                  <label className="text-xs text-zinc-400">
                    Expected payout atomic units
                    <input className={inputClass} value={expectedAtomic} onChange={event => setExpectedAtomic(event.target.value)} />
                  </label>
                  <Button
                    variant="outline"
                    onClick={() =>
                      void runAdminOperation(
                        () =>
                          jsonRequest<PayoutReconciliation>("/api/crypto-provider/mining/reconcile-payouts", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ expectedAtomic }),
                          }),
                        setReconciliation,
                      )
                    }
                    disabled={busy}
                  >
                    Reconcile payouts
                  </Button>
                  {reconciliation && (
                    <ResultBox>
                      Settled: {reconciliation.reconciliation.settledAtomic} · pending: {reconciliation.reconciliation.pendingAtomic}
                      <div>Variance: {reconciliation.reconciliation.varianceAtomic} · balanced: {reconciliation.reconciliation.balanced ? "yes" : "no"}</div>
                    </ResultBox>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-[#10151d]">
              <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-violet-300" />External signer adapters</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Sign an already-hashed 32-byte digest using the configured OpenBao Transit key or MPC gateway.
                  The private key remains outside the application process.
                </p>
                <label className="text-xs text-zinc-400">
                  SHA-256 digest hex
                  <input className={inputClass} value={digestHex} onChange={event => setDigestHex(event.target.value)} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      void runAdminOperation(
                        () =>
                          jsonRequest<SignResult>("/api/crypto-provider/custody/openbao/sign", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ digestHex }),
                          }),
                        setSignResult,
                      )
                    }
                    disabled={busy}
                  >
                    Sign with OpenBao
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      void runAdminOperation(
                        () =>
                          jsonRequest<SignResult>("/api/crypto-provider/custody/mpc/sign", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ digestHex, algorithm: "secp256k1-sha256" }),
                          }),
                        setSignResult,
                      )
                    }
                    disabled={busy}
                  >
                    Sign with MPC gateway
                  </Button>
                </div>
                {signResult && (
                  <ResultBox>
                    Provider: {signResult.provider} · key: {signResult.keyRef} · persisted: {signResult.persisted ? "yes" : "no"}
                    <div className="mt-2 break-all font-mono text-xs text-violet-200">{signResult.signature}</div>
                    <div className="mt-2 text-xs text-emerald-200">Private key exposed: no</div>
                  </ResultBox>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {operationError && (
          <Card className="border-red-400/30 bg-red-400/[0.06]">
            <CardContent className="p-4 text-sm text-red-200">{operationError}</CardContent>
          </Card>
        )}

        <Card className="border-amber-400/20 bg-amber-400/[0.04]">
          <CardContent className="flex gap-3 p-5 text-sm text-zinc-300">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p>
              Provider configuration is not proof of profitable mining, payout eligibility, regulatory approval,
              custody certification, or successful mainnet settlement. Operational actions remain gated by server
              configuration, administrator authorization, provider responses, and transaction reconciliation.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatusTile({ label, ready, detail }: { label: string; ready: boolean; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <Badge variant="outline" className={ready ? "border-emerald-400/50 text-emerald-200" : "border-zinc-500/50 text-zinc-400"}>
          {ready ? "configured" : "off"}
        </Badge>
      </div>
      <div className="mt-2 text-xs text-zinc-500">{detail}</div>
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 text-sm text-zinc-200">
      {children}
    </div>
  );
}
