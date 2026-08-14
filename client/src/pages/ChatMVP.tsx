import {
  AlertTriangle,
  Bot,
  Database,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated, persisted messaging contracts",
    icon: MessageSquare,
    detail:
      "Authorized conversation creation, participant verification, durable message records, server-side delivery handling, read-state semantics, deletion and retention controls, abuse reporting, block controls, rate limits, and auditability are required before operating a messaging surface.",
  },
  {
    title: "Verified AI assistance with safe action boundaries",
    icon: Bot,
    detail:
      "A configured provider, scoped data access, explicit user consent, approved prompts, output safeguards, human escalation, rate limits, monitoring, privacy review, and action confirmation are required before offering AI analysis, recommendations, service discovery, or execution through chat.",
  },
  {
    title: "Payment, tip, and marketplace transaction controls",
    icon: Database,
    detail:
      "Authorized payment or wallet infrastructure, recipient verification, server-side transaction validation, balance reconciliation, fraud prevention, fee disclosure, duplicate-prevention controls, refund and dispute workflows, and legal review are required before sending a tip, paying a provider, creating a listing, or representing a financial result.",
  },
  {
    title: "Communication safety and privacy safeguards",
    icon: ShieldCheck,
    detail:
      "Permission checks, content moderation, user reporting, blocking controls, secure media handling, call-provider verification, presence privacy, secrets management, incident response, and clear retention policies are required before exposing voice, video, attachment, contact, or presence capabilities.",
  },
];

export default function ChatMVP() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Chat MVP service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Chat MVP
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI-assisted chat, conversation search, presence, typing or delivery
            status, voice calls, video calls, attachments, marketplace actions,
            service requests, creator tips, payments, hiring, listing creation,
            matches, earnings, transaction fees, and AI action execution are not
            configured for this deployment. No conversation, person, AI result,
            payment, service provider, delivery state, call, or transaction is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated messages, AI actions, payments, tips, or
                communication presence
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not send or receive a message, identify an
                available contact, initiate a call, record a read receipt,
                attach media, provide an AI recommendation, find a provider,
                create a listing, collect a fee, send a tip, or complete a
                payment.
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
