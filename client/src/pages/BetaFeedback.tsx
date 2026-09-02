import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

export default function BetaFeedback() {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState("bug");
  const [severity, setSeverity] = useState("medium");
  const [route, setRoute] = useState(window.location.pathname);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const submit = trpc.betaFeedback.submit.useMutation({
    onSuccess: () => {
      setSummary("");
      setDetails("");
      setExpected("");
      setActual("");
      toast.success("Beta feedback received");
    },
    onError: error => toast.error(error.message),
  });

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link
            href="/beta-journey"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Beta journey
          </Link>
          <div className="h-4 w-px bg-white/15" />
          <h1 className="text-lg font-black">Beta Feedback</h1>
          <Badge variant="outline" className="border-sky-400/50 text-sky-200">
            Protected intake
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <section>
          <h2 className="text-3xl font-bold">Report what happened</h2>
          <p className="mt-3 text-white/60">
            Reports are stored with your beta account and an audit event. Do not
            include passwords, seed phrases, payment details, or other secrets.
            Use `SECURITY.md` for security-sensitive disclosures.
          </p>
        </section>
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base">Structured report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm text-white/70">
                Category
                <select
                  className="mt-2 w-full rounded-md border border-white/15 bg-black/20 p-2 text-white"
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                >
                  <option value="bug">Bug</option>
                  <option value="content">Content</option>
                  <option value="privacy">Privacy</option>
                  <option value="authorization">Authorization</option>
                  <option value="data_integrity">Data integrity</option>
                  <option value="availability">Availability</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="text-sm text-white/70">
                Severity
                <select
                  className="mt-2 w-full rounded-md border border-white/15 bg-black/20 p-2 text-white"
                  value={severity}
                  onChange={event => setSeverity(event.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
              <label className="text-sm text-white/70">
                Route
                <Input
                  className="mt-2"
                  value={route}
                  onChange={event => setRoute(event.target.value)}
                  maxLength={255}
                />
              </label>
            </div>
            <label className="block text-sm text-white/70">
              Summary
              <Input
                className="mt-2"
                value={summary}
                onChange={event => setSummary(event.target.value)}
                maxLength={255}
                placeholder="Short description"
              />
            </label>
            <label className="block text-sm text-white/70">
              Details
              <Textarea
                className="mt-2"
                value={details}
                onChange={event => setDetails(event.target.value)}
                maxLength={4000}
                placeholder="Steps to reproduce and relevant context"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-white/70">
                Expected
                <Textarea
                  className="mt-2"
                  value={expected}
                  onChange={event => setExpected(event.target.value)}
                  maxLength={2000}
                />
              </label>
              <label className="text-sm text-white/70">
                Actual
                <Textarea
                  className="mt-2"
                  value={actual}
                  onChange={event => setActual(event.target.value)}
                  maxLength={2000}
                />
              </label>
            </div>
            {!isAuthenticated && (
              <p className="rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3 text-sm text-amber-100">
                Sign in before submitting. This protected intake does not accept
                anonymous reports.
              </p>
            )}
            <Button
              disabled={
                !isAuthenticated ||
                submit.isPending ||
                !summary ||
                !details ||
                !expected ||
                !actual ||
                !route
              }
              onClick={() =>
                submit.mutate({
                  category: category as
                    | "bug"
                    | "content"
                    | "privacy"
                    | "authorization"
                    | "data_integrity"
                    | "availability"
                    | "other",
                  severity: severity as "low" | "medium" | "high" | "critical",
                  route,
                  summary,
                  details,
                  expected,
                  actual,
                })
              }
            >
              {submit.isPending ? "Submitting…" : "Submit feedback"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
