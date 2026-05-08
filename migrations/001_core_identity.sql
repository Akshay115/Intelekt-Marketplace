CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL,
  email text NOT NULL,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user',
  status text NOT NULL DEFAULT 'active',
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'moderator')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'invited', 'suspended', 'deleted')),
  CONSTRAINT users_email_not_blank CHECK (length(trim(email)) > 0)
);

COMMENT ON TABLE users IS 'Application user profiles linked to InsForge auth users. Email and role metadata are private.';

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  type text NOT NULL DEFAULT 'client',
  website_url text,
  logo_url text,
  billing_email text,
  status text NOT NULL DEFAULT 'active',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT organizations_type_check CHECK (type IN ('client', 'agency', 'vendor', 'admin')),
  CONSTRAINT organizations_status_check CHECK (status IN ('active', 'invited', 'suspended', 'archived')),
  CONSTRAINT organizations_slug_not_blank CHECK (length(trim(slug)) > 0)
);

COMMENT ON TABLE organizations IS 'Client companies, provider agencies, vendor teams, and internal admin organizations.';

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  invited_by uuid REFERENCES users(id) ON DELETE SET NULL,
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organization_members_role_check CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  CONSTRAINT organization_members_status_check CHECK (status IN ('invited', 'active', 'removed', 'suspended')),
  CONSTRAINT organization_members_unique_member UNIQUE (organization_id, user_id)
);

COMMENT ON TABLE organization_members IS 'Organization membership and permission anchor for project and entity RLS.';

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER organizations_set_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER organization_members_set_updated_at
BEFORE UPDATE ON organization_members
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
