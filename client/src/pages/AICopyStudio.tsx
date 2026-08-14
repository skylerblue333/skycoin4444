import {
  AlertTriangle,
  FileText,
  Languages,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Content generation and revision",
    icon: Sparkles,
    detail:
      "A configured model provider, server-side credential management, prompt controls, output moderation, rate limits, and failure handling are required before generating or improving copy.",
  },
  {
    title: "Analysis and performance scoring",
    icon: FileText,
    detail:
      "Defined scoring methods, validated data sources, objective evaluation criteria, and clear limitations are required before assigning quality, readability, persuasion, or conversion scores.",
  },
  {
    title: "Translation services",
    icon: Languages,
    detail:
      "A configured translation provider, language coverage policy, quality checks, and privacy controls are required before translating user-supplied content.",
  },
  {
    title: "Safe publishing workflow",
    icon: ShieldCheck,
    detail:
      "Content review, provenance labeling, privacy controls, user approval, and campaign integration are required before this can be offered as a production copywriting service.",
  },
];

export default function AICopyStudio() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI copy service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Copy Studio
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The copy-generation service is not configured for this deployment.
            This page does not generate, improve, analyze, score, translate,
            store, or publish marketing copy, and it does not make claims about
            engagement, search performance, conversion, or campaign outcomes.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated content or quality scores
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This interface intentionally does not fabricate generated copy,
                translations, templates, analysis results, word counts, history,
                or performance scores. AI content functions will remain
                unavailable until their services and safeguards are operational.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceRequirements.map(requirement => {
            const Icon = requirement.icon;
            return (
              <Card
                key={requirement.title}
                className="border-slate-700 bg-slate-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base text-white">
                    <span className="rounded-lg bg-slate-800 p-2 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">
                    {requirement.detail}
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    Status: not configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
