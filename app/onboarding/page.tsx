import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, PackageCheck, Search, Sparkles, UserRound } from "lucide-react";

import { selectOnboardingGoalAction } from "@/lib/auth/actions";
import { getUserDisplayName, requireCurrentUser } from "@/lib/auth";
import { ONBOARDING_GOALS } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Onboarding | Intelekt Marketplace",
};

const goalIcons = {
  find_ai_solutions: Search,
  offer_freelance_services: UserRound,
  list_ai_agency: Building2,
  list_ai_product: PackageCheck,
  explore_marketplace: Sparkles,
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [user, params] = await Promise.all([
    requireCurrentUser("/onboarding"),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium text-primary">Welcome, {getUserDisplayName(user)}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-none tracking-normal sm:text-5xl">
            What do you want to do first?
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We will use this to set up your role and route you to the right
            dashboard workspace.
          </p>
        </div>

        {params.error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>Please choose one onboarding path.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-3">
          {ONBOARDING_GOALS.map((goal) => {
            const Icon = goalIcons[goal.id];

            return (
              <form action={selectOnboardingGoalAction} key={goal.id}>
                <input name="goal" type="hidden" value={goal.id} />
                <button className="w-full text-left" type="submit">
                  <Card className="rounded-lg transition hover:border-primary/40 hover:bg-primary/5">
                    <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <CardTitle>{goal.label}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </CardHeader>
                  </Card>
                </button>
              </form>
            );
          })}
        </div>

        <Card className="mt-6 rounded-lg border-dashed">
          <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Already know the exact role you need?
            </p>
            <Button asChild variant="outline">
              <Link href="/onboarding/role">Choose a role directly</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
