import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { selectRoleAction } from "@/lib/auth/actions";
import { requireCurrentUser, USER_ROLES } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Choose role | Intelekt Marketplace",
};

const roleLabels = {
  client: "Client",
  freelancer: "Freelancer",
  agency_owner: "Agency owner",
  product_owner: "Product owner",
  admin: "Admin",
};

const roleDescriptions = {
  client: "Find AI products, services, freelancers, and agencies for business needs.",
  freelancer: "Offer AI services and respond to project opportunities.",
  agency_owner: "Manage an agency profile, team capabilities, and service packages.",
  product_owner: "List AI products and manage marketplace presence.",
  admin: "Moderate and operate marketplace workflows.",
};

export default async function RolePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [, params] = await Promise.all([
    requireCurrentUser("/onboarding/role"),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-primary">Role setup</p>
          <h1 className="mt-3 text-4xl font-semibold leading-none tracking-normal sm:text-5xl">
            Choose your marketplace role
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This writes a placeholder profile field through InsForge Auth so the
            role model can evolve without touching route code.
          </p>
        </div>

        {params.error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>Please choose a valid role.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {USER_ROLES.map((role) => (
            <form action={selectRoleAction} key={role}>
              <input name="role" type="hidden" value={role} />
              <Card className="h-full rounded-lg">
                <CardHeader>
                  <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  </div>
                  <CardTitle>{roleLabels[role]}</CardTitle>
                  <CardDescription>{roleDescriptions[role]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" type="submit">
                    Continue as {roleLabels[role]}
                  </Button>
                </CardContent>
              </Card>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
