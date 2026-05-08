import type { Metadata } from "next";

import { SignInForm } from "@/app/(auth)/_components/sign-in-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Sign in | Intelekt Marketplace",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; verified?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const notice = params.verified
    ? "Email verified. You can sign in now."
    : params.reset
      ? "Password reset complete. You can sign in with the new password."
      : "";

  return (
    <div className="space-y-4">
      {notice ? (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}
      <SignInForm nextPath={params.next ?? "/dashboard"} />
    </div>
  );
}
