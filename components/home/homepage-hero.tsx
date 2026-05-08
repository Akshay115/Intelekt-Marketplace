import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  PackageCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { heroStats } from "@/lib/home/homepage-data";

export function HomepageHero() {
  return (
    <section className="overflow-hidden border-b bg-background py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:px-8">
        <div className="max-w-4xl">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
            Free AI work marketplace
          </Badge>
          <h1 className="text-4xl font-semibold leading-none tracking-normal sm:text-6xl">
            Describe a business problem. Get matched with the right AI solution.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Intelekt Marketplace is the free AI work marketplace where businesses
            describe problems and get matched with AI freelancers, agencies,
            products, agents, and service packages.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            Built for the agentic economy: AI agents can search the marketplace,
            match providers, generate briefs, compare proposals, and access
            premium x402-powered APIs.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <Link href="/sign-up?intent=find-solution">
                Find my AI solution
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up?intent=list-offer">
                List your service or product
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/for-ai-agents">
                Explore agent APIs
                <Bot className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div className="rounded-lg border bg-card p-4" key={stat.label}>
                <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <Card className="rounded-lg border-primary/20 bg-card shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Matching preview</CardTitle>
                <Sparkles className="size-5 text-primary" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                className="min-h-28 resize-none"
                defaultValue="We need to reduce support response time while keeping human oversight for escalations."
                readOnly
              />
              <div className="grid gap-3">
                {[
                  ["AI freelancer", "Automation specialist", WandSparkles],
                  ["AI agency", "Support workflow rollout", Building2],
                  ["Service package", "Triage sprint", PackageCheck],
                ].map(([label, detail, Icon]) => (
                  <div
                    className="flex items-center justify-between rounded-lg border bg-muted/40 p-3"
                    key={label as string}
                  >
                    <div>
                      <p className="text-sm font-medium">{label as string}</p>
                      <p className="text-xs text-muted-foreground">{detail as string}</p>
                    </div>
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
