-- Internal staff-side accounts (Super Admin / Business Owner / Staff —
-- see TASKS.md Milestone 2). Kept entirely separate from `customers`:
-- a customer is a relationship to one business's public site, not an
-- account that manages anything.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    is_super_admin BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A user's relationship to one business: owner (full access) or staff
-- (log sales, manage bookings; can_view_full_analytics is an
-- owner-granted opt-in, meaningless for owner rows which always have
-- full access regardless of this flag).
CREATE TABLE business_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users (id),
    business_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'STAFF')),
    can_view_full_analytics BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, business_id)
);
CREATE INDEX idx_business_memberships_business_id ON business_memberships (business_id);

-- An end customer's account on one business's public site — separate
-- login realm from users/business_memberships (see TASKS.md Milestone
-- 6). Not wired to any auth endpoint yet; this is just the data model.
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (business_id, email)
);
