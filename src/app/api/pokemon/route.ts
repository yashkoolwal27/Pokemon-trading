import { NextResponse } from 'next/server';
import rawVariants from '../../../data/variants.json';
import rawPokemon from '../../../data/pokemon.json';
import { Variant } from '../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const shinyOnly = searchParams.get('shiny') === 'true';
  const costumeOnly = searchParams.get('costume') === 'true';
  const legendaryOnly = searchParams.get('legendary') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let filtered = (rawVariants as Variant[]).filter((v) => {
    if (q) {
      const matchName = v.name.toLowerCase().includes(q);
      const matchDex = v.dex.toString() === q;
      const matchForm = v.form.toLowerCase().includes(q);
      const matchCostume = v.costume.toLowerCase().includes(q);
      if (!matchName && !matchDex && !matchForm && !matchCostume) {
        return false;
      }
    }

    if (shinyOnly && !v.shiny) return false;
    if (costumeOnly && v.costume === 'none') return false;
    if (legendaryOnly && v.rarity_tier !== 'legendary' && v.rarity_tier !== 'ultra_rare') return false;

    return true;
  });

  return NextResponse.json({
    total: filtered.length,
    variants: filtered.slice(0, limit)
  });
}
