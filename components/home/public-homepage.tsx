import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Code2,
  CreditCard,
  ExternalLink,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { AudiencePanel } from "@/components/home/audience-panel";
import { AiProductCard } from "@/components/home/ai-product-card";
import { HomepageHero } from "@/components/home/homepage-hero";
import { SectionHeading } from "@/components/home/section-heading";
import { Container, Section } from "@/components/layout";
import { EntityCard, ServicePackageCard } from "@/components/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  audienceSections,
  developerLinks,
  featuredAiProducts,
  featuredProviders,
  featuredServicePackages,
  freeTools,
  howItWorksSteps,
  humanAgentModel,
  monetizationPoints,
  popularOutcomes,
  trustItems,
} from "@/lib/home/homepage-data";

const providerIcons = {
  agency: Building2,
  freelancer: Users,
  partner: Sparkles,
};

export function PublicHomepage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">Intelekt Marketplace</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
            <a className="transition hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-foreground" href="#clients">
              Clients
            </a>
            <a className="transition hover:text-foreground" href="#providers">
              Providers
            </a>
            <a className="transition hover:text-foreground" href="#trust">
              Trust
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex" size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </Container>
      </header>

      <HomepageHero />

      <Section tone="subtle">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Humans and agents"
            title="Built for humans and AI agents"
            description="The marketplace stays simple for people while giving AI agents structured ways to help with search, matching, briefs, and comparisons."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {humanAgentModel.map((item, index) => {
              const icons = [Users, Code2, CreditCard, LockKeyhole] as const;
              const Icon = icons[index];

              return (
                <Card className="rounded-lg" key={item.title}>
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section id="how-it-works">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="How it works"
            title="How Intelekt Marketplace works"
            description="Start with a real business problem, then use AI-assisted workflows to compare the people, products, agents, and packages that can solve it."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {howItWorksSteps.map((step, index) => (
              <Card className="rounded-lg" key={step.title}>
                <CardHeader>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    {index + 1}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 rounded-lg border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <SectionHeading
              eyebrow="Agents and developers"
              title="For AI agents and developers"
              description="Agents and developer teams can build on structured marketplace surfaces without making the homepage feel like API documentation."
            />
            <div className="grid gap-3">
              {developerLinks.map((link) => (
                <Button
                  asChild
                  className="h-auto justify-between whitespace-normal px-3 py-3 text-left"
                  key={link.href}
                  variant="outline"
                >
                  <Link href={link.href}>
                    <span>
                      <span className="block font-medium">{link.label}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Marketplace paths"
            title="Built for every side of AI work."
            description="Clients, freelancers, agencies, and product teams each get a clear surface without turning the marketplace into a noisy directory."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {audienceSections.map((section) => (
              <div id={section.id} key={section.id}>
                <AudiencePanel {...section} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Pricing model"
            title="Free for humans. Monetized through premium AI and agentic APIs."
            description="The basic marketplace stays open and approachable. Advanced AI outputs and high-value agent/API actions can unlock paid capabilities when needed."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {monetizationPoints.map((point) => (
              <Card className="rounded-lg" key={point}>
                <CardContent className="flex h-full gap-3 py-4">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  <p className="text-sm font-medium leading-6">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Popular outcomes"
            title="Start with the business result, then choose the delivery model."
          />
          <div className="flex flex-wrap gap-2">
            {popularOutcomes.map((outcome) => (
              <Badge
                className="rounded-lg border-border bg-card px-3 py-2 text-sm text-foreground"
                key={outcome}
                variant="outline"
              >
                {outcome}
              </Badge>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="raised">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Featured service packages"
            title="Productized AI work for clear scopes and faster starts."
            description="Placeholder listings live locally for now and can later be replaced by database-backed marketplace records."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {featuredServicePackages.map((servicePackage) => (
              <ServicePackageCard key={servicePackage.title} {...servicePackage} />
            ))}
          </div>
        </Container>
      </Section>

      <Section id="providers">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Featured providers"
            title="Freelancers, agencies, and implementation partners in one marketplace."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {featuredProviders.map((provider) => (
              <EntityCard
                key={provider.name}
                {...provider}
                icon={providerIcons[provider.icon]}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Featured AI products"
            title="Software options surfaced beside services and agents."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {featuredAiProducts.map((product) => (
              <AiProductCard key={product.name} {...product} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 rounded-lg border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <SectionHeading
              eyebrow="Free AI tools"
              title="Useful tools are coming for buyers and providers."
              description="The marketplace will include free planning tools that help teams scope better AI work before they spend."
            />
            <div className="grid gap-3">
              {freeTools.map((tool) => (
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3" key={tool}>
                  <Bot className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="trust" tone="raised">
        <Container className="space-y-8">
          <SectionHeading
            eyebrow="Trust and safety"
            title="Designed for cleaner matches and safer decisions."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <Card className="rounded-lg" key={item.title}>
                <CardHeader>
                  <ShieldCheck className="size-5 text-success" aria-hidden="true" />
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="rounded-lg bg-primary px-6 py-10 text-primary-foreground sm:px-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                  Find the right AI path without paying to enter the marketplace.
                </h2>
                <p className="mt-4 max-w-2xl text-primary-foreground/80">
                  Start as a client with a problem brief, or list your AI service,
                  agency, product, or agent for future matching.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/sign-up?intent=find-solution">
                    Find my AI solution
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/sign-up?intent=list-offer">List your offer</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
