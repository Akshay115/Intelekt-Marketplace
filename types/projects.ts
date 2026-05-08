import type {
  CurrencyCode,
  DatabaseRecord,
  ISODate,
  JsonArray,
  SoftDeleteFields,
  UUID,
} from "./database";

export type ClientBuyingStage = "exploring" | "scoping" | "ready_to_buy" | "active";
export type PreferredDeliveryModel =
  | "freelancer"
  | "agency"
  | "product"
  | "agent"
  | "service_package"
  | "mixed";
export type ProjectStatus =
  | "draft"
  | "matching"
  | "shortlisting"
  | "proposal_review"
  | "active"
  | "completed"
  | "cancelled"
  | "archived";
export type ProjectVisibility = "private" | "invited" | "public";
export type ProjectBriefVisibility = "private" | "shared" | "public_summary";
export type ProjectMatchStatus = "suggested" | "shortlisted" | "invited" | "dismissed" | "accepted";
export type ProjectShortlistStatus = "saved" | "invited" | "removed" | "selected";

export type ClientProfile = DatabaseRecord & {
  userId: UUID | null;
  organizationId: UUID | null;
  companySize: string | null;
  roleTitle: string | null;
  buyingStage: ClientBuyingStage;
  preferredBudgetRange: string | null;
  preferredDeliveryModel: PreferredDeliveryModel | null;
};

export type Project = DatabaseRecord &
  SoftDeleteFields & {
    clientProfileId: UUID | null;
    organizationId: UUID | null;
    createdBy: UUID | null;
    title: string;
    summary: string | null;
    status: ProjectStatus;
    budgetMin: number | null;
    budgetMax: number | null;
    currency: CurrencyCode;
    targetStartDate: ISODate | null;
    visibility: ProjectVisibility;
  };

export type ProjectBrief = DatabaseRecord & {
  projectId: UUID;
  version: number;
  problemStatement: string;
  goals: JsonArray;
  constraints: JsonArray;
  requirements: JsonArray;
  successMetrics: JsonArray;
  rawInput: string | null;
  visibility: ProjectBriefVisibility;
  createdBy: UUID | null;
};

export type ProjectMatch = DatabaseRecord & {
  projectId: UUID;
  entityId: UUID | null;
  servicePackageId: UUID | null;
  matchScore: number | null;
  matchReasons: JsonArray;
  riskFlags: JsonArray;
  status: ProjectMatchStatus;
  generatedByTaskId: UUID | null;
};

export type ProjectShortlist = DatabaseRecord & {
  projectId: UUID;
  entityId: UUID | null;
  servicePackageId: UUID | null;
  addedBy: UUID | null;
  notes: string | null;
  status: ProjectShortlistStatus;
};
