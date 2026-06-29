import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/dynamodb";
import { seedDemoLeads } from "@/lib/leads";

export async function POST() {
  return NextResponse.json({ leads: await seedDemoLeads(), demoMode: isDemoMode });
}
