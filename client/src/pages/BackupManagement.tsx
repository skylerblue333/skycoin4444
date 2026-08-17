import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  HardDrive,
  Info,
  LockKeyhole,
  RotateCcw,
  Save,
  ShieldCheck,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "skycoin.backup-preferences";
type BackupPreferences = {
  backupReminders: boolean;
  recoveryGuidance: boolean;
  deviceReview: boolean;
};
const defaults: BackupPreferences = {
  backupReminders: true,
  recoveryGuidance: true,
  deviceReview: true,
};

function readPreferences(): BackupPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<BackupPreferences>;
    return {
      backupReminders:
        typeof value.backupReminders === "boolean"
          ? value.backupReminders
          : defaults.backupReminders,
      recoveryGuidance:
        typeof value.recoveryGuidance === "boolean"
          ? value.recoveryGuidance
          : defaults.recoveryGuidance,
      deviceReview:
        typeof value.deviceReview === "boolean"
          ? value.deviceReview
          : defaults.deviceReview,
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
  icon: typeof Bell;
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
          <p className="text-sm font-medium">{label}</p>
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

const unavailableItems = [
  "Secure source of truth",
  "Recovery verification",
  "Export integrity check",
];

export default function BackupManagement() {
  const [preferences, setPreferences] = useState<BackupPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Backup preferences are saved."
  );
  useEffect(() => {
    setPreferences(readPreferences());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof BackupPreferences>(
    key: K,
    value: BackupPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved backup preference changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Backup preferences saved on this device.");
    toast.success("Backup preferences saved", {
      description: "No backup was created by this screen.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Backup preferences reset to defaults.");
    toast.success("Backup preferences reset");
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
              <HardDrive className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Backup management
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Readiness
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Review what is available before trusting any account or wallet
                data to a recovery flow.
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
              <Save className="h-4 w-4" aria-hidden="true" />
              {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </header>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                No backup has been created.
              </strong>{" "}
              This preview cannot export, encrypt, store, or restore account or
              wallet data. Do not treat the readiness checklist as proof of
              recoverability.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Readiness checklist
                </CardTitle>
                <CardDescription>
                  These capabilities require a verified account or secure
                  custody integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {unavailableItems.map(item => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-sm">{item}</span>
                    </div>
                    <Badge variant="outline">Not connected</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                  Readiness reminders
                </CardTitle>
                <CardDescription>
                  These local preferences help you remember to use a real,
                  verified backup flow when one is available.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Bell}
                  label="Backup reminders"
                  description="Show reminders to review backup readiness before important account changes."
                  checked={preferences.backupReminders}
                  onCheckedChange={value => update("backupReminders", value)}
                />
                <PreferenceRow
                  icon={LockKeyhole}
                  label="Recovery guidance"
                  description="Keep safety guidance visible before entering recovery or custody information."
                  checked={preferences.recoveryGuidance}
                  onCheckedChange={value => update("recoveryGuidance", value)}
                />
                <PreferenceRow
                  icon={HardDrive}
                  label="Device review reminders"
                  description="Remind you to review where local preferences and sensitive files may be stored."
                  checked={preferences.deviceReview}
                  onCheckedChange={value => update("deviceReview", value)}
                />
              </CardContent>
            </Card>
          </div>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Safe by being honest</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  A disabled backup action is safer than a fake success state.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary-foreground/10 p-3 text-sm leading-5">
                  Use only verified backup and recovery flows. Never paste seed
                  phrases or private keys into this preview.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reminder profile</CardTitle>
                <CardDescription>
                  {enabledCount} of 3 local reminders enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Backup reminders
                  </span>
                  <span className="font-medium">
                    {preferences.backupReminders ? "On" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Recovery guidance
                  </span>
                  <span className="font-medium">
                    {preferences.recoveryGuidance ? "On" : "Off"}
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
