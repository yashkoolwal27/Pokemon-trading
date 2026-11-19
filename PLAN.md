# Pokémon GO Trading App — Implementation Plan

This document synthesizes the product requirements from [pokemon-go-trading-app-plan.md](file:///c:/Users/yashk/Desktop/pokemon%20go%20trading%20app/pokemon-go-trading-app-plan.md) and the recommendation engine specification from [pokemon-go-dataset-and-recommendation-engine.md](file:///c:/Users/yashk/Desktop/pokemon%20go%20trading%20app/pokemon-go-dataset-and-recommendation-engine.md).

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (PWA)                          │
│     Next.js 15 (App Router) + React 19 + Tailwind CSS       │
│  - Pokémon Variant Picker (Shiny, Form, Costume, Gender)    │
│  - Want & Give List Manager                                 │
│  - Ranked Match Feed with Explanation Cards                 │
│  - 3-Way Cycle Group Trade Feed                             │
│  - 1-to-1 Realtime Chat & Trade Negotiation                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / WebSocket
┌──────────────────────────────┴──────────────────────────────┐
│                    Next.js Backend API                      │
│  - /api/pokemon (search & filter canonical variants)        │
│  - /api/lists (want/give CRUD)                              │
│  - /api/matches (5-stage candidate generation & ranking)    │
│  - /api/trades (propose, accept, complete, cancel, rate)    │
│  - /api/chat (conversations & messages)                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                   Database & State (Supabase)               │
│  - PostgreSQL with RLS, triggers & foreign keys             │
│  - Inverted index matching queries                          │
│  - Realtime subscriptions for Chat & Trade updates          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Variant Model

Every tradeable Pokémon is defined by a canonical `variant_key`:
```
variant_key = {dex}:{form}:{costume}:{shiny}:{gender}:{background}
```
- `dex`: Pokémon National Pokédex number (1..N)
- `form`: normal, alolan, galarian, hisuian, paldean, gmax, mega, etc.
- `costume`: none, party_hat, flower_crown, santa_hat, etc.
- `shiny`: 0 or 1
- `gender`: any, male, female
- `background`: none, or special event location ID
- `is_special_trade`: true if shiny, legendary, mythical, or unowned form
- `rarity_score`: composite score (0–100) based on shiny status, costume, legendary tier, and community supply/demand

---

## 3. Matching & Recommendation Engine (5 Stages)

1. **Stage 1: Candidate Generation (Exact Inverted Index)**
   - Query mutual overlaps: User A gives what User B wants AND User B gives what User A wants.
2. **Stage 2: Candidate Expansion (Close Matches / Substitutes)**
   - If User A enables `accept_substitutes`, match same species or evolution family with penalty discount.
3. **Stage 3: Feasibility Filters**
   - User active within 30 days.
   - Neither user has blocked the other.
   - Quantity check (`user_gives.quantity > 0`).
   - Location / flight feasibility (`can_fly` or same city/region).
   - Special trade capacity check.
4. **Stage 4: Scoring & Multi-Factor Ranking**
   $$\text{Score} = w_1 \cdot \text{want\_fit} + w_2 \cdot \text{partner\_fit} + w_3 \cdot \text{fairness} + w_4 \cdot \text{proximity} + w_5 \cdot \text{reliability} - w_8 \cdot \text{sub\_penalty}$$
   - Generates transparent match explanations: *"You receive Shiny Rayquaza, they receive Shiny Kyogre; equal rarity score (94); both in New York"*.
5. **Stage 5: 3-Way Trade Detection**
   - Detects cycles of length 3 ($A \to B \to C \to A$) via graph DFS when 2-way matches are unavailable.

---

## 4. Phase-by-Phase Execution Roadmap

### Phase 0: Project Setup & Foundations
- Initialize Next.js (App Router, TypeScript, Tailwind CSS, Lucide icons, shadcn/ui primitives).
- PWA manifest & mobile-optimized responsive layout.
- Environment configuration & Supabase client setup (with offline mock fallback for seamless local testing).

### Phase 1: Canonical Data Model & Seed Pipeline
- Define Supabase SQL migrations (users, pokemon, variants, user_wants, user_gives, matches, conversations, messages, ratings).
- Pokémon seed pipeline caching PokeAPI & Game Master data into static seed files.
- Fast client-side / server-side search index for 1000+ Pokémon variants.

### Phase 2: User Profiles & List Management (Want / Give)
- Trainer profile onboarding (trainer name, 12-digit friend code, location/city, team, can_fly flag).
- Interactive Pokémon Variant Picker:
  - Search by name or Dex number.
  - Multi-select filters (Shiny, Costume, Form, Legendary, Generation).
  - Priority selector (1 to 5 stars) and "Accept substitutes" toggle.
- Want List & Give List management with quantity counters and instant badge preview.

### Phase 3: Recommendation Engine & Match Feed
- Implement matching algorithm in `lib/engine/matcher.ts`:
  - Exact 2-way matching.
  - Substitute matching.
  - 3-Way cycle detection.
  - Multi-factor scoring formula with human-readable explanations.
- Match feed UI:
  - "Direct Matches" tab with compatibility score and trade breakdown.
  - "3-Way Group Trades" tab.
  - "Partial Matches" tab (they have what you want).

### Phase 4: Realtime Chat, Trade Lifecycle & Reviews
- Realtime chat window with friend-code one-click copy.
- Trade lifecycle state machine:
  - `PROPOSED` $\to$ `ACCEPTED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED` / `CANCELLED`.
- Post-trade 5-star rating & review modal with badge verification.
- Safety: report & block functionality.

### Phase 5: Verification, Polish & Performance
- End-to-end testing of user flow (create profile $\to$ pick lists $\to$ view matches $\to$ chat $\to$ complete trade).
- Performance audit (sub-100ms match calculations, fast sprite rendering).
