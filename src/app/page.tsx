import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  DollarSign,
  Flame,
  Phone,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const badges = ["Built with Vercel", "Powered by DynamoDB", "Zero-cost hackathon MVP", "B2B SaaS for contractors"];
const useCases = ["Garage door repair", "HVAC emergency calls", "Roofing quotes", "Plumbing upgrades", "Electrical jobs"];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
            <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600 text-white">
              <Wrench size={18} />
            </span>
            TradeFlow Lite
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="#how">How it works</Link>
            <Link href="/architecture">Architecture</Link>
            <Link href="/submission">Submission</Link>
          </div>
          <Link href="/dashboard">
            <Button>Open Demo Dashboard</Button>
          </Link>
        </nav>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge} tone="green">
                <CheckCircle size={13} />
                {badge}
              </Badge>
            ))}
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Never lose another contractor lead.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TradeFlow Lite helps local service businesses qualify leads, follow up faster, and track revenue from first
            inquiry to won job.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Open Demo Dashboard <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#how">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-emerald-700">
            Designed as a $49/month SaaS for small contractor businesses.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Today&apos;s pipeline</p>
                  <p className="text-3xl font-bold">$17,100</p>
                </div>
                <TrendingUp className="text-emerald-300" />
              </div>
            </div>
            <div className="grid gap-4 p-5">
              {([
                ["Hot emergency", "Garage door stuck", "$1,800", Flame],
                ["Qualified", "Roofing quote", "$8,500", Briefcase],
                ["Follow-up due", "HVAC no heat", "$3,200", Clock],
              ] as [string, string, string, LucideIcon][]).map(([label, title, value, Icon]) => (
                <div key={String(title)} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{String(label)}</p>
                      <p className="font-semibold text-slate-950">{String(title)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-950">{String(value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          {[
            ["Problem", "Leads arrive from calls, referrals, websites, Facebook, Google, and email. Follow-ups slip."],
            ["Solution", "Every inquiry becomes a scored opportunity with a clear next step and proposal summary."],
            ["Outcome", "Contractors can see urgent jobs, pipeline value, won revenue, and follow-ups in one place."],
          ].map(([title, copy]) => (
            <Card key={title}>
              <CardContent>
                <h2 className="text-xl font-bold text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-950">How it works</h2>
          <p className="mt-3 text-slate-600">A 60-second demo flow built for judges and real contractor workflows.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {([
            [Phone, "Capture lead", "Add customer, service type, urgency, value, source, and notes."],
            [Flame, "Score opportunity", "Local TypeScript logic ranks hot, warm, and cold leads instantly."],
            [Briefcase, "Move pipeline", "Track new, qualified, proposal sent, won, and lost jobs."],
            [DollarSign, "See revenue", "Metrics update as jobs move through the board."],
          ] as [LucideIcon, string, string][]).map(([Icon, title, copy]) => (
            <Card key={String(title)}>
              <CardContent>
                <Icon className="text-emerald-600" />
                <h3 className="mt-4 font-bold text-slate-950">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{String(copy)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Built for local service companies</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {useCases.map((useCase) => (
                <span key={useCase} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                  {useCase}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white/10 p-5">
              <Cloud className="text-emerald-300" />
              <p className="mt-3 font-semibold">Vercel-hosted Next.js app</p>
            </div>
            <div className="rounded-lg bg-white/10 p-5">
              <Database className="text-emerald-300" />
              <p className="mt-3 font-semibold">Amazon DynamoDB persistence</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
