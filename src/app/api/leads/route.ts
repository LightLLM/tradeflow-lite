import { NextResponse } from "next/server";
import { activeBackend, isDemoMode } from "@/lib/database";
import { createLead, listLeads } from "@/lib/leads";

export async function GET() {
  return NextResponse.json({ leads: await listLeads(), demoMode: isDemoMode, backend: activeBackend });
}

export async function POST(request: Request) {
  const body = await request.json();
  const lead = await createLead({ ...body, dealValue: Number(body.dealValue || 0) });
  return NextResponse.json({ lead, demoMode: isDemoMode, backend: activeBackend }, { status: 201 });
}
