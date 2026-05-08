# Intelekt Marketplace Database Schema Plan

This document plans the relational schema for Intelekt Marketplace. It is not a migration file and should not be applied directly. The goal is to clarify table responsibilities, relationships, indexing, row-level security (RLS), and visibility before implementation.

## Migration Files

Initial planning migrations have been created under `migrations/`:

- `001_core_identity.sql`
- `002_marketplace_entities.sql`
- `003_taxonomy.sql`
- `004_profiles.sql`
- `005_projects.sql`
- `006_proposals_and_messaging.sql`
- `007_reviews_trust_moderation.sql`
- `008_ai_tables.sql`
- `009_indexes.sql`
- `010_seed_categories.sql`

These files define the planned tables, check constraints, foreign keys, comments, timestamps, update triggers, search indexes, and starter taxonomy seed data. They do not include RLS policies yet; RLS should be added in a dedicated follow-up migration once the app access patterns are implemented and tested.

Note: the `embeddings` migration uses `double precision[]` for portable PostgreSQL compatibility. If the target InsForge database has `pgvector` enabled, this column should be migrated to `vector(<dimensions>)` and indexed with HNSW or IVFFlat.

## Shared Conventions

- Primary keys: `id uuid primary key default gen_random_uuid()`.
- Timestamps: `created_at timestamptz`, `updated_at timestamptz`, plus soft-delete `deleted_at timestamptz` where records need auditability.
- Ownership fields: use `created_by`, `organization_id`, `entity_id`, or `project_id` to anchor RLS decisions.
- Status fields: use constrained enums or check constraints when migrations are created.
- Public marketplace records should never expose private contact details, internal notes, payment identifiers, admin metadata, raw AI prompts containing sensitive input, or service-role-only fields.
- RLS should default to deny, with explicit policies for public reads, authenticated owner access, organization member access, provider access, and admin moderation access.

## Core Identity And Organizations

### `users`

- Purpose: Application user profile record linked to InsForge auth users.
- Important fields: `id`, `auth_user_id`, `email`, `display_name`, `avatar_url`, `role`, `status`, `last_seen_at`, `created_at`, `updated_at`.
- Relationships: One user can own `client_profiles`, belong to many `organizations` through `organization_members`, send `messages`, submit `reviews`, and trigger `ai_tasks`.
- Indexes: Unique `auth_user_id`; unique lowercased `email`; index `status`; index `last_seen_at`.
- RLS considerations: Users can read/update their own profile; organization members can read limited teammate profile fields; admins can read all.
- Visibility rules: Public only exposes `display_name`, `avatar_url`, and marketplace-safe identity fields. Email and role metadata are private.

### `organizations`

- Purpose: Client companies, provider agencies, vendor teams, and internal admin organizations.
- Important fields: `id`, `name`, `slug`, `type`, `website_url`, `logo_url`, `billing_email`, `status`, `created_by`, `created_at`, `updated_at`.
- Relationships: Has many `organization_members`, `projects`, `marketplace_entities`, `agency_profiles`, and `client_profiles`.
- Indexes: Unique `slug`; index `type`; index `created_by`; index `status`.
- RLS considerations: Organization members can read org records; owners/admins can update; public can read only verified public provider orgs.
- Visibility rules: Public fields include name, slug, logo, website, and verified public profile data. Billing email and internal status notes are private.

### `organization_members`

- Purpose: Membership and permissions for users inside organizations.
- Important fields: `id`, `organization_id`, `user_id`, `role`, `status`, `invited_by`, `joined_at`, `created_at`.
- Relationships: Joins `users` to `organizations`; drives RLS for projects, proposals, conversations, and entities owned by an organization.
- Indexes: Unique `(organization_id, user_id)`; index `user_id`; index `(organization_id, role)`; index `status`.
- RLS considerations: Members can read membership for their org; owners/admins can manage membership; users can see their own memberships.
- Visibility rules: Private to organization members and admins.

## Marketplace Entity Model

### `marketplace_entities`

- Purpose: Unified marketplace listing for freelancers, agencies, products, AI agents, and service providers.
- Important fields: `id`, `owner_user_id`, `organization_id`, `entity_type`, `name`, `slug`, `headline`, `description`, `avatar_url`, `cover_url`, `status`, `verification_status`, `visibility`, `published_at`, `created_at`, `updated_at`.
- Relationships: Parent for `freelancer_profiles`, `agency_profiles`, `product_profiles`, `agent_profiles`, `service_packages`, taxonomy join tables, `reviews`, `case_studies`, and `entity_badges`.
- Indexes: Unique `slug`; index `entity_type`; index `(status, visibility)`; index `verification_status`; full-text index on `name`, `headline`, `description`.
- RLS considerations: Public can read published visible entities; owners and org admins can manage drafts; admins can moderate all.
- Visibility rules: Published public fields are visible. Drafts, verification notes, internal scores, and moderation metadata are private.

### `freelancer_profiles`

- Purpose: Freelancer-specific profile data.
- Important fields: `id`, `entity_id`, `user_id`, `hourly_rate_min`, `hourly_rate_max`, `availability`, `timezone`, `experience_years`, `portfolio_url`, `response_time_hours`.
- Relationships: One-to-one with `marketplace_entities`; links to `users`.
- Indexes: Unique `entity_id`; index `user_id`; index `availability`; index rate range fields.
- RLS considerations: Public reads only when parent entity is published; owner can update; admins can review.
- Visibility rules: Public excludes private contact channels and internal availability notes.

### `agency_profiles`

- Purpose: Agency-specific profile data.
- Important fields: `id`, `entity_id`, `organization_id`, `team_size`, `founded_year`, `headquarters`, `delivery_model`, `minimum_project_budget`, `website_url`.
- Relationships: One-to-one with `marketplace_entities`; belongs to `organizations`.
- Indexes: Unique `entity_id`; index `organization_id`; index `minimum_project_budget`; index `team_size`.
- RLS considerations: Public reads only published agency entities; org owners/admins update.
- Visibility rules: Public profile data is visible; billing and internal team member details remain private.

### `product_profiles`

- Purpose: AI software product listings.
- Important fields: `id`, `entity_id`, `product_url`, `pricing_model`, `free_trial_available`, `deployment_type`, `integration_notes`, `support_level`.
- Relationships: One-to-one with `marketplace_entities`; can be matched to projects and appear in shortlists.
- Indexes: Unique `entity_id`; index `pricing_model`; index `deployment_type`; index `free_trial_available`.
- RLS considerations: Published products are public; owners manage; admins moderate.
- Visibility rules: Public fields include product positioning and pricing model. Private roadmap or vendor-only docs stay private.

### `agent_profiles`

- Purpose: AI agent listings, including agent capabilities and constraints.
- Important fields: `id`, `entity_id`, `agent_type`, `capabilities`, `supported_tools`, `deployment_mode`, `input_requirements`, `safety_notes`, `demo_url`.
- Relationships: One-to-one with `marketplace_entities`; connects to `workflow_templates` and `ai_model_performance`.
- Indexes: Unique `entity_id`; GIN index on `capabilities`; index `agent_type`; index `deployment_mode`.
- RLS considerations: Public reads published agent cards; owners manage; sensitive safety evaluations are admin/private.
- Visibility rules: Public capabilities and demos are visible. Internal prompts, secrets, and safety test details are private.

### `service_packages`

- Purpose: Productized services offered by freelancers, agencies, or entity owners.
- Important fields: `id`, `entity_id`, `title`, `slug`, `description`, `deliverables`, `starting_price`, `currency`, `timeline_days`, `revision_policy`, `status`.
- Relationships: Belongs to `marketplace_entities`; can be shortlisted, proposed, reviewed, and linked to milestones.
- Indexes: Unique `(entity_id, slug)`; index `status`; index `starting_price`; index `timeline_days`; full-text index on title/description.
- RLS considerations: Public can read active packages on published entities; owners manage drafts; admins moderate.
- Visibility rules: Public package details are visible. Internal pricing notes and unpublished drafts are private.

### `workflow_templates`

- Purpose: Reusable AI/service workflow templates for delivery packages and agent workflows.
- Important fields: `id`, `entity_id`, `name`, `description`, `template_type`, `steps`, `inputs_schema`, `outputs_schema`, `visibility`, `status`.
- Relationships: Belongs to `marketplace_entities`; can power `service_packages` and `ai_tasks`.
- Indexes: Index `entity_id`; index `template_type`; GIN index on `steps` and schemas.
- RLS considerations: Public reads only public active templates; owners/admins manage; private templates visible to owning organization.
- Visibility rules: Public templates show high-level steps only. Internal automation details, prompts, and credentials are private.

## Taxonomy

### `categories`

- Purpose: Top-level marketplace taxonomy such as AI automation, RAG, analytics, operations, sales, support.
- Important fields: `id`, `name`, `slug`, `description`, `parent_id`, `sort_order`, `is_active`.
- Relationships: Can be referenced by entities and projects later; self-references for hierarchy.
- Indexes: Unique `slug`; index `parent_id`; index `(is_active, sort_order)`.
- RLS considerations: Public read active categories; admin write.
- Visibility rules: Public.

### `skills`

- Purpose: Skill taxonomy for providers and matching.
- Important fields: `id`, `name`, `slug`, `description`, `category_id`, `is_active`.
- Relationships: Many-to-many with entities via `entity_skills`; can later connect to projects.
- Indexes: Unique `slug`; index `category_id`; full-text index on `name`.
- RLS considerations: Public read active skills; admin write.
- Visibility rules: Public.

### `tools`

- Purpose: Tool/platform taxonomy such as OpenAI, LangChain, n8n, HubSpot, Slack, Vercel.
- Important fields: `id`, `name`, `slug`, `website_url`, `category`, `is_active`.
- Relationships: Many-to-many with entities via `entity_tools`.
- Indexes: Unique `slug`; index `category`; index `is_active`.
- RLS considerations: Public read active tools; admin write.
- Visibility rules: Public.

### `industries`

- Purpose: Industry taxonomy for matching and marketplace filtering.
- Important fields: `id`, `name`, `slug`, `description`, `is_active`.
- Relationships: Many-to-many with entities via `entity_industries`; can later attach to client profiles and projects.
- Indexes: Unique `slug`; index `is_active`.
- RLS considerations: Public read active industries; admin write.
- Visibility rules: Public.

### `outcomes`

- Purpose: Business outcome taxonomy such as reduce support time, increase lead quality, automate reporting.
- Important fields: `id`, `name`, `slug`, `description`, `metric_hint`, `is_active`.
- Relationships: Many-to-many with entities via `entity_outcomes`; can support project matching.
- Indexes: Unique `slug`; index `is_active`; full-text index on `name`, `description`.
- RLS considerations: Public read active outcomes; admin write.
- Visibility rules: Public.

### `entity_skills`

- Purpose: Join table between marketplace entities and skills.
- Important fields: `id`, `entity_id`, `skill_id`, `proficiency`, `evidence_url`, `created_at`.
- Relationships: Joins `marketplace_entities` to `skills`.
- Indexes: Unique `(entity_id, skill_id)`; index `skill_id`; index `proficiency`.
- RLS considerations: Public reads only when entity is public; entity owners manage; admins moderate.
- Visibility rules: Public except evidence or verification notes if marked private.

### `entity_tools`

- Purpose: Join table between marketplace entities and tools.
- Important fields: `id`, `entity_id`, `tool_id`, `experience_level`, `certification_url`, `created_at`.
- Relationships: Joins `marketplace_entities` to `tools`.
- Indexes: Unique `(entity_id, tool_id)`; index `tool_id`; index `experience_level`.
- RLS considerations: Public reads only when entity is public; entity owners manage.
- Visibility rules: Public except private certification proof.

### `entity_industries`

- Purpose: Join table between marketplace entities and industries.
- Important fields: `id`, `entity_id`, `industry_id`, `case_count`, `created_at`.
- Relationships: Joins `marketplace_entities` to `industries`.
- Indexes: Unique `(entity_id, industry_id)`; index `industry_id`; index `case_count`.
- RLS considerations: Public reads only when entity is public; owners manage.
- Visibility rules: Public.

### `entity_outcomes`

- Purpose: Join table between marketplace entities and business outcomes.
- Important fields: `id`, `entity_id`, `outcome_id`, `confidence_score`, `evidence_summary`, `created_at`.
- Relationships: Joins `marketplace_entities` to `outcomes`.
- Indexes: Unique `(entity_id, outcome_id)`; index `outcome_id`; index `confidence_score`.
- RLS considerations: Public reads curated outcome mappings on public entities; owners suggest; admins verify.
- Visibility rules: Public confidence bands may be shown; raw scoring and admin notes stay private.

## Client And Project Workflow

### `client_profiles`

- Purpose: Client-side buyer profile for matching context.
- Important fields: `id`, `user_id`, `organization_id`, `company_size`, `role_title`, `buying_stage`, `preferred_budget_range`, `preferred_delivery_model`.
- Relationships: Belongs to `users` or `organizations`; owns or creates `projects`.
- Indexes: Unique nullable patterns for `user_id` and `organization_id`; index `buying_stage`.
- RLS considerations: Client user/org members can read and update; providers cannot read unless attached to shared project context.
- Visibility rules: Private except limited project-facing context shared during proposal workflows.

### `projects`

- Purpose: Client demand records for marketplace matching.
- Important fields: `id`, `client_profile_id`, `organization_id`, `created_by`, `title`, `summary`, `status`, `budget_min`, `budget_max`, `currency`, `target_start_date`, `visibility`.
- Relationships: Has one or many `project_briefs`, `project_matches`, `project_shortlists`, `proposals`, `conversations`, `milestones`, `files`, and `reviews`.
- Indexes: Index `organization_id`; index `created_by`; index `status`; index budget range; full-text index on `title`, `summary`.
- RLS considerations: Client org members read/manage; matched providers read limited project fields; admins can read all.
- Visibility rules: Private by default. Public/open briefs should hide client identity unless explicitly published.

### `project_briefs`

- Purpose: Structured intake generated from client input and AI scoping.
- Important fields: `id`, `project_id`, `version`, `problem_statement`, `goals`, `constraints`, `requirements`, `success_metrics`, `raw_input`, `created_by`, `created_at`.
- Relationships: Belongs to `projects`; can feed `ai_tasks`, `project_matches`, and `proposals`.
- Indexes: Unique `(project_id, version)`; index `project_id`; GIN indexes on structured JSON fields.
- RLS considerations: Client org members and explicitly matched providers can read approved brief versions; raw input is client/admin only.
- Visibility rules: Approved brief summary can be shared; raw intake and sensitive constraints are private.

### `project_matches`

- Purpose: AI and human-generated provider/product/package match recommendations.
- Important fields: `id`, `project_id`, `entity_id`, `service_package_id`, `match_score`, `match_reasons`, `risk_flags`, `status`, `generated_by_task_id`.
- Relationships: Links `projects` to marketplace entities/packages and `ai_tasks`.
- Indexes: Unique nullable match key `(project_id, entity_id, service_package_id)`; index `match_score`; index `status`.
- RLS considerations: Client org members read; providers read only their own match if invited/visible; admins read all.
- Visibility rules: Client sees explanations. Providers may see invitation context but not all comparative scoring.

### `project_shortlists`

- Purpose: Client-curated shortlist of matched providers/products/packages.
- Important fields: `id`, `project_id`, `entity_id`, `service_package_id`, `added_by`, `notes`, `status`, `created_at`.
- Relationships: Links projects to entities/packages; may lead to proposals/conversations.
- Indexes: Unique `(project_id, entity_id, service_package_id)`; index `added_by`; index `status`.
- RLS considerations: Client org members manage; shortlisted provider can see invitation if status allows.
- Visibility rules: Private to client until invite/share state is set.

### `proposals`

- Purpose: Provider responses to client projects.
- Important fields: `id`, `project_id`, `entity_id`, `submitted_by`, `title`, `approach`, `timeline_days`, `price_amount`, `currency`, `status`, `submitted_at`.
- Relationships: Belongs to projects and marketplace entities; can create milestones and conversations.
- Indexes: Index `project_id`; index `entity_id`; index `status`; index `submitted_at`.
- RLS considerations: Client org members and proposal-owning provider can read; provider can manage drafts; client can accept/reject.
- Visibility rules: Private between project client, proposal provider, and admins.

### `conversations`

- Purpose: Message thread for project-provider communication.
- Important fields: `id`, `project_id`, `entity_id`, `proposal_id`, `type`, `status`, `created_by`, `last_message_at`.
- Relationships: Has many `messages`; optionally linked to project, entity, and proposal.
- Indexes: Index `project_id`; index `entity_id`; index `proposal_id`; index `last_message_at`.
- RLS considerations: Only participants, client org members, provider owners, and admins can read/write.
- Visibility rules: Private.

### `messages`

- Purpose: Individual messages inside conversations.
- Important fields: `id`, `conversation_id`, `sender_user_id`, `body`, `message_type`, `metadata`, `read_at`, `created_at`, `deleted_at`.
- Relationships: Belongs to `conversations`; sender is `users`; may reference `project_files`.
- Indexes: Index `(conversation_id, created_at)`; index `sender_user_id`; GIN index on metadata if queried.
- RLS considerations: Conversation participants can read; sender can edit/delete within policy; admins can moderate.
- Visibility rules: Private. Moderation-safe excerpts may be available to admins.

### `project_milestones`

- Purpose: Delivery phases, acceptance checkpoints, and payment-style progress tracking.
- Important fields: `id`, `project_id`, `proposal_id`, `title`, `description`, `due_date`, `amount`, `currency`, `status`, `accepted_at`.
- Relationships: Belongs to projects and proposals; may link to files and reviews.
- Indexes: Index `project_id`; index `proposal_id`; index `status`; index `due_date`.
- RLS considerations: Client org and proposal provider can read; both parties have role-specific update rights.
- Visibility rules: Private to project participants and admins.

### `project_files`

- Purpose: File metadata for briefs, proposals, deliverables, and message attachments.
- Important fields: `id`, `project_id`, `uploaded_by`, `storage_bucket`, `storage_key`, `file_name`, `mime_type`, `size_bytes`, `visibility`, `created_at`.
- Relationships: Belongs to projects; uploaded by users; storage object lives in InsForge Storage.
- Indexes: Index `project_id`; index `uploaded_by`; index `(storage_bucket, storage_key)`; index `visibility`.
- RLS considerations: Storage RLS must match database permissions; project participants read according to visibility.
- Visibility rules: Private by default; provider/client shared visibility must be explicit.

## Trust, Reviews, And Moderation

### `reviews`

- Purpose: Client/provider reviews after project completion.
- Important fields: `id`, `project_id`, `entity_id`, `reviewer_user_id`, `rating`, `title`, `body`, `status`, `published_at`.
- Relationships: Belongs to projects and marketplace entities; reviewer is user.
- Indexes: Index `entity_id`; index `project_id`; index `rating`; index `(status, published_at)`.
- RLS considerations: Participants can create eligible reviews; public reads published reviews; admins moderate.
- Visibility rules: Published reviews are public. Drafts, reports, and moderation notes are private.

### `case_studies`

- Purpose: Curated proof of work and outcome stories.
- Important fields: `id`, `entity_id`, `project_id`, `title`, `summary`, `problem`, `solution`, `outcomes`, `metrics`, `status`, `published_at`.
- Relationships: Belongs to entity; optionally derived from project.
- Indexes: Index `entity_id`; index `project_id`; index `(status, published_at)`; full-text index on text fields.
- RLS considerations: Public reads published case studies; owners can draft; clients may need approval if project-derived.
- Visibility rules: Public only after approval. Sensitive client names/metrics require explicit consent.

### `verification_requests`

- Purpose: Provider/entity verification workflow.
- Important fields: `id`, `entity_id`, `requested_by`, `verification_type`, `status`, `submitted_data`, `reviewed_by`, `reviewed_at`, `notes`.
- Relationships: Belongs to marketplace entity; requested/reviewed by users; can grant trust badges.
- Indexes: Index `entity_id`; index `status`; index `verification_type`; index `reviewed_by`.
- RLS considerations: Entity owners can create/read their requests; admins review; public cannot read.
- Visibility rules: Private. Public sees resulting verification status/badges only.

### `trust_badges`

- Purpose: Badge definitions such as Verified AI Expert, Enterprise Ready, Fast Responder.
- Important fields: `id`, `name`, `slug`, `description`, `icon`, `criteria`, `is_active`.
- Relationships: Assigned to entities via `entity_badges`.
- Indexes: Unique `slug`; index `is_active`.
- RLS considerations: Public read active badge definitions; admin write.
- Visibility rules: Public.

### `entity_badges`

- Purpose: Badge assignments to marketplace entities.
- Important fields: `id`, `entity_id`, `trust_badge_id`, `awarded_by`, `source_request_id`, `expires_at`, `status`, `created_at`.
- Relationships: Joins `marketplace_entities` to `trust_badges`; may originate from verification request.
- Indexes: Unique active `(entity_id, trust_badge_id)`; index `trust_badge_id`; index `status`; index `expires_at`.
- RLS considerations: Public reads active badges on public entities; admins manage; owners can read badge history.
- Visibility rules: Active badges public; expired/rejected/internal notes private.

### `reports`

- Purpose: User-generated reports for listings, messages, projects, reviews, or proposals.
- Important fields: `id`, `reporter_user_id`, `target_type`, `target_id`, `reason`, `details`, `status`, `assigned_to`, `resolved_at`.
- Relationships: Polymorphic target; reporter and assigned admin are users; can create moderation events.
- Indexes: Index `reporter_user_id`; index `(target_type, target_id)`; index `status`; index `assigned_to`.
- RLS considerations: Reporter can see their report status; admins read/manage all; reported party cannot read report details.
- Visibility rules: Private to reporter and moderation team.

### `moderation_events`

- Purpose: Audit log of moderation decisions and policy actions.
- Important fields: `id`, `actor_user_id`, `target_type`, `target_id`, `event_type`, `reason`, `metadata`, `created_at`.
- Relationships: Polymorphic target; actor is admin/moderator user.
- Indexes: Index `actor_user_id`; index `(target_type, target_id)`; index `event_type`; index `created_at`.
- RLS considerations: Admin-only read/write; no public access.
- Visibility rules: Private admin audit log.

## AI Operations And Observability

### `ai_tasks`

- Purpose: Tracks async AI work such as brief structuring, matching, summarization, moderation, and embeddings.
- Important fields: `id`, `task_type`, `status`, `requested_by`, `organization_id`, `project_id`, `entity_id`, `input_ref`, `output_ref`, `error_message`, `created_at`, `completed_at`.
- Relationships: Can reference projects, entities, users, generations, model runs, and embeddings.
- Indexes: Index `task_type`; index `status`; index `requested_by`; index `project_id`; index `created_at`.
- RLS considerations: Requesting user/org can read their task summaries; admins can read all; raw inputs restricted.
- Visibility rules: Private operational data. Public never sees raw AI task payloads.

### `ai_generations`

- Purpose: Stores generated outputs and metadata for addressable AI generations.
- Important fields: `id`, `task_id`, `prompt_version_id`, `input_hash`, `output`, `output_type`, `status`, `created_by`, `created_at`.
- Relationships: Belongs to `ai_tasks` and `ai_prompt_versions`; can have multiple `ai_model_runs`.
- Indexes: Index `task_id`; index `prompt_version_id`; index `input_hash`; index `status`.
- RLS considerations: Visible only to owning user/org and admins; generated content may inherit source object permissions.
- Visibility rules: Private by default. Only explicitly published AI outputs can be shown publicly.

### `ai_model_runs`

- Purpose: Provider/model-level execution log for each AI request.
- Important fields: `id`, `generation_id`, `provider`, `model`, `input_tokens`, `output_tokens`, `latency_ms`, `cost_usd`, `status`, `error_code`, `created_at`.
- Relationships: Belongs to `ai_generations`; feeds `ai_model_performance`.
- Indexes: Index `generation_id`; index `(provider, model)`; index `status`; index `created_at`.
- RLS considerations: Admin and owning org read summaries; cost/provider details may be admin-only.
- Visibility rules: Private operational telemetry.

### `ai_model_performance`

- Purpose: Aggregated model quality, latency, cost, and routing performance by task type.
- Important fields: `id`, `provider`, `model`, `task_type`, `window_start`, `window_end`, `success_rate`, `avg_latency_ms`, `avg_cost_usd`, `quality_score`.
- Relationships: Aggregated from `ai_model_runs`; informs model routing.
- Indexes: Unique `(provider, model, task_type, window_start, window_end)`; index `task_type`; index `quality_score`.
- RLS considerations: Admin-only write; product team/admin read; not needed for end users.
- Visibility rules: Private internal analytics.

### `ai_prompt_versions`

- Purpose: Versioned prompt templates for matching, brief generation, moderation, and summaries.
- Important fields: `id`, `prompt_key`, `version`, `title`, `system_prompt`, `template`, `variables_schema`, `status`, `created_by`, `created_at`.
- Relationships: Referenced by `ai_generations`; can be evaluated against model performance.
- Indexes: Unique `(prompt_key, version)`; index `status`; index `created_by`.
- RLS considerations: Admin/product team write; no public access; service code can read active prompts.
- Visibility rules: Private. Prompt templates and system instructions are not public.

### `embeddings`

- Purpose: Vector store for semantic search, matching, recommendations, and RAG.
- Important fields: `id`, `source_type`, `source_id`, `embedding_model`, `embedding vector`, `content_hash`, `content_preview`, `metadata`, `created_at`.
- Relationships: Polymorphic source to entities, service packages, projects, briefs, case studies, and messages.
- Indexes: Vector index such as HNSW/IVFFlat on `embedding`; unique `(source_type, source_id, embedding_model, content_hash)`; index `source_type`; GIN index `metadata`.
- RLS considerations: Embedding rows inherit source object permissions; vector search functions must filter by caller visibility before returning results.
- Visibility rules: Private by default. Public search can query embeddings only for public marketplace sources.
