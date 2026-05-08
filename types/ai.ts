import type { DatabaseRecord, ISODateTime, JsonObject, UUID } from "./database";

export type AiTaskType =
  | "brief_structuring"
  | "matching"
  | "summarization"
  | "moderation"
  | "embedding"
  | "generation"
  | "evaluation";
export type AiTaskStatus = "queued" | "running" | "succeeded" | "failed" | "cancelled";
export type AiGenerationOutputType = "text" | "json" | "markdown" | "embedding" | "classification";
export type AiGenerationStatus = "created" | "accepted" | "rejected" | "archived";
export type AiModelRunStatus = "succeeded" | "failed" | "cancelled";
export type AiPromptVersionStatus = "draft" | "active" | "archived";
export type EmbeddingSourceType =
  | "marketplace_entity"
  | "service_package"
  | "project"
  | "project_brief"
  | "case_study"
  | "message"
  | "review";

export type AiTask = DatabaseRecord & {
  taskType: AiTaskType;
  status: AiTaskStatus;
  requestedBy: UUID | null;
  organizationId: UUID | null;
  projectId: UUID | null;
  entityId: UUID | null;
  inputRef: JsonObject;
  outputRef: JsonObject;
  errorMessage: string | null;
  completedAt: ISODateTime | null;
};

export type AiGeneration = DatabaseRecord & {
  taskId: UUID | null;
  promptVersionId: UUID | null;
  inputHash: string | null;
  output: JsonObject;
  outputType: AiGenerationOutputType;
  status: AiGenerationStatus;
  createdBy: UUID | null;
};

export type AiModelRun = {
  id: UUID;
  generationId: UUID | null;
  provider: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
  latencyMs: number | null;
  costUsd: number | null;
  status: AiModelRunStatus;
  errorCode: string | null;
  createdAt: ISODateTime;
};

export type AiModelPerformance = DatabaseRecord & {
  provider: string;
  model: string;
  taskType: AiTaskType;
  windowStart: ISODateTime;
  windowEnd: ISODateTime;
  successRate: number | null;
  avgLatencyMs: number | null;
  avgCostUsd: number | null;
  qualityScore: number | null;
};

export type AiPromptVersion = DatabaseRecord & {
  promptKey: string;
  version: number;
  title: string;
  systemPrompt: string | null;
  template: string;
  variablesSchema: JsonObject;
  status: AiPromptVersionStatus;
  createdBy: UUID | null;
};

export type Embedding = DatabaseRecord & {
  sourceType: EmbeddingSourceType;
  sourceId: UUID;
  embeddingModel: string;
  embedding: number[];
  contentHash: string;
  contentPreview: string | null;
  metadata: JsonObject;
};
