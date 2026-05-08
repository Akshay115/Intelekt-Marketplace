CREATE TABLE marketplace_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  headline text,
  description text,
  avatar_url text,
  cover_url text,
  status text NOT NULL DEFAULT 'draft',
  verification_status text NOT NULL DEFAULT 'unverified',
  visibility text NOT NULL DEFAULT 'private',
  internal_notes text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT marketplace_entities_type_check CHECK (entity_type IN ('freelancer', 'agency', 'product', 'agent', 'service_provider')),
  CONSTRAINT marketplace_entities_status_check CHECK (status IN ('draft', 'pending_review', 'published', 'suspended', 'archived')),
  CONSTRAINT marketplace_entities_verification_check CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected', 'expired')),
  CONSTRAINT marketplace_entities_visibility_check CHECK (visibility IN ('private', 'unlisted', 'public')),
  CONSTRAINT marketplace_entities_owner_check CHECK (owner_user_id IS NOT NULL OR organization_id IS NOT NULL)
);

COMMENT ON TABLE marketplace_entities IS 'Unified marketplace listing table for freelancers, agencies, products, agents, and service providers.';

CREATE TABLE service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  starting_price numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'USD',
  timeline_days integer,
  revision_policy text,
  status text NOT NULL DEFAULT 'draft',
  visibility text NOT NULL DEFAULT 'private',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT service_packages_status_check CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  CONSTRAINT service_packages_visibility_check CHECK (visibility IN ('private', 'unlisted', 'public')),
  CONSTRAINT service_packages_price_check CHECK (starting_price IS NULL OR starting_price >= 0),
  CONSTRAINT service_packages_timeline_check CHECK (timeline_days IS NULL OR timeline_days > 0),
  CONSTRAINT service_packages_unique_slug UNIQUE (entity_id, slug)
);

COMMENT ON TABLE service_packages IS 'Productized services offered by marketplace entities.';

CREATE TABLE workflow_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  service_package_id uuid REFERENCES service_packages(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  template_type text NOT NULL DEFAULT 'delivery',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  inputs_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  outputs_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  visibility text NOT NULL DEFAULT 'private',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT workflow_templates_type_check CHECK (template_type IN ('delivery', 'agent', 'matching', 'intake', 'evaluation')),
  CONSTRAINT workflow_templates_visibility_check CHECK (visibility IN ('private', 'organization', 'public')),
  CONSTRAINT workflow_templates_status_check CHECK (status IN ('draft', 'active', 'archived'))
);

COMMENT ON TABLE workflow_templates IS 'Reusable workflow templates for service delivery, AI agents, and matching operations.';

CREATE TRIGGER marketplace_entities_set_updated_at
BEFORE UPDATE ON marketplace_entities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER service_packages_set_updated_at
BEFORE UPDATE ON service_packages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER workflow_templates_set_updated_at
BEFORE UPDATE ON workflow_templates
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
