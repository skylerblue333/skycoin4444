import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleCheck,
  Globe2,
  LayoutPanelTop,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
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

const STORAGE_KEY = "skycoin.general-preferences";

type GeneralPreferences = {
  language: "en-US" | "es-ES" | "fr-FR";
  dateFormat: "MMM d, yyyy" | "dd/MM/yyyy" | "yyyy-MM-dd";
  compactDensity: boolean;
  confirmActions: boolean;
};

const defaults: GeneralPreferences = {
  language: "en-US",
  dateFormat: "MMM d, yyyy",
  compactDensity: false,
  confirmActions: true,
};

function readPreferences(): GeneralPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<GeneralPreferences>;
    return {
      language:
        value.language === "es-ES" || value.language === "fr-FR"
          ? value.language
          : defaults.language,
      dateFormat:
        value.dateFormat === "dd/MM/yyyy" || value.dateFormat === "yyyy-MM-dd"
          ? value.dateFormat
          : defaults.dateFormat,
      compactDensity:
        typeof value.compactDensity === "boolean"
          ? value.compactDensity
          : defaults.compactDensity,
      confirmActions:
        typeof value.confirmActions === "boolean"
          ? value.confirmActions
          : defaults.confirmActions,
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

function SelectField({
  icon: Icon,
  id,
  label,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={event => onChange(event.target.value)}
          className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function GeneralSettings() {
  const [preferences, setPreferences] = useState<GeneralPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "General preferences are saved."
  );

  useEffect(() => {
    setPreferences(readPreferences());
  }, []);

  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof GeneralPreferences>(
    key: K,
    value: GeneralPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved general preference changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("General preferences saved on this device.");
    toast.success("General preferences saved", {
      description: "These presentation choices apply on this device.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("General preferences reset to defaults.");
    toast.success("General preferences reset");
  };

  const languageLabel = {
    "en-US": "English (United States)",
    "es-ES": "Español (España)",
    "fr-FR": "Français (France)",
  }[preferences.language];
  const densityLabel = preferences.compactDensity ? "Compact" : "Comfortable";

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Settings2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  General settings
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Set the language, formatting, and interaction details that make
                SKYCOIN4444 feel right for you.
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
                  <Globe2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  Language and region
                </CardTitle>
                <CardDescription>
                  These choices change local presentation only; they do not
                  change your account profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  icon={Globe2}
                  id="language"
                  label="Language"
                  value={preferences.language}
                  options={[
                    { value: "en-US", label: "English (United States)" },
                    { value: "es-ES", label: "Español (España)" },
                    { value: "fr-FR", label: "Français (France)" },
                  ]}
                  onChange={value =>
                    update("language", value as GeneralPreferences["language"])
                  }
                />
                <SelectField
                  icon={LayoutPanelTop}
                  id="date-format"
                  label="Date format"
                  value={preferences.dateFormat}
                  options={[
                    { value: "MMM d, yyyy", label: "Aug 17, 2026" },
                    { value: "dd/MM/yyyy", label: "17/08/2026" },
                    { value: "yyyy-MM-dd", label: "2026-08-17" },
                  ]}
                  onChange={value =>
                    update(
                      "dateFormat",
                      value as GeneralPreferences["dateFormat"]
                    )
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <SlidersHorizontal
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Interface behavior
                </CardTitle>
                <CardDescription>
                  Choose how much information and confirmation you want in
                  everyday flows.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={LayoutPanelTop}
                  label="Compact density"
                  description="Reduce spacing in lists and cards to fit more content in the viewport."
                  checked={preferences.compactDensity}
                  onCheckedChange={value => update("compactDensity", value)}
                />
                <PreferenceRow
                  icon={ShieldCheck}
                  label="Confirm important actions"
                  description="Ask for confirmation before supported actions that could change or remove data."
                  checked={preferences.confirmActions}
                  onCheckedChange={value => update("confirmActions", value)}
                />
              </CardContent>
            </Card>
          </div>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">
                  A local presentation profile
                </CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  These settings are saved on this device. They do not change
                  account data, billing, balances, or server-side permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary-foreground/10 p-3 text-sm leading-5">
                  Save changes when the preview matches how you want the
                  platform to feel.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Language</span>
                  <span className="text-right font-medium">
                    {languageLabel}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Density</span>
                  <span className="font-medium">{densityLabel}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confirm actions</span>
                  <span className="font-medium">
                    {preferences.confirmActions ? "On" : "Off"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="flex gap-3 p-4 text-sm">
                <CircleCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                <p className="text-muted-foreground">
                  Your selections are reversible. Reset restores the default
                  presentation profile.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
