export {
  ONBOARDING_GOALS,
  USER_ROLES,
  initialAuthActionState,
  type AuthActionState,
  type MarketplaceUser,
  type OnboardingGoalId,
  type UserRole,
} from "@/lib/auth/types";
export { getCurrentUser, getUserDisplayName, requireCurrentUser } from "@/lib/auth/server";
