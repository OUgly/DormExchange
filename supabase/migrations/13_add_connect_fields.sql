-- Stripe Connect fields for marketplace payouts
BEGIN;

-- Seller onboarding + payouts status
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS seller_stripe_account_id text,
  ADD COLUMN IF NOT EXISTS seller_charges_enabled boolean DEFAULT false NOT NULL;

-- Optional: track the Stripe Payment Intent on listings for reconciliation
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS payment_intent_id text;

COMMIT;

