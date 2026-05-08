CREATE UNIQUE INDEX users_auth_user_id_idx ON users (auth_user_id);
CREATE UNIQUE INDEX users_email_lower_idx ON users (lower(email));
CREATE INDEX users_status_idx ON users (status);

CREATE UNIQUE INDEX organizations_slug_idx ON organizations (slug);
CREATE INDEX organizations_type_idx ON organizations (type);
CREATE INDEX organizations_status_idx ON organizations (status);
CREATE INDEX organizations_created_by_idx ON organizations (created_by);

CREATE INDEX organization_members_user_id_idx ON organization_members (user_id);
CREATE INDEX organization_members_organization_role_idx ON organization_members (organization_id, role);
CREATE INDEX organization_members_status_idx ON organization_members (status);

CREATE UNIQUE INDEX marketplace_entities_slug_idx ON marketplace_entities (slug);
CREATE INDEX marketplace_entities_entity_type_idx ON marketplace_entities (entity_type);
CREATE INDEX marketplace_entities_status_visibility_idx ON marketplace_entities (status, visibility);
CREATE INDEX marketplace_entities_owner_user_id_idx ON marketplace_entities (owner_user_id);
CREATE INDEX marketplace_entities_organization_id_idx ON marketplace_entities (organization_id);
CREATE INDEX marketplace_entities_verification_status_idx ON marketplace_entities (verification_status);
CREATE INDEX marketplace_entities_search_idx ON marketplace_entities USING gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(headline, '') || ' ' || coalesce(description, '')));

CREATE INDEX service_packages_entity_id_idx ON service_packages (entity_id);
CREATE INDEX service_packages_status_idx ON service_packages (status);
CREATE INDEX service_packages_price_idx ON service_packages (starting_price);
CREATE INDEX service_packages_search_idx ON service_packages USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE INDEX workflow_templates_entity_id_idx ON workflow_templates (entity_id);
CREATE INDEX workflow_templates_type_idx ON workflow_templates (template_type);
CREATE INDEX workflow_templates_status_idx ON workflow_templates (status);
CREATE INDEX workflow_templates_steps_gin_idx ON workflow_templates USING gin (steps);

CREATE UNIQUE INDEX categories_slug_idx ON categories (slug);
CREATE INDEX categories_parent_id_idx ON categories (parent_id);
CREATE INDEX categories_active_sort_idx ON categories (is_active, sort_order);
CREATE UNIQUE INDEX skills_slug_idx ON skills (slug);
CREATE INDEX skills_category_id_idx ON skills (category_id);
CREATE INDEX skills_search_idx ON skills USING gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
CREATE UNIQUE INDEX tools_slug_idx ON tools (slug);
CREATE INDEX tools_category_idx ON tools (category);
CREATE UNIQUE INDEX industries_slug_idx ON industries (slug);
CREATE UNIQUE INDEX outcomes_slug_idx ON outcomes (slug);
CREATE INDEX outcomes_search_idx ON outcomes USING gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

CREATE INDEX entity_skills_skill_id_idx ON entity_skills (skill_id);
CREATE INDEX entity_tools_tool_id_idx ON entity_tools (tool_id);
CREATE INDEX entity_industries_industry_id_idx ON entity_industries (industry_id);
CREATE INDEX entity_outcomes_outcome_id_idx ON entity_outcomes (outcome_id);

CREATE INDEX freelancer_profiles_user_id_idx ON freelancer_profiles (user_id);
CREATE INDEX freelancer_profiles_availability_idx ON freelancer_profiles (availability);
CREATE INDEX agency_profiles_organization_id_idx ON agency_profiles (organization_id);
CREATE INDEX agency_profiles_minimum_budget_idx ON agency_profiles (minimum_project_budget);
CREATE INDEX product_profiles_pricing_model_idx ON product_profiles (pricing_model);
CREATE INDEX product_profiles_deployment_type_idx ON product_profiles (deployment_type);
CREATE INDEX agent_profiles_agent_type_idx ON agent_profiles (agent_type);
CREATE INDEX agent_profiles_capabilities_gin_idx ON agent_profiles USING gin (capabilities);
CREATE INDEX client_profiles_user_id_idx ON client_profiles (user_id);
CREATE INDEX client_profiles_organization_id_idx ON client_profiles (organization_id);

CREATE INDEX projects_organization_id_idx ON projects (organization_id);
CREATE INDEX projects_created_by_idx ON projects (created_by);
CREATE INDEX projects_status_idx ON projects (status);
CREATE INDEX projects_visibility_idx ON projects (visibility);
CREATE INDEX projects_budget_idx ON projects (budget_min, budget_max);
CREATE INDEX projects_search_idx ON projects USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '')));
CREATE INDEX project_briefs_project_id_idx ON project_briefs (project_id);
CREATE INDEX project_matches_project_id_idx ON project_matches (project_id);
CREATE INDEX project_matches_entity_id_idx ON project_matches (entity_id);
CREATE INDEX project_matches_score_idx ON project_matches (match_score);
CREATE INDEX project_matches_status_idx ON project_matches (status);
CREATE INDEX project_shortlists_project_id_idx ON project_shortlists (project_id);
CREATE INDEX project_shortlists_status_idx ON project_shortlists (status);

CREATE INDEX proposals_project_id_idx ON proposals (project_id);
CREATE INDEX proposals_entity_id_idx ON proposals (entity_id);
CREATE INDEX proposals_status_idx ON proposals (status);
CREATE INDEX proposals_submitted_at_idx ON proposals (submitted_at);
CREATE INDEX conversations_project_id_idx ON conversations (project_id);
CREATE INDEX conversations_entity_id_idx ON conversations (entity_id);
CREATE INDEX conversations_last_message_at_idx ON conversations (last_message_at);
CREATE INDEX messages_conversation_created_at_idx ON messages (conversation_id, created_at);
CREATE INDEX messages_sender_user_id_idx ON messages (sender_user_id);
CREATE INDEX project_milestones_project_id_idx ON project_milestones (project_id);
CREATE INDEX project_milestones_status_idx ON project_milestones (status);
CREATE INDEX project_files_project_id_idx ON project_files (project_id);
CREATE INDEX project_files_storage_key_idx ON project_files (storage_bucket, storage_key);

CREATE INDEX reviews_entity_id_idx ON reviews (entity_id);
CREATE INDEX reviews_status_published_idx ON reviews (status, published_at);
CREATE INDEX case_studies_entity_id_idx ON case_studies (entity_id);
CREATE INDEX case_studies_status_published_idx ON case_studies (status, published_at);
CREATE UNIQUE INDEX trust_badges_slug_idx ON trust_badges (slug);
CREATE UNIQUE INDEX entity_badges_active_unique_idx ON entity_badges (entity_id, trust_badge_id) WHERE status = 'active';
CREATE INDEX reports_target_idx ON reports (target_type, target_id);
CREATE INDEX reports_status_idx ON reports (status);
CREATE INDEX moderation_events_target_idx ON moderation_events (target_type, target_id);
CREATE INDEX moderation_events_created_at_idx ON moderation_events (created_at);

CREATE INDEX ai_tasks_type_idx ON ai_tasks (task_type);
CREATE INDEX ai_tasks_status_idx ON ai_tasks (status);
CREATE INDEX ai_tasks_project_id_idx ON ai_tasks (project_id);
CREATE INDEX ai_generations_task_id_idx ON ai_generations (task_id);
CREATE INDEX ai_generations_prompt_version_id_idx ON ai_generations (prompt_version_id);
CREATE INDEX ai_model_runs_generation_id_idx ON ai_model_runs (generation_id);
CREATE INDEX ai_model_runs_provider_model_idx ON ai_model_runs (provider, model);
CREATE INDEX ai_model_performance_task_type_idx ON ai_model_performance (task_type);
CREATE INDEX embeddings_source_idx ON embeddings (source_type, source_id);
CREATE INDEX embeddings_metadata_gin_idx ON embeddings USING gin (metadata);
