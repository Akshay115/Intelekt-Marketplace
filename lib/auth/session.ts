import "server-only";

import { cookies } from "next/headers";

import { AUTH_ACCESS_COOKIE, AUTH_REFRESH_COOKIE } from "@/lib/auth/types";

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getAuthCookies() {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(AUTH_ACCESS_COOKIE)?.value,
    refreshToken: cookieStore.get(AUTH_REFRESH_COOKIE)?.value,
  };
}

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_ACCESS_COOKIE, accessToken, {
    ...authCookieOptions,
    maxAge: 60 * 15,
  });

  if (refreshToken) {
    cookieStore.set(AUTH_REFRESH_COOKIE, refreshToken, {
      ...authCookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_ACCESS_COOKIE);
  cookieStore.delete(AUTH_REFRESH_COOKIE);
}
