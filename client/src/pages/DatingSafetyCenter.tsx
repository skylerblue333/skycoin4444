import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Heart,
  LockKeyhole,
  MessageCircleWarning,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildDateSafetySummary,
  dateSafetyPlanReadiness,
  detectDatingSafetySignals,
  type DateSafetyPlanInput,
} from "@/lib/datingSafety";

const PLAN_KEY = "sky4444.dating-date-safety-plan";

const emptyPlan: DateSafetyPlanInput = {
  publicPlace: "",
  transportation: "",
  checkInPlan: "",
  startTime: "",
  endTime: "",
  exitPlan: "",
};

const baselineSafety = [
  "Meet first dates in a busy public place.",
  "Control your own transportation and keep enough battery/fuel to leave.",
  "Tell someone you trust where you plan to be and when you expect to check in.",
  "Do not share passwords, private keys, recovery phrases, one-time codes, or account credentials.",
  "Do not send money, crypto, gift cards, or deposits because someone pressures you.",
  "Keep identifying details private until trust develops at your pace.",
  "Leave if someone ignores boundaries, pressures you, threatens you, or appears to be impersonating someone.",
];

export default function DatingSafetyCenter() {
  const [plan, setPlan] = useState<DateSafetyPlanInput>(emptyPlan);
  const [scanText, setScanText] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PLAN_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<DateSafetyPlanInput>;
      setPlan({
        publicPlace:
          typeof parsed.publicPlace === "string" ? parsed.publicPlace : "",
        transportation:
          typeof parsed.transportation === "string" ? parsed.transportation : "",
        checkInPlan:
          typeof parsed.checkInPlan === "string" ? parsed.checkInPlan : "",
        startTime:
          typeof parsed.startTime === "string" ? parsed.startTime : "",
        endTime: typeof parsed.endTime === "string" ? parsed.endTime : "",
        exitPlan: typeof parsed.exitPlan === "string" ? parsed.exitPlan : "",
      });
    } catch {
      // Invalid or unavailable session storage should not block the safety page.
    }
  }, []);

  const readiness = useMemo(() => dateSafetyPlanReadiness(plan), [plan]);
  const safetySignals = useMemo(
    () => detectDatingSafetySignals(scanText),
    [scanText]
  );

  const updatePlan = (patch: Partial<DateSafetyPlanInput>) => {
    setPlan(current => ({ ...current, ...patch }));
    setSaveStatus(null);
  };

  const savePlan = () => {
    try {
      sessionStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      setSaveStatus(
        "Plan saved only in this browser session. It was not sent to a contact or emergency service."
      );
    } catch {
      setSaveStatus(
        "Browser-session storage is unavailable. The plan remains only in this open page."
      );
    }
  };

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(buildDateSafetySummary(plan));
      setSaveStatus(
        "Safety-plan text copied. You choose whether and how to share it."
      );
    } catch {
      setSaveStatus(
        "Clipboard access was unavailable. Your plan was not transmitted anywhere."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#090404] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center gap-2 text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.18em]">
              Dating safety center
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Safer choices without fake guarantees
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
            These tools help you plan and notice warning language. They do not
            verify identity, conduct background checks, prove fraud, monitor a
            date, contact emergency services, or guarantee safety.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dating-home">
              <Button variant="outline" className="border-white/10 bg-white/[0.03] text-white">
                Dating home
              </Button>
            </Link>
            <Link href="/dating-discovery">
              <Button variant="outline" className="border-white/10 bg-white/[0.03] text-white">
                Discover
              </Button>
            </Link>
            <Link href="/dating-matches">
              <Button className="bg-pink-600 hover:bg-pink-500">
                Matches & chat
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <Card className="border-white/10 bg-white/[0.04] p-5 text-white">
              <div className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="font-black">Baseline safety checklist</h2>
              </div>
              <div className="mt-4 space-y-3">
                {baselineSafety.map(item => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/60"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-amber-200/15 bg-amber-200/[0.05] p-5 text-white">
              <div className="flex items-center gap-2 text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-black">Immediate-danger boundary</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">
                SKYCOIN4444 dating is not an emergency-response or monitoring
                service. If you believe you are in immediate danger, leave the
                situation when you safely can and contact local emergency
                services or a trusted person directly.
              </p>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] p-5 text-white">
              <div className="flex items-center gap-2 text-violet-200">
                <MessageCircleWarning className="h-5 w-5" />
                <h2 className="font-black">Message warning-signal check</h2>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Paste text here locally to look for a small set of obvious
                warning phrases. A flag is a reminder to slow down—not proof a
                person is dangerous or fraudulent.
              </p>
              <Textarea
                value={scanText}
                onChange={event => setScanText(event.target.value.slice(0, 2000))}
                rows={6}
                placeholder="Paste a message to review locally…"
                className="mt-4"
              />
              <div className="mt-3 min-h-12">
                {!scanText.trim() ? (
                  <p className="text-sm text-white/30">
                    Nothing is uploaded by this helper.
                  </p>
                ) : safetySignals.length ? (
                  <div className="flex flex-wrap gap-2">
                    {safetySignals.map(signal => (
                      <span
                        key={signal.signal}
                        className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-100"
                      >
                        {signal.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-300">
                    No configured warning phrase matched. This is not a safety
                    certification.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <Card className="border-white/10 bg-white/[0.04] p-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-pink-200">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="font-black">First-date safety plan</h2>
                </div>
                <p className="mt-2 max-w-xl text-xs leading-5 text-white/40">
                  This plan is session-local. Saving it does not notify another
                  person, share your location, or create an emergency check-in.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm font-black">
                {readiness.percent}%
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-white/65">
                Public meeting place
                <Input
                  value={plan.publicPlace}
                  onChange={event =>
                    updatePlan({ publicPlace: event.target.value.slice(0, 120) })
                  }
                  placeholder="Busy coffee shop, public venue…"
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-semibold text-white/65">
                Independent transportation
                <Input
                  value={plan.transportation}
                  onChange={event =>
                    updatePlan({
                      transportation: event.target.value.slice(0, 120),
                    })
                  }
                  placeholder="Drive myself, rideshare I control…"
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-semibold text-white/65 sm:col-span-2">
                Check-in plan
                <Input
                  value={plan.checkInPlan}
                  onChange={event =>
                    updatePlan({ checkInPlan: event.target.value.slice(0, 160) })
                  }
                  placeholder="Example: text a trusted friend at 8:00 PM"
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-semibold text-white/65">
                Approximate start time
                <Input
                  type="time"
                  value={plan.startTime}
                  onChange={event => updatePlan({ startTime: event.target.value })}
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-semibold text-white/65">
                Approximate end/check-out time
                <Input
                  type="time"
                  value={plan.endTime}
                  onChange={event => updatePlan({ endTime: event.target.value })}
                  className="mt-1"
                />
              </label>
              <label className="text-sm font-semibold text-white/65 sm:col-span-2">
                Exit plan
                <Textarea
                  value={plan.exitPlan}
                  onChange={event =>
                    updatePlan({ exitPlan: event.target.value.slice(0, 240) })
                  }
                  rows={4}
                  placeholder="How will you leave independently if you become uncomfortable?"
                  className="mt-1"
                />
              </label>
            </div>

            {readiness.missing.length ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {readiness.missing.map(item => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-xs text-white/50"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3 text-sm text-emerald-200">
                All configured planning fields are filled. This is still a plan,
                not a safety guarantee.
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={savePlan} className="bg-pink-600 hover:bg-pink-500">
                <Save className="mr-2 h-4 w-4" />
                Save in this session
              </Button>
              <Button
                onClick={() => void copyPlan()}
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy plan text
              </Button>
            </div>

            {saveStatus ? (
              <div
                className="mt-4 rounded-xl border border-white/8 bg-black/20 p-3 text-sm leading-6 text-white/55"
                aria-live="polite"
              >
                {saveStatus}
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-white/70">
                <LockKeyhole className="h-4 w-4" />
                <h3 className="text-sm font-black">Privacy note</h3>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">
                The plan and message checker on this page are browser-session
                tools. They are separate from server-backed dating profile,
                match, message, block, and report records.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
