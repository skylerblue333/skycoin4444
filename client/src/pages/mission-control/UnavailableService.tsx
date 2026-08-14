import { AlertTriangle, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UnavailableServiceProps {
  title: string;
  icon: LucideIcon;
  summary: string;
  requirements: Array<{ title: string; detail: string }>;
}

export function UnavailableService({
  title,
  icon: Icon,
  summary,
  requirements,
}: UnavailableServiceProps) {
  return (
    <section className="space-y-6 rounded-xl border border-slate-700 bg-slate-950 p-6 text-slate-100">
      <header>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
          <AlertTriangle className="h-3.5 w-3.5" /> Service unavailable
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-slate-800 p-2 text-sky-300">
            <Icon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {summary}
        </p>
      </header>

      <div className="rounded-xl border border-amber-900/60 bg-amber-950/30 p-4">
        <p className="text-sm leading-6 text-amber-200">
          This area does not simulate transactions, user actions, financial or
          reputation values, workflows, outcomes, or third-party integrations.
          It will remain unavailable until its requirements are implemented and
          verifiable.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {requirements.map(requirement => (
          <Card
            key={requirement.title}
            className="border-slate-700 bg-slate-900"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">
                {requirement.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-300">
                {requirement.detail}
              </p>
              <p className="mt-3 text-xs font-medium text-slate-400">
                Status: not configured
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
