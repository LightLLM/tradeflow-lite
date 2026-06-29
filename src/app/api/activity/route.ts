import { NextResponse } from "next/server";
import { listActivityLogs } from "@/lib/leads";

export async function GET() {
  return NextResponse.json({ activity: await listActivityLogs() });
}
