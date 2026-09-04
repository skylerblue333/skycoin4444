import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  convertText,
  type TextConversionMode,
} from "@/lib/betaUtilities";
import { Download, FileText, Upload } from "lucide-react";

const modes: Array<{ value: TextConversionMode; label: string }> = [
  { value: "json-pretty", label: "JSON → pretty JSON" },
  { value: "json-minify", label: "JSON → minified JSON" },
  { value: "csv-to-tsv", label: "CSV → TSV" },
  { value: "tsv-to-csv", label: "TSV → CSV" },
  { value: "uppercase", label: "Text → UPPERCASE" },
  { value: "lowercase", label: "Text → lowercase" },
];

export default function FileConverter() {
  const [input, setInput] = useState('{"sky":"beta","routes":32}');
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<TextConversionMode>("json-pretty");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("converted.txt");

  const run = () => {
    setError("");
    try {
      setOutput(convertText(input, mode));
    } catch (cause) {
      setOutput("");
      setError(cause instanceof Error ? cause.message : "Conversion failed.");
    }
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_000_000) {
      setError("Choose a text file smaller than 1 MB for this browser-local beta.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setInput(typeof reader.result === "string" ? reader.result : "");
      setFilename(file.name.replace(/\.[^.]+$/, "") + "-converted.txt");
      setError("");
    };
    reader.onerror = () => setError("The browser could not read this file.");
    reader.readAsText(file);
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Launchable beta · browser-local conversion
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black">
            <FileText className="h-8 w-8 text-primary" />
            File Converter Lab
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Convert small text files locally between JSON formatting, CSV/TSV,
            and letter case. Files are read by your browser and are not uploaded
            to a server.
          </p>
        </header>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle>Local conversion</CardTitle>
                <CardDescription>
                  Text only · 1 MB browser limit · no OCR or binary conversion
                </CardDescription>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold">
                <Upload className="h-4 w-4" />
                Load text file
                <input
                  type="file"
                  accept=".txt,.json,.csv,.tsv,text/plain,application/json,text/csv"
                  className="sr-only"
                  onChange={event => loadFile(event.target.files?.[0])}
                />
              </label>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {modes.map(item => (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant={mode === item.value ? "default" : "outline"}
                  onClick={() => setMode(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Input
                <Textarea
                  value={input}
                  onChange={event => setInput(event.target.value)}
                  className="min-h-72 font-mono text-xs"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Output
                <Textarea
                  readOnly
                  value={output}
                  className="min-h-72 font-mono text-xs"
                  placeholder="Run a conversion to see output."
                />
              </label>
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button onClick={run}>Convert locally</Button>
              <Button
                type="button"
                variant="outline"
                disabled={!output}
                onClick={download}
              >
                <Download className="mr-2 h-4 w-4" />
                Download output
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Boundary: no cloud upload, malware scanning, image/video transcoding,
          OCR, document preservation guarantee, or server-side persistence.
        </p>
      </div>
    </main>
  );
}
