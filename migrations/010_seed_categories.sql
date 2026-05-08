INSERT INTO categories (name, slug, description, sort_order)
VALUES
  ('AI Automation', 'ai-automation', 'Workflow automation, operations copilots, and business process AI.', 10),
  ('Retrieval And Knowledge', 'retrieval-knowledge', 'RAG, knowledge assistants, internal search, and document intelligence.', 20),
  ('AI Agents', 'ai-agents', 'Autonomous and semi-autonomous agents for business workflows.', 30),
  ('Analytics And Intelligence', 'analytics-intelligence', 'Forecasting, reporting, decision intelligence, and data products.', 40),
  ('Customer Support AI', 'customer-support-ai', 'Support triage, response assistance, QA, and customer experience AI.', 50),
  ('Sales And Marketing AI', 'sales-marketing-ai', 'Lead scoring, content operations, sales copilots, and lifecycle automation.', 60),
  ('Engineering AI', 'engineering-ai', 'Developer tools, code agents, testing automation, and technical copilots.', 70),
  ('Governance And Safety', 'governance-safety', 'Evaluation, observability, policy, security, and AI risk management.', 80)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO industries (name, slug, description)
VALUES
  ('SaaS', 'saas', 'Software-as-a-service companies and product-led teams.'),
  ('Professional Services', 'professional-services', 'Consulting, agencies, advisory, and expert services.'),
  ('Healthcare', 'healthcare', 'Healthcare operations, care delivery, and regulated health workflows.'),
  ('Financial Services', 'financial-services', 'Banking, fintech, accounting, insurance, and finance operations.'),
  ('Retail And Ecommerce', 'retail-ecommerce', 'Retail, ecommerce, marketplaces, and consumer operations.'),
  ('Manufacturing', 'manufacturing', 'Manufacturing, supply chain, and industrial operations.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

INSERT INTO outcomes (name, slug, description, metric_hint)
VALUES
  ('Reduce Manual Work', 'reduce-manual-work', 'Automate repetitive operational work and reduce manual handoffs.', 'Hours saved per week'),
  ('Improve Response Time', 'improve-response-time', 'Shorten customer, sales, or internal response cycles.', 'Median response time'),
  ('Increase Lead Quality', 'increase-lead-quality', 'Improve qualification, routing, and conversion quality.', 'Qualified lead rate'),
  ('Accelerate Research', 'accelerate-research', 'Summarize, retrieve, and synthesize information faster.', 'Research cycle time'),
  ('Improve Compliance', 'improve-compliance', 'Reduce policy gaps, review errors, and audit risk.', 'Exception rate'),
  ('Launch AI Product', 'launch-ai-product', 'Design, build, and ship an AI-native product or feature.', 'Time to launch')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  metric_hint = EXCLUDED.metric_hint,
  updated_at = now();

INSERT INTO skills (name, slug, description, category_id)
SELECT skill.name, skill.slug, skill.description, categories.id
FROM (
  VALUES
    ('RAG Architecture', 'rag-architecture', 'Designing retrieval-augmented generation systems.', 'retrieval-knowledge'),
    ('AI Workflow Automation', 'ai-workflow-automation', 'Automating business processes with AI workflows.', 'ai-automation'),
    ('Agent Orchestration', 'agent-orchestration', 'Coordinating AI agents, tools, and handoffs.', 'ai-agents'),
    ('Prompt Evaluation', 'prompt-evaluation', 'Testing prompts and model behavior for reliability.', 'governance-safety'),
    ('LLM Observability', 'llm-observability', 'Monitoring quality, latency, cost, and failures in AI systems.', 'governance-safety'),
    ('AI Product Strategy', 'ai-product-strategy', 'Scoping and launching AI-native products.', 'analytics-intelligence')
) AS skill(name, slug, description, category_slug)
JOIN categories ON categories.slug = skill.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  updated_at = now();

INSERT INTO tools (name, slug, website_url, category)
VALUES
  ('OpenAI', 'openai', 'https://openai.com', 'model-provider'),
  ('OpenRouter', 'openrouter', 'https://openrouter.ai', 'model-router'),
  ('LangChain', 'langchain', 'https://www.langchain.com', 'framework'),
  ('n8n', 'n8n', 'https://n8n.io', 'automation'),
  ('Vercel', 'vercel', 'https://vercel.com', 'deployment'),
  ('InsForge', 'insforge', 'https://insforge.dev', 'backend')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  website_url = EXCLUDED.website_url,
  category = EXCLUDED.category,
  updated_at = now();
