import {
  Activity,
  AlertTriangle,
  Database,
  Edit,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated media-project ownership",
    icon: Database,
    detail:
      "Authenticated ownership, authorization-aware project access, durable project records, version history, validated media references, secure deletion, tenant isolation, audit logging, and recovery procedures are required before creating, listing, editing, saving, sharing, or removing a media-editing project.",
  },
  {
    title: "Secure source media and edit operations",
    icon: Edit,
    detail:
      "Authorized media storage, file validation, access-controlled asset retrieval, safe edit operations, content and metadata controls, privacy settings, error recovery, and clear user feedback are required before displaying, trimming, combining, transforming, previewing, or otherwise editing media.",
  },
  {
    title: "Controlled rendering, export, and publishing pipeline",
    icon: ShieldCheck,
    detail:
      "Isolated render jobs, resource limits, job status records, output validation, malware and abuse safeguards, copyright and moderation workflows, secure delivery, publishing authorization, failure handling, and support escalation are required before rendering, exporting, downloading, publishing, or reporting that a media output is ready.",
  },
  {
    title: "Evidence-based operation and performance reporting",
    icon: Activity,
    detail:
      "Source-attributed job data, documented metric definitions, observability, capacity monitoring, privacy protections, secure error handling, incident response, and independently evidenced performance tests are required before claiming live updates, analytics, active users, transactions, success rates, response times, automation, or production readiness.",
  },
];

export default function VideoEditor() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Video editing service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Video Editor
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Media projects, source files, editing operations, project saves,
            previews, rendering, exports, publishing, real-time updates,
            analytics, active user counts, transactions, success rates, response
            times, and automation are not configured for this deployment. No
            media, edit, project, render job, output, metric, or service result
            is represented as saved, processed, available, or successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated project, edit, render, export, publication, live
                status, or analytics result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a media project, modify a file, save
                an edit, preview a composition, start a render, export a video,
                publish content, retrieve analytics, or report that a
                media-editing action succeeded.
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
