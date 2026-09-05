import { type FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startLogin } from "@/const";

type BetaAuthProbe = {
  mode: "oauth" | "access_key";
  configured: boolean;
  identityVerification: false;
  invitationRequired: true;
  rateLimit: {
    windowMs: number;
    maxAttempts: number;
    scope: "process_local";
  } | null;
};

function admissionMessage(reason: string | null) {
  if (reason === "not-invited") {
    return {
      title: "This account is not on the beta invite list",
      detail:
        "SKYCOIN4444 is currently invitation-only. No session was issued for this account.",
      tone: "warning" as const,
    };
  }

  if (reason === "oauth-unconfigured") {
    return {
      title: "Sign-in provider is not configured",
      detail:
        "The external identity-provider path is unavailable in this environment.",
      tone: "warning" as const,
    };
  }

  return {
    title: "Invitation-only engineering beta",
    detail:
      "Admission is checked before a session is created and again on protected requests.",
    tone: "normal" as const,
  };
}

export function Signin() {
  const reason =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("reason");
  const message = admissionMessage(reason);
  const [authProbe, setAuthProbe] = useState<BetaAuthProbe | null>(null);
  const [probeError, setProbeError] = useState("");
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/beta/auth", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async response => {
        if (!response.ok) throw new Error("auth probe failed");
        return (await response.json()) as BetaAuthProbe;
      })
      .then(payload => {
        if (payload.mode !== "oauth" && payload.mode !== "access_key") {
          throw new Error("unknown auth mode");
        }
        setAuthProbe(payload);
      })
      .catch(error => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setProbeError(
          "Sign-in configuration is unavailable. The beta remains fail-closed."
        );
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (retrySeconds <= 0) return;
    const timer = window.setInterval(() => {
      setRetrySeconds(current => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retrySeconds]);

  async function submitAccessLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (retrySeconds > 0) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/beta/access-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, accessKey }),
      });

      if (response.status === 429) {
        const retryAfter = Number.parseInt(
          response.headers.get("Retry-After") ?? "60",
          10
        );
        setRetrySeconds(
          Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60
        );
        return;
      }

      if (!response.ok) {
        setSubmitError("Invitation credentials were not accepted.");
        return;
      }

      const payload = (await response.json()) as {
        ok?: boolean;
        redirect?: string;
      };
      if (!payload.ok) {
        setSubmitError("Invitation credentials were not accepted.");
        return;
      }

      window.location.assign(payload.redirect || "/dashboard");
    } catch {
      setSubmitError("Sign-in could not be completed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const accessKeyMode = authProbe?.mode === "access_key";
  const rateLimitMinutes = authProbe?.rateLimit
    ? Math.max(1, Math.round(authProbe.rateLimit.windowMs / 60_000))
    : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] px-4 py-10 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 rounded-lg text-sm text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to ecosystem
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <section className="hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-400/[0.07] via-white/[0.025] to-violet-400/[0.07] p-8 lg:flex lg:flex-col lg:justify-between">
            <div>
              <Badge
                variant="outline"
                className="border-sky-300/25 bg-sky-300/[0.04] text-sky-100"
              >
                SKYCOIN4444 engineering beta
              </Badge>
              <h1 className="mt-6 text-4xl font-black tracking-tight">
                One secure front door for the beta.
              </h1>
              <p className="mt-4 text-base leading-7 text-white/55">
                The live beta is invitation-only. Sign-in creates the same
                canonical browser session used by protected account routes,
                while high-risk financial and chain actions remain gated.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "Invitation checked before session issuance",
                "Admission re-checked on protected requests",
                "No SKYCOIN4444 password collected",
                "No identity-verification claim",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3.5 text-sm text-white/60"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-200" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="border-white/10 bg-white/[0.035] text-white shadow-2xl shadow-black/30">
            <CardHeader className="space-y-4 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                {accessKeyMode && authProbe?.rateLimit ? (
                  <Badge
                    variant="outline"
                    className="border-white/10 text-white/45"
                  >
                    <Clock3 className="h-3 w-3" />
                    {authProbe.rateLimit.maxAttempts} attempts /{" "}
                    {rateLimitMinutes} min
                  </Badge>
                ) : null}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/70">
                  Invitation access
                </p>
                <CardTitle className="mt-2 text-3xl font-black">
                  Enter the beta
                </CardTitle>
                <CardDescription className="mt-2 text-white/50">
                  {accessKeyMode
                    ? "Use the invited email and beta access key provided for this engineering environment."
                    : "Authentication uses the configured external identity provider when available."}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
              <div
                className={
                  "rounded-2xl border p-4 " +
                  (message.tone === "warning"
                    ? "border-amber-400/30 bg-amber-400/[0.06]"
                    : "border-white/10 bg-black/20")
                }
              >
                <div className="flex items-start gap-3">
                  {message.tone === "warning" ? (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                  ) : (
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
                  )}
                  <div>
                    <h2 className="font-bold">{message.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {message.detail}
                    </p>
                  </div>
                </div>
              </div>

              {probeError ? (
                <div
                  className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-3 text-sm text-amber-100"
                  role="alert"
                >
                  {probeError}
                </div>
              ) : null}

              {!authProbe && !probeError ? (
                <Button type="button" className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking beta sign-in mode
                </Button>
              ) : null}

              {authProbe?.mode === "oauth" ? (
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={() => startLogin()}
                  disabled={!authProbe.configured}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Continue with approved identity provider
                </Button>
              ) : null}

              {accessKeyMode ? (
                <form className="space-y-4" onSubmit={submitAccessLogin}>
                  <div>
                    <label
                      htmlFor="beta-email"
                      className="mb-2 block text-sm font-medium text-white/80"
                    >
                      Invited email
                    </label>
                    <input
                      id="beta-email"
                      type="email"
                      required
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="beta-access-key"
                      className="mb-2 block text-sm font-medium text-white/80"
                    >
                      Invitation access key
                    </label>
                    <div className="relative">
                      <input
                        id="beta-access-key"
                        type={showAccessKey ? "text" : "password"}
                        required
                        value={accessKey}
                        onChange={event => setAccessKey(event.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 pr-12 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/10"
                        placeholder="Enter your beta access key"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccessKey(value => !value)}
                        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-white/35 transition hover:text-white"
                        aria-label={
                          showAccessKey ? "Hide access key" : "Show access key"
                        }
                      >
                        {showAccessKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {retrySeconds > 0 ? (
                    <div
                      className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-3 text-sm text-amber-100"
                      role="status"
                      aria-live="polite"
                    >
                      Too many sign-in attempts. Try again in {retrySeconds}
                      {retrySeconds === 1 ? " second" : " seconds"}.
                    </div>
                  ) : null}

                  {submitError ? (
                    <div
                      className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-3 text-sm text-red-100"
                      role="alert"
                      aria-live="polite"
                    >
                      {submitError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={
                      submitting ||
                      retrySeconds > 0 ||
                      !authProbe.configured ||
                      !email.trim() ||
                      !accessKey
                    }
                  >
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    {retrySeconds > 0
                      ? "Sign-in temporarily limited"
                      : "Enter invitation beta"}
                  </Button>
                </form>
              ) : null}

              <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                <p className="text-xs leading-5 text-white/40">
                  {accessKeyMode
                    ? "Access-key mode checks an allowlisted email plus a server-side invitation secret. It does not independently verify ownership of that email or legal identity, and the page does not persist the access key in browser storage."
                    : "No local password is collected by the external-provider sign-in path."}
                  {" "}
                  This page never accepts a SKYCOIN4444 password. Financial
                  settlement, wallet custody, token transfers, signing, and live
                  chain execution remain outside this beta.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/help-center">
                  <Button type="button" variant="outline">
                    Beta help
                  </Button>
                </Link>
                <Link href="/beta-workspace">
                  <Button type="button" variant="ghost">
                    Browse public beta labs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Signin;
