import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Identity verification",
  "Consent management",
  "Personal-data export",
  "Account deletion requests",
  "Compliance audit history",
] as const;

export default function ComplianceCenter() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading compliance account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-gray-900">
          <CardHeader><CardTitle>Compliance Center</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view compliance information associated with your account.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">Compliance Center</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">Not configured</Badge>
          </div>
          <p className="text-sm text-gray-400">A transparent boundary for identity, privacy, and data-rights workflows.</p>
        </header>

        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Compliance services unavailable</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
              This application does not currently expose verified KYC, consent, data-rights, or compliance-audit procedures for this account. It therefore does not display a compliance score, risk score, approval status, certification, processing deadline, or completed request.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader><CardTitle>Planned capabilities</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/20 p-3">
                <span className="text-sm text-gray-300">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs leading-5 text-gray-500">
          Account identity is limited to the authenticated session. No sensitive identity documents, wallet data, or compliance claims are collected or stored by this page.
        </p>
      </div>
    </main>
  );
}
