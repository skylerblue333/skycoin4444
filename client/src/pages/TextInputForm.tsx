import { useMemo, useState } from "react";
import { AlignLeft } from "lucide-react";
import { countText } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TextInputForm() {
  const [label, setLabel] = useState("Beta note");
  const [value, setValue] = useState("");
  const [required, setRequired] = useState(true);
  const [maxLength, setMaxLength] = useState(160);
  const counts = useMemo(() => countText(value), [value]);
  const error = required && !value.trim()
    ? "A value is required."
    : value.length > maxLength
      ? "Value exceeds " + maxLength + " characters."
      : "";

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Local form lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Text input</h1>
          <p className="mt-2 text-muted-foreground">
            Preview label, required-state, length validation, and live text counts.
          </p>
        </header>

        <Card>
          <CardHeader>
            <AlignLeft className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Configure the field</CardTitle>
            <CardDescription>All state stays in this page session.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Label
              <Input value={label} maxLength={60} onChange={event => setLabel(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Max length
              <Input
                type="number"
                min={20}
                max={2000}
                value={maxLength}
                onChange={event => setMaxLength(Math.min(2000, Math.max(20, Number(event.target.value) || 20)))}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={required} onChange={event => setRequired(event.target.checked)} />
              Required
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{label || "Untitled field"}{required ? " *" : ""}</CardTitle>
            <CardDescription>{counts.characters}/{maxLength} characters · {counts.words} words</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={value}
              onChange={event => setValue(event.target.value)}
              aria-invalid={Boolean(error)}
              placeholder="Type to test validation"
            />
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <p className="text-sm text-emerald-600">Field is valid.</p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This page demonstrates client-side validation only; it does not submit, save, sanitize for a server, or create a production form.
        </p>
      </div>
    </main>
  );
}
