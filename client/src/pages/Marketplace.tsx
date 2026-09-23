import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Boxes,
  Check,
  Coins,
  Heart,
  Layers3,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Truck,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MARKETPLACE_CAPABILITIES,
  OFFICIAL_TRUMP_MARKETPLACE_PAYMENT,
  filterMarketplaceProducts,
  marketplaceCapabilityCounts,
  marketplaceDemoProducts,
  reviewFixturesForProduct,
  unitPriceForQuantity,
  type MarketplaceCategory,
  type MarketplaceProduct,
  type MarketplaceSort,
  type SupplierTier,
} from "@/lib/marketplaceV2";

const SAVED_KEY = "sky4444.marketplace-v2.saved";
const CART_KEY = "sky4444.marketplace-v2.cart";
const categories: Array<MarketplaceCategory | "All"> = [
  "All",
  "Electronics",
  "Home",
  "Beauty",
  "Fashion",
  "Auto",
  "Sports",
  "Toys",
  "Tools",
];

const categoryStyles: Record<MarketplaceCategory, string> = {
  Electronics: "from-cyan-500/25 via-blue-500/10 to-slate-950",
  Home: "from-amber-500/25 via-orange-500/10 to-slate-950",
  Beauty: "from-pink-500/25 via-fuchsia-500/10 to-slate-950",
  Fashion: "from-violet-500/25 via-purple-500/10 to-slate-950",
  Auto: "from-red-500/25 via-orange-500/10 to-slate-950",
  Sports: "from-emerald-500/25 via-teal-500/10 to-slate-950",
  Toys: "from-yellow-500/25 via-lime-500/10 to-slate-950",
  Tools: "from-slate-400/25 via-zinc-500/10 to-slate-950",
};

function money(amountMinor: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountMinor / 100);
}

function readSaved(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const known = new Set(marketplaceDemoProducts.map(product => product.sku));
    return parsed.filter(
      (sku): sku is string => typeof sku === "string" && known.has(sku)
    );
  } catch {
    return [];
  }
}

function readCart(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const known = new Map(
      marketplaceDemoProducts.map(product => [product.sku, product])
    );

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([sku, quantity]) => known.has(sku) && Number(quantity) > 0)
        .map(([sku, quantity]) => {
          const product = known.get(sku)!;
          return [
            sku,
            Math.min(
              999,
              Math.max(product.minOrder, Math.floor(Number(quantity)))
            ),
          ];
        })
    );
  } catch {
    return {};
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The beta remains usable when local persistence is blocked.
  }
}

function ProductVisual({ product }: { product: MarketplaceProduct }) {
  return (
    <div
      className={
        "relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br " +
        categoryStyles[product.category]
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.18),transparent_24%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,.08),transparent_30%)]" />
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur">
        Demo catalog
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <div className="text-xs font-bold text-white/50">{product.category}</div>
        <div className="mt-1 line-clamp-2 text-lg font-black text-white">
          {product.name}
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<MarketplaceCategory | "All">("All");
  const [sort, setSort] = useState<MarketplaceSort>("featured");
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [fourStarsOnly, setFourStarsOnly] = useState(false);
  const [lowMoqOnly, setLowMoqOnly] = useState(false);
  const [supplierTier, setSupplierTier] =
    useState<SupplierTier | "all">("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedSku, setSelectedSku] = useState(
    marketplaceDemoProducts[0]?.sku ?? ""
  );
  const [paymentMode, setPaymentMode] = useState<"usd" | "trump">("trump");

  useEffect(() => {
    setSaved(readSaved());
    setCart(readCart());
  }, []);

  const products = useMemo(
    () =>
      filterMarketplaceProducts(marketplaceDemoProducts, {
        query,
        category,
        sort,
        freeShippingOnly,
        fourStarsOnly,
        maxMinOrder: lowMoqOnly ? 5 : undefined,
        supplierTier,
      }),
    [
      category,
      fourStarsOnly,
      freeShippingOnly,
      lowMoqOnly,
      query,
      sort,
      supplierTier,
    ]
  );

  const selectedProduct =
    marketplaceDemoProducts.find(product => product.sku === selectedSku) ??
    products[0] ??
    marketplaceDemoProducts[0];

  const selectedReviews = selectedProduct
    ? reviewFixturesForProduct(selectedProduct.sku)
    : [];

  const capabilityCounts = marketplaceCapabilityCounts();

  const cartEntries = marketplaceDemoProducts
    .filter(product => cart[product.sku])
    .map(product => {
      const quantity = cart[product.sku] ?? product.minOrder;
      const unitAmountMinor = unitPriceForQuantity(product, quantity);
      return {
        product,
        quantity,
        unitAmountMinor,
        lineAmountMinor: quantity * unitAmountMinor,
      };
    });

  const cartTotalMinor = cartEntries.reduce(
    (sum, entry) => sum + entry.lineAmountMinor,
    0
  );
  const cartCount = cartEntries.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );

  const toggleSaved = (sku: string) => {
    setSaved(current => {
      const next = current.includes(sku)
        ? current.filter(candidate => candidate !== sku)
        : [...current, sku];
      persist(SAVED_KEY, next);
      return next;
    });
  };

  const toggleCompare = (sku: string) => {
    setCompare(current => {
      if (current.includes(sku)) {
        return current.filter(candidate => candidate !== sku);
      }
      if (current.length >= 4) return current;
      return [...current, sku];
    });
  };

  const addToCart = (product: MarketplaceProduct) => {
    setCart(current => {
      const currentQuantity = current[product.sku] ?? 0;
      const nextQuantity =
        currentQuantity === 0
          ? product.minOrder
          : Math.min(999, currentQuantity + product.minOrder);
      const next = { ...current, [product.sku]: nextQuantity };
      persist(CART_KEY, next);
      return next;
    });
  };

  const updateCart = (product: MarketplaceProduct, quantity: number) => {
    setCart(current => {
      const next = { ...current };
      if (!Number.isFinite(quantity) || quantity <= 0) {
        delete next[product.sku];
      } else {
        next[product.sku] = Math.min(
          999,
          Math.max(product.minOrder, Math.floor(quantity))
        );
      }
      persist(CART_KEY, next);
      return next;
    });
  };

  return (
    <ExperienceShell
      title="SkyShop Marketplace"
      subtitle="Supplier-style discovery, reviews, bulk pricing, and crypto-payment planning with truthful beta boundaries."
      icon={ShoppingBag}
      accent="orange"
      badge="Marketplace V2 beta"
      actions={
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300">
            {saved.length} saved
          </span>
          <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-200">
            {cartCount} planned
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        <SurfaceCard className="relative overflow-hidden bg-slate-950 p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(249,115,22,.28),transparent_32%),radial-gradient(circle_at_10%_85%,rgba(14,165,233,.18),transparent_34%)]" />
          <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-orange-200">
                  Supplier discovery beta
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                  No DHgate affiliation or copied live catalog
                </span>
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                Marketplace-scale shopping mechanics without fake orders.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Browse a controlled supplier-style demo catalog, compare products,
                test bulk price breaks, inspect sample reviews, save items, and
                plan a cart. The architecture is ready for an authorized catalog
                feed later, but this beta never presents fixture products or
                reviews as live third-party marketplace data.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <Boxes className="h-4 w-4 text-orange-300" />
                  {marketplaceDemoProducts.length} catalog fixtures
                </span>
                <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <MessageSquare className="h-4 w-4 text-sky-300" />
                  Sample verified-purchase review semantics
                </span>
                <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <Layers3 className="h-4 w-4 text-emerald-300" />
                  100-capability expansion map
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-black">
                <Coins className="h-4 w-4 text-orange-300" />
                Official TRUMP payment rail
              </div>
              <div className="mt-3 rounded-xl bg-black/20 p-3">
                <div className="text-xs font-bold text-white">
                  {OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.asset.name} (
                  {OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.asset.symbol})
                </div>
                <div className="mt-1 break-all font-mono text-[10px] leading-5 text-slate-400">
                  {OFFICIAL_TRUMP_MARKETPLACE_PAYMENT.asset.contractAddress}
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Shared Solana asset metadata is connected. A price oracle,
                checkout settlement, custody, signing, and broadcast are not
                connected, so SKYCOIN4444 will not invent a TRUMP amount or claim
                a completed payment.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode("trump")}
                  className={
                    "rounded-lg px-3 py-2 text-xs font-bold " +
                    (paymentMode === "trump"
                      ? "bg-orange-500 text-white"
                      : "bg-white/5 text-slate-300")
                  }
                >
                  TRUMP plan
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("usd")}
                  className={
                    "rounded-lg px-3 py-2 text-xs font-bold " +
                    (paymentMode === "usd"
                      ? "bg-white text-slate-950"
                      : "bg-white/5 text-slate-300")
                  }
                >
                  USD plan
                </button>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-4 md:p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search products, categories, tags, or suppliers"
                className="h-11 rounded-xl pl-9"
              />
            </label>
            <select
              value={sort}
              onChange={event => setSort(event.target.value as MarketplaceSort)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rating</option>
              <option value="reviews">Most review fixtures</option>
            </select>
            <select
              value={supplierTier}
              onChange={event =>
                setSupplierTier(event.target.value as SupplierTier | "all")
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              <option value="all">All demo suppliers</option>
              <option value="demo-verified">Demo verified tier</option>
              <option value="new-supplier">New supplier tier</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={
                  "rounded-full px-3 py-2 text-xs font-bold transition " +
                  (category === option
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10")
                }
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFreeShippingOnly(current => !current)}
              className={
                "rounded-full px-3 py-2 text-xs font-bold transition " +
                (freeShippingOnly
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300")
              }
            >
              Free shipping fixture
            </button>
            <button
              type="button"
              onClick={() => setFourStarsOnly(current => !current)}
              className={
                "rounded-full px-3 py-2 text-xs font-bold transition " +
                (fourStarsOnly
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300")
              }
            >
              4★ and up
            </button>
            <button
              type="button"
              onClick={() => setLowMoqOnly(current => !current)}
              className={
                "rounded-full px-3 py-2 text-xs font-bold transition " +
                (lowMoqOnly
                  ? "bg-sky-500 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300")
              }
            >
              MOQ ≤ 5
            </button>
          </div>
        </SurfaceCard>

        {compare.length > 0 ? (
          <SurfaceCard className="border-sky-200 bg-sky-50/60 p-4 dark:border-sky-400/20 dark:bg-sky-400/5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  Compare shortlist ({compare.length}/4)
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {compare.map(sku => {
                    const product = marketplaceDemoProducts.find(
                      candidate => candidate.sku === sku
                    );
                    return product ? (
                      <button
                        key={sku}
                        type="button"
                        onClick={() => toggleCompare(sku)}
                        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:bg-white/10 dark:text-slate-200"
                      >
                        {product.name}
                        <X className="h-3 w-3" />
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:max-w-xl">
                {compare.slice(0, 2).map(sku => {
                  const product = marketplaceDemoProducts.find(
                    candidate => candidate.sku === sku
                  );
                  return product ? (
                    <div
                      key={sku}
                      className="rounded-xl bg-white p-3 text-xs text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="mt-1">
                        {money(product.unitAmountMinor)} · MOQ {product.minOrder} ·{" "}
                        {product.rating.toFixed(1)}★
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </SurfaceCard>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Supplier-style discovery
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {products.length} demo products match your filters.
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-400">
                Fixture data only
              </div>
            </div>

            {products.length ? (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {products.map(product => {
                  const savedItem = saved.includes(product.sku);
                  const compared = compare.includes(product.sku);
                  return (
                    <SurfaceCard
                      key={product.sku}
                      className="overflow-hidden p-3"
                    >
                      <ProductVisual product={product} />
                      <div className="p-2 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {product.rating.toFixed(1)}
                            <span className="font-medium text-slate-400">
                              ({product.reviewCount} demo count)
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={
                              savedItem
                                ? "Remove from wishlist"
                                : "Save to wishlist"
                            }
                            onClick={() => toggleSaved(product.sku)}
                            className={
                              "grid h-9 w-9 place-items-center rounded-xl border transition " +
                              (savedItem
                                ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/10"
                                : "border-slate-200 text-slate-400 hover:text-rose-500 dark:border-white/10")
                            }
                          >
                            <Heart
                              className={
                                "h-4 w-4 " +
                                (savedItem ? "fill-current" : "")
                              }
                            />
                          </button>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-base font-black text-slate-900 dark:text-white">
                          {product.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                          {product.description}
                        </p>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div>
                            <div className="text-lg font-black text-slate-950 dark:text-white">
                              {money(product.unitAmountMinor)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              demo unit · MOQ {product.minOrder}
                            </div>
                          </div>
                          {product.freeShipping ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                              Free shipping fixture
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                            <Store className="h-3.5 w-3.5 text-orange-500" />
                            {product.supplier.name}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                            <span>{product.supplier.years} demo years</span>
                            <span>{product.supplier.responseRate}% response fixture</span>
                            <span>
                              {product.supplier.tier === "demo-verified"
                                ? "Demo verified tier"
                                : "New supplier tier"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                              setSelectedSku(product.sku);
                            }}
                          >
                            Reviews
                          </Button>
                          <Button
                            type="button"
                            className="rounded-xl bg-orange-600 hover:bg-orange-700"
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="mr-1.5 h-4 w-4" />
                            Add plan
                          </Button>
                        </div>
                        <button
                          type="button"
                          disabled={!compared && compare.length >= 4}
                          onClick={() => toggleCompare(product.sku)}
                          className={
                            "mt-2 w-full rounded-xl px-3 py-2 text-xs font-bold transition " +
                            (compared
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 dark:bg-white/5 dark:text-slate-300")
                          }
                        >
                          {compared ? "Remove comparison" : "Compare product"}
                        </button>
                      </div>
                    </SurfaceCard>
                  );
                })}
              </div>
            ) : (
              <SurfaceCard className="grid min-h-64 place-items-center p-8 text-center">
                <div>
                  <Search className="mx-auto h-8 w-8 text-slate-300" />
                  <h3 className="mt-3 font-black text-slate-900 dark:text-white">
                    No demo products match
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Clear a filter or try another search term.
                  </p>
                </div>
              </SurfaceCard>
            )}
          </div>

          <div className="space-y-5">
            <SurfaceCard className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white">
                    Cart planner
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Local planning only. No order is created.
                  </p>
                </div>
                <ShoppingCart className="h-5 w-5 text-orange-500" />
              </div>

              <div className="mt-4 space-y-3">
                {cartEntries.length ? (
                  cartEntries.map(entry => (
                    <div
                      key={entry.product.sku}
                      className="rounded-xl border border-slate-200 p-3 dark:border-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {entry.product.name}
                          </div>
                          <div className="mt-1 text-[10px] text-slate-400">
                            {money(entry.unitAmountMinor)} per demo unit at qty{" "}
                            {entry.quantity}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateCart(entry.product, 0)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <input
                          aria-label={"Quantity for " + entry.product.name}
                          type="number"
                          min={entry.product.minOrder}
                          max={999}
                          value={entry.quantity}
                          onChange={event =>
                            updateCart(
                              entry.product,
                              Number(event.target.value)
                            )
                          }
                          className="h-9 w-24 rounded-lg border border-slate-200 bg-transparent px-2 text-sm dark:border-white/10"
                        />
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {money(entry.lineAmountMinor)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-white/[0.03]">
                    Add a product to rehearse MOQ and wholesale price breaks.
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    Demo merchandise total
                  </span>
                  <span className="text-lg font-black text-slate-950 dark:text-white">
                    {money(cartTotalMinor)}
                  </span>
                </div>
                <div
                  className={
                    "mt-3 rounded-xl p-3 text-xs leading-5 " +
                    (paymentMode === "trump"
                      ? "bg-orange-50 text-orange-800 dark:bg-orange-400/10 dark:text-orange-200"
                      : "bg-slate-50 text-slate-600 dark:bg-white/[0.03] dark:text-slate-300")
                  }
                >
                  {paymentMode === "trump"
                    ? "TRUMP is selected as the payment-planning rail. No token amount is shown because a live market-price oracle and settlement service are not connected."
                    : "USD planning mode uses fixture amounts only. It does not authorize a card, bank transfer, order, or settlement."}
                </div>
                <Link
                  href="/beta-commerce"
                  className="mt-3 flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  Open checkout math sandbox
                </Link>
              </div>
            </SurfaceCard>

            {selectedProduct ? (
              <SurfaceCard className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">
                      Sample review fixtures
                    </div>
                    <h2 className="mt-1 font-black text-slate-900 dark:text-white">
                      {selectedProduct.name}
                    </h2>
                  </div>
                  <Star className="h-5 w-5 fill-current text-amber-500" />
                </div>
                <div className="mt-4 space-y-3">
                  {selectedReviews.map(review => (
                    <div
                      key={review.id}
                      className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.03]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="h-3 w-3 fill-current" />
                          {review.rating}/5
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                          <BadgeCheck className="h-3 w-3" />
                          Verified-purchase fixture
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                        {review.title}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {review.body}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[10px] leading-4 text-slate-400">
                  These are controlled review fixtures used to exercise rating,
                  moderation, and verified-purchase presentation. They are not
                  copied from DHgate or represented as real customer reviews.
                </div>
              </SurfaceCard>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-orange-500" />
              <h2 className="font-black text-slate-900 dark:text-white">
                100-capability marketplace expansion map
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              The map separates what this beta surface actually demonstrates
              from backend/provider contracts and future work. Adding an item to
              the map never counts as production capability by itself.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-400/10">
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {capabilityCounts["beta-surface"]}
                </div>
                <div className="mt-1 text-xs font-bold text-emerald-700/80 dark:text-emerald-300/80">
                  Beta surfaces
                </div>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4 dark:bg-sky-400/10">
                <div className="text-2xl font-black text-sky-700 dark:text-sky-300">
                  {capabilityCounts["integration-contract"]}
                </div>
                <div className="mt-1 text-xs font-bold text-sky-700/80 dark:text-sky-300/80">
                  Integration contracts
                </div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/[0.05]">
                <div className="text-2xl font-black text-slate-700 dark:text-slate-200">
                  {capabilityCounts.roadmap}
                </div>
                <div className="mt-1 text-xs font-bold text-slate-500">
                  Roadmap capabilities
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {MARKETPLACE_CAPABILITIES.slice(0, 18).map(capability => (
                <div
                  key={capability.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs dark:border-white/10"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {capability.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">
              The full 100-item map is maintained in the marketplace V2 model and
              release documentation.
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="font-black text-slate-900 dark:text-white">
                Buyer-protection boundary
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                Catalog and reviews are explicitly fixture-labeled.
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                Bulk prices are deterministic rehearsal values, not supplier quotes.
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                TRUMP support reuses the configured public asset descriptor.
              </li>
              <li className="flex gap-2">
                <Truck className="mt-1 h-4 w-4 shrink-0 text-sky-500" />
                No carrier, tracking number, delivery promise, or fulfillment is created.
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-orange-500" />
                No payment, escrow, custody, settlement, or blockchain broadcast is claimed.
              </li>
            </ul>
          </SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
