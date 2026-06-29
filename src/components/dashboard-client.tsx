"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  Flame,
  Mail,
  Menu,
  Phone,
  Plus,
  TrendingUp,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { currency, humanize } from "@/lib/utils";
import type { Lead, LeadDetail, LeadStatus } from "@/lib/types";

const statuses: { id: LeadStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal_sent", label: "Proposal Sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

const initialForm = {
  customerName: "",
  contact: "",
  serviceType: "garage_door",
  urgency: "emergency",
  dealValue: "1800",
  leadSource: "website",
  notes: "",
  followUpDate: "",
};

export function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [backend, setBackend] = useState("memory");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedLead, setSelectedLead] = useState<LeadDetail | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/leads", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setLeads(data.leads);
        setDemoMode(data.demoMode);
        setBackend(data.backend);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const open = leads.filter((lead) => lead.status !== "lost");
    const won = leads.filter((lead) => lead.status === "won");
    const dueToday = new Date().toISOString().slice(0, 10);
    const total = open.reduce((sum, lead) => sum + lead.dealValue, 0);
    return {
      total,
      newLeads: leads.filter((lead) => lead.status === "new").length,
      hotLeads: leads.filter((lead) => lead.temperature === "Hot").length,
      wonRevenue: won.reduce((sum, lead) => sum + lead.dealValue, 0),
      followUpsDue: leads.filter((lead) => lead.followUpDate <= dueToday && !["won", "lost"].includes(lead.status)).length,
      averageDeal: leads.length ? Math.round(total / leads.length) : 0,
    };
  }, [leads]);

  async function seedDemo() {
    setSaving(true);
    const response = await fetch("/api/leads/seed", { method: "POST" });
    const data = await response.json();
    setLeads(data.leads);
    setToast("Demo leads loaded.");
    setSaving(false);
  }

  async function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLeads((current) => [data.lead, ...current]);
    setForm(initialForm);
    setModalOpen(false);
    setToast(`${data.lead.customerName} scored ${data.lead.score} and was added to the pipeline.`);
    setSaving(false);
  }

  async function changeStatus(leadId: string, status: LeadStatus) {
    const response = await fetch(`/api/leads/${leadId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    setLeads((current) => current.map((lead) => (lead.leadId === leadId ? data.lead : lead)));
    setToast(`Status updated to ${humanize(status)}.`);
  }

  async function openLead(leadId: string) {
    const response = await fetch(`/api/leads/${leadId}`, { cache: "no-store" });
    const data = await response.json();
    setSelectedLead(data.lead);
  }

  return (
    <main className="min-h-screen bg-slate-100 lg:flex">
      <aside className="bg-slate-950 text-white lg:min-h-screen lg:w-72">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-md bg-emerald-600">
              <Wrench size={18} />
            </span>
            TradeFlow Lite
          </Link>
          <Menu className="lg:hidden" />
        </div>
        <nav className="grid gap-1 px-3 pb-5 text-sm font-medium text-slate-300 lg:mt-6">
          {([
            [Briefcase, "Pipeline", "/dashboard"],
            [Database, "Architecture", "/architecture"],
            [CheckCircle, "Submission", "/submission"],
          ] as [LucideIcon, string, string][]).map(([Icon, label, href]) => (
            <Link
              key={String(label)}
              href={String(href)}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 hover:text-white"
            >
              <Icon size={17} />
              {String(label)}
            </Link>
          ))}
        </nav>
        <div className="mx-5 mb-5 rounded-lg bg-white/10 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">$49/month SaaS story</p>
          <p className="mt-2">Built for contractors who need a simple lead system before they need a giant CRM.</p>
        </div>
      </aside>

      <section className="flex-1">
        <header className="border-b border-slate-200 bg-white px-5 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Contractor CRM dashboard</p>
              <h1 className="text-3xl font-bold text-slate-950">Lead Pipeline</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={seedDemo} disabled={saving || leads.length > 0}>
                <Database size={16} />
                Demo Seed
              </Button>
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={16} />
                Add Lead
              </Button>
            </div>
          </div>
          {demoMode && (
            <Alert className="mt-4 flex items-center gap-2">
              <AlertTriangle size={16} />
              Demo mode: no DynamoDB or Aurora DSQL database environment variables are configured.
            </Alert>
          )}
          {!demoMode && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
              Connected database backend: {backend === "dsql" ? "Aurora DSQL" : "Amazon DynamoDB"}.
            </div>
          )}
          {toast && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
              <span>{toast}</span>
              <button onClick={() => setToast("")} aria-label="Dismiss toast">
                <X size={16} />
              </button>
            </div>
          )}
        </header>

        <div className="p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {([
              [DollarSign, "Total pipeline value", currency(metrics.total)],
              [Users, "New leads", metrics.newLeads],
              [Flame, "Hot leads", metrics.hotLeads],
              [TrendingUp, "Won revenue", currency(metrics.wonRevenue)],
              [Clock, "Follow-ups due", metrics.followUpsDue],
              [Briefcase, "Average deal value", currency(metrics.averageDeal)],
            ] as [LucideIcon, string, string | number][]).map(([Icon, label, value]) => (
              <Card key={String(label)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{String(label)}</p>
                    <Icon className="text-emerald-600" size={18} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{String(value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {loading ? (
            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-slate-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <Briefcase className="mx-auto text-emerald-600" size={36} />
              <h2 className="mt-4 text-xl font-bold text-slate-950">No leads yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">
                Add your first contractor lead or load the five demo opportunities for a quick Devpost walkthrough.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Button onClick={() => setModalOpen(true)}>Add Lead</Button>
                <Button variant="outline" onClick={seedDemo} disabled={saving}>
                  Seed Demo Leads
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 xl:grid-cols-5">
              {statuses.map((status) => (
                <section key={status.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-bold text-slate-950">{status.label}</h2>
                    <Badge>{leads.filter((lead) => lead.status === status.id).length}</Badge>
                  </div>
                  <div className="grid gap-3">
                    {leads
                      .filter((lead) => lead.status === status.id)
                      .map((lead) => (
                        <LeadCard
                          key={lead.leadId}
                          lead={lead}
                          onOpen={() => openLead(lead.leadId)}
                          onStatus={(nextStatus) => changeStatus(lead.leadId, nextStatus)}
                        />
                      ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <form onSubmit={addLead} className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Add contractor lead</h2>
                <p className="mt-1 text-sm text-slate-600">TradeFlow scores the opportunity as soon as it is saved.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close modal">
                <X />
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Label title="Customer name">
                <Input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </Label>
              <Label title="Contact">
                <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone or email" />
              </Label>
              <Label title="Service type">
                <Select value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                  {["garage_door", "hvac", "roofing", "plumbing", "electrical", "other"].map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label title="Urgency">
                <Select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
                  {["emergency", "this_week", "this_month", "just_researching"].map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label title="Deal value">
                <Input type="number" min="0" value={form.dealValue} onChange={(e) => setForm({ ...form, dealValue: e.target.value })} />
              </Label>
              <Label title="Lead source">
                <Select value={form.leadSource} onChange={(e) => setForm({ ...form, leadSource: e.target.value })}>
                  {["referral", "website", "google", "facebook", "phone", "other"].map((option) => (
                    <option key={option} value={option}>
                      {humanize(option)}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label title="Follow-up date">
                <Input type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
              </Label>
              <Label title="Notes" className="md:col-span-2">
                <Textarea required value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                Save Lead
              </Button>
            </div>
          </form>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
          <aside className="h-full w-full max-w-xl overflow-auto bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <Badge tone={selectedLead.temperature === "Hot" ? "red" : selectedLead.temperature === "Warm" ? "amber" : "blue"}>
                  {selectedLead.temperature} score {selectedLead.score}
                </Badge>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">{selectedLead.customerName}</h2>
                <p className="mt-1 text-slate-600">{humanize(selectedLead.serviceType)} opportunity</p>
              </div>
              <button onClick={() => setSelectedLead(null)} aria-label="Close detail panel">
                <X />
              </button>
            </div>
            <Separator className="my-5" />
            <div className="grid gap-3 text-sm text-slate-700">
              <p><strong>Contact:</strong> {selectedLead.contact || "Missing"}</p>
              <p><strong>Urgency:</strong> {humanize(selectedLead.urgency)}</p>
              <p><strong>Deal value:</strong> {currency(selectedLead.dealValue)}</p>
              <p><strong>Source:</strong> {humanize(selectedLead.leadSource)}</p>
              <p><strong>Follow-up:</strong> {selectedLead.followUpDate}</p>
              <p><strong>Notes:</strong> {selectedLead.notes}</p>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Follow-up checklist</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {selectedLead.followUpPlan.map((task) => (
                  <div key={task} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="text-emerald-600" size={16} />
                    {task}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Proposal-ready summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-slate-700">{selectedLead.proposalSummary}</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}

function LeadCard({ lead, onOpen, onStatus }: { lead: Lead; onOpen: () => void; onStatus: (status: LeadStatus) => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md">
      <CardContent className="p-4">
        <button className="w-full text-left" onClick={onOpen}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-slate-950">{lead.customerName}</h3>
            <Badge tone={lead.temperature === "Hot" ? "red" : lead.temperature === "Warm" ? "amber" : "blue"}>{lead.score}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600">{humanize(lead.serviceType)} / {humanize(lead.urgency)}</p>
          <p className="mt-3 text-xl font-bold text-slate-950">{currency(lead.dealValue)}</p>
          <div className="mt-3 grid gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={13} /> Follow-up {lead.followUpDate}</span>
            <span className="flex items-center gap-1">
              {lead.contact.includes("@") ? <Mail size={13} /> : <Phone size={13} />} {lead.contact || "No contact"}
            </span>
            <span>Created {new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </button>
        <Select className="mt-3" value={lead.status} onChange={(event) => onStatus(event.target.value as LeadStatus)}>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              Move to {status.label}
            </option>
          ))}
        </Select>
      </CardContent>
    </Card>
  );
}

function Label({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{title}</span>
      {children}
    </label>
  );
}
