CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_slug_not_blank CHECK (length(trim(slug)) > 0)
);

COMMENT ON TABLE categories IS 'Top-level and nested marketplace categories used for discovery and matching.';

CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT skills_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  website_url text,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tools_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT industries_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  metric_hint text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT outcomes_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE entity_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency text NOT NULL DEFAULT 'working',
  evidence_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_skills_proficiency_check CHECK (proficiency IN ('learning', 'working', 'advanced', 'expert')),
  CONSTRAINT entity_skills_unique UNIQUE (entity_id, skill_id)
);

CREATE TABLE entity_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  experience_level text NOT NULL DEFAULT 'working',
  certification_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_tools_experience_check CHECK (experience_level IN ('learning', 'working', 'advanced', 'expert')),
  CONSTRAINT entity_tools_unique UNIQUE (entity_id, tool_id)
);

CREATE TABLE entity_industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  industry_id uuid NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  case_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_industries_case_count_check CHECK (case_count >= 0),
  CONSTRAINT entity_industries_unique UNIQUE (entity_id, industry_id)
);

CREATE TABLE entity_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  outcome_id uuid NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
  confidence_score numeric(5,2),
  evidence_summary text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_outcomes_confidence_check CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100)),
  CONSTRAINT entity_outcomes_unique UNIQUE (entity_id, outcome_id)
);

CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER skills_set_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tools_set_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER industries_set_updated_at BEFORE UPDATE ON industries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER outcomes_set_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER entity_skills_set_updated_at BEFORE UPDATE ON entity_skills FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER entity_tools_set_updated_at BEFORE UPDATE ON entity_tools FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER entity_industries_set_updated_at BEFORE UPDATE ON entity_industries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER entity_outcomes_set_updated_at BEFORE UPDATE ON entity_outcomes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
