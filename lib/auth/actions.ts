"use server";

import { redirect } from "next/navigation";

import { clearAuthCookies, getAuthCookies, setAuthCookies } from "@/lib/auth/session";
import { createInsForgeAuthClient, getCurrentUser } from "@/lib/auth/server";
import {
  ONBOARDING_GOALS,
  USER_ROLES,
  type AuthActionState,
  type OnboardingGoalId,
  type UserRole,
} from "@/lib/auth/types";

function getFormString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getSafeRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  const path = String(value ?? "").trim();

  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const next = getSafeRedirectPath(formData.get("next"), "/dashboard");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  const client = createInsForgeAuthClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error || !data?.accessToken) {
    return {
      status: "error",
      message: error?.message ?? "We could not sign you in with those details.",
    };
  }

  await setAuthCookies(data.accessToken, data.refreshToken);
  redirect(next);
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");

  if (!name || !email || !password) {
    return { status: "error", message: "Name, email, and password are required." };
  }

  const client = createInsForgeAuthClient();
  const { data, error } = await client.auth.signUp({
    name,
    email,
    password,
    redirectTo: new URL("/sign-in?verified=1", getAppUrl()).toString(),
  });

  if (error) {
    return {
      status: "error",
      message: error.message ?? "We could not create your account.",
    };
  }

  if (data?.accessToken) {
    await setAuthCookies(data.accessToken, data.refreshToken);
    redirect("/onboarding");
  }

  return {
    status: "success",
    message:
      "Account created. Check your email to verify your account, then sign in to continue onboarding.",
  };
}

export async function forgotPasswordAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getFormString(formData, "email");

  if (!email) {
    return { status: "error", message: "Email is required." };
  }

  const client = createInsForgeAuthClient();
  const { error } = await client.auth.sendResetPasswordEmail({
    email,
    redirectTo: new URL("/sign-in?reset=1", getAppUrl()).toString(),
  });

  if (error) {
    return {
      status: "error",
      message: error.message ?? "We could not send the reset email.",
    };
  }

  return {
    status: "success",
    message: "If an account exists for that email, a reset link is on the way.",
  };
}

export async function selectOnboardingGoalAction(formData: FormData) {
  const goalId = getFormString(formData, "goal") as OnboardingGoalId;
  const goal = ONBOARDING_GOALS.find((item) => item.id === goalId);

  if (!goal) {
    redirect("/onboarding?error=invalid_goal");
  }

  await updateCurrentUserRole(goal.role, goal.id);
  redirect("/dashboard");
}

export async function selectRoleAction(formData: FormData) {
  const role = getFormString(formData, "role") as UserRole;

  if (!USER_ROLES.includes(role)) {
    redirect("/onboarding/role?error=invalid_role");
  }

  await updateCurrentUserRole(role);
  redirect("/dashboard");
}

export async function signOutAction() {
  const { accessToken } = await getAuthCookies();

  if (accessToken) {
    await createInsForgeAuthClient(accessToken).auth.signOut();
  }

  await clearAuthCookies();
  redirect("/sign-in");
}

async function updateCurrentUserRole(role: UserRole, goal?: OnboardingGoalId) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?next=/onboarding");
  }

  const { accessToken } = await getAuthCookies();
  const client = createInsForgeAuthClient(accessToken);
  const { error } = await client.auth.setProfile({
    ...(user.profile ?? {}),
    marketplace_role: role,
    onboarding_goal: goal,
    onboarding_completed_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message ?? "Unable to save onboarding role.");
  }
}
