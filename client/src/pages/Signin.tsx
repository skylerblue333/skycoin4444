import { Link } from "wouter";
import { AlertTriangle, ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startLogin } from "@/const";

function admissionMessage(reason: string | null) {
  if (reason === "not-invited") {
    return {
      title: "This account is not on the beta invite list",
      detail:
        "SKYCOIN4444 is currently invitation-only. No session was issued for this account. Ask the beta owner to add your OAuth identity or email before trying again.",
      tone: "warning" as const,
    };
  }

  if (reason === "oauth-unconfigured") {
    return {
      title: "Sign-in provider is not configured",
      detail:
        "This environment cannot start OAuth yet. No email, password, or local credential was collected. The deployment owner must configure the approved identity provider first.",
      tone: "warning" as const,
    };
  }

  return {
    title: "Invitation-only engineering beta",
    detail:
      "Use the configured identity provider to continue. Access is checked against the beta invitation policy before a session is created and again on protected requests.",
    tone: "normal" as const,
  };
}

export function Signin() {
  const reason =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("reason");
  const message = admissionMessage(reason);

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
                Authentication is provider-backed only when the deployment has
                verified OAuth configuration.
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

            <Button
              type="button"
              className="w-full"
              onClick={() => startLogin()}
              disabled={reason === "oauth-unconfigured"}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Continue with approved identity provider
            </Button>

            <p className="text-xs leading-5 text-white/40">
              This page never accepts a SKYCOIN4444 password and never stores a
              fabricated authentication token in browser storage. Financial
              settlement, wallet custody, token transfers, signing, and live
              chain execution remain outside this beta.
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
