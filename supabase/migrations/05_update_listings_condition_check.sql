-- Migration: update listings condition check constraint
-- Drops the existing constraint (if any) and creates a new one that
-- allows the canonical slugs used by the app and common human-readable labels.
-- Run this SQL in your Supabase SQL editor or apply via your migration tooling.

BEGIN;

ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_condition_check;

ALTER TABLE public.listings
  ADD CONSTRAINT listings_condition_check CHECK (
    condition IS NULL
    OR condition IN (
      -- canonical slugs used by the app
      'new','like_new','good','fair','poor','used',
      -- common human-readable labels (kept for compatibility)
      'New','Like New','Good','Fair','Poor','Used'
    )
  );

COMMIT;

-- Notes:
-- 1) This migration only changes the constraint. It does not modify existing
--    data. If you prefer an enum type or a stricter canonical set, replace the
--    CHECK with an enum migration.
-- 2) After running this, retry creating a listing from the app. If you still
--    get constraint errors, run the inspection SQL below to see the live
--    constraint definition.

-- Helpful SQL to inspect the constraint directly in your database:
-- SELECT conname, pg_get_constraintdef(c.oid) AS definition
-- FROM pg_constraint c
-- JOIN pg_class t ON c.conrelid = t.oid
-- WHERE t.relname = 'listings' AND c.contype = 'c';
