import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Licensed, traceable market and sentiment data service",
    icon: Database,
    detail:
      "Authorized market-data and news or social-data providers, documented coverage and licensing terms, source attribution, timestamped collection, validated symbols and entities, data-quality controls, adjustment and correction handling, defined refresh and retention policies, and independently verifiable source records are required before retrieving, displaying, aggregating, or reporting a market price, market condition, sentiment signal, social signal, news item, trend, transaction, user activity, or market-data result.",
  },
  {
    title: "Documented sentiment methodology and analytical controls",
    icon: TrendingUp,
    detail:
      "A documented sentiment definition, transparent scoring methodology, evaluation and calibration evidence, known limitations, model and prompt versioning where applicable, provenance for inputs and outputs, bias and manipulation controls, exception handling, and clear distinction between descriptive analysis and predictive or advisory outputs are required before creating or reporting a sentiment score, market insight, trend, analytic, signal, recommendation, forecast, ranking, or automated result.",
  },
  {
    title: "Secure, compliant delivery and user-action safeguards",
    icon: ShieldCheck,
    detail:
      "Authenticated account ownership, authorization boundaries, secure integration contracts, input and output validation, rate limits, audit logging, privacy controls, abuse prevention, incident response, access reviews, and evidence that controls operate as designed are required before representing market information, a user action, automation, integration, notification, account result, or financial-service interaction as protected, available, or successfully processed.",
  },
  {
    title: "Evidence-based operational reporting and support",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, monitoring, alerting, documented sampling and retention methods, performance testing, failure and retry handling, support procedures, and independently verifiable operational evidence are required before reporting active users, transactions, success rates, response times, real-time availability, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function MarketSentiment() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Market sentiment service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Market Sentiment
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Licensed and traceable market or sentiment data, real-time updates,
            scoring, analytics, insights, automation, integrations, user and
            transaction data, operational metrics, and support documentation are
            not configured for this deployment. No market condition, sentiment
            signal, price, trend, activity, transaction, insight, analytic,
            ranking, metric, financial result, recommendation, forecast, or
            service status is represented as current, complete, verified,
            active, real-time, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated market data, sentiment, or financial result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve, process, score, summarize, rank,
                predict, recommend, notify, automate, or report market data,
                market sentiment, prices, trends, news, social signals, user
                data, transactions, analytics, insights, performance figures, or
                financial outcomes. It does not offer investment advice or claim
                that any market-related operation succeeded.
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
