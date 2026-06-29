import { NextResponse } from "next/server";
import { activeBackend, isDemoMode } from "@/lib/database";
import { seedDemoLeads } from "@/lib/leads";

export async function POST() {
  return NextResponse.json({ leads: await seedDemoLeads(), demoMode: isDemoMode, backend: activeBackend });
}
