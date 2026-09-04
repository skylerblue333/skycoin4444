import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, LifeBuoy, ArrowRight, ShieldCheck } from "lucide-react";

const articles = [
  {
    title: "Start the ecosystem beta",
    summary: "Use the workspace to move through the strongest evidence-backed routes.",
    route: "/beta-workspace",
    tags: ["start", "workspace", "testing"],
  },
  {
    title: "Understand launchable vs controlled routes",
    summary: "Review the current route inventory and explicit safety boundaries.",
    route: "/beta-catalog",
    tags: ["status", "inventory", "launchable"],
  },
  {
    title: "Report a bug or evidence gap",
    summary: "Use the beta feedback path for bugs, privacy concerns, and safety issues.",
    route: "/beta-feedback",
    tags: ["feedback", "bug", "privacy", "safety"],
  },
  {
    title: "Check operational readiness evidence",
    summary: "Inspect the engineering-beta readiness surface and current limitations.",
    route: "/operational-readiness",
    tags: ["readiness", "build", "operations"],
  },
  {
    title: "Manage your account profile",
    summary: "Review authenticated profile and privacy controls.",
    route: "/profile",
    tags: ["profile", "privacy", "account"],
  },
  {
    title: "Test social participation",
    summary: "Open the activity feed to exercise persisted posts, reactions, and replies.",
    route: "/activity-feed",
    tags: ["social", "posts", "replies"],
  },
  {
    title: "Test local creator setup",
    summary: "Preview browser devices and save a local stream brief without broadcasting.",
    route: "/live-streaming",
    tags: ["live", "camera", "creator"],
  },
  {
    title: "Use the local Arcade Lab",
    summary: "Play deterministic games without real-money wagering or chain settlement.",
    route: "/arcade",
    tags: ["gaming", "arcade", "simulation"],
  },
] as const;

export default function HelpCenter() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return articles;
    return articles.filter(article =>
      [article.title, article.summary, article.route, ...article.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">
            Launchable beta · self-service help
          </Badge>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LifeBuoy className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight">
            SKYCOIN4444 Help Center
          </h1>
          <p className="mt-3 text-muted-foreground">
            Search verified beta guidance and jump directly to the relevant
            product surface. There is no fabricated live-support agent or SLA.
          </p>
          <div className="relative mt-6">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search help"
              className="pl-9"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search testing, privacy, gaming, social..."
            />
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {visible.map(article => (
            <Link key={article.route} href={article.route} className="group">
              <Card className="h-full group-hover:border-primary/40">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-semibold text-primary">
                    Open {article.route}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {visible.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No help article matches “{query}”. Try a product area or use the beta
            feedback route.
          </div>
        )}

        <div className="mt-10 flex gap-3 rounded-2xl border bg-muted/30 p-5 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            This help center documents the engineering beta only. It does not
            promise production uptime, financial services, identity verification,
            moderation response times, or external provider availability.
          </p>
        </div>
      </div>
    </main>
  );
}
