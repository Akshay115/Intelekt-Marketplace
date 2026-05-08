import type {
  CurrencyCode,
  DatabaseRecord,
  ISODateTime,
  JsonArray,
  JsonObject,
  SoftDeleteFields,
  UUID,
  Visibility,
} from "./database";

export type MarketplaceEntityType =
  | "freelancer"
  | "agency"
  | "product"
  | "agent"
  | "service_provider";

export type MarketplaceEntityStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "suspended"
  | "archived";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected" | "expired";
export type ServicePackageStatus = "draft" | "active" | "paused" | "archived";
export type FreelancerAvailability = "available" | "limited" | "unavailable";
export type ExperienceLevel = "learning" | "working" | "advanced" | "expert";
export type ProductPricingModel = "free" | "usage" | "subscription" | "one_time" | "custom";
export type ProductDeploymentType = "saas" | "self_hosted" | "hybrid" | "api" | "agent";
export type AgentType = "assistant" | "workflow" | "research" | "automation" | "support" | "custom";
export type AgentDeploymentMode = "hosted" | "customer_cloud" | "self_hosted" | "hybrid";

export type MarketplaceEntity = DatabaseRecord &
  SoftDeleteFields & {
    ownerUserId: UUID | null;
    organizationId: UUID | null;
    entityType: MarketplaceEntityType;
    name: string;
    slug: string;
    headline: string | null;
    description: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    status: MarketplaceEntityStatus;
    verificationStatus: VerificationStatus;
    visibility: Visibility;
    internalNotes: string | null;
    publishedAt: ISODateTime | null;
  };

export type FreelancerProfile = DatabaseRecord & {
  entityId: UUID;
  userId: UUID | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  availability: FreelancerAvailability;
  timezone: string | null;
  experienceYears: number | null;
  portfolioUrl: string | null;
  responseTimeHours: number | null;
  privateNotes: string | null;
};

export type AgencyProfile = DatabaseRecord & {
  entityId: UUID;
  organizationId: UUID | null;
  teamSize: number | null;
  foundedYear: number | null;
  headquarters: string | null;
  deliveryModel: string | null;
  minimumProjectBudget: number | null;
  websiteUrl: string | null;
  privateNotes: string | null;
};

export type ProductProfile = DatabaseRecord & {
  entityId: UUID;
  productUrl: string | null;
  pricingModel: ProductPricingModel;
  freeTrialAvailable: boolean;
  deploymentType: ProductDeploymentType;
  integrationNotes: string | null;
  supportLevel: string | null;
  privateRoadmap: string | null;
};

export type AgentProfile = DatabaseRecord & {
  entityId: UUID;
  agentType: AgentType;
  capabilities: JsonArray;
  supportedTools: JsonArray;
  deploymentMode: AgentDeploymentMode;
  inputRequirements: string | null;
  safetyNotes: string | null;
  demoUrl: string | null;
  internalPromptNotes: string | null;
};

export type ServicePackage = DatabaseRecord &
  SoftDeleteFields & {
    entityId: UUID;
    title: string;
    slug: string;
    description: string | null;
    deliverables: JsonArray;
    startingPrice: number | null;
    currency: CurrencyCode;
    timelineDays: number | null;
    revisionPolicy: string | null;
    status: ServicePackageStatus;
    visibility: Visibility;
  };

export type Category = DatabaseRecord & {
  name: string;
  slug: string;
  description: string | null;
  parentId: UUID | null;
  sortOrder: number;
  isActive: boolean;
};

export type Skill = DatabaseRecord & {
  name: string;
  slug: string;
  description: string | null;
  categoryId: UUID | null;
  isActive: boolean;
};

export type Tool = DatabaseRecord & {
  name: string;
  slug: string;
  websiteUrl: string | null;
  category: string | null;
  isActive: boolean;
};

export type Industry = DatabaseRecord & {
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

export type Outcome = DatabaseRecord & {
  name: string;
  slug: string;
  description: string | null;
  metricHint: string | null;
  isActive: boolean;
};

export type WorkflowTemplate = DatabaseRecord &
  SoftDeleteFields & {
    entityId: UUID | null;
    servicePackageId: UUID | null;
    name: string;
    description: string | null;
    templateType: "delivery" | "agent" | "matching" | "intake" | "evaluation";
    steps: JsonArray;
    inputsSchema: JsonObject;
    outputsSchema: JsonObject;
    visibility: "private" | "organization" | "public";
    status: "draft" | "active" | "archived";
  };
