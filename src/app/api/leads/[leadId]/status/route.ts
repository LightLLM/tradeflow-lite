import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads";
import type { LeadStatus } from "@/lib/types";

const statuses: LeadStatus[] = ["new", "qualified", "proposal_sent", "won", "lost"];

export async function PATCH(request: Request, { params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const { status } = await request.json();

  if (!statuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await updateLeadStatus(leadId, status);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  return NextResponse.json({ lead });
}
