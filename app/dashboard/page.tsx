import type { Metadata } from "next";
import { BriefcaseBusiness, Building2, PackageCheck, Sparkles } from "lucide-react";

import { requireCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard | Intelekt Marketplace",
};

const nextSteps = [
  {
    title: "Create a client brief",
    description: "Describe a business problem and prepare it for AI matching.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Complete marketplace profile",
    description: "Add capabilities, proof, pricing, and trust signals.",
    icon: Building2,
  },
  {
    title: "Publish an offer",
    description: "List a service package, AI product, or agency capability.",
    icon: PackageCheck,
  },
];

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const role = user.profile?.marketplace_role ?? "client";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Protected workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          You are signed in as {user.email}. Your current marketplace role is{" "}
          <span className="text-foreground">{role.replace("_", " ")}</span>.
        </p>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <CardTitle>Workspace shell</CardTitle>
          <CardDescription>
            This protected dashboard is ready for role-specific surfaces.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {nextSteps.map((item) => (
          <Card className="rounded-lg" key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Coming next
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
