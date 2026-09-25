import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Blocks, Cpu, RefreshCw, ShieldCheck, Wallet } from "lucide-react";

type NetworkProbe = {
  id: string;
  label: string;
  openSourceRuntime: string;
  configured: boolean;
  state: "online" | "offline" | "unconfigured";
  detail: string;
  height?: string;
  chain?: string;
  version?: string;
};

type TransferPlan = {
  mode: string;
  plan: {
    accountId: string;
    destination: string;
    amount: string;
    fee: string;
    nonce: string;
    planId: string;
  };
  projectedAccount: {
    accountId: string;
    balance: string;
    nextNonce: string;
  };
  signed: false;
  broadcast: false;
  custody: false;
};

type BlockResult = {
  mode: string;
  block: {
    height: string;
    previousHash: string;
    transfers: Array<{ from: string; to: string; amount: string; nonce: string }>;
    hash: string;
  };
  consensusSubmitted: false;
  broadcast: false;
};

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/70";

async function responseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error || "Request failed");
  }
  return body;
}

export default function CryptoEngineeringLab() {
  const { user, loading, isAuthenticated } = useAuth();
  const [networks, setNetworks] = useState<NetworkProbe[]>([]);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [sourceAccountId, setSourceAccountId] = useState("acct:alice");
  const [destination, setDestination] = useState("acct:bob");
  const [balance, setBalance] = useState("100000");
  const [amount, setAmount] = useState("1000");
  const [fee, setFee] = useState("10");
  const [nonce, setNonce] = useState("0");
  const [transfer, setTransfer] = useState<TransferPlan | null>(null);
  const [block, setBlock] = useState<BlockResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const onlineCount = useMemo(
    () => networks.filter(network => network.state === "online").length,
    [networks],
  );

  const loadNetworks = async () => {
    setNetworkLoading(true);
    try {
      const response = await fetch("/api/crypto-lab/networks", { cache: "no-store" });
      const body = await responseJson<{ networks: NetworkProbe[] }>(response);
      setNetworks(body.networks);
    } catch (error) {
      setNetworks([]);
      setActionError(error instanceof Error ? error.message : "Unable to probe nodes");
    } finally {
      setNetworkLoading(false);
    }
  };

  useEffect(() => {
    void loadNetworks();
  }, []);

  const planTransfer = async () => {
    setWorking(true);
    setActionError(null);
    setBlock(null);
    try {
      const response = await fetch("/api/crypto-lab/transfer/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceAccountId,
          destination,
          balance,
          amount,
          fee,
          nonce,
        }),
      });
      setTransfer(await responseJson<TransferPlan>(response));
    } catch (error) {
      setTransfer(null);
      setActionError(error instanceof Error ? error.message : "Unable to plan transfer");
    } finally {
      setWorking(false);
    }
  };

  const buildBlock = async () => {
    if (!transfer) return;
    setWorking(true);
    setActionError(null);
    try {
      const response = await fetch("/api/crypto-lab/block/build", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          height: "1",
          previousHash: "0".repeat(64),
          transfers: [
            {
              from: transfer.plan.accountId,
              to: transfer.plan.destination,
              amount: transfer.plan.amount,
              nonce: transfer.plan.nonce,
            },
          ],
        }),
      });
      setBlock(await responseJson<BlockResult>(response));
    } catch (error) {
      setBlock(null);
      setActionError(error instanceof Error ? error.message : "Unable to build block");
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#09090f] p-8 text-white">Loading account state…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#111118]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-300" />
              Crypto & Blockchain Lab
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              Sign in to run account-scoped transfer planning and local ledger operations.
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
    <main className="min-h-screen bg-[#09090f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Blocks className="h-8 w-8 text-amber-300" />
            <h1 className="text-3xl font-black">Crypto & Blockchain Engineering Lab</h1>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-200">
              Working beta
            </Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-zinc-400">
            This screen performs real validation, local wallet accounting, deterministic block construction,
            and read-only probes against operator-configured open-source nodes. It does not hold keys,
            sign transactions, broadcast funds, or claim settlement.
          </p>
        </header>

        <Card className="border-white/10 bg-[#111118]">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-300" />
              Open-source network adapters
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => void loadNetworks()} disabled={networkLoading}>
              <RefreshCw className={"mr-2 h-4 w-4 " + (networkLoading ? "animate-spin" : "")} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-xs text-zinc-500">
              {onlineCount} node adapter{onlineCount === 1 ? "" : "s"} online. Unconfigured adapters stay fail-closed.
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {networks.map(network => (
                <div key={network.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="font-semibold">{network.label}</div>
                    <Badge
                      variant="outline"
                      className={
                        network.state === "online"
                          ? "border-emerald-400/50 text-emerald-200"
                          : network.state === "offline"
                            ? "border-red-400/50 text-red-200"
                            : "border-zinc-500/50 text-zinc-300"
                      }
                    >
                      {network.state}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">{network.openSourceRuntime}</p>
                  <p className="mt-3 text-sm text-zinc-300">{network.detail}</p>
                  {network.height && <p className="mt-2 text-xs text-zinc-500">Height / slot: {network.height}</p>}
                  {network.chain && <p className="text-xs text-zinc-500">Chain: {network.chain}</p>}
                  {network.version && <p className="text-xs text-zinc-500">Version: {network.version}</p>}
                </div>
              ))}
              {!networkLoading && networks.length === 0 && (
                <div className="text-sm text-zinc-400">No node probe data is available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-sky-300" />
                SKY4 local transfer planner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Enter local sandbox units. The server validates balance, amount, fee, nonce, and plan integrity.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-zinc-400">
                  Source account
                  <input className={inputClass} value={sourceAccountId} onChange={event => setSourceAccountId(event.target.value)} />
                </label>
                <label className="text-xs text-zinc-400">
                  Destination
                  <input className={inputClass} value={destination} onChange={event => setDestination(event.target.value)} />
                </label>
                <label className="text-xs text-zinc-400">
                  Local balance
                  <input className={inputClass} inputMode="numeric" value={balance} onChange={event => setBalance(event.target.value)} />
                </label>
                <label className="text-xs text-zinc-400">
                  Amount
                  <input className={inputClass} inputMode="numeric" value={amount} onChange={event => setAmount(event.target.value)} />
                </label>
                <label className="text-xs text-zinc-400">
                  Fee
                  <input className={inputClass} inputMode="numeric" value={fee} onChange={event => setFee(event.target.value)} />
                </label>
                <label className="text-xs text-zinc-400">
                  Nonce
                  <input className={inputClass} inputMode="numeric" value={nonce} onChange={event => setNonce(event.target.value)} />
                </label>
              </div>
              <Button onClick={() => void planTransfer()} disabled={working}>
                Validate & plan transfer
              </Button>
              {transfer && (
                <div className="space-y-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.05] p-4 text-sm">
                  <div><span className="text-zinc-500">Plan ID:</span> <span className="break-all font-mono text-sky-200">{transfer.plan.planId}</span></div>
                  <div><span className="text-zinc-500">Projected balance:</span> {transfer.projectedAccount.balance}</div>
                  <div><span className="text-zinc-500">Next nonce:</span> {transfer.projectedAccount.nextNonce}</div>
                  <div className="text-xs text-amber-200">Unsigned · unbroadcast · non-custodial</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111118]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-violet-300" />
                Deterministic block builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                After a transfer plan passes validation, build a deterministic local SKY4 ledger block from it.
              </p>
              <Button onClick={() => void buildBlock()} disabled={!transfer || working}>
                Build local block
              </Button>
              {block ? (
                <div className="space-y-2 rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4 text-sm">
                  <div><span className="text-zinc-500">Height:</span> {block.block.height}</div>
                  <div><span className="text-zinc-500">Transfers:</span> {block.block.transfers.length}</div>
                  <div><span className="text-zinc-500">Block hash:</span> <span className="break-all font-mono text-violet-200">{block.block.hash}</span></div>
                  <div className="text-xs text-amber-200">Local ledger only · not submitted to consensus</div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
                  Create a valid transfer plan first.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {actionError && (
          <Card className="border-red-400/30 bg-red-400/[0.06]">
            <CardContent className="p-4 text-sm text-red-200">{actionError}</CardContent>
          </Card>
        )}

        <Card className="border-amber-400/20 bg-amber-400/[0.04]">
          <CardContent className="flex gap-3 p-5 text-sm text-zinc-300">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p>
              Production activation still requires approved RPC infrastructure, transaction signing,
              monitoring, reconciliation, kill-switch controls, and explicit release evidence. The current
              beta intentionally keeps live side effects disabled.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
