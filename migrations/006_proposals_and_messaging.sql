CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  submitted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  approach text,
  timeline_days integer,
  price_amount numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'draft',
  submitted_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT proposals_timeline_check CHECK (timeline_days IS NULL OR timeline_days > 0),
  CONSTRAINT proposals_price_check CHECK (price_amount IS NULL OR price_amount >= 0),
  CONSTRAINT proposals_status_check CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn', 'archived'))
);

COMMENT ON TABLE proposals IS 'Provider responses to client projects. Private between project client, provider, and admins.';

CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  entity_id uuid REFERENCES marketplace_entities(id) ON DELETE SET NULL,
  proposal_id uuid REFERENCES proposals(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'project',
  status text NOT NULL DEFAULT 'open',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT conversations_type_check CHECK (type IN ('project', 'proposal', 'support', 'moderation')),
  CONSTRAINT conversations_status_check CHECK (status IN ('open', 'closed', 'archived'))
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  body text,
  message_type text NOT NULL DEFAULT 'text',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT messages_type_check CHECK (message_type IN ('text', 'file', 'system', 'proposal_update', 'milestone_update'))
);

CREATE TABLE project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES proposals(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_date date,
  amount numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'planned',
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT project_milestones_amount_check CHECK (amount IS NULL OR amount >= 0),
  CONSTRAINT project_milestones_status_check CHECK (status IN ('planned', 'in_progress', 'submitted', 'accepted', 'revision_requested', 'cancelled'))
);

CREATE TABLE project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  storage_bucket text NOT NULL,
  storage_key text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  visibility text NOT NULL DEFAULT 'private',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT project_files_size_check CHECK (size_bytes IS NULL OR size_bytes >= 0),
  CONSTRAINT project_files_visibility_check CHECK (visibility IN ('private', 'client', 'provider', 'project_participants', 'public'))
);

CREATE TRIGGER proposals_set_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER conversations_set_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER messages_set_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_milestones_set_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_files_set_updated_at BEFORE UPDATE ON project_files FOR EACH ROW EXECUTE FUNCTION set_updated_at();
