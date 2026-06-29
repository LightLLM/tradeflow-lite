import { auroraDSQLPostgres } from "@aws/aurora-dsql-postgresjs-connector";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import type { ActivityLog, Lead } from "@/lib/types";

export const dsqlHost = process.env.DSQL_CLUSTER_ENDPOINT || "";
export const dsqlRegion = process.env.DSQL_REGION || process.env.AWS_REGION || "";
export const dsqlDatabase = process.env.DSQL_DATABASE || "postgres";
export const dsqlUser = process.env.DSQL_DB_USER || "admin";

export const isDsqlConfigured = Boolean(dsqlHost && dsqlRegion);

const sql = isDsqlConfigured
  ? auroraDSQLPostgres({
      host: dsqlHost,
      region: dsqlRegion,
      database: dsqlDatabase,
      username: dsqlUser,
      customCredentialsProvider: fromNodeProviderChain(),
      max: 1,
      idle_timeout: 10,
      connect_timeout: 10,
      retry: true,
    })
  : null;

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!sql) return;
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS tradeflow_leads (
        lead_id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        service_type TEXT NOT NULL,
        urgency TEXT NOT NULL,
        deal_value INTEGER NOT NULL,
        lead_source TEXT NOT NULL,
        notes TEXT NOT NULL,
        score INTEGER NOT NULL,
        temperature TEXT NOT NULL,
        status TEXT NOT NULL,
        follow_up_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tradeflow_activity (
        activity_id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `;
  })();

  await schemaReady;
}

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    leadId: String(row.lead_id),
    customerName: String(row.customer_name),
    contact: String(row.contact),
    serviceType: row.service_type as Lead["serviceType"],
    urgency: row.urgency as Lead["urgency"],
    dealValue: Number(row.deal_value),
    leadSource: row.lead_source as Lead["leadSource"],
    notes: String(row.notes),
    score: Number(row.score),
    temperature: row.temperature as Lead["temperature"],
    status: row.status as Lead["status"],
    followUpDate: String(row.follow_up_date),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function rowToActivity(row: Record<string, unknown>): ActivityLog {
  return {
    activityId: String(row.activity_id),
    leadId: String(row.lead_id),
    type: String(row.type),
    message: String(row.message),
    createdAt: String(row.created_at),
  };
}

export async function insertDsqlLead(lead: Lead) {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  await sql`
    INSERT INTO tradeflow_leads (
      lead_id, customer_name, contact, service_type, urgency, deal_value, lead_source,
      notes, score, temperature, status, follow_up_date, created_at, updated_at
    ) VALUES (
      ${lead.leadId}, ${lead.customerName}, ${lead.contact}, ${lead.serviceType}, ${lead.urgency},
      ${lead.dealValue}, ${lead.leadSource}, ${lead.notes}, ${lead.score}, ${lead.temperature},
      ${lead.status}, ${lead.followUpDate}, ${lead.createdAt}, ${lead.updatedAt}
    )
  `;
}

export async function selectDsqlLeads() {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  const rows = await sql`SELECT * FROM tradeflow_leads ORDER BY created_at DESC`;
  return rows.map(rowToLead);
}

export async function selectDsqlLead(leadId: string) {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  const rows = await sql`SELECT * FROM tradeflow_leads WHERE lead_id = ${leadId} LIMIT 1`;
  return rows[0] ? rowToLead(rows[0]) : null;
}

export async function updateDsqlLeadStatus(leadId: string, status: Lead["status"], updatedAt: string) {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  const rows = await sql`
    UPDATE tradeflow_leads
    SET status = ${status}, updated_at = ${updatedAt}
    WHERE lead_id = ${leadId}
    RETURNING *
  `;
  return rows[0] ? rowToLead(rows[0]) : null;
}

export async function insertDsqlActivity(activity: ActivityLog) {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  await sql`
    INSERT INTO tradeflow_activity (activity_id, lead_id, type, message, created_at)
    VALUES (${activity.activityId}, ${activity.leadId}, ${activity.type}, ${activity.message}, ${activity.createdAt})
  `;
}

export async function selectDsqlActivity() {
  if (!sql) throw new Error("Aurora DSQL is not configured.");
  await ensureSchema();
  const rows = await sql`SELECT * FROM tradeflow_activity ORDER BY created_at DESC`;
  return rows.map(rowToActivity);
}
