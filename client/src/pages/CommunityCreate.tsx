import {
  AlertTriangle,
  Database,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized community creation and ownership records",
    icon: Users,
    detail:
      "Authenticated server-side creation, unique-slug validation, ownership assignment, durable records, moderation controls, deletion handling, audit trails, and clear community terms are required before allowing a community or group to be created.",
  },
  {
    title: "Membership, privacy, and access controls",
    icon: LockKeyhole,
    detail:
      "Verified membership rules, invitation and approval workflows, privacy settings, content visibility rules, role permissions, abuse reporting, blocking controls, data-retention policies, and support processes are required before offering public or private community access.",
  },
  {
    title: "Token and subscription gate verification",
    icon: Database,
    detail:
      "Validated wallet or payment integrations, clear eligibility criteria, server-side entitlement checks, transaction or subscription verification, failure handling, refund or dispute procedures, and legal review are required before claiming token-gated or premium community access.",
  },
  {
    title: "Safety and moderation infrastructure",
    icon: ShieldCheck,
    detail:
      "Published policies, scoped moderator authority, content-review workflows, reporting tools, rate limits, user-protection measures, incident response, and durable audit records are required before operating a community publishing surface.",
  },
];

export default function CommunityCreate() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Community creation
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Community
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Community creation, public and private groups, membership approvals,
            categories, custom slugs, token-gated access, premium subscriptions,
            roles, posts, member lists, and publishing controls are not
            configured for this deployment. No community, membership, access
            right, payment entitlement, or visibility setting is represented as
            created, verified, or active.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated group creation or paid access
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create a community, reserve a slug, publish a
                group, accept a member, apply a privacy setting, verify a
                wallet, charge a subscription, or grant token-gated access.
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
