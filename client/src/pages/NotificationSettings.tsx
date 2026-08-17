import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  Clock3,
  Mail,
  MessageSquare,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Zap,
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

const STORAGE_KEY = "skycoin.notification-preferences";

type NotificationPreferences = {
  account: boolean;
  security: boolean;
  messages: boolean;
  community: boolean;
  product: boolean;
  email: boolean;
  push: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
};

const defaults: NotificationPreferences = {
  account: true,
  security: true,
  messages: true,
  community: true,
  product: false,
  email: true,
  push: true,
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "07:00",
};

function readPreferences(): NotificationPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<NotificationPreferences>;
    return {
      account:
        typeof value.account === "boolean" ? value.account : defaults.account,
      security:
        typeof value.security === "boolean"
          ? value.security
          : defaults.security,
      messages:
        typeof value.messages === "boolean"
          ? value.messages
          : defaults.messages,
      community:
        typeof value.community === "boolean"
          ? value.community
          : defaults.community,
      product:
        typeof value.product === "boolean" ? value.product : defaults.product,
      email: typeof value.email === "boolean" ? value.email : defaults.email,
      push: typeof value.push === "boolean" ? value.push : defaults.push,
      quietHours:
        typeof value.quietHours === "boolean"
          ? value.quietHours
          : defaults.quietHours,
      quietStart:
        typeof value.quietStart === "string"
          ? value.quietStart
          : defaults.quietStart,
      quietEnd:
        typeof value.quietEnd === "string" ? value.quietEnd : defaults.quietEnd,
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

export default function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Notification preferences are saved."
  );

  useEffect(() => {
    setPreferences(readPreferences());
  }, []);

  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved notification changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Notification preferences saved on this device.");
    toast.success("Notification preferences saved", {
      description: "Your delivery choices are applied on this device.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Notification preferences reset to defaults.");
    toast.success("Notification preferences reset");
  };

  const enabledCategories = [
    preferences.security,
    preferences.account,
    preferences.messages,
    preferences.community,
    preferences.product,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Bell className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Notifications
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose which updates matter to you and where SKYCOIN4444 should
                deliver them.
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
                  <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                  What you hear about
                </CardTitle>
                <CardDescription>
                  Important security notices stay on. Everything else is
                  configurable.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={ShieldCheck}
                  label="Security and sign-in"
                  description="New sign-ins, authentication changes, and security recommendations."
                  checked={preferences.security}
                  onCheckedChange={value => update("security", value)}
                />
                <PreferenceRow
                  icon={Bell}
                  label="Account activity"
                  description="Profile updates, account milestones, and important account status changes."
                  checked={preferences.account}
                  onCheckedChange={value => update("account", value)}
                />
                <PreferenceRow
                  icon={MessageSquare}
                  label="Messages"
                  description="Direct messages and replies that need your attention."
                  checked={preferences.messages}
                  onCheckedChange={value => update("messages", value)}
                />
                <PreferenceRow
                  icon={Bell}
                  label="Community activity"
                  description="Follows, mentions, reactions, and updates from your community."
                  checked={preferences.community}
                  onCheckedChange={value => update("community", value)}
                />
                <PreferenceRow
                  icon={Zap}
                  label="Product updates"
                  description="New features, educational resources, and occasional platform announcements."
                  checked={preferences.product}
                  onCheckedChange={value => update("product", value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  Delivery channels
                </CardTitle>
                <CardDescription>
                  Control where enabled notifications can appear.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <PreferenceRow
                  icon={Mail}
                  label="Email notifications"
                  description="Receive enabled notifications at your verified account email address."
                  checked={preferences.email}
                  onCheckedChange={value => update("email", value)}
                />
                <PreferenceRow
                  icon={Smartphone}
                  label="Push notifications"
                  description="Receive enabled notifications on supported devices and browsers."
                  checked={preferences.push}
                  onCheckedChange={value => update("push", value)}
                />
                <PreferenceRow
                  icon={Clock3}
                  label="Quiet hours"
                  description="Pause non-essential push notifications during your configured quiet period."
                  checked={preferences.quietHours}
                  onCheckedChange={value => update("quietHours", value)}
                />
                {preferences.quietHours && (
                  <div className="grid gap-4 py-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-start">Starts</Label>
                      <select
                        id="quiet-start"
                        value={preferences.quietStart}
                        onChange={event =>
                          update("quietStart", event.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {["20:00", "21:00", "22:00", "23:00", "00:00"].map(
                          time => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-end">Ends</Label>
                      <select
                        id="quiet-end"
                        value={preferences.quietEnd}
                        onChange={event =>
                          update("quietEnd", event.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {["05:00", "06:00", "07:00", "08:00", "09:00"].map(
                          time => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Stay in control</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  Notification choices are stored locally on this device.
                  Security notices may still be required for account protection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-primary-foreground/10 p-3 text-sm leading-5">
                  Save changes when you are finished. You can update these
                  choices at any time.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery summary</CardTitle>
                <CardDescription>
                  {enabledCategories} of 5 notification categories enabled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">
                    {preferences.email ? "Enabled" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Push</span>
                  <span className="font-medium">
                    {preferences.push ? "Enabled" : "Off"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quiet hours</span>
                  <span className="font-medium">
                    {preferences.quietHours
                      ? `${preferences.quietStart}–${preferences.quietEnd}`
                      : "Off"}
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
