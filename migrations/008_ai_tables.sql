CREATE TABLE ai_prompt_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_key text NOT NULL,
  version integer NOT NULL,
  title text NOT NULL,
  system_prompt text,
  template text NOT NULL,
  variables_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_prompt_versions_version_check CHECK (version > 0),
  CONSTRAINT ai_prompt_versions_status_check CHECK (status IN ('draft', 'active', 'archived')),
  CONSTRAINT ai_prompt_versions_unique UNIQUE (prompt_key, version)
);

CREATE TABLE ai_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  requested_by uuid REFERENCES users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  entity_id uuid REFERENCES marketplace_entities(id) ON DELETE SET NULL,
  input_ref jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_ref jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT ai_tasks_type_check CHECK (task_type IN ('brief_structuring', 'matching', 'summarization', 'moderation', 'embedding', 'generation', 'evaluation')),
  CONSTRAINT ai_tasks_status_check CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled'))
);

CREATE TABLE ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES ai_tasks(id) ON DELETE SET NULL,
  prompt_version_id uuid REFERENCES ai_prompt_versions(id) ON DELETE SET NULL,
  input_hash text,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_type text NOT NULL DEFAULT 'json',
  status text NOT NULL DEFAULT 'created',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_generations_output_type_check CHECK (output_type IN ('text', 'json', 'markdown', 'embedding', 'classification')),
  CONSTRAINT ai_generations_status_check CHECK (status IN ('created', 'accepted', 'rejected', 'archived'))
);

CREATE TABLE ai_model_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id uuid REFERENCES ai_generations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  model text NOT NULL,
  input_tokens integer,
  output_tokens integer,
  latency_ms integer,
  cost_usd numeric(12,6),
  status text NOT NULL DEFAULT 'succeeded',
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_model_runs_token_check CHECK ((input_tokens IS NULL OR input_tokens >= 0) AND (output_tokens IS NULL OR output_tokens >= 0)),
  CONSTRAINT ai_model_runs_latency_check CHECK (latency_ms IS NULL OR latency_ms >= 0),
  CONSTRAINT ai_model_runs_cost_check CHECK (cost_usd IS NULL OR cost_usd >= 0),
  CONSTRAINT ai_model_runs_status_check CHECK (status IN ('succeeded', 'failed', 'cancelled'))
);

CREATE TABLE ai_model_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  model text NOT NULL,
  task_type text NOT NULL,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  success_rate numeric(5,2),
  avg_latency_ms numeric(12,2),
  avg_cost_usd numeric(12,6),
  quality_score numeric(5,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_model_performance_window_check CHECK (window_start < window_end),
  CONSTRAINT ai_model_performance_rate_check CHECK (success_rate IS NULL OR (success_rate >= 0 AND success_rate <= 100)),
  CONSTRAINT ai_model_performance_quality_check CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 100)),
  CONSTRAINT ai_model_performance_unique UNIQUE (provider, model, task_type, window_start, window_end)
);

CREATE TABLE embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_id uuid NOT NULL,
  embedding_model text NOT NULL,
  embedding double precision[] NOT NULL,
  content_hash text NOT NULL,
  content_preview text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT embeddings_source_type_check CHECK (source_type IN ('marketplace_entity', 'service_package', 'project', 'project_brief', 'case_study', 'message', 'review')),
  CONSTRAINT embeddings_unique UNIQUE (source_type, source_id, embedding_model, content_hash)
);

COMMENT ON TABLE embeddings IS 'Semantic search storage. Uses double precision arrays for portable PostgreSQL; migrate to pgvector vector type if the extension is enabled.';

ALTER TABLE project_matches
  ADD CONSTRAINT project_matches_generated_by_task_fk
  FOREIGN KEY (generated_by_task_id) REFERENCES ai_tasks(id) ON DELETE SET NULL;

CREATE TRIGGER ai_prompt_versions_set_updated_at BEFORE UPDATE ON ai_prompt_versions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ai_tasks_set_updated_at BEFORE UPDATE ON ai_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ai_generations_set_updated_at BEFORE UPDATE ON ai_generations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ai_model_performance_set_updated_at BEFORE UPDATE ON ai_model_performance FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER embeddings_set_updated_at BEFORE UPDATE ON embeddings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
