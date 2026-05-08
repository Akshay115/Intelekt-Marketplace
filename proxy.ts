import { NextResponse, type NextRequest } from "next/server";

const accessCookie = "intelekt_access_token";
const refreshCookie = "intelekt_refresh_token";

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has(accessCookie) || request.cookies.has(refreshCookie);

  if (!hasSession) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
