import { z } from "zod";

const uuidSchema = z.uuid();
const nullableUuidSchema = uuidSchema.nullish();
const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.");
const urlSchema = z.url();
const optionalUrlSchema = z.union([urlSchema, z.literal("")]).optional();
const currencySchema = z.string().trim().length(3).transform((value) => value.toUpperCase());
const jsonRecordSchema = z.record(z.string(), z.unknown());
const jsonArraySchema = z.array(z.unknown());

export const marketplaceEntityTypeSchema = z.enum([
  "freelancer",
  "agency",
  "product",
  "agent",
  "service_provider",
]);

export const marketplaceEntityStatusSchema = z.enum([
  "draft",
  "pending_review",
  "published",
  "suspended",
  "archived",
]);

export const visibilitySchema = z.enum(["private", "unlisted", "public"]);

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: slugSchema,
  type: z.enum(["client", "agency", "vendor", "admin"]).default("client"),
  websiteUrl: optionalUrlSchema,
  logoUrl: optionalUrlSchema,
  billingEmail: z.email().optional().or(z.literal("")),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const createMarketplaceEntitySchema = z
  .object({
    ownerUserId: nullableUuidSchema,
    organizationId: nullableUuidSchema,
    entityType: marketplaceEntityTypeSchema,
    name: z.string().trim().min(2).max(180),
    slug: slugSchema,
    headline: z.string().trim().max(220).optional(),
    description: z.string().trim().max(5000).optional(),
    avatarUrl: optionalUrlSchema,
    coverUrl: optionalUrlSchema,
    status: marketplaceEntityStatusSchema.default("draft"),
    visibility: visibilitySchema.default("private"),
  })
  .refine((value) => Boolean(value.ownerUserId || value.organizationId), {
    message: "Either ownerUserId or organizationId is required.",
    path: ["ownerUserId"],
  });

export const updateMarketplaceEntitySchema = createMarketplaceEntitySchema.partial();

export const createFreelancerProfileSchema = z
  .object({
    entityId: uuidSchema,
    userId: nullableUuidSchema,
    hourlyRateMin: z.number().nonnegative().optional(),
    hourlyRateMax: z.number().nonnegative().optional(),
    availability: z.enum(["available", "limited", "unavailable"]).default("available"),
    timezone: z.string().trim().max(80).optional(),
    experienceYears: z.number().int().nonnegative().optional(),
    portfolioUrl: optionalUrlSchema,
    responseTimeHours: z.number().int().nonnegative().optional(),
  })
  .refine(
    (value) =>
      value.hourlyRateMin === undefined ||
      value.hourlyRateMax === undefined ||
      value.hourlyRateMin <= value.hourlyRateMax,
    {
      message: "hourlyRateMin must be less than or equal to hourlyRateMax.",
      path: ["hourlyRateMin"],
    }
  );

export const updateFreelancerProfileSchema = createFreelancerProfileSchema.partial();

export const createAgencyProfileSchema = z.object({
  entityId: uuidSchema,
  organizationId: nullableUuidSchema,
  teamSize: z.number().int().nonnegative().optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  headquarters: z.string().trim().max(180).optional(),
  deliveryModel: z.string().trim().max(120).optional(),
  minimumProjectBudget: z.number().nonnegative().optional(),
  websiteUrl: optionalUrlSchema,
});

export const updateAgencyProfileSchema = createAgencyProfileSchema.partial();

export const createProductProfileSchema = z.object({
  entityId: uuidSchema,
  productUrl: optionalUrlSchema,
  pricingModel: z.enum(["free", "usage", "subscription", "one_time", "custom"]).default("custom"),
  freeTrialAvailable: z.boolean().default(false),
  deploymentType: z.enum(["saas", "self_hosted", "hybrid", "api", "agent"]).default("saas"),
  integrationNotes: z.string().trim().max(3000).optional(),
  supportLevel: z.string().trim().max(120).optional(),
});

export const updateProductProfileSchema = createProductProfileSchema.partial();

export const createAgentProfileSchema = z.object({
  entityId: uuidSchema,
  agentType: z
    .enum(["assistant", "workflow", "research", "automation", "support", "custom"])
    .default("assistant"),
  capabilities: jsonArraySchema.default([]),
  supportedTools: jsonArraySchema.default([]),
  deploymentMode: z
    .enum(["hosted", "customer_cloud", "self_hosted", "hybrid"])
    .default("hosted"),
  inputRequirements: z.string().trim().max(3000).optional(),
  safetyNotes: z.string().trim().max(3000).optional(),
  demoUrl: optionalUrlSchema,
});

export const updateAgentProfileSchema = createAgentProfileSchema.partial();

export const createServicePackageSchema = z.object({
  entityId: uuidSchema,
  title: z.string().trim().min(2).max(180),
  slug: slugSchema,
  description: z.string().trim().max(5000).optional(),
  deliverables: jsonArraySchema.default([]),
  startingPrice: z.number().nonnegative().optional(),
  currency: currencySchema.default("USD"),
  timelineDays: z.number().int().positive().optional(),
  revisionPolicy: z.string().trim().max(1000).optional(),
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
  visibility: visibilitySchema.default("private"),
});

export const updateServicePackageSchema = createServicePackageSchema.partial();

export const createClientProfileSchema = z
  .object({
    userId: nullableUuidSchema,
    organizationId: nullableUuidSchema,
    companySize: z.string().trim().max(80).optional(),
    roleTitle: z.string().trim().max(120).optional(),
    buyingStage: z.enum(["exploring", "scoping", "ready_to_buy", "active"]).default("exploring"),
    preferredBudgetRange: z.string().trim().max(120).optional(),
    preferredDeliveryModel: z
      .enum(["freelancer", "agency", "product", "agent", "service_package", "mixed"])
      .optional(),
  })
  .refine((value) => Boolean(value.userId || value.organizationId), {
    message: "Either userId or organizationId is required.",
    path: ["userId"],
  });

export const updateClientProfileSchema = createClientProfileSchema.partial();

export const createProjectSchema = z
  .object({
    clientProfileId: nullableUuidSchema,
    organizationId: nullableUuidSchema,
    createdBy: nullableUuidSchema,
    title: z.string().trim().min(3).max(180),
    summary: z.string().trim().max(2000).optional(),
    status: z
      .enum([
        "draft",
        "matching",
        "shortlisting",
        "proposal_review",
        "active",
        "completed",
        "cancelled",
        "archived",
      ])
      .default("draft"),
    budgetMin: z.number().nonnegative().optional(),
    budgetMax: z.number().nonnegative().optional(),
    currency: currencySchema.default("USD"),
    targetStartDate: z.iso.date().optional(),
    visibility: z.enum(["private", "invited", "public"]).default("private"),
  })
  .refine(
    (value) =>
      value.budgetMin === undefined ||
      value.budgetMax === undefined ||
      value.budgetMin <= value.budgetMax,
    {
      message: "budgetMin must be less than or equal to budgetMax.",
      path: ["budgetMin"],
    }
  );

export const updateProjectSchema = createProjectSchema.partial();

export const createProjectBriefSchema = z.object({
  projectId: uuidSchema,
  version: z.number().int().positive().default(1),
  problemStatement: z.string().trim().min(10).max(8000),
  goals: jsonArraySchema.default([]),
  constraints: jsonArraySchema.default([]),
  requirements: jsonArraySchema.default([]),
  successMetrics: jsonArraySchema.default([]),
  rawInput: z.string().trim().max(12000).optional(),
  visibility: z.enum(["private", "shared", "public_summary"]).default("private"),
  createdBy: nullableUuidSchema,
});

export const updateProjectBriefSchema = createProjectBriefSchema.partial();

export const createProjectMatchSchema = z
  .object({
    projectId: uuidSchema,
    entityId: nullableUuidSchema,
    servicePackageId: nullableUuidSchema,
    matchScore: z.number().min(0).max(100).optional(),
    matchReasons: jsonArraySchema.default([]),
    riskFlags: jsonArraySchema.default([]),
    status: z
      .enum(["suggested", "shortlisted", "invited", "dismissed", "accepted"])
      .default("suggested"),
    generatedByTaskId: nullableUuidSchema,
  })
  .refine((value) => Boolean(value.entityId || value.servicePackageId), {
    message: "Either entityId or servicePackageId is required.",
    path: ["entityId"],
  });

export const updateProjectMatchSchema = createProjectMatchSchema.partial();

export const createProposalSchema = z.object({
  projectId: uuidSchema,
  entityId: uuidSchema,
  submittedBy: nullableUuidSchema,
  title: z.string().trim().min(3).max(180),
  approach: z.string().trim().max(8000).optional(),
  timelineDays: z.number().int().positive().optional(),
  priceAmount: z.number().nonnegative().optional(),
  currency: currencySchema.default("USD"),
  status: z
    .enum(["draft", "submitted", "under_review", "accepted", "rejected", "withdrawn", "archived"])
    .default("draft"),
});

export const updateProposalSchema = createProposalSchema.partial();

export const createConversationSchema = z.object({
  projectId: nullableUuidSchema,
  entityId: nullableUuidSchema,
  proposalId: nullableUuidSchema,
  type: z.enum(["project", "proposal", "support", "moderation"]).default("project"),
  status: z.enum(["open", "closed", "archived"]).default("open"),
  createdBy: nullableUuidSchema,
});

export const updateConversationSchema = createConversationSchema.partial();

export const createMessageSchema = z.object({
  conversationId: uuidSchema,
  senderUserId: nullableUuidSchema,
  body: z.string().trim().max(12000).optional(),
  messageType: z
    .enum(["text", "file", "system", "proposal_update", "milestone_update"])
    .default("text"),
  metadata: jsonRecordSchema.default({}),
});

export const updateMessageSchema = createMessageSchema
  .pick({ body: true, metadata: true })
  .partial();

export const createReviewSchema = z.object({
  projectId: nullableUuidSchema,
  entityId: uuidSchema,
  reviewerUserId: nullableUuidSchema,
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(160).optional(),
  body: z.string().trim().max(5000).optional(),
  status: z.enum(["draft", "pending_review", "published", "rejected", "archived"]).default("draft"),
});

export const updateReviewSchema = createReviewSchema.partial();

export const createCaseStudySchema = z.object({
  entityId: uuidSchema,
  projectId: nullableUuidSchema,
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().max(2000).optional(),
  problem: z.string().trim().max(5000).optional(),
  solution: z.string().trim().max(5000).optional(),
  outcomes: jsonArraySchema.default([]),
  metrics: jsonRecordSchema.default({}),
  status: z.enum(["draft", "client_review", "published", "archived"]).default("draft"),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

export const createAiTaskSchema = z.object({
  taskType: z.enum([
    "brief_structuring",
    "matching",
    "summarization",
    "moderation",
    "embedding",
    "generation",
    "evaluation",
  ]),
  status: z.enum(["queued", "running", "succeeded", "failed", "cancelled"]).default("queued"),
  requestedBy: nullableUuidSchema,
  organizationId: nullableUuidSchema,
  projectId: nullableUuidSchema,
  entityId: nullableUuidSchema,
  inputRef: jsonRecordSchema.default({}),
  outputRef: jsonRecordSchema.default({}),
});

export const updateAiTaskSchema = createAiTaskSchema.partial().extend({
  errorMessage: z.string().trim().max(4000).optional(),
  completedAt: z.iso.datetime().optional(),
});

export type CreateMarketplaceEntityInput = z.infer<typeof createMarketplaceEntitySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type CreateAiTaskInput = z.infer<typeof createAiTaskSchema>;
