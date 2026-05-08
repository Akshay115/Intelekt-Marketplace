import type { Metadata } from "next";

import { SignUpForm } from "@/app/(auth)/_components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up | Intelekt Marketplace",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
