-- Real appointment bookings (TASKS.md Milestone 3) — a genuinely new,
-- write-capable entity, unlike the read-only content mirrors in
-- V2__content_tables.sql. Modeled with real typed columns (not a JSONB
-- passthrough) since staff need to query/filter by status and date, and
-- there's no existing static-data shape it needs to mirror.
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    source TEXT NOT NULL CHECK (source IN ('ONLINE', 'STAFF')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_business_id ON bookings (business_id);
CREATE INDEX idx_bookings_business_id_preferred_date ON bookings (business_id, preferred_date);
