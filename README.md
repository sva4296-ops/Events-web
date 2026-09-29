# povestea-web

Web RSVP page for PovesteaNoastra. A guest opens the personal link from their WhatsApp invite
(`https://povesteanoastra.ro/i/<token>`), sees the invitation, and answers **Confirm** / **Nu pot
ajunge** with no login and no app install.

## How it works

- Every `event_guests` row in Supabase has its own `invite_token` (32 hex chars). The app puts it in
  the WhatsApp message (`utils/whatsappInvite.ts` in the Events repo).
- This site reads and writes **only** through two RPCs granted to `anon`, both scoped to the single
  row the token names: `get_invite_by_token` and `respond_to_invite_by_token`
  (Events repo: `supabase/migrations/20260929000001_guest_invite_tokens.sql`).
- All Supabase calls run server-side (server component + server action) with the anon key. There is
  no user session and no service-role key anywhere in this project.

## Routes

| Route | What |
| --- | --- |
| `/` | Landing (redirects to `/events` when signed in) |
| `/i/[token]` | No-login invitation + RSVP from the personal WhatsApp link |
| `/login`, `/login/verify` | Phone number + SMS code (Supabase OTP, same account as the app) |
| `/welcome` | One-time first/last name step (same gate as the app's `complete-profile`) |
| `/events` | My invitations + events I host |
| `/invite/[id]` | Signed-in RSVP (pending/declined guests land here) |
| `/event/[id]` | Event pages, only for the owner or a confirmed guest: home (Acasă), `/details` (+ `/details/[section]`: schedule, location, menu, seating, lodging, vendors), `/fund`, `/chat` (Realtime), `/live` (photo upload), `/album` |
| `/account` | Name + sign out |

Guest-side parity with the app. Organizer-only features (create event, edit details, post moments,
manage guests, pricing) are not on the web yet; owners can browse their event read-only.

## Auth and data

- `src/proxy.ts` refreshes the Supabase session cookie on every request (`@supabase/ssr`).
- Server Components read with `src/lib/supabase/server.ts` (the user's session, so RLS applies
  exactly as in the app). Writes are Server Actions in `src/lib/actions/`.
- The browser client (`src/lib/supabase/browser.ts`) is only used for OTP login, Chat Realtime and
  Storage uploads (Live).
- The token page uses the anon client (`src/lib/supabase/anon.ts`) and the two token RPCs only.

## Setup

```bash
cp .env.example .env.local   # fill in the same URL + anon key as the app
yarn
yarn dev                     # http://localhost:3000/i/<token>
```

Checks: `yarn lint`, `yarn tsc --noEmit`, `yarn build`.

The migrations `20260929000001` and `20260929000002` must be applied to Supabase first (`supabase db push` from the Events repo),
otherwise every link shows "Invitația nu a fost găsită".

## Deploy

Vercel: import the repo, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then
point `povesteanoastra.ro` at it.
