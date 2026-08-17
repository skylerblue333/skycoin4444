import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Check,
  Eye,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "skycoin.security-preferences";

type SecurityPreferences = {
  signInAlerts: boolean;
  newDeviceAlerts: boolean;
  sessionVisibility: boolean;
  privacyReminders: boolean;
  securityDigest: boolean;
};

const defaults: SecurityPreferences = {
  signInAlerts: true,
  newDeviceAlerts: true,
  sessionVisibility: true,
  privacyReminders: true,
  securityDigest: false,
};

function readPreferences(): SecurityPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<SecurityPreferences>;
    return {
      signInAlerts:
        typeof value.signInAlerts === "boolean"
          ? value.signInAlerts
          : defaults.signInAlerts,
      newDeviceAlerts:
        typeof value.newDeviceAlerts === "boolean"
          ? value.newDeviceAlerts
          : defaults.newDeviceAlerts,
      sessionVisibility:
        typeof value.sessionVisibility === "boolean"
          ? value.sessionVisibility
          : defaults.sessionVisibility,
      privacyReminders:
        typeof value.privacyReminders === "boolean"
          ? value.privacyReminders
          : defaults.privacyReminders,
      securityDigest:
        typeof value.securityDigest === "boolean"
          ? value.securityDigest
          : defaults.securityDigest,
    };
  } catch {
    return defaults;
  }
}

function PreferenceRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-4">
      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 rounded-lg border border-border/70 bg-muted/40 p-2 text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="max-w-xl text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  );
}

export default function SecuritySettings() {
  const [preferences, setPreferences] = useState<SecurityPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Security preferences are saved."
  );

  useEffect(() => {
    setPreferences(readPreferences());
  }, []);

  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );

  const update = <K extends keyof SecurityPreferences>(
    key: K,
    value: SecurityPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved security preference changes.");
  };

  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Security preferences saved on this device.");
    toast.success("Security preferences saved", {
      description:
        "These local preferences do not replace account authentication.",
    });
  };

  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Security preferences reset to defaults.");
    toast.success("Security preferences reset");
  };

  const enabledCount = Object.values(preferences).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Security settings
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose how SKYCOIN4444 should help you notice account activity
                and protect your privacy.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button
              variant="ghost"
              onClick={resetPreferences}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </Button>
            <Button
              onClick={savePreferences}
              disabled={saved && !changed}
              className="gap-2"
            >
              <Save className="h-4 w-4" aria-hidden="true" />{" "}
              {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BellRing
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />{" "}
                  Account activity
                </CardTitle>
                <CardDescription>
                  Get useful signals about changes to your account and sign-in
                  activity.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={KeyRound}
                  label="Sign-in alerts"
                  description="Show a notification when a new sign-in is detected by the platform."
                  checked={preferences.signInAlerts}
                  onCheckedChange={value => update("signInAlerts", value)}
                />
                <PreferenceRow
                  icon={Smartphone}
                  label="New device alerts"
                  description="Highlight activity from a device that has not been seen on this account before."
                  checked={preferences.newDeviceAlerts}
                  onCheckedChange={value => update("newDeviceAlerts", value)}
                />
                <PreferenceRow
                  icon={Eye}
                  label="Session visibility"
                  description="Keep the session and device summary visible in supported account views."
                  checked={preferences.sessionVisibility}
                  onCheckedChange={value => update("sessionVisibility", value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LockKeyhole
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />{" "}
                  Privacy reminders
                </CardTitle>
                <CardDescription>
                  Receive guidance that helps you make safer choices without
                  changing account data.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={ShieldCheck}
                  label="Privacy reminders"
                  description="Show occasional reminders about sharing sensitive information and reviewing access."
                  checked={preferences.privacyReminders}
                  onCheckedChange={value => update("privacyReminders", value)}
                />
                <PreferenceRow
                  icon={BellRing}
                  label="Security digest"
                  description="Include security guidance in the platform’s optional account digest when available."
                  checked={preferences.securityDigest}
                  onCheckedChange={value => update("securityDigest", value)}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-amber-500/30 bg-amber-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle
                    className="h-5 w-5 text-amber-500"
                    aria-hidden="true"
                  />{" "}
                  Important distinction
                </CardTitle>
                <CardDescription className="text-foreground/75">
                  These are preference controls stored locally on this device.
                  They do not enable two-factor authentication, revoke sessions,
                  or change credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-amber-500/20 bg-background/40 p-3 text-sm leading-5 text-muted-foreground">
                  Use the platform’s real account-security flow for password,
                  authentication, recovery, or device-management actions.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preference summary</CardTitle>
                <CardDescription>
                  {enabledCount} of 5 local preferences enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sign-in alerts</span>
                  <span className="font-medium">
                    {preferences.signInAlerts ? "On" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    New device alerts
                  </span>
                  <span className="font-medium">
                    {preferences.newDeviceAlerts ? "On" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Privacy reminders
                  </span>
                  <span className="font-medium">
                    {preferences.privacyReminders ? "On" : "Off"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
