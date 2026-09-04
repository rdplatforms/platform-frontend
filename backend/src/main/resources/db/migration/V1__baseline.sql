-- Baseline migration: proves Flyway/Postgres wiring works end-to-end.
-- Real content tables land in TASK-003.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
