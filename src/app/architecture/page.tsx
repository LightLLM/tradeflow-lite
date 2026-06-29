import Link from "next/link";
import { ArrowRight, Cloud, Code2, Database, Server, Users, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const flow = [
  ["User", "Contractor / business owner", Users],
  ["Vercel Hosted Next.js App", "Frontend and backend deployed together", Cloud],
  ["Next.js Server Actions / API Routes", "Lead operations and scoring logic", Server],
  ["AWS SDK v3", "Typed DynamoDB client", Code2],
  ["Amazon DynamoDB", "tradeflow-leads table", Database],
] as const;

export default function ArchitecturePage() {
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

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Badge tone="green">AWS database architecture</Badge>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight text-slate-950">
          Serverless contractor CRM powered by DynamoDB.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          A screenshot-ready view of the zero-cost hackathon stack: Vercel hosts the Next.js app, API routes use AWS SDK
          v3, and Amazon DynamoDB stores lead and activity records with a single-table design.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {flow.map(([title, copy, Icon], index) => (
            <div key={title} className="flex items-center gap-4 lg:block">
              <Card className="flex-1">
                <CardContent className="p-5">
                  <div className="flex size-12 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <Icon />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-slate-950">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </CardContent>
              </Card>
              {index < flow.length - 1 && <ArrowRight className="hidden text-slate-400 lg:mx-auto lg:mt-5 lg:block" />}
            </div>
          ))}
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-slate-950">Single-table DynamoDB design</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-3">Record</th>
                      <th className="p-3">PK</th>
                      <th className="p-3">SK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold">Lead</td>
                      <td className="p-3">TENANT#demo</td>
                      <td className="p-3">LEAD#&lt;leadId&gt;</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Activity</td>
                      <td className="p-3">TENANT#demo</td>
                      <td className="p-3">ACTIVITY#&lt;timestamp&gt;#&lt;activityId&gt;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold text-slate-950">Why this wins the zero stack</h2>
              <div className="mt-5 grid gap-3 text-sm text-slate-700">
                {[
                  "Serverless deployment on Vercel",
                  "Amazon DynamoDB on-demand billing and free-tier friendly traffic",
                  "Tenant partition key ready for future multi-tenant SaaS",
                  "Lead records and activity records in one table",
                  "No paid APIs, no authentication, no external services",
                  "Local mock mode keeps the demo usable before AWS credentials are configured",
                ].map((item) => (
                  <p key={item} className="rounded-md bg-slate-50 p-3">
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
