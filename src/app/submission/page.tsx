import Link from "next/link";
import { CheckCircle, Database, DollarSign, Rocket, Wrench, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  ["Project title", "TradeFlow Lite"],
  ["Problem statement", "Small contractors often manage leads across calls, emails, referrals, websites, and social media messages. Without a simple pipeline, they lose track of urgent jobs and forget follow-ups."],
  ["Who it serves", "Garage door companies, HVAC businesses, roofers, plumbers, electricians, and other local service companies."],
  ["AWS database used", "Amazon DynamoDB with a single-table design for lead and activity records."],
  ["Why DynamoDB", "DynamoDB is serverless, free-tier friendly for a hackathon MVP, fast for lead capture workflows, and scalable for a future multi-tenant SaaS product."],
  ["Technical implementation", "Vercel hosts a Next.js App Router application. API routes call AWS SDK v3 to persist lead records in DynamoDB. Local TypeScript logic calculates lead scores, follow-up plans, and proposal-ready summaries."],
  ["Monetization model", "TradeFlow Lite is designed as a $49/month SaaS for small contractor businesses that need simple lead follow-up before adopting a larger CRM."],
  ["Future roadmap", "Add email reminders, calendar scheduling, multi-tenant accounts, mobile-first field tech views, CSV import, and optional paid invoicing integrations."],
] as const;

export default function SubmissionPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white">
            <Wrench size={18} />
          </span>
          TradeFlow Lite
        </Link>
        <Link href="/dashboard">
          <Button>Open Dashboard</Button>
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Badge tone="green">Devpost helper page</Badge>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950">TradeFlow Lite submission copy</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Copy-ready project narrative for H0: Hack the Zero Stack with Vercel v0 and AWS Databases, Track 2:
          Monetizable B2B App.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {([
            [Database, "AWS Database", "Amazon DynamoDB"],
            [DollarSign, "Monetization", "$49/month SaaS"],
            [Rocket, "Demo Flow", "Lead to won job in under 60 seconds"],
          ] as [LucideIcon, string, string][]).map(([Icon, label, value]) => (
            <Card key={String(label)}>
              <CardContent>
                <Icon className="text-emerald-600" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{String(label)}</p>
                <p className="mt-1 text-xl font-bold text-slate-950">{String(value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4">
          {sections.map(([title, copy]) => (
            <Card key={title}>
              <CardContent>
                <h2 className="text-lg font-bold text-slate-950">{title}</h2>
                <p className="mt-2 leading-7 text-slate-700">{copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent>
            <h2 className="text-lg font-bold text-slate-950">Demo script</h2>
            <div className="mt-4 grid gap-3 text-slate-700">
              {[
                "Open the landing page and explain the contractor lead follow-up problem.",
                "Click Open Demo Dashboard.",
                "Seed demo leads if the board is empty.",
                "Add a new emergency contractor lead and show the score.",
                "Open the lead detail panel to show the follow-up checklist and proposal summary.",
                "Move the lead from New to Qualified or Won and show revenue metrics updating.",
                "Open Architecture to explain Vercel, Next.js API routes, AWS SDK v3, and DynamoDB.",
              ].map((step) => (
                <p key={step} className="flex gap-2 rounded-md bg-slate-50 p-3">
                  <CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                  {step}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
