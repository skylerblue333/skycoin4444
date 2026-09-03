import { useEffect, useState } from "react";
import {
  CalendarClock,
  Clipboard,
  Languages,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
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
import {
  buildLanguagePracticePlan,
  emptyLanguageExchangeProfile,
  parseLanguageExchangeProfile,
  validateLanguageExchangeProfile,
  type LanguageExchangeProfile,
  type LanguagePracticePlan,
} from "@/lib/competitiveLabs";

const STORAGE_KEY = "sky4444.language-exchange-profile";

export default function LanguagePartnerDiscovery() {
  const [profile, setProfile] = useState<LanguageExchangeProfile>(
    emptyLanguageExchangeProfile
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [plan, setPlan] = useState<LanguagePracticePlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const restored = parseLanguageExchangeProfile(
      localStorage.getItem(STORAGE_KEY)
    );
    if (restored) setProfile(restored);
  }, []);

  const update = (patch: Partial<LanguageExchangeProfile>) => {
    setProfile(current => ({ ...current, ...patch }));
    setErrors([]);
    setSaved(false);
    setPlan(null);
    setCopied(false);
  };

  const validate = () => {
    const nextErrors = validateLanguageExchangeProfile(profile);
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const saveProfile = () => {
    if (!validate()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  const createPlan = () => {
    if (!validate()) return;
    setPlan(buildLanguagePracticePlan(profile));
  };

  const copyPlan = async () => {
    if (!plan || !navigator.clipboard) return;
    await navigator.clipboard.writeText(
      [
        plan.title,
        ...plan.steps.map(
          step =>
            String(step.minutes) + " min — " + step.label + ": " + step.detail
        ),
      ].join("\n")
    );
    setCopied(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        icon={Languages}
        title="Language Exchange Lab"
        subtitle="Build a real local profile and a balanced practice plan without fabricated partners"
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <Card className="border-sky-400/30 bg-sky-400/[0.05]">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge
                variant="outline"
                className="border-sky-400/50 text-sky-700 dark:text-sky-200"
              >
                Local test lab
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Partner discovery is not connected. This page contains no fake
                people, locations, ratings, sessions, response times, or
                availability.
              </p>
            </div>
            <ShieldCheck className="h-7 w-7 shrink-0 text-sky-500" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Your exchange profile</CardTitle>
              <CardDescription>
                Stored only in this browser until a reviewed account contract
                exists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="I speak">
                  <Input
                    value={profile.nativeLanguage}
                    onChange={event =>
                      update({ nativeLanguage: event.target.value })
                    }
                    placeholder="Your strongest language"
                  />
                </Field>
                <Field label="I am learning">
                  <Input
                    value={profile.learningLanguage}
                    onChange={event =>
                      update({ learningLanguage: event.target.value })
                    }
                    placeholder="Practice language"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Current CEFR level">
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={profile.level}
                    onChange={event =>
                      update({
                        level: event.target
                          .value as LanguageExchangeProfile["level"],
                      })
                    }
                  >
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Session length">
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={profile.sessionMinutes}
                    onChange={event =>
                      update({
                        sessionMinutes: Number(
                          event.target.value
                        ) as LanguageExchangeProfile["sessionMinutes"],
                      })
                    }
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </Field>
              </div>
              <Field label="Availability">
                <Input
                  value={profile.availability}
                  onChange={event =>
                    update({ availability: event.target.value })
                  }
                  placeholder="e.g. Saturdays after 15:00 UTC"
                />
              </Field>
              <Field label="Practice goal">
                <Textarea
                  rows={3}
                  value={profile.goals}
                  onChange={event => update({ goals: event.target.value })}
                  placeholder="What should a useful session improve?"
                />
              </Field>
              <Field label="Topics">
                <Input
                  value={profile.topics}
                  onChange={event => update({ topics: event.target.value })}
                  placeholder="Travel, music, software…"
                />
              </Field>

              {errors.length > 0 && (
                <ul className="list-disc rounded-lg border border-destructive/40 bg-destructive/5 p-4 pl-8 text-sm text-destructive">
                  {errors.map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
              {saved && (
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-200">
                  Profile saved in this browser.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={saveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save local profile
                </Button>
                <Button type="button" onClick={createPlan}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Build practice plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>Balanced practice plan</CardTitle>
                    <CardDescription className="mt-1">
                      Deterministic timing, equal practice, and no AI-provider
                      claim.
                    </CardDescription>
                  </div>
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {plan ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{plan.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.totalMinutes} minutes total
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={copyPlan}
                      >
                        <Clipboard className="mr-2 h-4 w-4" />
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    {plan.steps.map((step, index) => (
                      <div
                        key={step.label}
                        className="flex gap-4 rounded-xl border bg-muted/20 p-4"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">
                            {step.label} · {step.minutes} min
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-72 place-items-center rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                    <div>
                      <Languages className="mx-auto mb-3 h-8 w-8" />
                      Complete the profile and build a practice plan.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-400/30">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-amber-500" />
                  <div>
                    <CardTitle>Partner discovery: not connected</CardTitle>
                    <CardDescription className="mt-1 leading-6">
                      Promotion requires account-owned profiles, consent and
                      blocking contracts, moderation and reporting, presence,
                      messaging or calls, abuse testing, and verified
                      persistence.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
