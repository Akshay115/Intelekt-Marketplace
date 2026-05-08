import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  ClipboardList,
  ExternalLink,
  Gauge,
  Layers3,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

import {
  Container,
  EmptyState,
  LoadingState,
  PageHeader,
  Section,
} from "@/components/layout";
import {
  CategoryPill,
  EntityCard,
  ProjectCard,
  ProposalCard,
  ServicePackageCard,
  TrustBadge,
} from "@/components/marketplace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  { label: "Freelancers", icon: Users, active: true },
  { label: "Agencies", icon: Building2 },
  { label: "AI agents", icon: Bot },
  { label: "Products", icon: Layers3 },
  { label: "Packages", icon: PackageCheck },
];

const entities = [
  {
    name: "Northstar AI Studio",
    type: "AI agency",
    metric: "98% match",
    description:
      "Builds internal copilots, retrieval systems, and evaluation workflows for operations teams.",
    tags: ["RAG", "Workflow AI", "Enterprise"],
    icon: Building2,
  },
  {
    name: "Maya Chen",
    type: "AI freelancer",
    metric: "Top rated",
    description:
      "Ships AI automations for sales, support, and finance teams with measurable time savings.",
    tags: ["Automation", "CRM", "Agents"],
    icon: Users,
  },
  {
    name: "Atlas Intake Agent",
    type: "AI agent",
    metric: "Free trial",
    description:
      "Turns messy project briefs into structured scopes, requirements, and match criteria.",
    tags: ["Scoping", "Briefs", "Matching"],
    icon: Bot,
  },
];

const pipeline = [
  ["Customer support AI triage", "Matching", "12 candidates"],
  ["Procurement knowledge assistant", "Shortlisted", "4 proposals"],
  ["Finance close automation", "Discovery", "7 matches"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <span className="font-semibold">Intelekt Marketplace</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#marketplace">
              Marketplace
            </a>
            <a className="transition hover:text-foreground" href="#projects">
              Projects
            </a>
            <a className="transition hover:text-foreground" href="#dashboard">
              Dashboard
            </a>
          </nav>
          <Button variant="outline" size="sm">
            Workspace
          </Button>
        </Container>
      </header>

      <Section className="overflow-hidden pb-10 pt-14 sm:pt-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
            <PageHeader
              eyebrow="AI-native marketplace"
              title="Describe the problem. Match with the right AI builder."
              description="Intelekt Marketplace connects client business problems with AI freelancers, agencies, products, agents, and productized service packages."
              actions={
                <>
                  <Button size="lg">
                    Start a brief
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Browse marketplace
                  </Button>
                </>
              }
            />

            <Card className="bg-card/90 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>AI matching console</CardTitle>
                    <CardDescription>Placeholder product surface</CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    Live design system
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3">
                  <Input placeholder="Find AI builders, agents, products..." />
                  <Textarea placeholder="We need to reduce customer response time without replacing our support team." />
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex h-8 flex-1 items-center rounded-lg border border-input px-3 text-sm text-muted-foreground">
                      Operations
                    </div>
                    <Button className="sm:w-40">
                      Match
                      <WandSparkles className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                <Alert className="border-primary/20 bg-primary/5">
                  <BrainCircuit className="size-4 text-primary" aria-hidden="true" />
                  <AlertTitle>Auto-routed AI layer</AlertTitle>
                  <AlertDescription>
                    Matching workflows are prepared for OpenRouter free auto routing.
                  </AlertDescription>
                </Alert>
                <div className="flex flex-wrap gap-2">
                  <TrustBadge label="Verified profiles" detail="Human-reviewed" />
                  <TrustBadge label="Outcome scoped" detail="Brief-first matching" icon={Gauge} />
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="marketplace" tone="subtle">
        <Container className="space-y-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Badge variant="outline" className="mb-3">
                Marketplace categories
              </Badge>
              <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                Browse AI delivery options
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Placeholder inventory for the provider, product, agent, and package
                surfaces that will power client matching.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryPill
                  active={category.active}
                  icon={category.icon}
                  key={category.label}
                  label={category.label}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {entities.map((entity) => (
              <EntityCard key={entity.name} {...entity} />
            ))}
          </div>
        </Container>
      </Section>

      <Section id="projects">
        <Container>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal">
                Curated work formats
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Project, proposal, and service package cards share one design language.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <ServicePackageCard
                  title="AI Support Triage Sprint"
                  description="Deploy a scoped routing assistant for support inboxes and escalation rules."
                  price="$3,500"
                  timeline="10 days"
                  outcomes={["Workflow map", "Agent prompt stack", "Analytics handoff"]}
                />
                <ServicePackageCard
                  title="Enterprise RAG Readiness"
                  description="Audit content sources and define a retrieval architecture for internal teams."
                  price="$5,800"
                  timeline="2 weeks"
                  outcomes={["Knowledge audit", "Model routing plan", "Evaluation rubric"]}
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <ProjectCard
                  title="Vendor risk review copilot"
                  stage="Open"
                  budget="$12k - $18k"
                  timeline="6 weeks"
                  description="A procurement team needs AI assistance reviewing vendor docs, exceptions, and policy gaps."
                />
                <ProjectCard
                  title="Sales call insight engine"
                  stage="Draft"
                  budget="$8k - $14k"
                  timeline="4 weeks"
                  description="A revenue team wants call summaries, objections, and next-best actions pushed into CRM."
                />
              </div>
              <div className="space-y-3">
                <ProposalCard
                  provider="Vector North"
                  score="96%"
                  estimate="$9.5k"
                  summary="Strong fit for structured data extraction, review workflows, and internal enablement."
                />
                <ProposalCard
                  provider="Ava Systems"
                  score="91%"
                  estimate="$11k"
                  summary="Best aligned with agent orchestration and post-launch measurement."
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="dashboard" tone="raised">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Client project pipeline</CardTitle>
              <CardDescription>Table styles for dashboard and admin surfaces.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Signal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pipeline.map(([project, status, signal]) => (
                    <TableRow key={project}>
                      <TableCell className="font-medium">{project}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {signal}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <EmptyState
              icon={ClipboardList}
              title="No saved shortlist yet"
              description="Shortlisted providers, products, and packages will appear here once matching is implemented."
              actionLabel="Create shortlist"
            />
            <LoadingState rows={2} />
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="rounded-lg">
                  <AvatarFallback className="rounded-lg bg-brand-blue/15 text-brand-blue">
                    IM
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Marketplace ops</p>
                  <p className="truncate text-sm text-muted-foreground">
                    Trust, matching, reviews, and case studies
                  </p>
                </div>
                <Button size="icon" variant="ghost" aria-label="Open marketplace ops">
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <footer className="border-t py-8">
        <Container className="flex flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>Intelekt Marketplace</span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            Premium marketplace foundation
          </span>
        </Container>
      </footer>
    </main>
  );
}
