import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
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

const STORAGE_KEY = "skycoin.privacy-preferences";

type PrivacyPreferences = {
  publicActivity: boolean;
  searchableProfile: boolean;
  messageRequests: boolean;
  personalizedInsights: boolean;
  dataShareReminders: boolean;
};

const defaults: PrivacyPreferences = {
  publicActivity: true,
  searchableProfile: true,
  messageRequests: true,
  personalizedInsights: true,
  dataShareReminders: true,
};

function readPreferences(): PrivacyPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<PrivacyPreferences>;
    return {
      publicActivity:
        typeof value.publicActivity === "boolean"
          ? value.publicActivity
          : defaults.publicActivity,
      searchableProfile:
        typeof value.searchableProfile === "boolean"
          ? value.searchableProfile
          : defaults.searchableProfile,
      messageRequests:
        typeof value.messageRequests === "boolean"
          ? value.messageRequests
          : defaults.messageRequests,
      personalizedInsights:
        typeof value.personalizedInsights === "boolean"
          ? value.personalizedInsights
          : defaults.personalizedInsights,
      dataShareReminders:
        typeof value.dataShareReminders === "boolean"
          ? value.dataShareReminders
          : defaults.dataShareReminders,
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

export default function PrivacySettings() {
  const [preferences, setPreferences] = useState<PrivacyPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Privacy preferences are saved."
  );

  useEffect(() => {
    setPreferences(readPreferences());
  }, []);

  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof PrivacyPreferences>(
    key: K,
    value: PrivacyPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved privacy preference changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Privacy preferences saved on this device.");
    toast.success("Privacy preferences saved", {
      description:
        "These local choices do not replace account privacy controls.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Privacy preferences reset to defaults.");
    toast.success("Privacy preferences reset");
  };

  const enabledCount = Object.values(preferences).filter(Boolean).length;
  const posture =
    enabledCount >= 4
      ? "Open by default"
      : enabledCount >= 2
        ? "Balanced"
        : "More private";

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Privacy settings
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose how visible your activity feels and how much
                personalization you want from the platform.
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

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                  Visibility and discovery
                </CardTitle>
                <CardDescription>
                  These preferences describe your desired visibility. They are
                  stored locally until connected to a real account privacy API.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Eye}
                  label="Public activity"
                  description="Keep your community activity eligible for public surfaces when the platform supports it."
                  checked={preferences.publicActivity}
                  onCheckedChange={value => update("publicActivity", value)}
                />
                <PreferenceRow
                  icon={Search}
                  label="Searchable profile"
                  description="Allow your profile to be discoverable through supported platform search experiences."
                  checked={preferences.searchableProfile}
                  onCheckedChange={value => update("searchableProfile", value)}
                />
                <PreferenceRow
                  icon={MessageCircle}
                  label="Message requests"
                  description="Allow people outside your connections to send a message request."
                  checked={preferences.messageRequests}
                  onCheckedChange={value => update("messageRequests", value)}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Personalization
                </CardTitle>
                <CardDescription>
                  Choose whether the interface may use your activity to make
                  local recommendations more relevant.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Sparkles}
                  label="Personalized insights"
                  description="Allow supported screens to tailor suggestions and educational prompts to your activity."
                  checked={preferences.personalizedInsights}
                  onCheckedChange={value =>
                    update("personalizedInsights", value)
                  }
                />
                <PreferenceRow
                  icon={ShieldCheck}
                  label="Data-sharing reminders"
                  description="Show reminders before sharing information that may be sensitive or difficult to revoke."
                  checked={preferences.dataShareReminders}
                  onCheckedChange={value => update("dataShareReminders", value)}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-sky-500/30 bg-sky-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <EyeOff className="h-5 w-5 text-sky-500" aria-hidden="true" />
                  Privacy, clearly stated
                </CardTitle>
                <CardDescription className="text-foreground/75">
                  This screen stores preferences on this device. It does not
                  delete data, change account visibility on the server, or grant
                  access to private information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-sky-500/20 bg-background/40 p-3 text-sm leading-5 text-muted-foreground">
                  Use the platform’s actual account privacy and data-management
                  flows for server-side changes.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Privacy posture</CardTitle>
                <CardDescription>
                  {enabledCount} of 5 local preferences enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current profile</span>
                  <span className="font-medium">{posture}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Public activity</span>
                  <span className="font-medium">
                    {preferences.publicActivity ? "On" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Personalization</span>
                  <span className="font-medium">
                    {preferences.personalizedInsights ? "On" : "Off"}
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
