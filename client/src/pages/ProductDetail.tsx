import { Link, useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Loader2, Package, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function ProductDetail() {
  const [location] = useLocation();
  const productId = new URLSearchParams(location.split("?")[1] ?? "").get("id");
  const productQuery = trpc.marketplace.productById.useQuery(
    { id: productId ?? "" },
    { enabled: Boolean(productId) }
  );

  if (!productId) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200">
            <ArrowLeft className="h-4 w-4" /> Back to marketplace
          </Link>
          <Card className="mt-8 border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle>No product selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Choose a recorded product from the marketplace catalog to inspect its persisted details.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (productQuery.isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100"><Loader2 className="h-6 w-6 animate-spin" aria-label="Loading product" /></main>;
  }

  if (productQuery.isError) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" /> Back to marketplace</Link>
          <Card className="mt-8 border-red-900/60 bg-red-950/30">
            <CardHeader><CardTitle className="flex items-center gap-2 text-red-100"><AlertTriangle className="h-5 w-5" /> Product unavailable</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-red-200">{productQuery.error.message}</p><Button className="mt-5" variant="outline" onClick={() => productQuery.refetch()}>Try again</Button></CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const product = productQuery.data;
  if (!product) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" /> Back to marketplace</Link>
          <Card className="mt-8 border-slate-700 bg-slate-900"><CardHeader><CardTitle>Product not found</CardTitle></CardHeader><CardContent><p className="text-sm text-slate-400">No recorded product matches this identifier.</p></CardContent></Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" /> Back to marketplace</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="overflow-hidden border-slate-700 bg-slate-900">
            <div className="flex min-h-72 items-center justify-center bg-slate-800">
              {product.image ? <img src={product.image} alt={product.name ?? "Product image"} className="h-full max-h-[420px] w-full object-cover" /> : <Package className="h-16 w-16 text-slate-500" />}
            </div>
            <CardHeader><p className="text-xs font-medium uppercase tracking-wide text-sky-300">{product.category ?? "Uncategorized"}</p><CardTitle className="text-3xl text-white">{product.name ?? "Untitled product"}</CardTitle></CardHeader>
            <CardContent><p className="whitespace-pre-wrap leading-7 text-slate-300">{product.description ?? "No description is recorded for this product."}</p></CardContent>
          </Card>
          <aside className="space-y-4">
            <Card className="border-slate-700 bg-slate-900"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShoppingBag className="h-4 w-4 text-sky-300" /> Recorded details</CardTitle></CardHeader><CardContent><dl className="space-y-4 text-sm"><div><dt className="text-slate-400">Listed value</dt><dd className="mt-1 text-lg font-semibold text-white">{typeof product.price === "number" ? product.price.toFixed(2) : "Not specified"}</dd></div><div><dt className="text-slate-400">Inventory</dt><dd className="mt-1 font-semibold text-white">{typeof product.stock === "number" ? `${product.stock} available` : "Not specified"}</dd></div></dl></CardContent></Card>
            <Card className="border-amber-900/60 bg-amber-950/20"><CardContent className="pt-6"><p className="text-sm leading-6 text-amber-100">Ordering is not enabled. This page shows only data persisted in the catalog; it does not represent a completed purchase, payment, escrow, shipping, or seller-verification flow.</p></CardContent></Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
