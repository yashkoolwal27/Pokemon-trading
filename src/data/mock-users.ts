import { UserProfile, UserWant, UserGive } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "user-ash-001",
    username: "AshKetchum_99",
    friend_code: "4829 1048 2934",
    team: "instinct",
    level: 48,
    country: "United States",
    city: "New York",
    can_fly: false,
    avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png",
    bio: "PVP battler and Shiny hunter. Looking for rare legacy trades in NYC!",
    trades_completed: 42,
    rating_avg: 4.95,
    rating_count: 38,
    last_active_at: new Date().toISOString()
  },
  {
    id: "user-misty-002",
    username: "Misty_WaterGym",
    friend_code: "9182 7364 5510",
    team: "mystic",
    level: 46,
    country: "United States",
    city: "New York",
    can_fly: false,
    avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png",
    bio: "Water type enthusiast. I have spare legendaries & costumes for trade.",
    trades_completed: 65,
    rating_avg: 5.00,
    rating_count: 59,
    last_active_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "user-brock-003",
    username: "Brock_RockSolid",
    friend_code: "3391 8842 1109",
    team: "valor",
    level: 44,
    country: "United States",
    city: "Boston",
    can_fly: true,
    avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png",
    bio: "I travel frequently (can fly) for community days and Go Fest. Fast trader!",
    trades_completed: 89,
    rating_avg: 4.88,
    rating_count: 76,
    last_active_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "user-dawn-004",
    username: "Dawn_SinnohStar",
    friend_code: "5501 2294 8831",
    team: "mystic",
    level: 42,
    country: "United States",
    city: "Chicago",
    can_fly: false,
    avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/4.png",
    bio: "Completing my Sinnoh dex and shiny legendaries collection.",
    trades_completed: 28,
    rating_avg: 4.90,
    rating_count: 24,
    last_active_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: "user-red-005",
    username: "Red_Champion",
    friend_code: "7711 0029 4481",
    team: "valor",
    level: 50,
    country: "Japan",
    city: "Tokyo",
    can_fly: true,
    avatar_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png",
    bio: "Level 50 veteran. Huge collection of legacy costumes, shiny mythical and apex legendaries.",
    trades_completed: 180,
    rating_avg: 4.98,
    rating_count: 165,
    last_active_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export const INITIAL_WANTS: UserWant[] = [
  // Ash wants: Armored Mewtwo, Shiny Riolu, Shiny Kyogre
  {
    id: "w-ash-1",
    user_id: "user-ash-001",
    variant_key: "150:armored:none:0:any:none",
    dex: 150,
    priority: 5,
    accept_substitutes: false,
    notes: "Armored Mewtwo is my dream trade!",
    created_at: new Date().toISOString()
  },
  {
    id: "w-ash-2",
    user_id: "user-ash-001",
    variant_key: "447:normal:none:1:any:none",
    dex: 447,
    priority: 4,
    accept_substitutes: true,
    notes: "Will also accept Shiny Lucario",
    created_at: new Date().toISOString()
  },
  {
    id: "w-ash-3",
    user_id: "user-ash-001",
    variant_key: "382:normal:none:1:any:none",
    dex: 382,
    priority: 4,
    accept_substitutes: false,
    notes: "Shiny Kyogre with Origin Pulse preferred",
    created_at: new Date().toISOString()
  },

  // Misty wants: Shiny Charizard, Shiny Kyogre, Shiny Gyarados
  {
    id: "w-misty-1",
    user_id: "user-misty-002",
    variant_key: "6:normal:none:1:any:none",
    dex: 6,
    priority: 5,
    accept_substitutes: false,
    notes: "Black Charizard only please!",
    created_at: new Date().toISOString()
  },
  {
    id: "w-misty-2",
    user_id: "user-misty-002",
    variant_key: "382:normal:none:1:any:none",
    dex: 382,
    priority: 4,
    accept_substitutes: false,
    created_at: new Date().toISOString()
  },

  // Brock wants: Shiny Rayquaza
  {
    id: "w-brock-1",
    user_id: "user-brock-003",
    variant_key: "384:normal:none:1:any:none",
    dex: 384,
    priority: 5,
    accept_substitutes: false,
    notes: "I can fly to you anytime",
    created_at: new Date().toISOString()
  },

  // Dawn wants: Shiny Dialga, Armored Mewtwo, Shiny Charizard
  {
    id: "w-dawn-1",
    user_id: "user-dawn-004",
    variant_key: "483:origin:none:1:any:none",
    dex: 483,
    priority: 5,
    accept_substitutes: true,
    created_at: new Date().toISOString()
  },
  {
    id: "w-dawn-2",
    user_id: "user-dawn-004",
    variant_key: "6:normal:none:1:any:none",
    dex: 6,
    priority: 4,
    accept_substitutes: false,
    notes: "Looking for black shiny Charizard",
    created_at: new Date().toISOString()
  },

  // Red wants: Gholdengo, Cowboy Hat Snorlax
  {
    id: "w-red-1",
    user_id: "user-red-005",
    variant_key: "1000:normal:none:0:any:none",
    dex: 1000,
    priority: 4,
    accept_substitutes: false,
    created_at: new Date().toISOString()
  },
  {
    id: "w-red-2",
    user_id: "user-red-005",
    variant_key: "143:normal:cowboy_hat:1:any:none",
    dex: 143,
    priority: 5,
    accept_substitutes: false,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_GIVES: UserGive[] = [
  // Ash gives: Shiny Charizard, Shiny Rayquaza, Shiny Pikachu (Santa Hat)
  {
    id: "g-ash-1",
    user_id: "user-ash-001",
    variant_key: "6:normal:none:1:any:none",
    dex: 6,
    quantity: 2,
    notes: "Caught on Community Day, high IV",
    created_at: new Date().toISOString()
  },
  {
    id: "g-ash-2",
    user_id: "user-ash-001",
    variant_key: "384:normal:none:1:any:none",
    dex: 384,
    quantity: 1,
    notes: "Clean shiny Rayquaza with Dragon Ascent",
    created_at: new Date().toISOString()
  },
  {
    id: "g-ash-3",
    user_id: "user-ash-001",
    variant_key: "25:normal:santa_hat:1:any:none",
    dex: 25,
    quantity: 1,
    notes: "2019 Holiday event shiny",
    created_at: new Date().toISOString()
  },

  // Misty gives: Armored Mewtwo, Party Hat Gengar
  {
    id: "g-misty-1",
    user_id: "user-misty-002",
    variant_key: "150:armored:none:0:any:none",
    dex: 150,
    quantity: 1,
    notes: "From original raid event, very rare legacy!",
    created_at: new Date().toISOString()
  },
  {
    id: "g-misty-2",
    user_id: "user-misty-002",
    variant_key: "94:normal:party_hat:0:any:none",
    dex: 94,
    quantity: 2,
    created_at: new Date().toISOString()
  },

  // Brock gives: Shiny Riolu, Shiny Larvitar
  {
    id: "g-brock-1",
    user_id: "user-brock-003",
    variant_key: "447:normal:none:1:any:none",
    dex: 447,
    quantity: 1,
    notes: "Hatched shiny Riolu from 7km egg",
    created_at: new Date().toISOString()
  },
  {
    id: "g-brock-2",
    user_id: "user-brock-003",
    variant_key: "246:normal:none:1:any:none",
    dex: 246,
    quantity: 3,
    created_at: new Date().toISOString()
  },

  // Dawn gives: Shiny Kyogre
  {
    id: "g-dawn-1",
    user_id: "user-dawn-004",
    variant_key: "382:normal:none:1:any:none",
    dex: 382,
    quantity: 1,
    notes: "Hoenn Tour raid catch",
    created_at: new Date().toISOString()
  },

  // Red gives: Shiny Origin Dialga, Cowboy Hat Snorlax, Gholdengo
  {
    id: "g-red-1",
    user_id: "user-red-005",
    variant_key: "483:origin:none:1:any:none",
    dex: 483,
    quantity: 2,
    notes: "Roar of Time adventure effect enabled",
    created_at: new Date().toISOString()
  },
  {
    id: "g-red-2",
    user_id: "user-red-005",
    variant_key: "143:normal:cowboy_hat:1:any:none",
    dex: 143,
    quantity: 1,
    created_at: new Date().toISOString()
  }
];
