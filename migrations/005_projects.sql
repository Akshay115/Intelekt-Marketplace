CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_profile_id uuid REFERENCES client_profiles(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text,
  status text NOT NULL DEFAULT 'draft',
  budget_min numeric(12,2),
  budget_max numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'USD',
  target_start_date date,
  visibility text NOT NULL DEFAULT 'private',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT projects_status_check CHECK (status IN ('draft', 'matching', 'shortlisting', 'proposal_review', 'active', 'completed', 'cancelled', 'archived')),
  CONSTRAINT projects_visibility_check CHECK (visibility IN ('private', 'invited', 'public')),
  CONSTRAINT projects_budget_check CHECK (budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max)
);

COMMENT ON TABLE projects IS 'Client demand records used for matching, proposals, messaging, milestones, and reviews.';

CREATE TABLE project_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  problem_statement text NOT NULL,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  constraints jsonb NOT NULL DEFAULT '[]'::jsonb,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  success_metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  raw_input text,
  visibility text NOT NULL DEFAULT 'private',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_briefs_unique_version UNIQUE (project_id, version),
  CONSTRAINT project_briefs_version_check CHECK (version > 0),
  CONSTRAINT project_briefs_visibility_check CHECK (visibility IN ('private', 'shared', 'public_summary'))
);

CREATE TABLE project_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  service_package_id uuid REFERENCES service_packages(id) ON DELETE SET NULL,
  match_score numeric(5,2),
  match_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  risk_flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'suggested',
  generated_by_task_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_matches_target_check CHECK (entity_id IS NOT NULL OR service_package_id IS NOT NULL),
  CONSTRAINT project_matches_score_check CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100)),
  CONSTRAINT project_matches_status_check CHECK (status IN ('suggested', 'shortlisted', 'invited', 'dismissed', 'accepted'))
);

CREATE TABLE project_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  service_package_id uuid REFERENCES service_packages(id) ON DELETE SET NULL,
  added_by uuid REFERENCES users(id) ON DELETE SET NULL,
  notes text,
  status text NOT NULL DEFAULT 'saved',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_shortlists_target_check CHECK (entity_id IS NOT NULL OR service_package_id IS NOT NULL),
  CONSTRAINT project_shortlists_status_check CHECK (status IN ('saved', 'invited', 'removed', 'selected'))
);

CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_briefs_set_updated_at BEFORE UPDATE ON project_briefs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_matches_set_updated_at BEFORE UPDATE ON project_matches FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_shortlists_set_updated_at BEFORE UPDATE ON project_shortlists FOR EACH ROW EXECUTE FUNCTION set_updated_at();
