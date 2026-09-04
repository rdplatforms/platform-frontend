-- Read-only mirror of static-data/*.json (TASK-003). Each row's `data`
-- column holds the full record as JSON, verbatim — field-for-field
-- fidelity with the corresponding type in packages/types/src/*.ts is
-- guaranteed by construction (it IS that JSON), not by hand-modeling
-- every nested union type (LocalizableText, BusinessHours[], etc.) into
-- columns. The few native columns that exist are purely for lookup/
-- indexing. See backend/README.md for the reasoning and when this
-- should evolve into real normalized columns (once write/admin CRUD
-- needs field-level validation, not before).

CREATE TABLE businesses (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    data JSONB NOT NULL
);

CREATE TABLE service_items (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE INDEX idx_service_items_business_id ON service_items (business_id);

CREATE TABLE gallery_items (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE INDEX idx_gallery_items_business_id ON gallery_items (business_id);

CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE INDEX idx_testimonials_business_id ON testimonials (business_id);

CREATE TABLE faq_items (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE INDEX idx_faq_items_business_id ON faq_items (business_id);

CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    data JSONB NOT NULL
);
CREATE INDEX idx_team_members_business_id ON team_members (business_id);

-- One row per business (singletons) — business_id IS the primary key.
CREATE TABLE business_themes (
    business_id TEXT PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE seo_configs (
    business_id TEXT PRIMARY KEY,
    data JSONB NOT NULL
);

CREATE TABLE business_settings (
    business_id TEXT PRIMARY KEY,
    data JSONB NOT NULL
);

-- A business can have multiple pages (PageConfig has no own `id` field in
-- packages/types — natural key is businessId+path), so this is the one
-- table here needing a synthetic PK.
CREATE TABLE page_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL,
    path TEXT NOT NULL,
    data JSONB NOT NULL,
    UNIQUE (business_id, path)
);
CREATE INDEX idx_page_configs_business_id ON page_configs (business_id);
