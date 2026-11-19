-- Pokémon GO Trading App Database Initialization Schema

-- 1. Users Profile Table (Extends Supabase auth.users or standalone for demo mode)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    friend_code VARCHAR(14) NOT NULL, -- e.g. "1234 5678 9012"
    team TEXT CHECK (team IN ('valor', 'mystic', 'instinct', 'harmony')),
    level INTEGER CHECK (level >= 1 AND level <= 50) DEFAULT 30,
    country TEXT NOT NULL DEFAULT 'United States',
    city TEXT NOT NULL DEFAULT 'New York',
    can_fly BOOLEAN NOT NULL DEFAULT false, -- remote trade / spoof capability flag
    avatar_url TEXT,
    bio TEXT DEFAULT 'Ready to trade!',
    trades_completed INTEGER NOT NULL DEFAULT 0,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    rating_count INTEGER NOT NULL DEFAULT 0,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Master Pokémon Table
CREATE TABLE IF NOT EXISTS public.pokemon (
    dex INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    gen INTEGER NOT NULL,
    types TEXT[] NOT NULL DEFAULT '{}',
    family_id INTEGER,
    is_legendary BOOLEAN NOT NULL DEFAULT false,
    is_mythical BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Canonical Variants Table
-- variant_key format: {dex}:{form}:{costume}:{shiny}:{gender}:{background}
CREATE TABLE IF NOT EXISTS public.variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_key TEXT UNIQUE NOT NULL,
    dex INTEGER NOT NULL REFERENCES public.pokemon(dex) ON DELETE CASCADE,
    name TEXT NOT NULL,
    form TEXT NOT NULL DEFAULT 'normal',
    costume TEXT NOT NULL DEFAULT 'none',
    shiny BOOLEAN NOT NULL DEFAULT false,
    gender TEXT NOT NULL DEFAULT 'any', -- 'any', 'male', 'female'
    background TEXT NOT NULL DEFAULT 'none',
    is_tradeable BOOLEAN NOT NULL DEFAULT true,
    is_special_trade BOOLEAN NOT NULL DEFAULT false,
    sprite_path TEXT NOT NULL,
    rarity_tier TEXT NOT NULL DEFAULT 'common', -- common, uncommon, rare, epic, legendary, ultra_rare
    rarity_score NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast variant searches
CREATE INDEX IF NOT EXISTS idx_variants_dex ON public.variants(dex);
CREATE INDEX IF NOT EXISTS idx_variants_shiny ON public.variants(shiny);
CREATE INDEX IF NOT EXISTS idx_variants_costume ON public.variants(costume);
CREATE INDEX IF NOT EXISTS idx_variants_form ON public.variants(form);

-- 4. User Wants List
CREATE TABLE IF NOT EXISTS public.user_wants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    variant_key TEXT NOT NULL REFERENCES public.variants(variant_key) ON DELETE CASCADE,
    dex INTEGER NOT NULL REFERENCES public.pokemon(dex) ON DELETE CASCADE,
    priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    accept_substitutes BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_user_wants_user ON public.user_wants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wants_key ON public.user_wants(variant_key);

-- 5. User Gives List
CREATE TABLE IF NOT EXISTS public.user_gives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    variant_key TEXT NOT NULL REFERENCES public.variants(variant_key) ON DELETE CASCADE,
    dex INTEGER NOT NULL REFERENCES public.pokemon(dex) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_user_gives_user ON public.user_gives(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gives_key ON public.user_gives(variant_key);

-- 6. Direct Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    a_receives_key TEXT NOT NULL REFERENCES public.variants(variant_key),
    b_receives_key TEXT NOT NULL REFERENCES public.variants(variant_key),
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    fairness_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    proximity_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    explanation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggested' 
        CHECK (status IN ('suggested', 'proposed', 'accepted', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_a, user_b, a_receives_key, b_receives_key)
);

CREATE INDEX IF NOT EXISTS idx_matches_user_a ON public.matches(user_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON public.matches(user_b);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);

-- 7. 3-Way Cycle Group Trades Table (A gives B, B gives C, C gives A)
CREATE TABLE IF NOT EXISTS public.three_way_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_c UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    a_receives_key TEXT NOT NULL REFERENCES public.variants(variant_key),
    b_receives_key TEXT NOT NULL REFERENCES public.variants(variant_key),
    c_receives_key TEXT NOT NULL REFERENCES public.variants(variant_key),
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    explanation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggested' 
        CHECK (status IN ('suggested', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Conversations & Realtime Messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);

-- 9. Ratings & Reviews
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rated_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    tags TEXT[] NOT NULL DEFAULT '{}',
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Safety: Blocks & Reports
CREATE TABLE IF NOT EXISTS public.blocks (
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
