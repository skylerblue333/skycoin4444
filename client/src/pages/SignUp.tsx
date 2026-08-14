import {
  AlertTriangle,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { startLogin } from "@/const";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SignUp() {
  const [authenticationError, setAuthenticationError] = useState<string | null>(
    null
  );

  const beginSecureAuthentication = () => {
    setAuthenticationError(null);

    try {
      startLogin();
    } catch {
      setAuthenticationError(
        "Secure authentication is not configured for this deployment. No account or session was created."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <Card className="w-full max-w-lg border-slate-700 bg-slate-900">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto rounded-full bg-sky-500/10 p-3 text-sky-300">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl text-white">
            Secure account access
          </CardTitle>
          <p className="text-sm leading-6 text-slate-300">
            This application uses the configured authentication provider to
            establish an authenticated session. It does not create accounts,
            store passwords, issue verification messages, or write
            authentication tokens in the browser.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-amber-800/70 bg-amber-950/30 text-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-300" />
            <AlertDescription className="pl-2 text-sm leading-6 text-amber-100">
              Local email, phone, social-provider, profile, reward, and
              verification flows are not configured. No account, credential,
              reward, token balance, email, phone verification, or session will
              be simulated.
            </AlertDescription>
          </Alert>

          {authenticationError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="pl-2">
                {authenticationError}
              </AlertDescription>
            </Alert>
          ) : null}

          <section className="space-y-4 rounded-lg border border-slate-700 bg-slate-950/50 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <h2 className="font-semibold text-white">
                  Provider-managed authentication
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Authentication begins only after you choose to continue. The
                  provider completes identity handling and the server verifies
                  the callback before establishing a session.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <div>
                <h2 className="font-semibold text-white">
                  No fabricated registration state
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  If the authentication provider or its configuration is
                  unavailable, access remains unavailable and no user record,
                  verification outcome, or login state is represented as
                  successful.
                </p>
              </div>
            </div>
          </section>

          <Button className="w-full" onClick={beginSecureAuthentication}>
            Continue with secure sign-in
          </Button>

          <p className="text-center text-sm text-slate-400">
            Already authenticated?{" "}
            <Link href="/" className="text-sky-300 hover:text-sky-200">
              Return to the application
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default SignUp;
