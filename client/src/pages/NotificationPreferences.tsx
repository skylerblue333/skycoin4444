/*
 * Notification preferences beta boundary: durable user-owned controls for
 * in-app policy only. No external email, push, SMS, or delivery provider is enabled.
 */
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type Settings = { inAppEnabled: boolean; productUpdatesEnabled: boolean; securityAlertsEnabled: boolean };
const defaults: Settings = { inAppEnabled: true, productUpdatesEnabled: false, securityAlertsEnabled: true };

export default function NotificationPreferences() {
  const { user } = useAuth();
  const preferences = trpc.notificationPreferences.get.useQuery(undefined, { enabled: !!user });
  const utils = trpc.useUtils();
  const update = trpc.notificationPreferences.update.useMutation({ onSuccess: () => void utils.notificationPreferences.get.invalidate() });
  const [settings, setSettings] = useState<Settings>(defaults);
  useEffect(() => { if (preferences.data) setSettings({ inAppEnabled: preferences.data.inAppEnabled, productUpdatesEnabled: preferences.data.productUpdatesEnabled, securityAlertsEnabled: preferences.data.securityAlertsEnabled }); }, [preferences.data]);
  function change(key: keyof Settings, value: boolean) { const next = { ...settings, [key]: value }; setSettings(next); update.mutate(next); }
  if (!user) return <main className="grid min-h-screen place-items-center bg-[#050510] p-4 text-white"><Card className="w-full max-w-md border-white/10 bg-white/[0.03] text-white"><CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription className="text-white/50">Sign in to manage account-owned notification controls.</CardDescription></CardHeader></Card> </main>;
  return <main className="min-h-screen bg-[#050510] text-white"><header className="border-b border-white/10 bg-[#050510]/95"><div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5"><Link href="/beta-workspace" className="text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link><div><div className="flex items-center gap-2"><h1 className="font-black">Notification preferences</h1><Badge variant="outline" className="border-amber-400/40 text-amber-200">Beta</Badge></div><p className="mt-1 text-xs text-white/40">Control what appears in your account inbox</p></div></div></header><div className="mx-auto max-w-5xl space-y-8 px-4 py-10"><section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">Account control</p><h2 className="mt-3 text-4xl font-black tracking-tight">Choose the signals worth your attention.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55">These settings are stored against your account and apply to the in-app notification surface. They do not subscribe you to an external email, push, SMS, or marketing provider.</p></div><Card className="border-amber-400/25 bg-amber-400/[0.05] text-white"><CardHeader><LockKeyhole className="h-5 w-5 text-amber-200" /><CardTitle className="mt-3 text-amber-100">Delivery boundary</CardTitle><CardDescription className="text-white/55">External notification delivery is not connected in this beta.</CardDescription></CardHeader><CardContent className="space-y-2 text-sm text-white/60"><p>Email: unavailable</p><p>Push and SMS: unavailable</p><p>In-app policy: configurable</p></CardContent></Card></section><Card className="border-white/10 bg-white/[0.03]"><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber-200" />In-app notification policy</CardTitle><CardDescription className="text-white/50">Changes save immediately to your account.</CardDescription></CardHeader><CardContent className="space-y-5">{([ ["inAppEnabled", "In-app notifications", "Allow account-owned notifications to appear in the notification center."], ["securityAlertsEnabled", "Security alerts", "Keep security and account-protection notices visible."], ["productUpdatesEnabled", "Product updates", "Opt in to future product-update notices inside the app."] ] as const).map(([key, title, detail]) => <div key={key} className="flex items-center justify-between gap-5 rounded-xl border border-white/10 bg-black/20 p-4"><div><div className="font-semibold text-white">{title}</div><p className="mt-1 text-sm leading-6 text-white/50">{detail}</p></div><Switch checked={settings[key]} onCheckedChange={value => change(key, value)} disabled={preferences.isLoading || update.isPending} aria-label={title} /></div>)}{update.isSuccess && <p className="text-sm text-emerald-300"><CheckCircle2 className="mr-1 inline h-4 w-4" />Saved to your account</p>}{update.error && <p className="text-sm text-rose-200">Could not save preferences: {update.error.message}</p>}</CardContent></Card><section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/55"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" />Notification preferences change visibility policy only. They do not authorize payments, purchases, wallet actions, transfers, signing, or production-chain execution.</section></div></main>;
}
