import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { activeBackend } from "@/lib/database";
import {
  insertDsqlActivity,
  insertDsqlLead,
  selectDsqlActivity,
  selectDsqlLead,
  selectDsqlLeads,
  updateDsqlLeadStatus,
} from "@/lib/dsql";
import { dynamoDb, tableName } from "@/lib/dynamodb";
import type { ActivityLog, Lead, LeadInput, LeadStatus, Temperature } from "@/lib/types";

const TENANT_PK = "TENANT#demo";
const hotWords = ["urgent", "broken", "stuck", "leaking", "no heat", "same day"];

let memoryLeads: Lead[] = [];
let memoryActivity: ActivityLog[] = [];

function id(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function leadToItem(lead: Lead) {
  return { PK: TENANT_PK, SK: `LEAD#${lead.leadId}`, entityType: "lead", ...lead };
}

function activityToItem(activity: ActivityLog) {
  return {
    PK: TENANT_PK,
    SK: `ACTIVITY#${activity.createdAt}#${activity.activityId}`,
    entityType: "activity",
    ...activity,
  };
}

function itemToLead(item: Record<string, unknown>) {
  const lead = { ...item };
  delete lead.PK;
  delete lead.SK;
  delete lead.entityType;
  return lead as Lead;
}

function itemToActivity(item: Record<string, unknown>) {
  const activity = { ...item };
  delete activity.PK;
  delete activity.SK;
  delete activity.entityType;
  return activity as ActivityLog;
}

export function calculateLeadScore(input: LeadInput) {
  let score = 0;

  score += {
    emergency: 35,
    this_week: 25,
    this_month: 10,
    just_researching: 0,
  }[input.urgency];

  if (input.dealValue >= 5000) score += 30;
  else if (input.dealValue >= 2500) score += 20;
  else if (input.dealValue >= 1000) score += 10;
  else score += 5;

  score += {
    referral: 25,
    website: 15,
    google: 15,
    facebook: 10,
    phone: 10,
    other: 5,
  }[input.leadSource];

  score += input.contact.trim() ? 10 : -30;

  const normalizedNotes = input.notes.toLowerCase();
  if (hotWords.some((word) => normalizedNotes.includes(word))) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function getLeadTemperature(score: number): Temperature {
  if (score >= 75) return "Hot";
  if (score >= 45) return "Warm";
  return "Cold";
}

export function generateFollowUpPlan(lead: Lead) {
  if (lead.temperature === "Hot") {
    return [
      "Call within 15 minutes",
      "Confirm service address and urgency",
      "Send estimate checklist",
      "Schedule visit today or next available slot",
      "Follow up after quote within 24 hours",
    ];
  }

  if (lead.temperature === "Warm") {
    return [
      "Call within 2 hours",
      "Send service overview",
      "Ask for photos or more job details",
      "Follow up tomorrow",
      "Move to proposal if qualified",
    ];
  }

  return [
    "Send introductory message",
    "Ask about timeline",
    "Follow up in 3 days",
    "Add to nurture list",
  ];
}

export function generateProposalSummary(lead: Lead) {
  const firstStep = generateFollowUpPlan(lead)[0].toLowerCase();
  return `Customer ${lead.customerName} needs ${lead.serviceType.replaceAll("_", " ")} service with ${lead.urgency.replaceAll("_", " ")} urgency. Estimated opportunity value is $${lead.dealValue.toLocaleString()}. This lead came from ${lead.leadSource} and is currently scored as ${lead.temperature}. Recommended next step: ${firstStep}.`;
}

export async function createActivityLog(leadId: string, type: string, message: string) {
  const activity: ActivityLog = {
    activityId: id("activity"),
    leadId,
    type,
    message,
    createdAt: new Date().toISOString(),
  };

  if (activeBackend === "memory") {
    memoryActivity = [activity, ...memoryActivity];
    return activity;
  }

  if (activeBackend === "dsql") {
    await insertDsqlActivity(activity);
  } else {
    await dynamoDb?.send(new PutCommand({ TableName: tableName, Item: activityToItem(activity) }));
  }

  return activity;
}

export async function createLead(input: LeadInput) {
  const now = new Date().toISOString();
  const score = calculateLeadScore(input);
  const lead: Lead = {
    ...input,
    leadId: id("lead"),
    score,
    temperature: getLeadTemperature(score),
    status: "new",
    followUpDate: input.followUpDate || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    createdAt: now,
    updatedAt: now,
  };

  if (activeBackend === "memory") {
    memoryLeads = [lead, ...memoryLeads];
  } else if (activeBackend === "dsql") {
    await insertDsqlLead(lead);
  } else {
    await dynamoDb?.send(new PutCommand({ TableName: tableName, Item: leadToItem(lead) }));
  }

  await createActivityLog(lead.leadId, "created", `${lead.customerName} was added as a new lead.`);
  return lead;
}

export async function listLeads() {
  if (activeBackend === "memory") {
    return [...memoryLeads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  if (activeBackend === "dsql") {
    return selectDsqlLeads();
  }

  const result = await dynamoDb?.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": TENANT_PK, ":sk": "LEAD#" },
    }),
  );

  return (result?.Items ?? []).map(itemToLead).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(leadId: string) {
  if (activeBackend === "memory") {
    const lead = memoryLeads.find((item) => item.leadId === leadId);
    return lead
      ? { ...lead, followUpPlan: generateFollowUpPlan(lead), proposalSummary: generateProposalSummary(lead) }
      : null;
  }

  if (activeBackend === "dsql") {
    const lead = await selectDsqlLead(leadId);
    return lead
      ? { ...lead, followUpPlan: generateFollowUpPlan(lead), proposalSummary: generateProposalSummary(lead) }
      : null;
  }

  const result = await dynamoDb?.send(
    new GetCommand({ TableName: tableName, Key: { PK: TENANT_PK, SK: `LEAD#${leadId}` } }),
  );
  if (!result?.Item) return null;
  const lead = itemToLead(result.Item);
  return { ...lead, followUpPlan: generateFollowUpPlan(lead), proposalSummary: generateProposalSummary(lead) };
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const updatedAt = new Date().toISOString();

  if (activeBackend === "memory") {
    memoryLeads = memoryLeads.map((lead) => (lead.leadId === leadId ? { ...lead, status, updatedAt } : lead));
    const updated = memoryLeads.find((lead) => lead.leadId === leadId) ?? null;
    if (updated) await createActivityLog(leadId, "status_updated", `Status changed to ${status.replaceAll("_", " ")}.`);
    return updated;
  }

  if (activeBackend === "dsql") {
    const updated = await updateDsqlLeadStatus(leadId, status, updatedAt);
    if (updated) await createActivityLog(leadId, "status_updated", `Status changed to ${status.replaceAll("_", " ")}.`);
    return updated;
  }

  const result = await dynamoDb?.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { PK: TENANT_PK, SK: `LEAD#${leadId}` },
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": status, ":updatedAt": updatedAt },
      ReturnValues: "ALL_NEW",
    }),
  );

  await createActivityLog(leadId, "status_updated", `Status changed to ${status.replaceAll("_", " ")}.`);
  return result?.Attributes ? itemToLead(result.Attributes) : null;
}

export async function listActivityLogs() {
  if (activeBackend === "memory") return memoryActivity;

  if (activeBackend === "dsql") return selectDsqlActivity();

  const result = await dynamoDb?.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": TENANT_PK, ":sk": "ACTIVITY#" },
      ScanIndexForward: false,
    }),
  );

  return (result?.Items ?? []).map(itemToActivity);
}

export async function seedDemoLeads() {
  if ((await listLeads()).length > 0) return listLeads();

  const seeds: LeadInput[] = [
    {
      customerName: "Lions Gate Garage Doors Lead",
      serviceType: "garage_door",
      urgency: "emergency",
      dealValue: 1800,
      leadSource: "website",
      contact: "(604) 555-0188",
      notes: "Customer says garage door is stuck and needs same day help.",
    },
    {
      customerName: "North Shore Homeowner",
      serviceType: "hvac",
      urgency: "emergency",
      dealValue: 3200,
      leadSource: "phone",
      contact: "northshore@example.com",
      notes: "No heat in the house, wants urgent technician visit.",
    },
    {
      customerName: "Burnaby Property Manager",
      serviceType: "roofing",
      urgency: "this_week",
      dealValue: 8500,
      leadSource: "referral",
      contact: "(604) 555-0142",
      notes: "Multi-unit roof repair quote needed this week.",
    },
    {
      customerName: "Surrey Restaurant Owner",
      serviceType: "plumbing",
      urgency: "this_month",
      dealValue: 2400,
      leadSource: "google",
      contact: "owner@surreybistro.example",
      notes: "Looking for commercial plumbing upgrade.",
    },
    {
      customerName: "Vancouver Retail Shop",
      serviceType: "electrical",
      urgency: "just_researching",
      dealValue: 1200,
      leadSource: "facebook",
      contact: "(604) 555-0199",
      notes: "Comparing quotes for lighting upgrade.",
    },
  ];

  for (const seed of seeds) {
    await createLead(seed);
  }

  return listLeads();
}
