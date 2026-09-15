/*
 * Controlled beta Web3 surface: evidence cards plus deterministic local intent
 * simulation. Never connect a wallet, sign, custody, transfer, or execute
 * against a chain from this page.
 */
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Activity,
  CheckCircle2,
  Database,
  Eye,
  FileCheck2,
  History,
  LockKeyhole,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  WEB3_INTENT_HISTORY_KEY,
  addWeb3IntentSimulation,
  analyzeWeb3Intent,
  createWeb3IntentSimulation,
  normalizeWeb3IntentHistory,
  web3IntentAssets,
  web3IntentFeeScenarios,
  web3IntentSafetyChecks,
  type Web3IntentAsset,
  type Web3IntentFeeScenario,
  type Web3IntentNetwork,
  type Web3IntentSafetyCheckId,
  type Web3IntentSimulationReceipt,
} from "@/lib/web3IntentLab";

type NFTFixture = {
  tokenId: string;
  collection: string;
  owner: string;
  metadataStatus: "indexed" | "pending";
  network: "local" | "testnet";
};

const indexedNFTs: NFTFixture[] = [
  { tokenId: "sky-demo-001", collection: "Field Atlas", owner: "owner:alpha", metadataStatus: "indexed", network: "local" },
  { tokenId: "sky-demo-002", collection: "Field Atlas", owner: "owner:beta", metadataStatus: "indexed", network: "local" },
  { tokenId: "sky-test-017", collection: "Test Collection", owner: "0xtest…7a2", metadataStatus: "pending", network: "testnet" },
];

const protocolSignals = [
  ["Environment", "Local fixture node", "verified"],
  ["Read path", "Deterministic snapshot", "verified"],
  ["Write path", "Disabled by policy", "gated"],
  ["Mainnet", "No connection configured", "unavailable"],
] as const;

const tokenMetadata = [
  { symbol: "SKY444", name: "Skycoin beta token metadata", network: "local", decimals: 8, address: "not deployed" },
  { symbol: "SKYTEST", name: "Testnet fixture token metadata", network: "testnet", decimals: 8, address: "0xtest…metadata" },
] as const;

function readSimulationHistory() {
  try {
    return normalizeWeb3IntentHistory(
      JSON.parse(localStorage.getItem(WEB3_INTENT_HISTORY_KEY) ?? "[]")
    );
  } catch {
    return [];
  }
}

function persistSimulationHistory(history: readonly Web3IntentSimulationReceipt[]) {
  try {
    localStorage.setItem(WEB3_INTENT_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Keep simulation usable in memory when browser storage is unavailable.
  }
}

export default function BetaWeb3Sandbox() {
  const [query, setQuery] = useState("");
  const [network, setNetwork] = useState<"all" | NFTFixture["network"]>("all");
  const [completedSecurity, setCompletedSecurity] = useState<Web3IntentSafetyCheckId[]>([]);
  const [intentAsset, setIntentAsset] = useState<Web3IntentAsset>("SKYTEST");
  const [intentNetwork, setIntentNetwork] = useState<Web3IntentNetwork>("testnet");
  const [recipientReference, setRecipientReference] = useState("");
  const [intentAmount, setIntentAmount] = useState("");
  const [feeScenario, setFeeScenario] = useState<Web3IntentFeeScenario>("standard");
  const [simulationHistory, setSimulationHistory] = useState<Web3IntentSimulationReceipt[]>([]);
  const [simulationMessage, setSimulationMessage] = useState("");

  useEffect(() => {
    setSimulationHistory(readSimulationHistory());
  }, []);

  const filteredNFTs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return indexedNFTs.filter((item) => {
      const matchesNetwork = network === "all" || item.network === network;
      const matchesQuery = !normalized || `${item.tokenId} ${item.collection} ${item.owner}`.toLowerCase().includes(normalized);
      return matchesNetwork && matchesQuery;
    });
  }, [network, query]);

  const intentInput = useMemo(
    () => ({
      asset: intentAsset,
      network: intentNetwork,
      recipientReference,
      amount: intentAmount,
      feeScenario,
      acknowledgedChecks: completedSecurity,
    }),
    [completedSecurity, feeScenario, intentAmount, intentAsset, intentNetwork, recipientReference]
  );
  const intentAnalysis = useMemo(() => analyzeWeb3Intent(intentInput), [intentInput]);

  const toggleSafetyCheck = (checkId: Web3IntentSafetyCheckId) => {
    setCompletedSecurity(current =>
      current.includes(checkId)
        ? current.filter(item => item !== checkId)
        : [...current, checkId]
    );
  };

  const simulateIntent = () => {
    try {
      const receipt = createWeb3IntentSimulation(intentInput);
      const next = addWeb3IntentSimulation(simulationHistory, receipt);
      setSimulationHistory(next);
      persistSimulationHistory(next);
      setSimulationMessage(
        "Local simulation receipt created. No signature, broadcast, custody, balance change, or chain write occurred."
      );
    } catch (error) {
      setSimulationMessage(
        error instanceof Error ? error.message : "Intent is not ready for simulation."
      );
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex max-w-6xl items-center gap-3 px-4 py-5">
          <Link href="/beta-catalog" className="text-sm text-muted-foreground hover:text-foreground">← Area catalog</Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black">Web3 Evidence Room</h1>
            <Badge variant="outline" className="border-amber-500/50 text-amber-700">Controlled test</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
        <section className="max-w-3xl">
          <Badge variant="outline" className="mb-3">Read-only / local-testnet boundary</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Inspect evidence, rehearse intent, never write to a chain.</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            This surface makes the Web3 boundary concrete with indexed fixtures, protocol signals, and a deterministic transaction-intent rehearsal. It does not connect wallets, request signatures, hold keys, transfer assets, query a real balance, or claim production-chain availability.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {protocolSignals.map(([label, value, status]) => (
            <Card key={label} className="border-border/60">
              <CardHeader className="pb-3"><CardDescription>{label}</CardDescription><CardTitle className="text-base">{value}</CardTitle></CardHeader>
              <CardContent><Badge variant={status === "verified" ? "default" : "outline"}>{status}</Badge></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Token metadata registry</CardTitle><CardDescription>Schema-validated display metadata only; no balances, pricing, minting, or transfer claims.</CardDescription></CardHeader>
            <CardContent className="space-y-3">{tokenMetadata.map((token) => <div key={token.symbol} className="rounded-lg border p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{token.symbol}</p><p className="text-sm text-muted-foreground">{token.name}</p></div><Badge variant="outline">{token.network}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Decimals: {token.decimals} · Contract: {token.address}</p></div>)}</CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" />Wallet observation</CardTitle><CardDescription>Connection and signing are not part of this beta.</CardDescription></CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground"><p>No address, balance, transaction history, or portfolio value is displayed.</p><p>No wallet connector, private-key input, signature request, custody, transfer, or chain submission is available.</p><Badge variant="outline" className="border-destructive/40 text-destructive">Wallet actions unavailable</Badge></CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Intent safety gate</CardTitle><CardDescription>All four acknowledgements are required before a local simulation receipt can be created.</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {web3IntentSafetyChecks.map(check => {
                const done = completedSecurity.includes(check.id);
                return (
                  <button key={check.id} type="button" onClick={() => toggleSafetyCheck(check.id)} className="flex w-full items-start gap-2 rounded-lg border p-3 text-left text-sm">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${done ? "text-emerald-600" : "text-muted-foreground"}`} />
                    <span>{check.label}</span>
                  </button>
                );
              })}
              <div className="rounded-lg border border-dashed p-3 text-xs leading-5 text-muted-foreground">
                Never paste a recovery phrase, seed phrase, mnemonic, private key, or secret key. The simulator rejects obvious recovery-material wording and long word sequences.
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-500/25 bg-sky-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileCheck2 className="h-5 w-5" />Transaction-intent simulator</CardTitle>
              <CardDescription>Rehearse review logic only. It never signs, broadcasts, changes a balance, or contacts a wallet/RPC provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-semibold">Asset fixture
                  <select value={intentAsset} onChange={event => setIntentAsset(event.target.value as Web3IntentAsset)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    {web3IntentAssets.map(asset => <option key={asset.symbol} value={asset.symbol}>{asset.label}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs font-semibold">Network fixture
                  <select value={intentNetwork} onChange={event => setIntentNetwork(event.target.value as Web3IntentNetwork)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value="local">local</option>
                    <option value="testnet">testnet</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold">Recipient reference
                <Input value={recipientReference} onChange={event => setRecipientReference(event.target.value)} maxLength={120} placeholder="recipient:test-alpha — never paste recovery material" className="mt-1" />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs font-semibold">Display amount
                  <Input value={intentAmount} onChange={event => setIntentAmount(event.target.value.replace(/[^0-9.]/g, ""))} inputMode="decimal" placeholder="12.34567890" className="mt-1" />
                </label>
                <label className="space-y-1 text-xs font-semibold">Fee scenario
                  <select value={feeScenario} onChange={event => setFeeScenario(event.target.value as Web3IntentFeeScenario)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    {web3IntentFeeScenarios.map(fee => <option key={fee.id} value={fee.id}>{fee.label}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-2 rounded-lg border bg-background/60 p-3 text-xs sm:grid-cols-3">
                <div><span className="text-muted-foreground">Amount</span><strong className="mt-1 block">{intentAnalysis.amountDisplay ?? "invalid"}</strong></div>
                <div><span className="text-muted-foreground">Fixture fee</span><strong className="mt-1 block">{intentAnalysis.feeDisplay}</strong></div>
                <div><span className="text-muted-foreground">Display total</span><strong className="mt-1 block">{intentAnalysis.totalDisplay ?? "unavailable"}</strong></div>
              </div>

              {intentAnalysis.blockers.length ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <p className="flex items-center gap-2 text-xs font-bold"><TriangleAlert className="h-4 w-4" />Resolve before simulation</p>
                  <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
                    {intentAnalysis.blockers.map(blocker => <li key={blocker}>• {blocker}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs font-semibold text-emerald-700">Intent is ready for deterministic local simulation.</div>
              )}

              <div className="space-y-1 text-[11px] leading-5 text-muted-foreground">
                {intentAnalysis.warnings.map(warning => <p key={warning}>• {warning}</p>)}
              </div>

              <Button type="button" className="w-full" onClick={simulateIntent} disabled={!intentAnalysis.canSimulate}>
                Create local simulation receipt
              </Button>
              {simulationMessage ? <p className="text-xs leading-5 text-muted-foreground" role="status" aria-live="polite">{simulationMessage}</p> : null}
            </CardContent>
          </Card>
        </section>

        {simulationHistory.length ? (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Recent local simulations</CardTitle><CardDescription>Browser-local receipts only. They are not transactions, wallet history, chain evidence, or proof of funds.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {simulationHistory.slice(0, 4).map(receipt => (
                <div key={receipt.id} className="rounded-lg border p-4 text-sm">
                  <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{receipt.amountDisplay} {receipt.asset}</p><p className="text-xs text-muted-foreground">to {receipt.recipientReference}</p></div><Badge variant="outline">{receipt.network}</Badge></div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><span className="text-muted-foreground">Fixture fee</span><span className="text-right">{receipt.feeDisplay}</span><span className="text-muted-foreground">Display total</span><span className="text-right">{receipt.totalDisplay}</span></div>
                  <div className="mt-3 flex flex-wrap gap-2"><Badge variant="outline">signature: no</Badge><Badge variant="outline">broadcast: no</Badge><Badge variant="outline">custody: no</Badge></div>
                  <p className="mt-3 text-[10px] text-muted-foreground">{receipt.contract} · {new Date(receipt.simulatedAt).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Indexed NFT fixtures</CardTitle><CardDescription className="mt-1">Read-only records with provenance labels and network scope.</CardDescription></div>
                <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search token or owner" className="pl-9" /></div>
              </div>
              <div className="flex gap-2 pt-3">
                {(["all", "local", "testnet"] as const).map((value) => <Button key={value} type="button" size="sm" variant={network === value ? "default" : "outline"} onClick={() => setNetwork(value)}>{value}</Button>)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredNFTs.map((item) => (
                <div key={item.tokenId} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div><p className="font-semibold">{item.tokenId}</p><p className="text-sm text-muted-foreground">{item.collection} · owner {item.owner}</p></div>
                  <div className="flex gap-2"><Badge variant="outline">{item.network}</Badge><Badge variant={item.metadataStatus === "indexed" ? "default" : "outline"}>{item.metadataStatus}</Badge></div>
                </div>
              ))}
              {!filteredNFTs.length && <p className="py-8 text-center text-sm text-muted-foreground">No indexed fixture matches this query.</p>}
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" />Write boundary</CardTitle><CardDescription>These controls are intentionally absent.</CardDescription></CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p><ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />No wallet connection or private-key handling.</p>
              <p><Database className="mr-2 inline h-4 w-4 text-primary" />No token transfer, custody, or settlement.</p>
              <p><Activity className="mr-2 inline h-4 w-4 text-primary" />No mainnet provider or production protocol write.</p>
              <Badge variant="outline" className="border-destructive/40 text-destructive">Live Web3 unavailable</Badge>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
