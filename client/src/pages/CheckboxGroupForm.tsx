import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  Info,
  RotateCcw,
  Save,
  Sparkles,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "skycoin.checkbox-group-preview";
const options = [
  {
    id: "learning",
    label: "Learning updates",
    description: "Keep sample course and study prompts visible.",
  },
  {
    id: "community",
    label: "Community highlights",
    description: "Show sample discussions and welcome prompts.",
  },
  {
    id: "product",
    label: "Product guidance",
    description: "Show local tips for exploring the ecosystem.",
  },
  {
    id: "weekly",
    label: "Weekly digest preview",
    description: "Include a sample weekly summary in this preview.",
  },
];
const defaults = ["learning", "community"];
function readSelection() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) &&
      parsed.every(value => typeof value === "string")
      ? parsed.filter(value => options.some(option => option.id === value))
      : defaults;
  } catch {
    return defaults;
  }
}

export default function CheckboxGroupForm() {
  const [selection, setSelection] = useState<string[]>(defaults);
  const [saved, setSaved] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Local preference selection is saved."
  );
  useEffect(() => {
    setSelection(readSelection());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(selection) !== JSON.stringify(readSelection()),
    [selection]
  );
  const toggle = (id: string) => {
    setSelection(current =>
      current.includes(id)
        ? current.filter(value => value !== id)
        : [...current, id]
    );
    setSaved(false);
    setSubmitted(false);
    setStatusMessage("Unsaved local preference changes.");
  };
  const save = () => {
    if (selection.length === 0) {
      setSubmitted(true);
      setStatusMessage("Choose at least one preference before saving.");
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    setSaved(true);
    setSubmitted(false);
    setStatusMessage("Local preference selection saved on this device.");
    toast.success("Preferences saved", {
      description: "No server-side subscription was created.",
    });
  };
  const reset = () => {
    setSelection(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setSubmitted(false);
    setStatusMessage("Local preference selection reset.");
    toast.success("Preferences reset");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Preference groups
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose the sample content groups you want to explore without
                creating a live subscription.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </Button>
            <Button
              onClick={save}
              disabled={saved && !changed}
              className="gap-2"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {saved ? "Saved" : "Save choices"}
            </Button>
          </div>
        </header>
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Local preference preview.
              </strong>{" "}
              These choices only shape this device's sample experience. No
              email, push, or account subscription is created.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                Choose content groups
              </CardTitle>
              <CardDescription>
                Select at least one group to continue. Each option is labeled
                for the preview context.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <fieldset className="space-y-3">
                <legend className="sr-only">Content preference groups</legend>
                {options.map(option => (
                  <div
                    key={option.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${selection.includes(option.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                  >
                    <Checkbox
                      id={option.id}
                      checked={selection.includes(option.id)}
                      onCheckedChange={() => toggle(option.id)}
                      aria-describedby={`${option.id}-description`}
                    />
                    <div className="grid gap-1">
                      <Label
                        htmlFor={option.id}
                        className="cursor-pointer font-medium"
                      >
                        {option.label}
                      </Label>
                      <p
                        id={`${option.id}-description`}
                        className="text-sm leading-5 text-muted-foreground"
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </fieldset>
              {submitted && selection.length === 0 && (
                <p
                  className="mt-4 text-sm font-medium text-destructive"
                  role="alert"
                >
                  Choose at least one preference before saving.
                </p>
              )}
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">Selection summary</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  Local preview state only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {selection.length}{" "}
                  <span className="text-base font-normal text-primary-foreground/75">
                    of {options.length} groups selected
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  What happens next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The selected groups are used only to demonstrate local
                  preference state and feedback.
                </p>
                <p>
                  When real subscriptions are available, the product must
                  disclose delivery channel, permission scope, and unsubscribe
                  behavior.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
