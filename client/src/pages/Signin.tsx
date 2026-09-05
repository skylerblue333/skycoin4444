import { type FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Loader2,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      "Access is checked against the beta invitation policy before a session is created and again on protected requests.",
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
  const [submitError, setSubmitError] = useState("");
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

  async function submitAccessLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      window.location.assign(payload.redirect || "/");
    } catch {
      setSubmitError("Sign-in could not be completed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const accessKeyMode = authProbe?.mode === "access_key";

  return (
    <main className="min-h-screen bg-[#050510] px-4 py-12 text-white">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to ecosystem
        </Link>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200/70">
                SKYCOIN4444
              </p>
              <CardTitle className="mt-2 text-3xl font-black">
                Beta sign in
              </CardTitle>
              <CardDescription className="mt-2 text-white/50">
                {accessKeyMode
                  ? "Self-contained invite access for the engineering beta. No external OAuth provider is required."
                  : "Authentication uses the configured external identity provider when available."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
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
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                )}
                <div>
                  <h1 className="font-bold">{message.title}</h1>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {message.detail}
                  </p>
                </div>
              </div>
            </div>

            {probeError ? (
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-3 text-sm text-amber-100">
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
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-white outline-none focus:border-amber-300/50"
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
                  <input
                    id="beta-access-key"
                    type="password"
                    required
                    value={accessKey}
                    onChange={event => setAccessKey(event.target.value)}
                    autoComplete="off"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-white outline-none focus:border-amber-300/50"
                    placeholder="Enter your beta access key"
                  />
                </div>

                {submitError ? (
                  <div className="rounded-xl border border-red-400/30 bg-red-400/[0.06] p-3 text-sm text-red-100">
                    {submitError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || !authProbe.configured}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  Enter invitation beta
                </Button>
              </form>
            ) : null}

            <p className="text-xs leading-5 text-white/40">
              {accessKeyMode
                ? "This access mode checks an allowlisted email plus a server-side invitation secret. It does not independently verify ownership of that email or a legal identity. The page does not store the access key in browser storage."
                : "No local password is collected by the external-provider sign-in path."}
              {" "}Financial settlement, wallet custody, token transfers, signing,
              and live chain execution remain outside this beta.
            </p>

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
    </main>
  );
}

export default Signin;
