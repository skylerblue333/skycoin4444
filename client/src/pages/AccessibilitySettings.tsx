import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Check,
  Eye,
  Keyboard,
  Monitor,
  RotateCcw,
  Save,
  Sparkles,
  Type,
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "skycoin.accessibility-preferences";

type AccessibilityPreferences = {
  reducedMotion: boolean;
  highContrast: boolean;
  focusIndicators: boolean;
  keyboardShortcuts: boolean;
  textScale: number;
};

const defaults: AccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  focusIndicators: true,
  keyboardShortcuts: true,
  textScale: 100,
};

function readPreferences(): AccessibilityPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<AccessibilityPreferences>;
    return {
      reducedMotion:
        typeof value.reducedMotion === "boolean"
          ? value.reducedMotion
          : defaults.reducedMotion,
      highContrast:
        typeof value.highContrast === "boolean"
          ? value.highContrast
          : defaults.highContrast,
      focusIndicators:
        typeof value.focusIndicators === "boolean"
          ? value.focusIndicators
          : defaults.focusIndicators,
      keyboardShortcuts:
        typeof value.keyboardShortcuts === "boolean"
          ? value.keyboardShortcuts
          : defaults.keyboardShortcuts,
      textScale:
        typeof value.textScale === "number" &&
        value.textScale >= 90 &&
        value.textScale <= 125
          ? value.textScale
          : defaults.textScale,
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

export default function AccessibilitySettings() {
  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Accessibility preferences are saved."
  );

  useEffect(() => {
    setPreferences(readPreferences());
  }, []);

  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );

  const update = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved accessibility changes.");
  };

  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Accessibility preferences saved on this device.");
    toast.success("Accessibility preferences saved", {
      description: "Your preferences are applied on this device.",
    });
  };

  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Accessibility preferences reset to defaults.");
    toast.success("Accessibility preferences reset");
  };

  return (
    <div
      className="min-h-screen bg-muted/20"
      style={{ fontSize: `${preferences.textScale}%` }}
    >
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Accessibility className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Accessibility
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Adjust how SKYCOIN4444 feels and behaves so the interface works
                better for your needs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button
              variant="ghost"
              onClick={resetPreferences}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
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
                  Visual comfort
                </CardTitle>
                <CardDescription>
                  Make content easier to read and reduce visual distraction.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Sparkles}
                  label="Reduce motion"
                  description="Limit non-essential animations and transitions throughout the interface."
                  checked={preferences.reducedMotion}
                  onCheckedChange={value => update("reducedMotion", value)}
                />
                <PreferenceRow
                  icon={Eye}
                  label="High contrast surfaces"
                  description="Increase separation between panels, borders, and foreground content."
                  checked={preferences.highContrast}
                  onCheckedChange={value => update("highContrast", value)}
                />
                <div className="space-y-4 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg border border-border/70 bg-muted/40 p-2 text-muted-foreground">
                        <Type className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <Label htmlFor="text-scale">Text size</Label>
                        <p className="text-sm text-muted-foreground">
                          Scale interface text without changing your browser
                          zoom.
                        </p>
                      </div>
                    </div>
                    <span
                      className="rounded-md bg-muted px-2 py-1 text-sm font-medium tabular-nums"
                      aria-live="polite"
                    >
                      {preferences.textScale}%
                    </span>
                  </div>
                  <Slider
                    id="text-scale"
                    min={90}
                    max={125}
                    step={5}
                    value={[preferences.textScale]}
                    onValueChange={([value]) => update("textScale", value)}
                    aria-label="Text size"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>90%</span>
                    <span>100%</span>
                    <span>125%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Interaction
                </CardTitle>
                <CardDescription>
                  Choose how you move through the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Monitor}
                  label="Always show focus indicators"
                  description="Keep a visible outline around the active control when navigating with a keyboard."
                  checked={preferences.focusIndicators}
                  onCheckedChange={value => update("focusIndicators", value)}
                />
                <PreferenceRow
                  icon={Keyboard}
                  label="Keyboard shortcuts"
                  description="Enable shortcuts for common navigation actions. You can review them from the help menu."
                  checked={preferences.keyboardShortcuts}
                  onCheckedChange={value => update("keyboardShortcuts", value)}
                />
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">
                  Your settings, your way
                </CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  These preferences are stored locally on this device. They do
                  not change account or financial data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary-foreground/10 p-3 text-sm leading-5">
                  Changes apply after you save. You can return here at any time
                  to adjust them.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Motion</span>
                  <span className="font-medium">
                    {preferences.reducedMotion ? "Reduced" : "Standard"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Text scale</span>
                  <span className="font-medium">{preferences.textScale}%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Keyboard support
                  </span>
                  <span className="font-medium">
                    {preferences.keyboardShortcuts ? "On" : "Off"}
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
