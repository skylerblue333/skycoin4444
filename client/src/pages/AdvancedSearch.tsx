import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  searchBetaRoutes,
  type SearchableBetaRoute,
} from "@/lib/betaUtilities";
import { Search, ArrowRight, ShieldCheck } from "lucide-react";

const betaRoutes: readonly SearchableBetaRoute[] = [
  {
    "route": "/",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/a-i-tools-hub",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/activity-feed",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/activity-evidence",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/arcade",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/community-hub",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/course-catalog",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/creator-analytics",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/dating-profile-setup",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/language-partner-discovery",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/live-streaming",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/mission-control",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-workspace",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/operational-readiness",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/discovery-center",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-catalog",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-journey",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-commerce",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-web3",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/beta-feedback",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/notification-preferences",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/onboarding",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/profile",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/sign-up-flow",
    "capability": "Previously verified SKYCOIN4444 engineering-beta route",
    "persistence": "Route-specific; see implementation and release docs",
    "boundary": "Launchable beta status proves only the route-specific behavior already documented; unavailable production integrations remain gated."
  },
  {
    "route": "/calculator",
    "capability": "Local arithmetic calculator with deterministic history",
    "persistence": "Browser localStorage history",
    "boundary": "No financial advice, exchange pricing, provider calls, or server persistence."
  },
  {
    "route": "/calendar",
    "capability": "Local event planner with create, complete, filter, and restore",
    "persistence": "Browser localStorage",
    "boundary": "No external calendar synchronization, invitations, reminders, or server persistence."
  },
  {
    "route": "/help-center",
    "capability": "Searchable beta help and support navigation",
    "persistence": "None",
    "boundary": "No fabricated support agents, SLA, live chat, or ticket resolution."
  },
  {
    "route": "/accessibility-settings",
    "capability": "Local accessibility preference preview",
    "persistence": "Browser localStorage",
    "boundary": "Preferences are local beta settings and do not certify WCAG conformance across all historical pages."
  },
  {
    "route": "/file-converter",
    "capability": "Local text/JSON/CSV/TSV conversion utility",
    "persistence": "None",
    "boundary": "No server upload, OCR, binary conversion, cloud storage, or malware scanning."
  },
  {
    "route": "/blog-editor",
    "capability": "Local blog drafting workspace with preview and autosave",
    "persistence": "Browser localStorage",
    "boundary": "No publication, remote collaboration, moderation approval, or server persistence."
  },
  {
    "route": "/advanced-search",
    "capability": "Searchable launchable-beta route directory",
    "persistence": "None",
    "boundary": "Search covers the beta promotion registry only, not users, private records, or web content."
  },
  {
    "route": "/event-planner",
    "capability": "Local drag-and-drop event floor planner",
    "persistence": "Browser localStorage",
    "boundary": "No real-time sync, guest invitations, venue booking, external maps, or server persistence."
  }
];

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => searchBetaRoutes(betaRoutes, query),
    [query]
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Launchable beta · registry search
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black">
            <Search className="h-8 w-8 text-primary" />
            Beta Route Search
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Search the evidence-backed launchable beta registry by route,
            capability, persistence model, or boundary. This does not search
            users, private records, the public web, or unverified legacy pages.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Search launchable beta</CardTitle>
            <CardDescription>
              {results.length} of {betaRoutes.length} registry routes match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search launchable beta routes"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Try gaming, localStorage, social, feedback..."
                className="pl-9"
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {results.map(result => (
                <Link key={result.route} href={result.route} className="group">
                  <div className="h-full rounded-2xl border p-4 transition group-hover:border-primary/40 group-hover:bg-muted/25">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <code className="text-xs text-primary">
                          {result.route}
                        </code>
                        <h2 className="mt-2 font-bold">{result.capability}</h2>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      Persistence: {result.persistence}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {result.boundary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No launchable beta route matches “{query}”.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3 rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Search results come from the same evidence registry used by the
            repository screen audit. A route must still keep its documented
            limitations visible; registry status is not a production-service
            certification.
          </p>
        </div>
      </div>
    </main>
  );
}
