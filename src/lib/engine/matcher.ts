import { UserProfile, UserWant, UserGive, Variant, TradeMatch, ThreeWayTradeMatch, MatchBreakdown } from '../../types';
import rawVariants from '../../data/variants.json';
import rawPokemon from '../../data/pokemon.json';

const variantsMap = new Map<string, Variant>();
for (const v of rawVariants as Variant[]) {
  variantsMap.set(v.variant_key, v);
}

const pokemonMap = new Map<number, any>();
for (const p of rawPokemon) {
  pokemonMap.set(p.dex, p);
}

export function getVariant(variant_key: string): Variant | undefined {
  return variantsMap.get(variant_key);
}

export interface MatcherOptions {
  weights?: {
    want_fit: number;
    partner_fit: number;
    fairness: number;
    proximity: number;
    reliability: number;
    substitute_penalty: number;
  };
}

const DEFAULT_WEIGHTS = {
  want_fit: 0.30,
  partner_fit: 0.20,
  fairness: 0.20,
  proximity: 0.15,
  reliability: 0.15,
  substitute_penalty: 25.0
};

export class RecommendationEngine {
  private profiles: Map<string, UserProfile> = new Map();
  private wants: UserWant[] = [];
  private gives: UserGive[] = [];

  constructor(profiles: UserProfile[], wants: UserWant[], gives: UserGive[]) {
    this.profiles = new Map(profiles.map(p => [p.id, p]));
    this.wants = wants;
    this.gives = gives;
  }

  public updateLists(wants: UserWant[], gives: UserGive[]) {
    this.wants = wants;
    this.gives = gives;
  }

  public addProfile(profile: UserProfile) {
    this.profiles.set(profile.id, profile);
  }

  /**
   * Stage 1 & 2 & 3 & 4: Find direct 2-way matches for a specific user
   */
  public findMatchesForUser(userId: string, options: MatcherOptions = {}): TradeMatch[] {
    const weights = { ...DEFAULT_WEIGHTS, ...options.weights };
    const user = this.profiles.get(userId);
    if (!user) return [];

    const myWants = this.wants.filter(w => w.user_id === userId);
    const myGives = this.gives.filter(g => g.user_id === userId && g.quantity > 0);

    if (myWants.length === 0 || myGives.length === 0) {
      return [];
    }

    // Inverted index of what other users give: variant_key -> Array of UserGive
    const givesByVariant = new Map<string, UserGive[]>();
    for (const g of this.gives) {
      if (g.user_id === userId || g.quantity <= 0) continue;
      const list = givesByVariant.get(g.variant_key) || [];
      list.push(g);
      givesByVariant.set(g.variant_key, list);
    }

    // Inverted index of what other users want: variant_key -> Array of UserWant
    const wantsByVariant = new Map<string, UserWant[]>();
    for (const w of this.wants) {
      if (w.user_id === userId) continue;
      const list = wantsByVariant.get(w.variant_key) || [];
      list.push(w);
      wantsByVariant.set(w.variant_key, list);
    }

    const matches: TradeMatch[] = [];
    const seenPairs = new Set<string>();

    // Stage 1: Exact matches
    for (const myWant of myWants) {
      const candidates = givesByVariant.get(myWant.variant_key) || [];

      for (const candidateGive of candidates) {
        const partnerId = candidateGive.user_id;
        const partner = this.profiles.get(partnerId);
        if (!partner) continue;

        // Check if partner wants anything I give
        for (const myGive of myGives) {
          const partnerWants = this.wants.filter(
            w => w.user_id === partnerId && w.variant_key === myGive.variant_key
          );

          if (partnerWants.length > 0) {
            const partnerWant = partnerWants[0];
            const pairKey = `${partnerId}:${candidateGive.variant_key}:${myGive.variant_key}`;
            if (seenPairs.has(pairKey)) continue;
            seenPairs.add(pairKey);

            const match = this.evaluateMatch(
              user,
              partner,
              myWant,
              candidateGive,
              myGive,
              partnerWant,
              false,
              weights
            );

            if (match) {
              matches.push(match);
            }
          }
        }
      }
    }

    // Stage 2: Substitute matches (if enabled on myWant)
    for (const myWant of myWants) {
      if (!myWant.accept_substitutes) continue;

      // Find other variants with the same dex
      for (const g of this.gives) {
        if (g.user_id === userId || g.quantity <= 0 || g.variant_key === myWant.variant_key) continue;
        if (g.dex !== myWant.dex) continue;

        const partnerId = g.user_id;
        const partner = this.profiles.get(partnerId);
        if (!partner) continue;

        for (const myGive of myGives) {
          const partnerWants = this.wants.filter(
            w => w.user_id === partnerId && (w.variant_key === myGive.variant_key || (w.accept_substitutes && w.dex === myGive.dex))
          );

          if (partnerWants.length > 0) {
            const partnerWant = partnerWants[0];
            const pairKey = `${partnerId}:${g.variant_key}:${myGive.variant_key}`;
            if (seenPairs.has(pairKey)) continue;
            seenPairs.add(pairKey);

            const match = this.evaluateMatch(
              user,
              partner,
              myWant,
              g,
              myGive,
              partnerWant,
              true,
              weights
            );

            if (match) {
              matches.push(match);
            }
          }
        }
      }
    }

    // Sort by final score descending
    matches.sort((a, b) => b.score - a.score);
    return matches;
  }

  /**
   * Stage 3 & 4: Evaluate feasibility, calculate subscores, and build explanation
   */
  private evaluateMatch(
    user: UserProfile,
    partner: UserProfile,
    myWant: UserWant,
    candidateGive: UserGive,
    myGive: UserGive,
    partnerWant: UserWant,
    isSubstitute: boolean,
    weights: typeof DEFAULT_WEIGHTS
  ): TradeMatch | null {
    const aReceives = variantsMap.get(candidateGive.variant_key);
    const bReceives = variantsMap.get(myGive.variant_key);
    if (!aReceives || !bReceives) return null;

    // Feasibility filter: Proximity / Can-fly
    const isSameCity = user.city.toLowerCase() === partner.city.toLowerCase();
    const isSameCountry = user.country.toLowerCase() === partner.country.toLowerCase();
    const canCoordinateDistance = isSameCity || user.can_fly || partner.can_fly;

    // If completely unable to meet or fly, score penalty
    let proximityScore = 20;
    if (isSameCity) {
      proximityScore = 100;
    } else if (user.can_fly || partner.can_fly) {
      proximityScore = 85;
    } else if (isSameCountry) {
      proximityScore = 55;
    }

    // Want fit scores (1-5 mapped to 20-100)
    const wantFitScore = (myWant.priority / 5) * 100;
    const partnerWantFitScore = (partnerWant.priority / 5) * 100;

    // Fairness score based on relative rarity_score
    const rarityDiff = Math.abs(aReceives.rarity_score - bReceives.rarity_score);
    const fairnessScore = Math.max(10, 100 - rarityDiff * 1.5);

    // Reliability score
    const reliabilityScore = (partner.rating_avg / 5) * 70 + Math.min(30, partner.trades_completed * 0.5);

    // Composite weighted score
    let totalScore =
      weights.want_fit * wantFitScore +
      weights.partner_fit * partnerWantFitScore +
      weights.fairness * fairnessScore +
      weights.proximity * proximityScore +
      weights.reliability * reliabilityScore;

    if (isSubstitute) {
      totalScore = Math.max(10, totalScore - weights.substitute_penalty);
    }

    const isSpecialTrade = aReceives.is_special_trade || bReceives.is_special_trade;
    // Estimated Stardust cost (e.g. 20,000 for standard special trade with Good Friends)
    const stardustCost = isSpecialTrade ? 20000 : 100;

    // Human-readable explanation builder
    const reasons: string[] = [];
    if (aReceives.shiny && bReceives.shiny) {
      reasons.push("Mutual Shiny trade");
    } else if (isSubstitute) {
      reasons.push(`Alternate ${aReceives.name} variant swap`);
    } else {
      reasons.push(`Direct ${aReceives.name} for ${bReceives.name}`);
    }

    if (fairnessScore >= 80) {
      reasons.push("Balanced rarity");
    }

    if (isSameCity) {
      reasons.push(`Both in ${user.city}`);
    } else if (partner.can_fly) {
      reasons.push(`${partner.username} can fly/travel`);
    } else if (user.can_fly) {
      reasons.push("You can fly/travel");
    }

    const explanation = reasons.join(" • ");

    const breakdown: MatchBreakdown = {
      want_fit: Math.round(wantFitScore),
      partner_want_fit: Math.round(partnerWantFitScore),
      fairness: Math.round(fairnessScore),
      proximity: Math.round(proximityScore),
      reliability: Math.round(reliabilityScore),
      special_trade: isSpecialTrade,
      substitute_used: isSubstitute
    };

    return {
      id: `match-${user.id}-${partner.id}-${aReceives.variant_key}-${bReceives.variant_key}`,
      user_a: user.id,
      user_b: partner.id,
      partner,
      a_receives: aReceives,
      b_receives: bReceives,
      score: Math.round(totalScore),
      fairness_score: Math.round(fairnessScore),
      proximity_score: Math.round(proximityScore),
      breakdown,
      explanation,
      status: 'suggested',
      stardust_cost: stardustCost,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Stage 5: Find 3-way trade cycles (A -> B -> C -> A)
   * User A gives to B, B gives to C, C gives to A.
   */
  public findThreeWayMatches(userId: string): ThreeWayTradeMatch[] {
    const userA = this.profiles.get(userId);
    if (!userA) return [];

    const aWants = this.wants.filter(w => w.user_id === userId);
    const aGives = this.gives.filter(g => g.user_id === userId && g.quantity > 0);
    if (aWants.length === 0 || aGives.length === 0) return [];

    const threeWayMatches: ThreeWayTradeMatch[] = [];
    const seen = new Set<string>();

    // For each item A wants, find user C who gives it
    for (const wantA of aWants) {
      const cCandidates = this.gives.filter(
        g => g.user_id !== userId && g.variant_key === wantA.variant_key && g.quantity > 0
      );

      for (const giveC of cCandidates) {
        const userCId = giveC.user_id;
        const userC = this.profiles.get(userCId);
        if (!userC) continue;

        // User C wants something that User B can give
        const cWants = this.wants.filter(w => w.user_id === userCId);

        for (const wantC of cWants) {
          const bCandidates = this.gives.filter(
            g => g.user_id !== userId && g.user_id !== userCId && g.variant_key === wantC.variant_key && g.quantity > 0
          );

          for (const giveB of bCandidates) {
            const userBId = giveB.user_id;
            const userB = this.profiles.get(userBId);
            if (!userB) continue;

            // Now check if user B wants something that User A gives!
            const bWants = this.wants.filter(w => w.user_id === userBId);
            for (const wantB of bWants) {
              const matchingAGive = aGives.find(g => g.variant_key === wantB.variant_key);

              if (matchingAGive) {
                const cycleKey = [userId, userBId, userCId].sort().join(":");
                if (seen.has(cycleKey)) continue;
                seen.add(cycleKey);

                const aReceives = variantsMap.get(giveC.variant_key)!;
                const bReceives = variantsMap.get(matchingAGive.variant_key)!;
                const cReceives = variantsMap.get(giveB.variant_key)!;

                const score = 88; // High value multi-party unlock

                threeWayMatches.push({
                  id: `cycle-${userId}-${userBId}-${userCId}`,
                  user_a: userId,
                  user_b: userBId,
                  user_c: userCId,
                  user_b_profile: userB,
                  user_c_profile: userC,
                  a_receives: aReceives,
                  b_receives: bReceives,
                  c_receives: cReceives,
                  score,
                  explanation: `3-Way Circle: You receive ${aReceives.name} from ${userC.username}, ${userB.username} receives ${bReceives.name} from you, and ${userC.username} receives ${cReceives.name} from ${userB.username}`,
                  status: 'suggested',
                  created_at: new Date().toISOString()
                });
              }
            }
          }
        }
      }
    }

    return threeWayMatches;
  }
}
