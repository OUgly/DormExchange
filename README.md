# DormXchange SLC Skin

## Getting Started

```
npm install
npm run dev
```

- Accent color lives in `tailwind.config.js`.
- Seed data in `data/listings.json`.
- Mock writes won't persist on Vercel.

## Deploying to Vercel

- See `VERCEL_DEPLOYMENT.md` for environment variables and webhook setup.

## Messaging (threads)

- New schema adds `message_threads`, `message_thread_participants`, and `messages` with RLS so only participants can see/write.
- Migrations: see `supabase/migrations/12_create_message_threads.sql`.
- Server actions:
  - `actionCreateOrGetThread` (app/(actions)/messages.ts): creates or reuses a thread for a listing and redirects to `/messages/[threadId]`.
  - `actionSendMessage` (app/(actions)/messages.ts): posts a message in a thread.
- UI:
  - `/messages`: redirects to first thread or shows empty state.
  - `/messages/[threadId]`: shows two-pane messages UI.

### Apply migrations

Run in Supabase SQL editor or via CLI:

1. Open/execute `supabase/migrations/12_create_message_threads.sql` in your project's SQL editor.
2. Ensure prior migrations for listings/images are applied (`09`, `10`).
3. Confirm RLS for `profiles` allows authenticated read so seller names can render.
