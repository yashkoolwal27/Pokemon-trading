import { RecommendationEngine } from '../src/lib/engine/matcher';
import { INITIAL_PROFILES, INITIAL_WANTS, INITIAL_GIVES } from '../src/data/mock-users';

function runTests() {
  console.log("=== Testing Pokémon GO Recommendation & Matching Engine ===");

  const engine = new RecommendationEngine(INITIAL_PROFILES, INITIAL_WANTS, INITIAL_GIVES);

  // Test 1: Ash's direct matches
  console.log("\n[Test 1] Finding direct 2-way matches for AshKetchum_99 (user-ash-001)...");
  const ashMatches = engine.findMatchesForUser("user-ash-001");
  console.log(`Found ${ashMatches.length} direct matches:`);

  for (const m of ashMatches) {
    console.log(` - Partner: ${m.partner.username} (${m.partner.city})`);
    console.log(`   You Receive: ${m.a_receives.name} (${m.a_receives.form}, Shiny: ${m.a_receives.shiny}, Rarity: ${m.a_receives.rarity_score})`);
    console.log(`   They Receive: ${m.b_receives.name} (${m.b_receives.form}, Shiny: ${m.b_receives.shiny}, Rarity: ${m.b_receives.rarity_score})`);
    console.log(`   Score: ${m.score}/100 | Breakdown: WantFit=${m.breakdown.want_fit}, Fairness=${m.breakdown.fairness}, Proximity=${m.breakdown.proximity}`);
    console.log(`   Explanation: ${m.explanation}`);
  }

  // Verify Ash <-> Misty match
  const mistyMatch = ashMatches.find(m => m.user_b === "user-misty-002");
  if (mistyMatch) {
    console.log("✓ SUCCESS: Ash <-> Misty direct mutual match verified!");
  } else {
    console.error("✗ FAILED: Expected match between Ash and Misty not found!");
  }

  // Test 2: 3-way cycle matching
  console.log("\n[Test 2] Checking 3-Way Trade Cycles for Ash...");
  const cycles = engine.findThreeWayMatches("user-ash-001");
  console.log(`Found ${cycles.length} 3-way cycles:`);
  for (const c of cycles) {
    console.log(` - Cycle: Ash -> ${c.user_b_profile.username} -> ${c.user_c_profile.username} -> Ash`);
    console.log(`   Explanation: ${c.explanation}`);
  }

  console.log("\n=== Engine Test Complete ===");
}

runTests();
