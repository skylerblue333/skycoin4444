import { useMemo, useState } from "react";
import { Loader2, Package, RefreshCw, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const catalogQuery = trpc.marketplace.catalog.useQuery({
    limit: 50,
    offset: 0,
  });

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          (catalogQuery.data ?? [])
            .map(product => product.category)
            .filter((value): value is string => Boolean(value))
        )
      ).sort(),
    [catalogQuery.data]
  );

  const products = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (catalogQuery.data ?? []).filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch =
        !normalizedSearch ||
        product.name?.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [catalogQuery.data, category, search]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <ShoppingBag className="h-3.5 w-3.5" /> Persisted product catalog
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Marketplace
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This catalog displays products recorded in the platform database.
            Checkout, escrow, shipping, and seller verification are not
            available until their supporting payment and fulfillment services
            are implemented.
          </p>
        </header>

        <section className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search recorded products"
              className="border-slate-700 bg-slate-950 pl-9"
            />
          </div>
          <Button
            variant="outline"
            className="border-slate-700"
            onClick={() => catalogQuery.refetch()}
            disabled={catalogQuery.isFetching}
          >
            {catalogQuery.isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </section>

        {categories.length > 0 ? (
          <nav
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Product categories"
          >
            <Button
              size="sm"
              variant={category === null ? "default" : "outline"}
              onClick={() => setCategory(null)}
            >
              All categories
            </Button>
            {categories.map(value => (
              <Button
                key={value}
                size="sm"
                variant={category === value ? "default" : "outline"}
                onClick={() => setCategory(value)}
              >
                {value}
              </Button>
            ))}
          </nav>
        ) : null}

        {catalogQuery.isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2
              className="h-6 w-6 animate-spin"
              aria-label="Loading product catalog"
            />
          </div>
        ) : catalogQuery.isError ? (
          <section className="mt-8 rounded-xl border border-red-900/60 bg-red-950/30 p-6 text-center">
            <h2 className="font-semibold text-red-100">Catalog unavailable</h2>
            <p className="mt-2 text-sm text-red-200">
              {catalogQuery.error.message}
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => catalogQuery.refetch()}
            >
              Try again
            </Button>
          </section>
        ) : products.length === 0 ? (
          <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-500" />
            <h2 className="mt-4 font-semibold">No matching products</h2>
            <p className="mt-2 text-sm text-slate-400">
              {catalogQuery.data?.length
                ? "Adjust the search or category filter to see recorded products."
                : "No products have been recorded in the catalog yet."}
            </p>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <Card
                key={product.id}
                className="overflow-hidden border-slate-700 bg-slate-900"
              >
                <div className="flex aspect-[16/9] items-center justify-center bg-slate-800">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name ?? "Product image"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-slate-500" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base text-white">
                    {product.name ?? "Untitled product"}
                  </CardTitle>
                  {product.category ? (
                    <p className="text-xs font-medium uppercase tracking-wide text-sky-300">
                      {product.category}
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.description ? (
                    <p className="line-clamp-3 text-sm leading-6 text-slate-300">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No description is recorded for this product.
                    </p>
                  )}
                  <dl className="grid grid-cols-2 gap-3 border-t border-slate-700 pt-3 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400">Listed value</dt>
                      <dd className="mt-1 font-semibold text-white">
                        {typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : "Not specified"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">Inventory</dt>
                      <dd className="mt-1 font-semibold text-white">
                        {typeof product.stock === "number"
                          ? `${product.stock} available`
                          : "Not specified"}
                      </dd>
                    </div>
                  </dl>
                  <p className="rounded-md bg-slate-800 p-2 text-xs text-slate-400">
                    Ordering is not yet enabled for this catalog.
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
