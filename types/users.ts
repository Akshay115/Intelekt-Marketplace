import type { DatabaseRecord, ISODateTime, SoftDeleteFields, UUID } from "./database";

export type UserRole = "user" | "admin" | "moderator";
export type UserStatus = "active" | "invited" | "suspended" | "deleted";
export type OrganizationType = "client" | "agency" | "vendor" | "admin";
export type OrganizationStatus = "active" | "invited" | "suspended" | "archived";
export type OrganizationMemberRole = "owner" | "admin" | "member" | "viewer";
export type OrganizationMemberStatus = "invited" | "active" | "removed" | "suspended";

export type User = DatabaseRecord &
  SoftDeleteFields & {
    authUserId: UUID;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    role: UserRole;
    status: UserStatus;
    lastSeenAt: ISODateTime | null;
  };

export type Organization = DatabaseRecord &
  SoftDeleteFields & {
    name: string;
    slug: string;
    type: OrganizationType;
    websiteUrl: string | null;
    logoUrl: string | null;
    billingEmail: string | null;
    status: OrganizationStatus;
    createdBy: UUID | null;
  };

export type OrganizationMember = DatabaseRecord & {
  organizationId: UUID;
  userId: UUID;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
  invitedBy: UUID | null;
  joinedAt: ISODateTime | null;
};
