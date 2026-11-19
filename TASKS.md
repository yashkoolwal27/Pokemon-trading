# Pokémon GO Trading App — Task Tracker

## Phase 0: Project Setup & Foundations
- [x] Initialize Next.js 15 App Router project with TypeScript, Tailwind CSS, Lucide icons
- [x] Configure PWA manifest (`manifest.json`, theme color, icons)
- [x] Configure Supabase client & environment configuration (`.env.local.example`, `.env.local`)
- [x] Set up local mock / demo mode for immediate testing without live Supabase credentials

## Phase 1: Database Schema & Pokémon Seed Data
- [x] Write SQL migrations (`supabase/migrations/20261119_init.sql`) with schema, RLS policies, and triggers
- [x] Build canonical Pokémon dataset & variant generator (`scripts/generate-dataset.ts`) with PokeAPI & Go asset definitions
- [x] Generate static Pokémon & variant registry JSON with sprite URLs, shiny assets, rarity tiers, and special trade flags (120 Pokémon, 438 canonical variants)
- [x] Create `/api/pokemon` search & query endpoint

## Phase 2: Profiles & List Management (Want & Give)
- [x] Implement Trainer Profile & onboarding (Friend Code formatter, Team selector, Location, Can-Fly toggle)
- [x] Build Pokémon Variant Picker modal/drawer with:
  - [x] Search input by Name and Dex #
  - [x] Variant toggles: Normal / Shiny, Forms (Alolan, Galarian, Hisuian, etc.), Costume
  - [x] Priority slider (1-5 stars) and "Accept Substitutes" checkbox
- [x] Build "My Lists" view with Want tab and Give tab
- [x] Add/Edit/Remove/Quantity controls with instant persistence

## Phase 3: Recommendation Engine & Matches Feed
- [x] Implement 5-stage matching engine (`src/lib/engine/matcher.ts`):
  - [x] Stage 1: Exact inverted index matching
  - [x] Stage 2: Substitute / same-species expansion
  - [x] Stage 3: Feasibility filters (distance/can_fly, activity, blocks, special trades)
  - [x] Stage 4: Fairness & compatibility scoring formula + explanation generator
  - [x] Stage 5: 3-Way cycle detection ($A \to B \to C \to A$)
- [x] Unit tests for matcher covering 2-way, substitutes, 3-way, and edge cases (`scripts/test-engine.ts`)
- [x] Build Matches Feed UI:
  - [x] Match Card (You give ↔ You get, match score badge, compatibility breakdown)
  - [x] "Why this match?" transparency tooltip / modal
  - [x] 3-Way Group Trade cards
  - [x] Proximity filtering (Same City / Can Fly Only)

## Phase 4: Trade Lifecycle, Chat & Reviews
- [x] Trade proposal modal ("Propose Trade" button on match card)
- [x] Trade management dashboard (Proposed / Accepted / Completed / Cancelled status flow)
- [x] Realtime Chat UI:
  - [x] Conversation header with partner's Friend Code ("Copy Friend Code" button)
  - [x] In-game safety notice & Stardust cost guide
  - [x] Message feed with timestamps & read receipts
- [x] Post-trade rating & review modal (1-5 stars, tags: "Fast responder", "Fair trader", etc.)
- [x] Safety & rules reminder banner

## Phase 5: Verification & Polish
- [x] Complete end-to-end browser walkthrough (view lists, direct matches, 3-way cycles, open chat, friend code copy)
- [x] Mobile responsive UX check (bottom navigation bar on mobile, drawer on mobile for picker)
- [x] PWA web app manifest and theme configuration
