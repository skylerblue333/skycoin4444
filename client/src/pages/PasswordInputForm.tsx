import { useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { analyzePassword } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PasswordInputForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const analysis = useMemo(() => analyzePassword(password), [password]);
  const matches = Boolean(password) && password === confirmation;

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Badge variant="outline">Local password form lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Password input</h1>
          <p className="mt-2 text-muted-foreground">
            Exercise show/hide, confirmation, and transparent heuristic checks without submitting a password anywhere.
          </p>
        </header>

        <Card>
          <CardHeader>
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Password field behavior</CardTitle>
            <CardDescription>This page never sends or persists the entered value.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type={visible ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                onChange={event => setPassword(event.target.value)}
                placeholder="Enter test password"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setVisible(value => !value)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Input
              type={visible ? "text" : "password"}
              value={confirmation}
              autoComplete="new-password"
              onChange={event => setConfirmation(event.target.value)}
              placeholder="Confirm test password"
            />

            <div className="rounded-xl border p-4">
              <p className="font-medium">Heuristic: {analysis.label}</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>{analysis.checks.length ? "✓" : "○"} 12+ characters</li>
                <li>{analysis.checks.upper ? "✓" : "○"} Uppercase letter</li>
                <li>{analysis.checks.lower ? "✓" : "○"} Lowercase letter</li>
                <li>{analysis.checks.number ? "✓" : "○"} Number</li>
                <li>{analysis.checks.symbol ? "✓" : "○"} Symbol</li>
                <li>{matches ? "✓" : "○"} Confirmation matches</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a UI heuristic, not a security guarantee, breach check, credential manager, authentication flow, or password-storage service.
        </p>
      </div>
    </main>
  );
}
