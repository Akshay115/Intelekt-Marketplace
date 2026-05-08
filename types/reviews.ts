import type { DatabaseRecord, ISODateTime, JsonArray, JsonObject, SoftDeleteFields, UUID } from "./database";

export type ReviewStatus = "draft" | "pending_review" | "published" | "rejected" | "archived";
export type CaseStudyStatus = "draft" | "client_review" | "published" | "archived";

export type Review = DatabaseRecord &
  SoftDeleteFields & {
    projectId: UUID | null;
    entityId: UUID;
    reviewerUserId: UUID | null;
    rating: number;
    title: string | null;
    body: string | null;
    status: ReviewStatus;
    publishedAt: ISODateTime | null;
  };

export type CaseStudy = DatabaseRecord &
  SoftDeleteFields & {
    entityId: UUID;
    projectId: UUID | null;
    title: string;
    summary: string | null;
    problem: string | null;
    solution: string | null;
    outcomes: JsonArray;
    metrics: JsonObject;
    status: CaseStudyStatus;
    publishedAt: ISODateTime | null;
  };
