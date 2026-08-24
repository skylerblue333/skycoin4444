import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startLogin } from "@/const";
import { CheckCircle2, Lock, ShieldCheck, UserPlus } from "lucide-react";

export function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            SKYCOIN4444
          </div>
          <CardTitle className="text-xl text-white">Create Account</CardTitle>
          <p className="text-sm text-slate-400">
            Account creation uses the platform's secure sign-in provider.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <Alert className="border-purple-500/20 bg-purple-500/5 text-slate-200">
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Passwords are not stored in this browser. The previous local-only signup flow has been disabled because it did not create a real server account.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">Secure identity</p>
                <p className="text-xs text-slate-400">Authentication is handled by the configured OAuth provider and server session.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Real account state</p>
                <p className="text-xs text-slate-400">The UI only reports success after the server completes authentication.</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => startLogin()}
            className="h-12 w-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white hover:from-purple-700 hover:to-pink-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Continue to Secure Sign Up
          </Button>

          <p className="text-center text-xs text-slate-500">
            Email/password registration, phone registration, and starter-token grants are not claimed until their server-side flows are implemented and verified.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
