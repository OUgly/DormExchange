Vercel Deployment Guide

Overview
- This codebase is configured for Vercel with Next.js App Router.
- API routes live under `app/api/*` and run on Vercel Serverless Functions.
- Stripe webhook is implemented at `app/api/stripe-webhook/route.ts` and runs on Node.js runtime.

Project Settings
- Framework: Next.js
- Build Command: `next build` (default)
- Install Command: `npm install` (default)
- Output Directory: `.next` (default)

Environment Variables (Project Settings → Environment Variables)
- NEXT_PUBLIC_SUPABASE_URL: Your Supabase URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anon key
- SUPABASE_SERVICE_ROLE_KEY: Supabase service role key (Server only)
- NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET: e.g. `avatars`
- STRIPE_SECRET_KEY: Your Stripe secret key (Test or Live)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key
- STRIPE_WEBHOOK_SECRET: Webhook signing secret for the endpoint below
- APP_URL: e.g. `https://your-domain.com`
- PLATFORM_FEE_BPS: e.g. `700`
- USE_STRIPE_CONNECT: `true` or `false`
- SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_FROM, CONTACT_TO: if email is used

Stripe Webhook
- Endpoint URL: `https://<your-vercel-domain>/api/stripe-webhook`
- In Stripe Dashboard → Developers → Webhooks: add the endpoint and copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
- The route verifies signatures when `STRIPE_WEBHOOK_SECRET` is present; otherwise it parses events unverified (for local development only).

Images
- Remote image patterns are allowed for Unsplash in `next.config.js`. Add more hosts there if needed.

Local Development
- Create a `.env.local` with the same variables above for local use.
- Run `npm run dev` and open http://localhost:3000.

Notes
- Cloudflare-specific files were removed (`wrangler.toml`, `functions/*`, `public/_headers`).
- If you used Cloudflare before, reconfigure Stripe to point at the new Vercel URL.

