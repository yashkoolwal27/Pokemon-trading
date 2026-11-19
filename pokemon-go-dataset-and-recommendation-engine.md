# Dataset + Recommendation Engine Spec
*Companion to `pokemon-go-trading-app-plan.md`. The recommendation engine is the main product; everything else supports it.*

---

## 0. What already exists (the bar we must beat)
I checked the sites you listed:

| Site | What it does | Takeaway for us |
|---|---|---|
| 9db.jp Trade List Generator | Make a want/offer list, export as image, save up to 5 lists. Filters combine with AND (e.g. Special + Shiny). Notes/badges per Pokémon. | No matching, only list-making. |
| pokexperience.com/trade | List maker with exact variants: shiny, costume, regional form, GMAX, Mega, gender, AR background. "I can fly" flag. Discord login. | Has variant model we should copy. |
| pokexperience.com/trade/matches | Matches on **exact variant**. "Perfect swaps" (mutual) + "Close matches" (same species, different variant). | **This is the baseline engine.** Ours must be smarter: ranked, feasibility-aware, learns from outcomes, supports 3-way trades. |
| pokemongotrading.com/tools | Page is JavaScript-rendered; I could not read its content. | Check it manually in a browser. |

**Our edge:** ranking quality, trade feasibility (Stardust, daily special-trade limit, friendship), value balance, multi-party cycles, and learning from completed trades.

---

## 1. Dataset

### 1.1 Do NOT scrape trade sites for Pokémon data
Those sites are built on the same underlying game data. Go to the primary sources instead (more complete, machine-readable, no scraping needed):

| Source | Use it for |
|---|---|
| **PokeMiners/game_masters** (GitHub, `latest.json`) | Official mined Game Master: species, forms, types, moves, trade-related settings |
| **PokeMiners/pogo_assets** (GitHub) | Sprite files, including costume/shiny/gender asset names (basis for costume list) |
| **PoGoAPI** (pogoapi.net: `shiny_pokemon`, `shadow_pokemon`, `pokemon_stats`, `pokemon_evolutions`) | Which Pokémon are released shiny/shadow, stats, evolution families |
| **WatWowMap/pogo-data-generator** (npm) | Ready-made templated Pokémon, forms, costumes, translations |
| **WatWowMap Game Master** | Costume pretty names + `isCostume` flag |
| **pokemon-go-api** (GitHub Pages JSON) | Current raid bosses, Max Battles |
| **PokeAPI** | Names, generations, sprite fallback, future Pokémon |
| **LeekDuck / ScrapedDuck** | Events feed (to know what is currently obtainable → affects rarity) |

Use 9db.jp / pokexperience only as a **reference to cross-check** your variant list. Before automating any request to them, read their Terms and robots.txt; I did not verify that scraping is allowed.

### 1.2 Legal note
Sprites, names and data belong to The Pokémon Company / Niantic / Scopely. Fine for a fan project in development, but before public launch: check their fan-content policy and consider using your own icons or licensed assets. Keep a "not affiliated" footer.

### 1.3 Canonical variant model (the heart of the dataset)
Every tradeable thing is a **variant**. Two variants are interchangeable only if their `variant_key` is equal.

```
variant_key = {dex}:{form}:{costume}:{shiny}:{gender}:{background}
example     = 6:normal:none:1:any:none      (shiny Charizard)
```

Dimensions:
- `dex` (1…N), `form` (normal, alolan, galarian, hisuian, paldean, GMAX, mega, other forms)
- `costume` (none, or code like party_hat, flower_crown…)
- `shiny` (0/1)
- `gender` (any/male/female, only where sprites differ)
- `background` (none, or location/special background id)
- `is_tradeable` (verify from Game Master; do not assume Mega/GMAX are tradeable)
- `is_released_shiny`, `is_legendary_or_mythical` (affects "special trade")

### 1.4 Tables
```sql
species(dex, name, gen, types[], family_id, is_legendary, is_mythical)
variants(variant_id PK, variant_key UNIQUE, dex, form, costume, shiny, gender, background,
         is_tradeable, is_special_trade, sprite_path, rarity_tier, rarity_score, updated_at)
variant_equivalence(variant_id, equivalent_variant_id, kind, weight)
  -- kind: same_species_diff_variant | same_family_evolved | user_defined
rarity_history(variant_id, date, rarity_score)
source_log(source, version_or_timestamp, fetched_at, row_count)
```

### 1.5 ETL pipeline (Antigravity agent task)
1. `fetch`: download PokeMiners `latest.json` + `timestamp.txt` (only re-run if timestamp changed), PoGoAPI endpoints, PokeAPI.
2. `normalize`: build species + forms from Game Master; join shiny/shadow flags from PoGoAPI.
3. `costumes`: derive costume list from `pogo_assets` filenames, name them via WatWowMap data.
4. `generate variants`: cross-product of valid (species × form × costume × shiny × gender); drop impossible combos using asset existence as the validity check.
5. `rarity`: compute `rarity_score` (see 2.4).
6. `validate`: compare variant count against pokexperience's grid by hand for a sample of 50 Pokémon; log mismatches.
7. `load` into Postgres; schedule weekly + on Game Master change.

Deliverables: `/data/etl/*.py` (or TS), `/data/snapshots/` JSON for fallback, unit tests with fixtures.

---

## 2. Recommendation Engine

### 2.1 Inputs
- `wants(user, variant, priority 1–5, accept_substitutes bool)`
- `gives(user, variant, quantity)`
- User context: city/country, `can_fly` flag, friendship level with others (if known), trainer level, last active, rating, completed trades count, timezone, languages
- Trade rules/costs (from the page I read): special trades are limited to **one per day**; Stardust cost depends on friendship level and trade type.

### 2.2 Pipeline (5 stages)

```
Stage 1  Candidate generation   → fast, exact, indexed
Stage 2  Candidate expansion    → close matches / substitutes
Stage 3  Feasibility filter     → rules that make a trade impossible
Stage 4  Scoring + ranking      → the "recommendation"
Stage 5  Multi-party cycles     → 3-way trades for unmatched users
```

**Stage 1 — Exact mutual match (inverted index)**
- Index: `gives_by_variant[variant_id] → set(user_ids)` and `wants_by_variant[variant_id] → set(user_ids)`.
- For user U: for each want `w`, partners P = `gives_by_variant[w]`. For each partner, check whether P wants anything U gives (set intersection). Cost is proportional to list sizes, not number of users.
- Output: `(U, P, [U_receives...], [P_receives...])`

**Stage 2 — Close matches (what competitor does at basic level)**
- If no exact variant, use `variant_equivalence` (same species, different variant) only for wants flagged `accept_substitutes`.
- Apply a **penalty weight** by kind (e.g. shiny→non-shiny substitute gets heavy penalty, same family gets small).

**Stage 3 — Feasibility filters (hard rules)**
- Both users active in last N days
- Neither blocked the other
- Special-trade capacity: if a trade includes a special variant, flag "uses daily special trade" and avoid pairing a user with two special trades planned same day
- Distance/travel: if far apart, require at least one side `can_fly` or mark as "remote trade" (Stardust cost note)
- Quantity: partner actually has stock

**Stage 4 — Scoring (start with transparent weighted sum, then learn)**

```
score = 
  + w1 * want_fit            # sum of priority of what U gets (normalized)
  + w2 * partner_want_fit    # sum of priority of what P gets (mutual satisfaction)
  + w3 * fairness            # 1 - |value_U_gives - value_U_gets| / max(...)  using rarity_score
  + w4 * proximity           # same city/region, can_fly bonus
  + w5 * reliability         # rating, completed trades, response rate
  + w6 * recency             # last active
  + w7 * friendship_ready    # already friends / friendship level enough
  - w8 * substitute_penalty
  - w9 * special_trade_conflict
```
Start with hand-tuned weights in a config file. Return top-K with an **explanation** per match ("You get Shiny Gible, they get your Lucky Larvitar; similar rarity; same city").

**Stage 5 — 3-way cycles**
- Build a directed graph: edge `A → B` if B gives something A wants.
- Find cycles of length 3 (A→B→C→A) with DFS limited to a small candidate set; score by the same formula; show as "Group trade".
- Note: a 3-way trade means actual Pokémon GO trades happen pairwise, so describe it as a chain the three players coordinate in chat.

### 2.3 Learning to rank (Phase 2 of engine)
Log events: `match_shown`, `match_clicked`, `chat_started`, `trade_proposed`, `trade_completed`, `trade_cancelled`, `no_response`.
- Labels: completed = strong positive, chat started = weak positive, ignored = weak negative, cancelled/reported = negative.
- After ~1–2k labelled matches: train LightGBM / XGBoost ranker (LambdaRank) on the same features as the scoring formula; keep the weighted formula as fallback.
- Cold start: new users get formula-based ranking + popularity-based suggestions.

### 2.4 Rarity / value score
Needed for fairness. Compute per variant:
```
rarity_score = f( shiny, legendary/mythical, costume/event-limited, regional/limited,
                  release status (currently available?), supply/demand ratio in OUR app )
```
Supply/demand ratio = (users wanting it) / (users giving it); update daily. Start with rules, let marketplace data take over.

### 2.5 "Recommend wants" (bonus recommender)
Suggest Pokémon to add to a user's lists:
- "People who want X also want Y" (item-item co-occurrence)
- Missing-evolution-family suggestions
- "You can give X; 14 players want it" (demand alert)

### 2.6 Abuse prevention
- Cap list size, detect bots (many lists, zero chat)
- Down-rank users with high cancel/report rates
- No contact info exposed until both accept a match

---

## 3. Architecture

```
Postgres (source of truth)
   ├─ nightly/triggered job → Match Service (Python FastAPI or Node worker)
   │        ├─ in-memory/Redis inverted indexes
   │        └─ writes matches + explanations to `matches`
   └─ event log table → training pipeline (Phase 2)
Frontend ← API: GET /matches, POST /matches/:id/propose, GET /recommendations/wants
```
Python FastAPI is a good fit for the engine (easy to add scikit-learn / LightGBM later), while the rest stays Next.js + Supabase.

Incremental updates: when a user edits a list, re-run Stage 1–4 only for that user and for users in the affected variant indexes.

---

## 4. Evaluation
- **Offline:** synthetic user generator (1k–100k users, realistic Zipf distribution of wants, shinies rare) to test speed and match counts.
- Metrics: match coverage (% users with ≥1 match), precision@5, trade completion rate, time to first match, average fairness score, % users unmatched.
- **Unit tests:** exact match, substitute match, special-trade conflict, quantity limits, 3-way cycle, blocked users.
- **Latency target:** per-user recommendation < 200 ms at 100k users.

---

## 5. Antigravity Task Breakdown (give each to a separate agent)

**Agent A — Data/ETL**
> Build the ETL in `/data/etl` that downloads PokeMiners latest Game Master, PoGoAPI shiny/shadow data and PokeAPI, generates the `variants` table using the variant_key format in 1.3, derives costumes from pogo_assets filenames, computes rarity_score, and loads Postgres. Add tests and a JSON snapshot fallback. Respect source terms; no scraping of trade sites.

**Agent B — Matching service**
> Build a FastAPI service `/engine` implementing the 5-stage pipeline in section 2 with inverted indexes, feasibility filters, a weighted scoring config in `weights.yaml`, explanations per match, and 3-way cycle detection. Include unit tests and a benchmark script on synthetic data.

**Agent C — Simulator + evaluation**
> Build a synthetic user generator and evaluation script producing the metrics in section 4, and a notebook comparing exact-only matching vs our ranked engine.

**Agent D — Frontend**
> Build the variant picker (filters: shiny, costume, form, gender, background combinable with AND), want/give list editor with priorities and "accept substitutes", the match feed with explanation text, and the group-trade view.

**Agent E — Events/Learning**
> Add event logging for match_shown/clicked/chat/proposed/completed/cancelled and a training script for a LightGBM LambdaRank model that can replace the weighted score when enough data exists.

---

## 6. Open Questions for You
1. Exact-variant only, or allow substitutes by default?
2. Should fairness (rarity balance) be strict or just a ranking signal?
3. Do we want 3-way trades in MVP or after launch?
4. Engine language: Python FastAPI (my suggestion) or keep everything in TypeScript?
