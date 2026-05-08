import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/app/(auth)/_components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password | Intelekt Marketplace",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
