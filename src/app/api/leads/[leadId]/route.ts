import { NextResponse } from "next/server";
import { getLead } from "@/lib/leads";

export async function GET(_request: Request, { params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const lead = await getLead(leadId);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}
