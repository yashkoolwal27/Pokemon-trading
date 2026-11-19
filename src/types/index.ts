export type Team = 'valor' | 'mystic' | 'instinct' | 'harmony';

export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra_rare';

export interface Pokemon {
  dex: number;
  name: string;
  gen: number;
  types: string[];
  family_id: number;
  is_legendary: boolean;
  is_mythical: boolean;
  base_rarity: number;
}

export interface Variant {
  variant_key: string; // e.g. "6:normal:none:1:any:none"
  dex: number;
  name: string;
  form: string;
  costume: string;
  shiny: boolean;
  gender: 'any' | 'male' | 'female';
  background: string;
  is_tradeable: boolean;
  is_special_trade: boolean;
  sprite_path: string;
  rarity_tier: RarityTier;
  rarity_score: number; // 0 - 100
}

export interface UserProfile {
  id: string;
  username: string;
  friend_code: string;
  team: Team;
  level: number;
  country: string;
  city: string;
  can_fly: boolean;
  avatar_url?: string;
  bio?: string;
  trades_completed: number;
  rating_avg: number;
  rating_count: number;
  last_active_at: string;
}

export interface UserWant {
  id: string;
  user_id: string;
  variant_key: string;
  dex: number;
  priority: number; // 1 to 5
  accept_substitutes: boolean;
  notes?: string;
  created_at: string;
  variant?: Variant;
}

export interface UserGive {
  id: string;
  user_id: string;
  variant_key: string;
  dex: number;
  quantity: number;
  notes?: string;
  created_at: string;
  variant?: Variant;
}

export type MatchStatus = 'suggested' | 'proposed' | 'accepted' | 'completed' | 'cancelled';

export interface MatchBreakdown {
  want_fit: number;
  partner_want_fit: number;
  fairness: number;
  proximity: number;
  reliability: number;
  special_trade: boolean;
  substitute_used: boolean;
}

export interface TradeMatch {
  id: string;
  user_a: string;
  user_b: string;
  partner: UserProfile;
  a_receives: Variant;
  b_receives: Variant;
  score: number;
  fairness_score: number;
  proximity_score: number;
  breakdown: MatchBreakdown;
  explanation: string;
  status: MatchStatus;
  stardust_cost: number;
  created_at: string;
}

export interface ThreeWayTradeMatch {
  id: string;
  user_a: string;
  user_b: string;
  user_c: string;
  user_b_profile: UserProfile;
  user_c_profile: UserProfile;
  a_receives: Variant; // from C
  b_receives: Variant; // from A
  c_receives: Variant; // from B
  score: number;
  explanation: string;
  status: 'suggested' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface TradeRating {
  id: string;
  match_id: string;
  rater_id: string;
  rated_id: string;
  stars: number; // 1-5
  tags: string[];
  comment?: string;
  created_at: string;
}
