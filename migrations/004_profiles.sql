CREATE TABLE freelancer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  hourly_rate_min numeric(12,2),
  hourly_rate_max numeric(12,2),
  availability text NOT NULL DEFAULT 'available',
  timezone text,
  experience_years integer,
  portfolio_url text,
  response_time_hours integer,
  private_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT freelancer_profiles_availability_check CHECK (availability IN ('available', 'limited', 'unavailable')),
  CONSTRAINT freelancer_profiles_rate_check CHECK (hourly_rate_min IS NULL OR hourly_rate_max IS NULL OR hourly_rate_min <= hourly_rate_max),
  CONSTRAINT freelancer_profiles_experience_check CHECK (experience_years IS NULL OR experience_years >= 0)
);

CREATE TABLE agency_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  team_size integer,
  founded_year integer,
  headquarters text,
  delivery_model text,
  minimum_project_budget numeric(12,2),
  website_url text,
  private_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT agency_profiles_team_size_check CHECK (team_size IS NULL OR team_size >= 0),
  CONSTRAINT agency_profiles_budget_check CHECK (minimum_project_budget IS NULL OR minimum_project_budget >= 0)
);

CREATE TABLE product_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  product_url text,
  pricing_model text NOT NULL DEFAULT 'custom',
  free_trial_available boolean NOT NULL DEFAULT false,
  deployment_type text NOT NULL DEFAULT 'saas',
  integration_notes text,
  support_level text,
  private_roadmap text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_profiles_pricing_model_check CHECK (pricing_model IN ('free', 'usage', 'subscription', 'one_time', 'custom')),
  CONSTRAINT product_profiles_deployment_type_check CHECK (deployment_type IN ('saas', 'self_hosted', 'hybrid', 'api', 'agent'))
);

CREATE TABLE agent_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL UNIQUE REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  agent_type text NOT NULL DEFAULT 'assistant',
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  supported_tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  deployment_mode text NOT NULL DEFAULT 'hosted',
  input_requirements text,
  safety_notes text,
  demo_url text,
  internal_prompt_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT agent_profiles_agent_type_check CHECK (agent_type IN ('assistant', 'workflow', 'research', 'automation', 'support', 'custom')),
  CONSTRAINT agent_profiles_deployment_mode_check CHECK (deployment_mode IN ('hosted', 'customer_cloud', 'self_hosted', 'hybrid'))
);

CREATE TABLE client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  company_size text,
  role_title text,
  buying_stage text NOT NULL DEFAULT 'exploring',
  preferred_budget_range text,
  preferred_delivery_model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT client_profiles_owner_check CHECK (user_id IS NOT NULL OR organization_id IS NOT NULL),
  CONSTRAINT client_profiles_buying_stage_check CHECK (buying_stage IN ('exploring', 'scoping', 'ready_to_buy', 'active')),
  CONSTRAINT client_profiles_delivery_model_check CHECK (preferred_delivery_model IS NULL OR preferred_delivery_model IN ('freelancer', 'agency', 'product', 'agent', 'service_package', 'mixed'))
);

CREATE TRIGGER freelancer_profiles_set_updated_at BEFORE UPDATE ON freelancer_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER agency_profiles_set_updated_at BEFORE UPDATE ON agency_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER product_profiles_set_updated_at BEFORE UPDATE ON product_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER agent_profiles_set_updated_at BEFORE UPDATE ON agent_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER client_profiles_set_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
