import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FeedbackCategory =
  | "bug"
  | "content"
  | "privacy"
  | "authorization"
  | "data_integrity"
  | "availability"
  | "other";
type FeedbackSeverity = "low" | "medium" | "high" | "critical";

function initialRoute() {
  if (typeof window === "undefined") return "";
  const fromQuery = new URLSearchParams(window.location.search)
    .get("route")
    ?.trim();
  if (fromQuery?.startsWith("/") && fromQuery.length <= 255) {
    return fromQuery;
  }
  return "";
}

export default function BetaFeedback() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [severity, setSeverity] = useState<FeedbackSeverity>("medium");
  const [route, setRoute] = useState(initialRoute);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");

  const submit = trpc.betaFeedback.submit.useMutation({
    onSuccess: async () => {
      setSummary("");
      setDetails("");
      setExpected("");
      setActual("");
      await Promise.all([
        utils.activation.status.invalidate(),
        utils.activityEvidence.list.invalidate(),
      ]);
    },
  });

  const trimmed = useMemo(
    () => ({
      route: route.trim(),
      summary: summary.trim(),
      details: details.trim(),
      expected: expected.trim(),
      actual: actual.trim(),
    }),
    [route, summary, details, expected, actual]
  );

  const canSubmit =
    isAuthenticated &&
    !submit.isPending &&
    trimmed.route.length >= 1 &&
    trimmed.route.length <= 255 &&
    trimmed.summary.length >= 5 &&
    trimmed.details.length >= 10 &&
    trimmed.expected.length >= 3 &&
    trimmed.actual.length >= 3;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-4xl space-y-7 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-sky-300/25 bg-sky-300/[0.04] text-sky-100"
              >
                Protected tester intake
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Persisted + audited
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Report what happened
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Feedback is stored against your beta account and written with an
              audit/event record. Do not include passwords, access keys, seed
              phrases, payment details, session tokens, or other secrets.
            </p>
          </div>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
            >
              Back to dashboard
            </Button>
          </Link>
        </header>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Feedback intake is account-owned
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    Anonymous reports are not accepted by this route. Sign in
                    through the canonical invitation flow before submitting.
                  </p>
                </div>
              </div>
              <Link href="/signin">
                <Button className="shrink-0">
                  Open invitation sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {submit.isSuccess ? (
          <Card className="border-emerald-300/20 bg-emerald-300/[0.05] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                <div>
                  <p className="font-semibold text-emerald-100">
                    Feedback recorded
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    The submitted record now contributes to this account's
                    activation and activity evidence.
                  </p>
                </div>
              </div>
              <Link href="/activity-evidence">
                <Button variant="outline" className="border-emerald-300/20">
                  View activity evidence
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {submit.error ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            Feedback could not be saved: {submit.error.message}
          </div>
        ) : null}

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Flag className="h-5 w-5 text-sky-200" />
              Structured report
            </CardTitle>
            <CardDescription className="text-white/45">
              Minimum lengths match the server validation contract so the form
              can show readiness before submit.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm font-medium">
                <span>Category</span>
                <select
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
                  value={category}
                  onChange={event =>
                    setCategory(event.target.value as FeedbackCategory)
                  }
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

              <label className="space-y-2 text-sm font-medium">
                <span>Severity</span>
                <select
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40"
                  value={severity}
                  onChange={event =>
                    setSeverity(event.target.value as FeedbackSeverity)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>Affected route</span>
                <Input
                  value={route}
                  onChange={event => setRoute(event.target.value)}
                  maxLength={255}
                  placeholder="/activity-feed"
                  className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm font-medium">
              <span>Summary</span>
              <Input
                value={summary}
                onChange={event => setSummary(event.target.value)}
                maxLength={255}
                placeholder="What went wrong?"
                className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
              />
              <span className="block text-xs font-normal text-white/30">
                {summary.trim().length}/255 · minimum 5 characters
              </span>
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Details / reproduction steps</span>
              <Textarea
                value={details}
                onChange={event => setDetails(event.target.value)}
                maxLength={4000}
                placeholder="What did you do immediately before the issue?"
                className="min-h-32 border-white/10 bg-black/25 text-white placeholder:text-white/25"
              />
              <span className="block text-xs font-normal text-white/30">
                {details.trim().length}/4000 · minimum 10 characters
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>Expected</span>
                <Textarea
                  value={expected}
                  onChange={event => setExpected(event.target.value)}
                  maxLength={2000}
                  placeholder="What should have happened?"
                  className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
                />
                <span className="block text-xs font-normal text-white/30">
                  {expected.trim().length}/2000 · minimum 3
                </span>
              </label>

              <label className="space-y-2 text-sm font-medium">
                <span>Actual</span>
                <Textarea
                  value={actual}
                  onChange={event => setActual(event.target.value)}
                  maxLength={2000}
                  placeholder="What happened instead?"
                  className="border-white/10 bg-black/25 text-white placeholder:text-white/25"
                />
                <span className="block text-xs font-normal text-white/30">
                  {actual.trim().length}/2000 · minimum 3
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-white/30">
                Security-sensitive vulnerabilities should follow the repository
                security-disclosure process rather than including secrets here.
              </p>
              <Button
                disabled={!canSubmit}
                onClick={() =>
                  submit.mutate({
                    category,
                    severity,
                    route: trimmed.route,
                    summary: trimmed.summary,
                    details: trimmed.details,
                    expected: trimmed.expected,
                    actual: trimmed.actual,
                  })
                }
              >
                {submit.isPending ? "Submitting…" : "Submit feedback"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
