import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/dynamodb";
import { createLead, listLeads } from "@/lib/leads";

export async function GET() {
  return NextResponse.json({ leads: await listLeads(), demoMode: isDemoMode });
}

export async function POST(request: Request) {
  const body = await request.json();
  const lead = await createLead({ ...body, dealValue: Number(body.dealValue || 0) });
  return NextResponse.json({ lead, demoMode: isDemoMode }, { status: 201 });
}
