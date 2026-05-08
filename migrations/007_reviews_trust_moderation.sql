CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  reviewer_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  rating integer NOT NULL,
  title text,
  body text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviews_status_check CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'archived'))
);

CREATE TABLE case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text,
  problem text,
  solution text,
  outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT case_studies_status_check CHECK (status IN ('draft', 'client_review', 'published', 'archived'))
);

CREATE TABLE verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES users(id) ON DELETE SET NULL,
  verification_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT verification_requests_type_check CHECK (verification_type IN ('identity', 'business', 'case_study', 'certification', 'security', 'custom')),
  CONSTRAINT verification_requests_status_check CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'expired'))
);

CREATE TABLE trust_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  icon text,
  criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT trust_badges_slug_not_blank CHECK (length(trim(slug)) > 0)
);

CREATE TABLE entity_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES marketplace_entities(id) ON DELETE CASCADE,
  trust_badge_id uuid NOT NULL REFERENCES trust_badges(id) ON DELETE CASCADE,
  awarded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  source_request_id uuid REFERENCES verification_requests(id) ON DELETE SET NULL,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entity_badges_status_check CHECK (status IN ('active', 'expired', 'revoked', 'hidden'))
);

CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reports_target_type_check CHECK (target_type IN ('entity', 'project', 'proposal', 'message', 'review', 'case_study', 'user', 'organization')),
  CONSTRAINT reports_status_check CHECK (status IN ('open', 'triaged', 'resolved', 'dismissed'))
);

CREATE TABLE moderation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  event_type text NOT NULL,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT moderation_events_target_type_check CHECK (target_type IN ('entity', 'project', 'proposal', 'message', 'review', 'case_study', 'user', 'organization', 'report')),
  CONSTRAINT moderation_events_type_check CHECK (event_type IN ('approved', 'rejected', 'hidden', 'restored', 'suspended', 'warned', 'assigned', 'resolved', 'note'))
);

COMMENT ON TABLE moderation_events IS 'Admin-only audit log of moderation decisions and policy actions.';

CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER case_studies_set_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER verification_requests_set_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trust_badges_set_updated_at BEFORE UPDATE ON trust_badges FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER entity_badges_set_updated_at BEFORE UPDATE ON entity_badges FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reports_set_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
