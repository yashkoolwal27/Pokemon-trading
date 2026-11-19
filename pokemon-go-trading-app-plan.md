# Pokémon GO Trading App — Build Plan (for Google Antigravity IDE)

## 1. Product Summary
A web/mobile app where Pokémon GO players list **what they WANT** and **what they can GIVE**. The system automatically finds compatible trade partners, and matched players can chat to arrange the trade (via in-game friend codes).

**Core loop:** Sign up → set Want list + Give list → see matches → chat → mark trade done → rate partner.

---

## 2. Recommended Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (React) + Tailwind CSS | Fast to build, works as PWA on phones |
| Backend | Next.js API routes (or Node/Express) | One codebase, simple |
| Database | PostgreSQL (Supabase) | Relational data fits matching well |
| Auth | Supabase Auth (email + Google) | Ready-made |
| Realtime chat | Supabase Realtime (WebSockets) | No separate chat server needed |
| Pokémon data | PokeAPI (names, sprites, dex numbers) | Free, cached into our DB |
| Hosting | Vercel + Supabase | Free tiers to start |

---

## 3. Core Features

### MVP (Phase 1–3)
1. Auth and profile (username, friend code, region/city, trainer level, team)
2. Want list — pick Pokémon (with optional filters: shiny, lucky, shadow, specific form)
3. Give list — pick Pokémon you can trade away (same filters + quantity)
4. **Matching engine** (see section 5)
5. Match feed with compatibility score
6. 1-to-1 realtime chat
7. Trade status: Proposed → Accepted → Completed / Cancelled
8. Ratings and reviews after trade

### Phase 2 (after MVP)
- Block/report users, moderation
- Push/email notifications for new matches
- 3-way trade matching (A→B→C→A)
- Trade history
- Distance/region filter
- Friend code copy button, "Add as friend" instructions

---

## 4. Database Schema

```sql
users(id, username, friend_code, country, city, team, level, avatar_url, created_at)

pokemon(id, dex_number, name, form, sprite_url, is_tradeable)   -- seeded from PokeAPI

user_wants(id, user_id, pokemon_id, variant, priority, created_at)
-- variant: normal | shiny | lucky | shadow | purified

user_gives(id, user_id, pokemon_id, variant, quantity, created_at)

matches(id, user_a, user_b, a_gets_pokemon_id, b_gets_pokemon_id, score, status, created_at)
-- status: suggested | proposed | accepted | completed | cancelled

conversations(id, match_id, created_at)
messages(id, conversation_id, sender_id, body, created_at, read_at)

ratings(id, match_id, rater_id, rated_id, stars, comment, created_at)
reports(id, reporter_id, reported_id, reason, created_at)
blocks(blocker_id, blocked_id)
```

Indexes: `user_wants(pokemon_id, variant)`, `user_gives(pokemon_id, variant)`, `matches(user_a)`, `matches(user_b)`.

---

## 5. Matching Engine

**Perfect (2-way) match:** User A and User B are compatible when
- A **wants** something B **gives**, AND
- B **wants** something A **gives**.

**Basic SQL idea:**
```sql
SELECT other.user_id, g.pokemon_id AS i_get, g2.pokemon_id AS they_get
FROM user_wants w
JOIN user_gives g   ON g.pokemon_id = w.pokemon_id AND g.variant = w.variant
JOIN user_wants ow  ON ow.user_id = g.user_id
JOIN user_gives g2  ON g2.user_id = w.user_id
                   AND g2.pokemon_id = ow.pokemon_id AND g2.variant = ow.variant
WHERE w.user_id = :me AND g.user_id <> :me;
```

**Scoring (rank matches):**
- +priority weights of Pokémon on both sides
- + bonus for same city/region
- + bonus for high rating
- − penalty for inactive users (last seen > 14 days)

**One-sided matches** (they have what I want but don't want what I have) shown in a separate "Partial matches" tab.

**Run:** recalculate matches on list change (background job / DB trigger + Edge Function), plus a nightly refresh.

---

## 6. Screens
1. Landing / Login
2. Onboarding (friend code, location)
3. Pokémon picker (search, filters, grid with sprites) — used for both lists
4. My Lists (Want | Give tabs)
5. Matches feed (cards: partner, what you get ↔ what they get, score)
6. Match detail → Propose trade
7. Chat inbox + chat window
8. Profile (own and others, ratings)
9. Settings (notifications, privacy, block list)

---

## 7. Safety and Legal
- Never ask for the Pokémon GO password; only the public **friend code**
- Report/block buttons on every profile and chat
- Rate limiting on messages; basic profanity filter
- Row Level Security (RLS) so users only read their own data and conversations
- Disclaimer: unofficial fan app, not affiliated with Niantic / The Pokémon Company; use of names/sprites should respect their policies (check before public launch)

---

## 8. Build Phases (Task List for Antigravity Agents)

**Phase 0 — Setup**
- [ ] Create Next.js + Tailwind project, connect Supabase, set up env vars
- [ ] Configure Git repo and folder structure (`/app`, `/components`, `/lib`, `/supabase`)

**Phase 1 — Data and Auth**
- [ ] Create DB schema and RLS policies (migrations)
- [ ] Seed `pokemon` table from PokeAPI (script)
- [ ] Auth flow + profile onboarding

**Phase 2 — Lists**
- [ ] Pokémon picker component (search, filter, variants)
- [ ] Want list and Give list CRUD

**Phase 3 — Matching**
- [ ] Matching SQL function/Edge Function
- [ ] Scoring logic
- [ ] Matches feed UI + partial matches tab

**Phase 4 — Chat and Trades**
- [ ] Conversations/messages tables + Realtime subscription
- [ ] Chat UI (unread badges, timestamps)
- [ ] Trade status flow + ratings

**Phase 5 — Polish**
- [ ] Notifications, block/report, empty states, loading states
- [ ] Mobile responsive + PWA manifest
- [ ] Tests (matching logic unit tests, chat e2e)
- [ ] Deploy to Vercel

---

## 9. Antigravity IDE Workflow Tips
- Give the **Planner agent** this file first and ask it to produce an implementation plan and task list before coding.
- Run **separate agents in parallel**: one for DB/migrations, one for UI components, one for matching logic.
- Ask the **browser agent** to test signup → list creation → match → chat end to end after each phase.
- Keep a `PLAN.md` and `TASKS.md` in the repo root and have agents tick items off.

---

## 10. Master Prompt (paste into Antigravity)

> Build a Pokémon GO trading web app (PWA) using Next.js, Tailwind CSS and Supabase (Postgres, Auth, Realtime). Users create a profile with their Pokémon GO friend code and location, then select two lists: Pokémon they WANT and Pokémon they can GIVE (with variants: normal, shiny, lucky, shadow). A matching engine finds users where each side wants what the other gives, scores matches by priority, location, rating and activity, and shows them in a match feed. Matched users can chat in realtime, propose and complete trades, and rate each other. Include block/report, RLS security, and seed the Pokémon table from PokeAPI. Follow the schema, phases and task list in PLAN.md. Start by producing an implementation plan, then work phase by phase, testing each phase in the browser before moving on.

---

## 11. Open Decisions
- Web PWA first, or native mobile (React Native/Expo) later?
- Global matching, or city/country-limited at launch?
- Free app, or monetization later (ads/premium)?
