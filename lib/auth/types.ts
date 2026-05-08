import type { UserSchema } from "@insforge/sdk";

export const AUTH_ACCESS_COOKIE = "intelekt_access_token";
export const AUTH_REFRESH_COOKIE = "intelekt_refresh_token";

export const USER_ROLES = [
  "client",
  "freelancer",
  "agency_owner",
  "product_owner",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type MarketplaceUser = UserSchema & {
  profile: (UserSchema["profile"] & {
    marketplace_role?: UserRole;
    onboarding_goal?: OnboardingGoalId;
    onboarding_completed_at?: string;
  }) | null;
};

export const ONBOARDING_GOALS = [
  {
    id: "find_ai_solutions",
    label: "Find AI solutions for my business",
    description: "Post briefs, compare matches, and manage AI projects.",
    role: "client",
  },
  {
    id: "offer_freelance_services",
    label: "Offer freelance AI services",
    description: "Create a profile and respond to qualified client briefs.",
    role: "freelancer",
  },
  {
    id: "list_ai_agency",
    label: "List my AI agency",
    description: "Showcase your team, case studies, and packaged services.",
    role: "agency_owner",
  },
  {
    id: "list_ai_product",
    label: "List my AI product",
    description: "Publish product listings for clients searching the marketplace.",
    role: "product_owner",
  },
  {
    id: "explore_marketplace",
    label: "Explore the marketplace",
    description: "Browse the ecosystem before creating listings or briefs.",
    role: "client",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  description: string;
  role: UserRole;
}>;

export type OnboardingGoalId = (typeof ONBOARDING_GOALS)[number]["id"];

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: "",
};
