import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeftRight,
  Droplets,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Signature,
  Wallet,
} from "lucide-react";

type Eip1193Provider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};

type SwapQuote = {
  contract: string;
  quoteId: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  feeBps: string;
  priceImpactBps: string;
  model: string;
  execution: string;
  liveLiquidityClaimed: false;
};

type LiveDexQuote = {
  provider: "0x-swap-api-v2";
  quoteId: string;
  chainId: number;
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  minBuyAmount: string | null;
  taker: string;
  allowanceTarget: string | null;
  issues: unknown;
  fees: unknown;
  route: unknown;
  transaction: { to: string; data: string; value: string; gas: string | null };
  executableByWallet: true;
  serverBroadcast: false;
  persisted: boolean;
};

type MainnetPolicy = {
  allowed: boolean;
  reasons: string[];
  policyId: string;
  chainId: number;
  to: string;
  valueWei: string;
  purpose: "transfer" | "dex-swap";
  operatorApprovalStillRequired: true;
};

type ReconciliationResult = {
  network: "evm";
  chainId: number;
  txHash: string;
  status: string;
  confirmations: number;
  confirmed: boolean;
  persisted: boolean;
};

type LiquidityPlan = {
  planId: string;
  tokenA: string;
  tokenB: string;
  mintedShares: string;
  usedA: string;
  usedB: string;
  unusedA: string;
  unusedB: string;
  execution: string;
  livePoolClaimed: false;
};

type OrderPlan = {
  orderId: string;
  market: string;
  side: "buy" | "sell";
  quantityBaseUnits: string;
  limitPriceQuoteUnits: string;
  maxQuoteUnits: string;
  execution: string;
  venue: null;
  settlement: false;
};

type CheckoutPlan = {
  checkoutId: string;
  merchantId: string;
  settlementAsset: string;
  currencyMinor: string;
  totalMinor: string;
  paymentRequest: {
    asset: string;
    amountMinor: string;
    destination: null;
  };
  execution: string;
  paymentCreated: false;
  inventoryReserved: false;
};

const TESTNETS: Record<string, string> = {
  "0xaa36a7": "Ethereum Sepolia",
  "0x14a34": "Base Sepolia",
};

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/70";

const sections = [
  { key: "wallet", label: "Wallet", href: "/wallet-connect", icon: Wallet },
  { key: "swap", label: "Swap", href: "/swap-interface", icon: ArrowLeftRight },
  { key: "pool", label: "Pools", href: "/liquidity-pools", icon: Droplets },
  { key: "trade", label: "Trade", href: "/trading", icon: Radio },
  { key: "store", label: "Store", href: "/sky-store", icon: ShoppingBag },
] as const;

type Section = (typeof sections)[number]["key"];

function sectionFromPath(pathname: string): Section {
  if (/swap/i.test(pathname)) return "swap";
  if (/liquidity|pool/i.test(pathname)) return "pool";
  if (/trading|exchange/i.test(pathname)) return "trade";
  if (/store|shop/i.test(pathname)) return "store";
  return "wallet";
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

function browserProvider(): Eip1193Provider | null {
  return (
    (window as unknown as { ethereum?: Eip1193Provider }).ethereum ?? null
  );
}

function utf8Hex(value: string): string {
  const bytes = new TextEncoder().encode(value);
  return "0x" + Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function ethToWei(value: string): bigint {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,18})?$/.test(normalized)) {
    throw new Error("ETH amount must be a non-negative decimal with at most 18 decimals.");
  }
  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.padEnd(18, "0"));
}

function ethToWeiHex(value: string): string {
  return "0x" + ethToWei(value).toString(16);
}

function shortHex(value: string) {
  return value.length > 22 ? value.slice(0, 12) + "…" + value.slice(-8) : value;
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 text-sm text-zinc-200">
      {children}
    </div>
  );
}

export default function CryptoProductWorkspace() {
  const { user, loading, isAuthenticated } = useAuth();
  const section = useMemo(
    () => sectionFromPath(typeof window === "undefined" ? "" : window.location.pathname),
    [],
  );

  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [balanceWei, setBalanceWei] = useState("");
  const [walletError, setWalletError] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("Sign in to SKYCOIN4444 engineering beta");
  const [sendTo, setSendTo] = useState("");
  const [sendEth, setSendEth] = useState("0");
  const [txHash, setTxHash] = useState("");
  const [walletBusy, setWalletBusy] = useState(false);
  const [reconciliation, setReconciliation] = useState<ReconciliationResult | null>(null);

  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [liveDexQuote, setLiveDexQuote] = useState<LiveDexQuote | null>(null);
  const [liveDexPolicy, setLiveDexPolicy] = useState<MainnetPolicy | null>(null);
  const [liveSellToken, setLiveSellToken] = useState("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  const [liveBuyToken, setLiveBuyToken] = useState("0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
  const [liveSellAmount, setLiveSellAmount] = useState("1000000000000000");
  const [liveSlippageBps, setLiveSlippageBps] = useState("100");
  const [swapError, setSwapError] = useState<string | null>(null);
  const [tokenIn, setTokenIn] = useState("ETH");
  const [tokenOut, setTokenOut] = useState("USDC");
  const [reserveIn, setReserveIn] = useState("1000000");
  const [reserveOut, setReserveOut] = useState("2000000000");
  const [amountIn, setAmountIn] = useState("10000");
  const [feeBps, setFeeBps] = useState("30");

  const [poolPlan, setPoolPlan] = useState<LiquidityPlan | null>(null);
  const [poolError, setPoolError] = useState<string | null>(null);
  const [poolAmountA, setPoolAmountA] = useState("100");
  const [poolAmountB, setPoolAmountB] = useState("200000");

  const [orderPlan, setOrderPlan] = useState<OrderPlan | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [market, setMarket] = useState("ETH-USDC");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("250");
  const [limitPrice, setLimitPrice] = useState("2000");

  const [checkout, setCheckout] = useState<CheckoutPlan | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [sku, setSku] = useState("sky-demo-item");
  const [quantityStore, setQuantityStore] = useState("1");
  const [unitMinor, setUnitMinor] = useState("2500");
  const [settlementAsset, setSettlementAsset] = useState("USDC");

  const connectWallet = async () => {
    const provider = browserProvider();
    if (!provider) {
      setWalletError("No EIP-1193 browser wallet was detected.");
      return;
    }
    setWalletBusy(true);
    setWalletError(null);
    try {
      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      const nextAccount = accounts[0] ?? "";
      if (!nextAccount) throw new Error("Wallet returned no account.");
      const nextChainId = String(await provider.request({ method: "eth_chainId" }));
      const balance = String(
        await provider.request({
          method: "eth_getBalance",
          params: [nextAccount, "latest"],
        }),
      );
      setAccount(nextAccount);
      setChainId(nextChainId);
      setBalanceWei(BigInt(balance).toString());
      setSendTo(current => current || nextAccount);
      setSignature("");
      setTxHash("");
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet connection failed.");
    } finally {
      setWalletBusy(false);
    }
  };

  const signMessage = async () => {
    const provider = browserProvider();
    if (!provider || !account) return;
    setWalletBusy(true);
    setWalletError(null);
    try {
      const signed = String(
        await provider.request({
          method: "personal_sign",
          params: [utf8Hex(message), account],
        }),
      );
      setSignature(signed);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet signature failed.");
    } finally {
      setWalletBusy(false);
    }
  };

  const broadcastWalletTransaction = async () => {
    const provider = browserProvider();
    if (!provider || !account) return;
    setWalletBusy(true);
    setWalletError(null);
    setTxHash("");
    setReconciliation(null);
    try {
      const currentChain = String(await provider.request({ method: "eth_chainId" }));
      if (!/^0x[a-fA-F0-9]{40}$/.test(sendTo.trim())) {
        throw new Error("Destination must be a valid 20-byte EVM address.");
      }
      const valueWei = ethToWei(sendEth);
      if (!TESTNETS[currentChain]) {
        const policy = await postJson<MainnetPolicy>("/api/crypto-provider/wallet/mainnet-policy", {
          chainId: Number(BigInt(currentChain)),
          to: sendTo.trim(),
          valueWei: valueWei.toString(),
          purpose: "transfer",
        });
        if (!policy.allowed) {
          throw new Error("Mainnet policy denied: " + policy.reasons.join("; "));
        }
      }
      const hash = String(
        await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: sendTo.trim(),
              value: ethToWeiHex(sendEth),
            },
          ],
        }),
      );
      setTxHash(hash);
      setChainId(currentChain);
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Wallet broadcast failed.");
    } finally {
      setWalletBusy(false);
    }
  };

  const reconcileWalletTransaction = async () => {
    if (!txHash || !chainId) return;
    setWalletBusy(true);
    setWalletError(null);
    try {
      setReconciliation(
        await postJson<ReconciliationResult>("/api/crypto-provider/tx/reconcile", {
          network: "evm",
          chainId: Number(BigInt(chainId)),
          txHash,
          minConfirmations: 2,
        }),
      );
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : "Transaction reconciliation failed.");
    } finally {
      setWalletBusy(false);
    }
  };

  const runLiveDexQuote = async () => {
    if (!account || !chainId) {
      setSwapError("Connect an EVM wallet before requesting a live provider quote.");
      return;
    }
    setSwapError(null);
    setLiveDexQuote(null);
    setLiveDexPolicy(null);
    try {
      const quote = await postJson<LiveDexQuote>("/api/crypto-provider/dex/0x/quote", {
        chainId: Number(BigInt(chainId)),
        sellToken: liveSellToken,
        buyToken: liveBuyToken,
        sellAmount: liveSellAmount,
        taker: account,
        slippageBps: Number(liveSlippageBps),
      });
      setLiveDexQuote(quote);
      try {
        setLiveDexPolicy(
          await postJson<MainnetPolicy>("/api/crypto-provider/wallet/mainnet-policy", {
            chainId: quote.chainId,
            to: quote.transaction.to,
            valueWei: quote.transaction.value,
            purpose: "dex-swap",
          }),
        );
      } catch {
        setLiveDexPolicy(null);
      }
    } catch (error) {
      setSwapError(error instanceof Error ? error.message : "Live DEX quote failed.");
    }
  };

  const runSwap = async () => {
    setSwapError(null);
    setSwapQuote(null);
    try {
      setSwapQuote(
        await postJson<SwapQuote>("/api/crypto-products/swap/quote", {
          tokenIn,
          tokenOut,
          reserveIn,
          reserveOut,
          amountIn,
          feeBps,
        }),
      );
    } catch (error) {
      setSwapError(error instanceof Error ? error.message : "Swap quote failed.");
    }
  };

  const runPool = async () => {
    setPoolError(null);
    setPoolPlan(null);
    try {
      setPoolPlan(
        await postJson<LiquidityPlan>("/api/crypto-products/liquidity/deposit-plan", {
          tokenA: "ETH",
          tokenB: "USDC",
          reserveA: "1000",
          reserveB: "2000000",
          amountA: poolAmountA,
          amountB: poolAmountB,
          totalShares: "10000",
        }),
      );
    } catch (error) {
      setPoolError(error instanceof Error ? error.message : "Pool plan failed.");
    }
  };

  const runOrder = async () => {
    setOrderError(null);
    setOrderPlan(null);
    try {
      setOrderPlan(
        await postJson<OrderPlan>("/api/crypto-products/trade/order-plan", {
          market,
          side,
          quantityBaseUnits: quantity,
          limitPriceQuoteUnits: limitPrice,
        }),
      );
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : "Order plan failed.");
    }
  };

  const runCheckout = async () => {
    setCheckoutError(null);
    setCheckout(null);
    try {
      setCheckout(
        await postJson<CheckoutPlan>("/api/crypto-products/store/checkout-plan", {
          merchantId: "merchant:sky-store",
          settlementAsset,
          currencyMinor: "USD",
          lines: [{ sku, quantity: quantityStore, unitAmountMinor: unitMinor }],
        }),
      );
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout plan failed.");
    }
  };

  if (loading) {
    return <main className="min-h-screen bg-[#09090f] p-8 text-white">Loading crypto workspace…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#111118]">
          <CardHeader>
            <CardTitle>Crypto Product Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              Sign in before using wallet, swap, pool, trading, and checkout beta tools.
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
            <Wallet className="h-8 w-8 text-amber-300" />
            <h1 className="text-3xl font-black">SKYCOIN4444 Crypto Products</h1>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-200">
              Non-custodial beta
            </Badge>
          </div>
          <p className="max-w-4xl text-sm leading-6 text-zinc-400">
            Wallet connection and message signing use the user's browser wallet. Testnet broadcasts require
            explicit wallet approval. Swap, pool, trading, and store flows currently produce validated plans;
            they do not silently move assets or claim live exchange liquidity.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2">
          {sections.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.key} href={item.href}>
                <Button variant={section === item.key ? "default" : "outline"} size="sm">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {section === "wallet" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-[#111118]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-amber-300" />
                  Browser wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => void connectWallet()} disabled={walletBusy}>
                  {account ? "Refresh wallet" : "Connect wallet"}
                </Button>
                {account ? (
                  <ResultBox>
                    <div><span className="text-zinc-500">Account:</span> {shortHex(account)}</div>
                    <div><span className="text-zinc-500">Chain:</span> {TESTNETS[chainId] ?? chainId}</div>
                    <div><span className="text-zinc-500">Balance:</span> {balanceWei} wei</div>
                    <div className="mt-2 text-xs text-emerald-200">Private keys never enter SKYCOIN4444.</div>
                  </ResultBox>
                ) : (
                  <div className="text-sm text-zinc-500">No browser wallet connected.</div>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111118]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Signature className="h-5 w-5 text-sky-300" />
                  Live wallet signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="text-xs text-zinc-400">
                  Message
                  <input className={inputClass} value={message} onChange={event => setMessage(event.target.value)} />
                </label>
                <Button onClick={() => void signMessage()} disabled={!account || walletBusy || !message.trim()}>
                  Sign message in wallet
                </Button>
                {signature && (
                  <ResultBox>
                    <div className="text-xs text-zinc-500">Wallet-returned signature</div>
                    <div className="mt-1 break-all font-mono text-sky-200">{signature}</div>
                  </ResultBox>
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111118] lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-violet-300" />
                  Wallet transaction broadcast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Sepolia and Base Sepolia are enabled directly for beta testing. Other EVM chains must pass
                  the server's explicit mainnet chain, destination, and native-value policy before the wallet
                  is asked to send anything. The wallet still shows the final transaction for user approval.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs text-zinc-400">
                    Destination
                    <input className={inputClass} value={sendTo} onChange={event => setSendTo(event.target.value)} />
                  </label>
                  <label className="text-xs text-zinc-400">
                    Native asset amount
                    <input className={inputClass} value={sendEth} onChange={event => setSendEth(event.target.value)} />
                  </label>
                </div>
                <Button onClick={() => void broadcastWalletTransaction()} disabled={!account || walletBusy}>
                  Evaluate policy & broadcast with wallet approval
                </Button>
                {txHash && (
                  <ResultBox>
                    <div className="text-xs text-zinc-500">Submitted transaction hash</div>
                    <div className="mt-1 break-all font-mono text-violet-200">{txHash}</div>
                    <Button className="mt-3" variant="outline" size="sm" onClick={() => void reconcileWalletTransaction()} disabled={walletBusy}>
                      Check confirmations
                    </Button>
                    {reconciliation && (
                      <div className="mt-3 text-xs">
                        Status: {reconciliation.status} · confirmations: {reconciliation.confirmations} ·
                        persisted: {reconciliation.persisted ? "yes" : "no"}
                      </div>
                    )}
                  </ResultBox>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {section === "swap" && (
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader><CardTitle>Constant-product swap quote</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                This computes x*y=k AMM math from the reserves you provide. It is not a claim that a live DEX
                currently has those reserves.
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-xs text-zinc-400">Token in<input className={inputClass} value={tokenIn} onChange={event => setTokenIn(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Token out<input className={inputClass} value={tokenOut} onChange={event => setTokenOut(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Amount in<input className={inputClass} value={amountIn} onChange={event => setAmountIn(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Reserve in<input className={inputClass} value={reserveIn} onChange={event => setReserveIn(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Reserve out<input className={inputClass} value={reserveOut} onChange={event => setReserveOut(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Fee bps<input className={inputClass} value={feeBps} onChange={event => setFeeBps(event.target.value)} /></label>
              </div>
              <Button onClick={() => void runSwap()}>Calculate quote</Button>
              {swapQuote && (
                <ResultBox>
                  <div><span className="text-zinc-500">Output:</span> {swapQuote.amountOut} {swapQuote.tokenOut}</div>
                  <div><span className="text-zinc-500">Price impact:</span> {swapQuote.priceImpactBps} bps</div>
                  <div><span className="text-zinc-500">Quote:</span> {shortHex(swapQuote.quoteId)}</div>
                  <div className="mt-2 text-xs text-amber-200">Planning only · no live liquidity claimed</div>
                </ResultBox>
              )}
              <div className="border-t border-white/10 pt-5">
                <h3 className="text-lg font-bold">Live 0x Swap API v2 route</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Uses the configured server-side 0x API key to request a real provider quote for the connected
                  EVM wallet. SKYCOIN4444 never sends the API key to the browser and does not auto-broadcast the quote.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-xs text-zinc-400">Sell token address<input className={inputClass} value={liveSellToken} onChange={event => setLiveSellToken(event.target.value)} /></label>
                  <label className="text-xs text-zinc-400">Buy token address<input className={inputClass} value={liveBuyToken} onChange={event => setLiveBuyToken(event.target.value)} /></label>
                  <label className="text-xs text-zinc-400">Sell amount (atomic units)<input className={inputClass} value={liveSellAmount} onChange={event => setLiveSellAmount(event.target.value)} /></label>
                  <label className="text-xs text-zinc-400">Slippage bps<input className={inputClass} value={liveSlippageBps} onChange={event => setLiveSlippageBps(event.target.value)} /></label>
                </div>
                <Button className="mt-4" onClick={() => void runLiveDexQuote()} disabled={!account}>
                  Request live 0x route
                </Button>
                {liveDexQuote && (
                  <ResultBox>
                    <div><span className="text-zinc-500">Provider:</span> {liveDexQuote.provider}</div>
                    <div><span className="text-zinc-500">Buy amount:</span> {liveDexQuote.buyAmount}</div>
                    <div><span className="text-zinc-500">Transaction target:</span> {shortHex(liveDexQuote.transaction.to)}</div>
                    <div><span className="text-zinc-500">Quote persisted:</span> {liveDexQuote.persisted ? "yes" : "no"}</div>
                    <div className="mt-2 text-xs text-amber-200">
                      {liveDexPolicy
                        ? liveDexPolicy.allowed
                          ? "Server mainnet policy allows this target/value, but wallet approval and token allowance are still required."
                          : "Server mainnet policy denies execution: " + liveDexPolicy.reasons.join("; ")
                        : "Execution policy unavailable or not configured. Quote remains read-only."}
                    </div>
                  </ResultBox>
                )}
              </div>
              {swapError && <div className="text-sm text-red-300">{swapError}</div>}
            </CardContent>
          </Card>
        )}

        {section === "pool" && (
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader><CardTitle>Liquidity deposit planner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Model a proportional ETH/USDC pool deposit against explicit sandbox reserves and share supply.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-zinc-400">ETH units<input className={inputClass} value={poolAmountA} onChange={event => setPoolAmountA(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">USDC units<input className={inputClass} value={poolAmountB} onChange={event => setPoolAmountB(event.target.value)} /></label>
              </div>
              <Button onClick={() => void runPool()}>Plan liquidity deposit</Button>
              {poolPlan && (
                <ResultBox>
                  <div><span className="text-zinc-500">Minted shares:</span> {poolPlan.mintedShares}</div>
                  <div><span className="text-zinc-500">Used:</span> {poolPlan.usedA} ETH units / {poolPlan.usedB} USDC units</div>
                  <div><span className="text-zinc-500">Unused:</span> {poolPlan.unusedA} / {poolPlan.unusedB}</div>
                  <div className="mt-2 text-xs text-amber-200">No live LP deposit is submitted.</div>
                </ResultBox>
              )}
              {poolError && <div className="text-sm text-red-300">{poolError}</div>}
            </CardContent>
          </Card>
        )}

        {section === "trade" && (
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader><CardTitle>Limit-order planner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Validate an order and calculate its maximum quote-unit exposure without inventing market data,
                fills, P&L, or exchange execution.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-zinc-400">Market<input className={inputClass} value={market} onChange={event => setMarket(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Side
                  <select className={inputClass} value={side} onChange={event => setSide(event.target.value as "buy" | "sell")}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </label>
                <label className="text-xs text-zinc-400">Quantity base units<input className={inputClass} value={quantity} onChange={event => setQuantity(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Limit price quote units<input className={inputClass} value={limitPrice} onChange={event => setLimitPrice(event.target.value)} /></label>
              </div>
              <Button onClick={() => void runOrder()}>Create order plan</Button>
              {orderPlan && (
                <ResultBox>
                  <div><span className="text-zinc-500">Order:</span> {shortHex(orderPlan.orderId)}</div>
                  <div><span className="text-zinc-500">Exposure:</span> {orderPlan.maxQuoteUnits} quote units</div>
                  <div className="mt-2 text-xs text-amber-200">No venue selected · no settlement submitted</div>
                </ResultBox>
              )}
              {orderError && <div className="text-sm text-red-300">{orderError}</div>}
            </CardContent>
          </Card>
        )}

        {section === "store" && (
          <Card className="border-white/10 bg-[#111118]">
            <CardHeader><CardTitle>Crypto store checkout planner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Build a deterministic cart/payment request for a demo catalog item. Inventory, merchant
                settlement, shipping, and live payment execution are not claimed.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-zinc-400">SKU<input className={inputClass} value={sku} onChange={event => setSku(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Quantity<input className={inputClass} value={quantityStore} onChange={event => setQuantityStore(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Unit price (USD minor units)<input className={inputClass} value={unitMinor} onChange={event => setUnitMinor(event.target.value)} /></label>
                <label className="text-xs text-zinc-400">Settlement asset<input className={inputClass} value={settlementAsset} onChange={event => setSettlementAsset(event.target.value)} /></label>
              </div>
              <Button onClick={() => void runCheckout()}>Create checkout plan</Button>
              {checkout && (
                <ResultBox>
                  <div><span className="text-zinc-500">Checkout:</span> {shortHex(checkout.checkoutId)}</div>
                  <div><span className="text-zinc-500">Total:</span> {checkout.totalMinor} {checkout.currencyMinor} minor units</div>
                  <div><span className="text-zinc-500">Requested asset:</span> {checkout.paymentRequest.asset}</div>
                  <div className="mt-2 text-xs text-amber-200">Payment not created · inventory not reserved</div>
                </ResultBox>
              )}
              {checkoutError && <div className="text-sm text-red-300">{checkoutError}</div>}
            </CardContent>
          </Card>
        )}

        {walletError && section === "wallet" && (
          <Card className="border-red-400/30 bg-red-400/[0.06]">
            <CardContent className="p-4 text-sm text-red-200">{walletError}</CardContent>
          </Card>
        )}

        <Card className="border-amber-400/20 bg-amber-400/[0.04]">
          <CardContent className="flex gap-3 p-5 text-sm text-zinc-300">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <p>
              Server custody, seed/private-key collection, mainnet broadcasting, live DEX execution,
              leveraged trading, merchant settlement, and mining-pool payouts remain disabled. Those require
              independently reviewed providers, key controls, reconciliation, incident controls, and
              environment-specific release evidence.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
