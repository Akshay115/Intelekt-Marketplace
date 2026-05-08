export const heroStats = [
  { label: "Marketplace fee", value: "Free" },
  { label: "AI work types", value: "5" },
  { label: "Human approval", value: "Required" },
] as const;

export const howItWorksSteps = [
  {
    title: "Describe a business problem",
    description:
      "Share the business outcome, constraints, systems, and urgency in plain language.",
  },
  {
    title: "Get an AI-generated project brief",
    description:
      "Turn a rough need into a structured brief that providers and products can respond to.",
  },
  {
    title: "Compare delivery options",
    description:
      "Compare freelancers, agencies, products, agents, and service packages side by side.",
  },
  {
    title: "Generate proposals and plans",
    description:
      "Use AI to draft solution plans, proposal outlines, and implementation options.",
  },
  {
    title: "Work with the right team",
    description:
      "Move forward with humans, agents, or hybrid teams while keeping sensitive actions approved.",
  },
] as const;

export const humanAgentModel = [
  {
    title: "Humans use the free marketplace UI",
    description:
      "Clients, freelancers, agencies, and product companies can sign up, post, list, and browse through a simple web experience.",
  },
  {
    title: "AI agents use structured APIs",
    description:
      "Agents can search listings, match providers, generate briefs, compare proposals, and prepare recommendations.",
  },
  {
    title: "Premium API actions use x402",
    description:
      "Advanced reports and higher-value agent actions can be unlocked through x402-powered API payments.",
  },
  {
    title: "Sensitive actions require human approval",
    description:
      "Humans stay in control for commitments, payments, publication, and other sensitive marketplace actions.",
  },
] as const;

export const developerLinks = [
  {
    label: "For AI agents",
    href: "/for-ai-agents",
    description: "Marketplace access patterns for autonomous assistants.",
  },
  {
    label: "API docs",
    href: "/api-docs",
    description: "Structured search, matching, brief, and proposal endpoints.",
  },
  {
    label: "x402 developers",
    href: "/developers/x402",
    description: "Premium agent and API actions with payment unlocks.",
  },
  {
    label: "llms.txt",
    href: "/llms.txt",
    description: "Machine-readable guidance for AI crawlers and agents.",
  },
] as const;

export const monetizationPoints = [
  "Free signup",
  "Free profiles",
  "Free basic matching",
  "Free basic project posting",
  "Optional x402 unlocks for advanced AI reports and API actions",
] as const;

export const audienceSections = [
  {
    id: "clients",
    eyebrow: "For clients",
    title: "Turn business problems into AI options you can compare.",
    description:
      "Post a problem once and review practical paths across services, products, agents, and service packages.",
    points: ["Problem briefs", "Matched shortlists", "Outcome-first proposals"],
  },
  {
    id: "freelancers",
    eyebrow: "For freelancers",
    title: "Find clients who know the outcome before they ask for the tool.",
    description:
      "Show your AI delivery strengths and respond to briefs that match your skills, budget, and availability.",
    points: ["Verified profile", "Skill-based matching", "Service package listings"],
  },
  {
    id: "agencies",
    eyebrow: "For agencies",
    title: "List your AI team where buyers are already describing demand.",
    description:
      "Present capabilities, case studies, team depth, and productized offers for larger AI initiatives.",
    points: ["Agency profile", "Case study proof", "Team capability matching"],
  },
  {
    id: "products",
    eyebrow: "For AI products",
    title: "Meet buyers searching by problem, not just category.",
    description:
      "Position your AI product against real business outcomes and surface alongside service options.",
    points: ["Product listings", "Use-case matching", "Implementation partner paths"],
  },
] as const;

export const popularOutcomes = [
  "Customer support automation",
  "Sales research copilots",
  "Knowledge base search",
  "Document review workflows",
  "Finance close automation",
  "Recruiting screeners",
  "Operations reporting",
  "Internal AI agents",
] as const;

export const featuredServicePackages = [
  {
    title: "AI Support Triage Sprint",
    description:
      "Deploy an inbox triage workflow with routing rules, summaries, and escalation logic.",
    price: "$3,500",
    timeline: "10 days",
    outcomes: ["Workflow map", "Agent prompt stack", "Analytics handoff"],
  },
  {
    title: "Enterprise RAG Readiness",
    description:
      "Audit content sources and define a retrieval architecture for internal teams.",
    price: "$5,800",
    timeline: "2 weeks",
    outcomes: ["Knowledge audit", "Model routing plan", "Evaluation rubric"],
  },
  {
    title: "Sales Copilot Prototype",
    description:
      "Build a lead research and account planning copilot connected to your CRM workflow.",
    price: "$4,200",
    timeline: "12 days",
    outcomes: ["CRM workflow", "Research prompts", "Pilot dashboard"],
  },
] as const;

export const featuredProviders = [
  {
    name: "Northstar AI Studio",
    type: "AI agency",
    metric: "98% match",
    description:
      "Builds internal copilots, retrieval systems, and evaluation workflows for operations teams.",
    tags: ["RAG", "Workflow AI", "Enterprise"],
    icon: "agency",
  },
  {
    name: "Maya Chen",
    type: "AI freelancer",
    metric: "Top rated",
    description:
      "Ships AI automations for sales, support, and finance teams with measurable time savings.",
    tags: ["Automation", "CRM", "Agents"],
    icon: "freelancer",
  },
  {
    name: "Kaito Systems",
    type: "AI implementation partner",
    metric: "Fast start",
    description:
      "Connects AI products to messy internal systems with careful rollout and enablement.",
    tags: ["Integrations", "Enablement", "Ops"],
    icon: "partner",
  },
] as const;

export const featuredAiProducts = [
  {
    name: "Atlas Intake Agent",
    category: "Brief builder",
    description:
      "Turns messy business requests into structured scopes, requirements, and match criteria.",
    tags: ["Scoping", "Matching", "Projects"],
  },
  {
    name: "LedgerLens",
    category: "Finance automation",
    description:
      "Reviews invoices, reconciliations, and close notes for exceptions before finance review.",
    tags: ["Finance", "Review", "Controls"],
  },
  {
    name: "Support Signal",
    category: "Customer operations",
    description:
      "Clusters support issues, drafts responses, and highlights process gaps for service teams.",
    tags: ["Support", "Insights", "Triage"],
  },
] as const;

export const freeTools = [
  "AI project brief generator",
  "Vendor comparison checklist",
  "ROI estimate worksheet",
] as const;

export const trustItems = [
  {
    title: "Verified marketplace profiles",
    description: "Provider, agency, and product listings are structured around proof and fit.",
  },
  {
    title: "Brief-first matching",
    description: "Clients start with outcomes, constraints, and risks before choosing a vendor.",
  },
  {
    title: "Transparent shortlists",
    description: "Compare service, product, and agent paths without paying to access the marketplace.",
  },
] as const;
