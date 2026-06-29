export type LeadStatus = "new" | "qualified" | "proposal_sent" | "won" | "lost";

export type Urgency = "emergency" | "this_week" | "this_month" | "just_researching";

export type LeadSource = "referral" | "website" | "google" | "facebook" | "phone" | "other";

export type Temperature = "Hot" | "Warm" | "Cold";

export type ServiceType =
  | "garage_door"
  | "hvac"
  | "roofing"
  | "plumbing"
  | "electrical"
  | "other";

export type LeadInput = {
  customerName: string;
  contact: string;
  serviceType: ServiceType;
  urgency: Urgency;
  dealValue: number;
  leadSource: LeadSource;
  notes: string;
  followUpDate?: string;
};

export type Lead = Omit<LeadInput, "followUpDate"> & {
  leadId: string;
  score: number;
  temperature: Temperature;
  status: LeadStatus;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLog = {
  activityId: string;
  leadId: string;
  type: string;
  message: string;
  createdAt: string;
};

export type LeadDetail = Lead & {
  followUpPlan: string[];
  proposalSummary: string;
};
