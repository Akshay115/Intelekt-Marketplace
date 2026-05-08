import "server-only";

import { createClient } from "@insforge/sdk";
import { redirect } from "next/navigation";

import { getAuthCookies } from "@/lib/auth/session";
import type { MarketplaceUser } from "@/lib/auth/types";

export function createInsForgeAuthClient(accessToken?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error(
      "InsForge Auth is not configured. Set NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY."
    );
  }

  return createClient({
    baseUrl,
    anonKey,
    edgeFunctionToken: accessToken,
    isServerMode: true,
  });
}

export async function getCurrentUser(): Promise<MarketplaceUser | null> {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    return null;
  }

  const client = createInsForgeAuthClient(accessToken);
  const { data, error } = await client.auth.getCurrentUser();

  if (error || !data.user) {
    return null;
  }

  return data.user as MarketplaceUser;
}

export async function requireCurrentUser(nextPath = "/dashboard") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export function getUserDisplayName(user: MarketplaceUser) {
  return user.profile?.name ?? user.email.split("@")[0] ?? "there";
}
