import type {
  CurrencyCode,
  DatabaseRecord,
  ISODate,
  ISODateTime,
  JsonObject,
  SoftDeleteFields,
  UUID,
} from "./database";

export type ProposalStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "archived";
export type ConversationType = "project" | "proposal" | "support" | "moderation";
export type ConversationStatus = "open" | "closed" | "archived";
export type MessageType = "text" | "file" | "system" | "proposal_update" | "milestone_update";
export type ProjectMilestoneStatus =
  | "planned"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "revision_requested"
  | "cancelled";
export type ProjectFileVisibility =
  | "private"
  | "client"
  | "provider"
  | "project_participants"
  | "public";

export type Proposal = DatabaseRecord &
  SoftDeleteFields & {
    projectId: UUID;
    entityId: UUID;
    submittedBy: UUID | null;
    title: string;
    approach: string | null;
    timelineDays: number | null;
    priceAmount: number | null;
    currency: CurrencyCode;
    status: ProposalStatus;
    submittedAt: ISODateTime | null;
    acceptedAt: ISODateTime | null;
    rejectedAt: ISODateTime | null;
  };

export type Conversation = DatabaseRecord &
  SoftDeleteFields & {
    projectId: UUID | null;
    entityId: UUID | null;
    proposalId: UUID | null;
    type: ConversationType;
    status: ConversationStatus;
    createdBy: UUID | null;
    lastMessageAt: ISODateTime | null;
  };

export type Message = DatabaseRecord &
  SoftDeleteFields & {
    conversationId: UUID;
    senderUserId: UUID | null;
    body: string | null;
    messageType: MessageType;
    metadata: JsonObject;
    readAt: ISODateTime | null;
  };

export type ProjectMilestone = DatabaseRecord &
  SoftDeleteFields & {
    projectId: UUID;
    proposalId: UUID | null;
    title: string;
    description: string | null;
    dueDate: ISODate | null;
    amount: number | null;
    currency: CurrencyCode;
    status: ProjectMilestoneStatus;
    acceptedAt: ISODateTime | null;
  };

export type ProjectFile = DatabaseRecord &
  SoftDeleteFields & {
    projectId: UUID;
    uploadedBy: UUID | null;
    storageBucket: string;
    storageKey: string;
    fileName: string;
    mimeType: string | null;
    sizeBytes: number | null;
    visibility: ProjectFileVisibility;
  };
