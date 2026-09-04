import { useMemo, useState } from "react";
import { HeartHandshake, Search, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const guidelines = [
  {
    title: "Treat people with dignity",
    body: "Do not harass, threaten, stalk, impersonate, or target people with degrading abuse. Disagreement is allowed; targeted abuse is not.",
  },
  {
    title: "Protect privacy",
    body: "Do not post another person&apos;s private contact details, credentials, financial data, intimate material, or identifying records without authorization.",
  },
  {
    title: "Keep sexual and dating interactions consensual",
    body: "Do not pressure, exploit, deceive, or sexualize minors. Dating surfaces are for adults and should support clear consent and boundaries.",
  },
  {
    title: "No scams or deceptive commerce",
    body: "Do not misrepresent products, identities, payments, investments, giveaways, token rewards, or charitable impact.",
  },
  {
    title: "No instructions for serious harm",
    body: "Do not use community features to coordinate violence, exploitation, malware, credential theft, dangerous trafficking, or other serious wrongdoing.",
  },
  {
    title: "Respect creator and intellectual-property rights",
    body: "Share content you are allowed to share. Attribute where appropriate and respond to legitimate rights-holder concerns.",
  },
  {
    title: "Use beta labels honestly",
    body: "Do not present local simulations, fixtures, unverified metrics, unavailable providers, or controlled financial/Web3 labs as live production services.",
  },
] as const;

export default function CommunityGuidelines() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return guidelines;
    return guidelines.filter(item =>
      (item.title + " " + item.body).toLowerCase().includes(needle)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <Badge variant="outline">Engineering-beta community policy</Badge>
          <h1 className="mt-3 text-3xl font-bold">Community guidelines</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            A concise safety and integrity baseline for the social, creator, dating, marketplace, and feedback surfaces that are actually being tested.
          </p>
        </header>

        <Card>
          <CardHeader>
            <HeartHandshake className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Search the guidelines</CardTitle>
            <CardDescription>
              These rules describe beta expectations; they are not a claim of legal or regulatory certification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search harassment, privacy, scams…"
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4">
          {filtered.length ? (
            filtered.map((item, index) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {item.title}
                  </CardTitle>
                  <CardDescription className="leading-6">{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No guideline matches that search.
              </CardContent>
            </Card>
          )}
        </section>

        <Card className="border-amber-500/25">
          <CardHeader>
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <CardTitle className="mt-2">Report a beta issue</CardTitle>
            <CardDescription>
              Use Beta Feedback to record bugs, safety concerns, privacy issues, or misleading claims. Emergency response and law-enforcement services are not provided by this application.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/beta-feedback">
              <Button>Open Beta Feedback</Button>
            </Link>
            <Link href="/privacy-settings">
              <Button variant="outline">Privacy center</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
