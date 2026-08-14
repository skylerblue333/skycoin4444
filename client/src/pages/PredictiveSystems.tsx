import {
  Activity,
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Governed prediction data and measurement",
    icon: Database,
    detail:
      "A documented, consented, access-controlled, retained, and quality-checked data pipeline; data lineage; feature definitions; metric methodology; identity resolution; segmentation governance; and correction procedures are required before displaying user risk, activity patterns, retention, churn, revenue, audience behavior, financial effects, or platform measurements.",
  },
  {
    title: "Validated forecasting and model operations",
    icon: Activity,
    detail:
      "Versioned models, documented intended use, representative training and evaluation data, independent validation, calibration, accuracy and drift monitoring, bias and safety review, approval workflows, reproducible outputs, rollback controls, and human oversight are required before presenting a prediction, forecast, score, probability, model accuracy, ranking, anomaly, trend, or recommendation.",
  },
  {
    title: "Authorized intervention and communications controls",
    icon: Scale,
    detail:
      "Defined roles, user consent where required, eligibility and policy rules, rate limits, approved message and campaign workflows, audit trails, human review, reversal procedures, and measurable outcome controls are required before triggering an intervention, contacting a user, changing account treatment, initiating an engagement action, or taking a decision based on analytics.",
  },
  {
    title: "Privacy, security, and operational assurance",
    icon: ShieldCheck,
    detail:
      "Privacy impact review, minimization, retention limits, access logging, incident response, secure processing, transparency notices, appeal or correction channels, and production monitoring are required before processing personal or commercial data for predictive analytics or making risk-related claims.",
  },
];

export default function PredictiveSystems() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Predictive analytics
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Predictive Systems
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Churn prediction, trend forecasting, revenue-risk analysis,
            user-risk and retention scoring, signal weights, model accuracy,
            forecast charts, platform statistics, intervention recommendations,
            and automated actions are not configured for this deployment. No
            individual, segment, topic, account, revenue amount, behavioral
            pattern, or platform metric is represented as measured, predicted,
            ranked, or actionable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated score, forecast, financial analysis, or
                intervention
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not train or run a model, analyze user or
                financial data, calculate a probability, create a forecast,
                identify a trend, measure accuracy, assess a person or segment,
                trigger an intervention, send a campaign, or report that any
                analytics-driven action has succeeded.
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
