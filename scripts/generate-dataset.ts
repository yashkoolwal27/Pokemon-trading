import * as fs from 'fs';
import * as path from 'path';

interface PokemonRaw {
  dex: number;
  name: string;
  gen: number;
  types: string[];
  family_id: number;
  is_legendary?: boolean;
  is_mythical?: boolean;
  base_rarity?: number;
  forms?: string[];
  costumes?: string[];
}

const MASTER_POKEMON: PokemonRaw[] = [
  // Gen 1 Starters & Icons
  { dex: 1, name: "Bulbasaur", gen: 1, types: ["Grass", "Poison"], family_id: 1, costumes: ["party_hat", "halloween"] },
  { dex: 2, name: "Ivysaur", gen: 1, types: ["Grass", "Poison"], family_id: 1 },
  { dex: 3, name: "Venusaur", gen: 1, types: ["Grass", "Poison"], family_id: 1, forms: ["normal", "gmax"] },
  { dex: 4, name: "Charmander", gen: 1, types: ["Fire"], family_id: 4, costumes: ["party_hat", "cubone_hat"] },
  { dex: 5, name: "Charmeleon", gen: 1, types: ["Fire"], family_id: 4 },
  { dex: 6, name: "Charizard", gen: 1, types: ["Fire", "Flying"], family_id: 4, forms: ["normal", "gmax"] },
  { dex: 7, name: "Squirtle", gen: 1, types: ["Water"], family_id: 7, costumes: ["sunglasses", "party_hat"] },
  { dex: 8, name: "Wartortle", gen: 1, types: ["Water"], family_id: 7, costumes: ["sunglasses"] },
  { dex: 9, name: "Blastoise", gen: 1, types: ["Water"], family_id: 7, costumes: ["sunglasses"], forms: ["normal", "gmax"] },
  { dex: 25, name: "Pikachu", gen: 1, types: ["Electric"], family_id: 25, costumes: ["santa_hat", "party_hat", "flower_crown", "straw_hat", "lucario_hat", "rayquaza_hat", "tiara_shiny"] },
  { dex: 26, name: "Raichu", gen: 1, types: ["Electric"], family_id: 25, forms: ["normal", "alolan"], costumes: ["santa_hat", "flower_crown"] },
  { dex: 37, name: "Vulpix", gen: 1, types: ["Fire"], family_id: 37, forms: ["normal", "alolan"], costumes: ["festival"] },
  { dex: 38, name: "Ninetales", gen: 1, types: ["Fire"], family_id: 37, forms: ["normal", "alolan"] },
  { dex: 52, name: "Meowth", gen: 1, types: ["Normal"], family_id: 52, forms: ["normal", "alolan", "galarian"] },
  { dex: 58, name: "Growlithe", gen: 1, types: ["Fire"], family_id: 58, forms: ["normal", "hisuian"] },
  { dex: 59, name: "Arcanine", gen: 1, types: ["Fire"], family_id: 58, forms: ["normal", "hisuian"] },
  { dex: 63, name: "Abra", gen: 1, types: ["Psychic"], family_id: 63 },
  { dex: 64, name: "Kadabra", gen: 1, types: ["Psychic"], family_id: 63 },
  { dex: 65, name: "Alakazam", gen: 1, types: ["Psychic"], family_id: 63 },
  { dex: 66, name: "Machop", gen: 1, types: ["Fighting"], family_id: 66 },
  { dex: 67, name: "Machoke", gen: 1, types: ["Fighting"], family_id: 66 },
  { dex: 68, name: "Machamp", gen: 1, types: ["Fighting"], family_id: 66, forms: ["normal", "gmax"] },
  { dex: 74, name: "Geodude", gen: 1, types: ["Rock", "Ground"], family_id: 74, forms: ["normal", "alolan"] },
  { dex: 77, name: "Ponyta", gen: 1, types: ["Fire"], family_id: 77, forms: ["normal", "galarian"] },
  { dex: 78, name: "Rapidash", gen: 1, types: ["Fire"], family_id: 77, forms: ["normal", "galarian"] },
  { dex: 79, name: "Slowpoke", gen: 1, types: ["Water", "Psychic"], family_id: 79, forms: ["normal", "galarian"], costumes: ["2020_glasses", "detective"] },
  { dex: 80, name: "Slowbro", gen: 1, types: ["Water", "Psychic"], family_id: 79, forms: ["normal", "galarian"] },
  { dex: 88, name: "Grimer", gen: 1, types: ["Poison"], family_id: 88, forms: ["normal", "alolan"] },
  { dex: 92, name: "Gastly", gen: 1, types: ["Ghost", "Poison"], family_id: 92 },
  { dex: 93, name: "Haunter", gen: 1, types: ["Ghost", "Poison"], family_id: 92 },
  { dex: 94, name: "Gengar", gen: 1, types: ["Ghost", "Poison"], family_id: 92, costumes: ["party_hat", "spooky_festival"], forms: ["normal", "gmax"] },
  { dex: 103, name: "Exeggutor", gen: 1, types: ["Grass", "Psychic"], family_id: 102, forms: ["normal", "alolan"] },
  { dex: 105, name: "Marowak", gen: 1, types: ["Ground"], family_id: 104, forms: ["normal", "alolan"] },
  { dex: 115, name: "Kangaskhan", gen: 1, types: ["Normal"], family_id: 115 },
  { dex: 122, name: "Mr. Mime", gen: 1, types: ["Psychic", "Fairy"], family_id: 122, forms: ["normal", "galarian"] },
  { dex: 128, name: "Tauros", gen: 1, types: ["Normal"], family_id: 128, forms: ["normal", "paldean_combat", "paldean_blaze"] },
  { dex: 129, name: "Magikarp", gen: 1, types: ["Water"], family_id: 129 },
  { dex: 130, name: "Gyarados", gen: 1, types: ["Water", "Flying"], family_id: 129 },
  { dex: 131, name: "Lapras", gen: 1, types: ["Water", "Ice"], family_id: 131, costumes: ["bow", "blanche"] },
  { dex: 132, name: "Ditto", gen: 1, types: ["Normal"], family_id: 132 },
  { dex: 133, name: "Eevee", gen: 1, types: ["Normal"], family_id: 133, costumes: ["flower_crown", "party_hat", "holiday_hat"] },
  { dex: 134, name: "Vaporeon", gen: 1, types: ["Water"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 135, name: "Jolteon", gen: 1, types: ["Electric"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 136, name: "Flareon", gen: 1, types: ["Fire"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 142, name: "Aerodactyl", gen: 1, types: ["Rock", "Flying"], family_id: 142 },
  { dex: 143, name: "Snorlax", gen: 1, types: ["Normal"], family_id: 143, costumes: ["cowboy_hat", "nightcap"], forms: ["normal", "gmax"] },
  { dex: 144, name: "Articuno", gen: 1, types: ["Ice", "Flying"], family_id: 144, is_legendary: true, forms: ["normal", "galarian"] },
  { dex: 145, name: "Zapdos", gen: 1, types: ["Electric", "Flying"], family_id: 145, is_legendary: true, forms: ["normal", "galarian"] },
  { dex: 146, name: "Moltres", gen: 1, types: ["Fire", "Flying"], family_id: 146, is_legendary: true, forms: ["normal", "galarian"] },
  { dex: 147, name: "Dratini", gen: 1, types: ["Dragon"], family_id: 147 },
  { dex: 148, name: "Dragonair", gen: 1, types: ["Dragon"], family_id: 147 },
  { dex: 149, name: "Dragonite", gen: 1, types: ["Dragon", "Flying"], family_id: 147, costumes: ["bow_tie"] },
  { dex: 150, name: "Mewtwo", gen: 1, types: ["Psychic"], family_id: 150, is_legendary: true, forms: ["normal", "armored"] },
  { dex: 151, name: "Mew", gen: 1, types: ["Psychic"], family_id: 151, is_mythical: true },

  // Gen 2
  { dex: 172, name: "Pichu", gen: 2, types: ["Electric"], family_id: 25, costumes: ["ash_hat", "party_hat", "witch_hat"] },
  { dex: 175, name: "Togepi", gen: 2, types: ["Fairy"], family_id: 175, costumes: ["flower_crown"] },
  { dex: 196, name: "Espeon", gen: 2, types: ["Psychic"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 197, name: "Umbreon", gen: 2, types: ["Dark"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 212, name: "Scizor", gen: 2, types: ["Bug", "Steel"], family_id: 123 },
  { dex: 214, name: "Heracross", gen: 2, types: ["Bug", "Fighting"], family_id: 214 },
  { dex: 243, name: "Raikou", gen: 2, types: ["Electric"], family_id: 243, is_legendary: true },
  { dex: 244, name: "Entei", gen: 2, types: ["Fire"], family_id: 244, is_legendary: true },
  { dex: 245, name: "Suicune", gen: 2, types: ["Water"], family_id: 245, is_legendary: true },
  { dex: 246, name: "Larvitar", gen: 2, types: ["Rock", "Ground"], family_id: 246 },
  { dex: 247, name: "Pupitar", gen: 2, types: ["Rock", "Ground"], family_id: 246 },
  { dex: 248, name: "Tyranitar", gen: 2, types: ["Rock", "Dark"], family_id: 246 },
  { dex: 249, name: "Lugia", gen: 2, types: ["Psychic", "Flying"], family_id: 249, is_legendary: true, forms: ["normal", "apex"] },
  { dex: 250, name: "Ho-Oh", gen: 2, types: ["Fire", "Flying"], family_id: 250, is_legendary: true, forms: ["normal", "apex"] },
  { dex: 251, name: "Celebi", gen: 2, types: ["Psychic", "Grass"], family_id: 251, is_mythical: true },

  // Gen 3
  { dex: 252, name: "Treecko", gen: 3, types: ["Grass"], family_id: 252 },
  { dex: 254, name: "Sceptile", gen: 3, types: ["Grass"], family_id: 252 },
  { dex: 255, name: "Torchic", gen: 3, types: ["Fire"], family_id: 255 },
  { dex: 257, name: "Blaziken", gen: 3, types: ["Fire", "Fighting"], family_id: 255 },
  { dex: 258, name: "Mudkip", gen: 3, types: ["Water"], family_id: 258 },
  { dex: 260, name: "Swampert", gen: 3, types: ["Water", "Ground"], family_id: 258 },
  { dex: 280, name: "Ralts", gen: 3, types: ["Psychic", "Fairy"], family_id: 280, costumes: ["hat"] },
  { dex: 282, name: "Gardevoir", gen: 3, types: ["Psychic", "Fairy"], family_id: 280, costumes: ["hat"] },
  { dex: 302, name: "Sableye", gen: 3, types: ["Dark", "Ghost"], family_id: 302, costumes: ["litwick_hat"] },
  { dex: 371, name: "Bagon", gen: 3, types: ["Dragon"], family_id: 371 },
  { dex: 373, name: "Salamence", gen: 3, types: ["Dragon", "Flying"], family_id: 371 },
  { dex: 374, name: "Beldum", gen: 3, types: ["Steel", "Psychic"], family_id: 374 },
  { dex: 376, name: "Metagross", gen: 3, types: ["Steel", "Psychic"], family_id: 374 },
  { dex: 380, name: "Latias", gen: 3, types: ["Dragon", "Psychic"], family_id: 380, is_legendary: true },
  { dex: 381, name: "Latios", gen: 3, types: ["Dragon", "Psychic"], family_id: 381, is_legendary: true },
  { dex: 382, name: "Kyogre", gen: 3, types: ["Water"], family_id: 382, is_legendary: true, forms: ["normal", "primal"] },
  { dex: 383, name: "Groudon", gen: 3, types: ["Ground"], family_id: 383, is_legendary: true, forms: ["normal", "primal"] },
  { dex: 384, name: "Rayquaza", gen: 3, types: ["Dragon", "Flying"], family_id: 384, is_legendary: true, forms: ["normal", "mega"] },
  { dex: 385, name: "Jirachi", gen: 3, types: ["Steel", "Psychic"], family_id: 385, is_mythical: true },

  // Gen 4
  { dex: 443, name: "Gible", gen: 4, types: ["Dragon", "Ground"], family_id: 443 },
  { dex: 444, name: "Gabite", gen: 4, types: ["Dragon", "Ground"], family_id: 443 },
  { dex: 445, name: "Garchomp", gen: 4, types: ["Dragon", "Ground"], family_id: 443 },
  { dex: 447, name: "Riolu", gen: 4, types: ["Fighting"], family_id: 447 },
  { dex: 448, name: "Lucario", gen: 4, types: ["Fighting", "Steel"], family_id: 447 },
  { dex: 470, name: "Leafeon", gen: 4, types: ["Grass"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 471, name: "Glaceon", gen: 4, types: ["Ice"], family_id: 133, costumes: ["flower_crown", "holiday_cape"] },
  { dex: 475, name: "Gallade", gen: 4, types: ["Psychic", "Fighting"], family_id: 280 },
  { dex: 483, name: "Dialga", gen: 4, types: ["Steel", "Dragon"], family_id: 483, is_legendary: true, forms: ["normal", "origin"] },
  { dex: 484, name: "Palkia", gen: 4, types: ["Water", "Dragon"], family_id: 484, is_legendary: true, forms: ["normal", "origin"] },
  { dex: 487, name: "Giratina", gen: 4, types: ["Ghost", "Dragon"], family_id: 487, is_legendary: true, forms: ["altered", "origin"] },
  { dex: 488, name: "Cresselia", gen: 4, types: ["Psychic"], family_id: 488, is_legendary: true },
  { dex: 491, name: "Darkrai", gen: 4, types: ["Dark"], family_id: 491, is_mythical: true },
  { dex: 493, name: "Arceus", gen: 4, types: ["Normal"], family_id: 493, is_mythical: true },

  // Gen 5 & Later Highlights
  { dex: 610, name: "Axew", gen: 5, types: ["Dragon"], family_id: 610 },
  { dex: 612, name: "Haxorus", gen: 5, types: ["Dragon"], family_id: 610 },
  { dex: 633, name: "Deino", gen: 5, types: ["Dark", "Dragon"], family_id: 633, costumes: ["party_hat"] },
  { dex: 635, name: "Hydreigon", gen: 5, types: ["Dark", "Dragon"], family_id: 633 },
  { dex: 643, name: "Reshiram", gen: 5, types: ["Dragon", "Fire"], family_id: 643, is_legendary: true },
  { dex: 644, name: "Zekrom", gen: 5, types: ["Dragon", "Electric"], family_id: 644, is_legendary: true },
  { dex: 646, name: "Kyurem", gen: 5, types: ["Dragon", "Ice"], family_id: 646, is_legendary: true, forms: ["normal", "black", "white"] },
  { dex: 658, name: "Greninja", gen: 6, types: ["Water", "Dark"], family_id: 656 },
  { dex: 700, name: "Sylveon", gen: 6, types: ["Fairy"], family_id: 133, costumes: ["flower_crown"] },
  { dex: 706, name: "Goodra", gen: 6, types: ["Dragon"], family_id: 704, forms: ["normal", "hisuian"] },
  { dex: 716, name: "Xerneas", gen: 6, types: ["Fairy"], family_id: 716, is_legendary: true },
  { dex: 717, name: "Yveltal", gen: 6, types: ["Dark", "Flying"], family_id: 717, is_legendary: true },
  { dex: 778, name: "Mimikyu", gen: 7, types: ["Ghost", "Fairy"], family_id: 778 },
  { dex: 785, name: "Tapu Koko", gen: 7, types: ["Electric", "Fairy"], family_id: 785, is_legendary: true },
  { dex: 888, name: "Zacian", gen: 8, types: ["Fairy", "Steel"], family_id: 888, is_legendary: true, forms: ["hero", "crowned"] },
  { dex: 889, name: "Zamazenta", gen: 8, types: ["Fighting", "Steel"], family_id: 889, is_legendary: true, forms: ["hero", "crowned"] },
  { dex: 999, name: "Gimmighoul", gen: 9, types: ["Ghost"], family_id: 999, forms: ["roaming", "chest"] },
  { dex: 1000, name: "Gholdengo", gen: 9, types: ["Steel", "Ghost"], family_id: 999 },
];

function getSpriteUrl(dex: number, shiny: boolean): string {
  // Use high-definition official PokeAPI sprite assets
  if (shiny) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${dex}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex}.png`;
}

function computeRarity(pokemon: PokemonRaw, form: string, costume: string, shiny: boolean): { tier: string; score: number } {
  let score = 15; // base common

  if (pokemon.is_mythical) {
    score += 50;
  } else if (pokemon.is_legendary) {
    score += 40;
  } else if (pokemon.dex >= 147 && [149, 248, 373, 376, 445, 635].includes(pokemon.dex)) {
    score += 25; // Pseudo-legendary
  }

  if (shiny) {
    score += 35;
  }

  if (costume !== 'none') {
    score += 30; // Event-limited costume
  }

  if (form !== 'normal' && form !== 'altered' && form !== 'hero') {
    score += 15; // Regional or alternate form
  }

  score = Math.min(100, Math.max(5, score));

  let tier = 'common';
  if (score >= 90) tier = 'ultra_rare';
  else if (score >= 75) tier = 'legendary';
  else if (score >= 60) tier = 'epic';
  else if (score >= 40) tier = 'rare';
  else if (score >= 25) tier = 'uncommon';

  return { tier, score };
}

function generate() {
  const allPokemon = MASTER_POKEMON.map(p => ({
    dex: p.dex,
    name: p.name,
    gen: p.gen,
    types: p.types,
    family_id: p.family_id,
    is_legendary: !!p.is_legendary,
    is_mythical: !!p.is_mythical,
    base_rarity: p.is_mythical ? 85 : p.is_legendary ? 75 : 20
  }));

  const allVariants: any[] = [];

  for (const p of MASTER_POKEMON) {
    const forms = p.forms && p.forms.length > 0 ? p.forms : ['normal'];
    const costumes = ['none', ...(p.costumes || [])];

    for (const form of forms) {
      for (const costume of costumes) {
        for (const shiny of [false, true]) {
          // Special mythical rule (Mew is not tradeable in Pokémon GO, except standard tradeables)
          const is_tradeable = !p.is_mythical;
          const is_special_trade = shiny || p.is_legendary || costume !== 'none';

          const { tier, score } = computeRarity(p, form, costume, shiny);
          const variant_key = `${p.dex}:${form}:${costume}:${shiny ? 1 : 0}:any:none`;

          allVariants.push({
            variant_key,
            dex: p.dex,
            name: p.name,
            form,
            costume,
            shiny,
            gender: 'any',
            background: 'none',
            is_tradeable,
            is_special_trade: !!is_special_trade,
            sprite_path: getSpriteUrl(p.dex, shiny),
            rarity_tier: tier,
            rarity_score: score
          });
        }
      }
    }
  }

  const outDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'pokemon.json'), JSON.stringify(allPokemon, null, 2));
  fs.writeFileSync(path.join(outDir, 'variants.json'), JSON.stringify(allVariants, null, 2));

  console.log(`Successfully generated ${allPokemon.length} Pokémon and ${allVariants.length} canonical variants.`);
}

generate();
