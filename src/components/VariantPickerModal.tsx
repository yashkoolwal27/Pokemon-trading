'use client';

import React, { useState, useMemo } from 'react';
import { Variant } from '../types';
import rawVariants from '../data/variants.json';
import { Search, X, Sparkles, Crown, Tag, Star, Plus, Check } from 'lucide-react';

interface VariantPickerModalProps {
  mode: 'want' | 'give';
  isOpen: boolean;
  onClose: () => void;
  onSelect: (variant: Variant, config: { priority: number; acceptSubstitutes: boolean; quantity: number; notes: string }) => void;
}

export const VariantPickerModal: React.FC<VariantPickerModalProps> = ({
  mode,
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShiny, setFilterShiny] = useState(false);
  const [filterCostume, setFilterCostume] = useState(false);
  const [filterLegendary, setFilterLegendary] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Want configuration
  const [priority, setPriority] = useState(4);
  const [acceptSubstitutes, setAcceptSubstitutes] = useState(false);

  // Give configuration
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const filteredVariants = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return (rawVariants as Variant[]).filter(v => {
      if (q) {
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesDex = v.dex.toString() === q;
        const matchesForm = v.form.toLowerCase().includes(q);
        const matchesCostume = v.costume.toLowerCase().includes(q);
        if (!matchesName && !matchesDex && !matchesForm && !matchesCostume) {
          return false;
        }
      }

      if (filterShiny && !v.shiny) return false;
      if (filterCostume && v.costume === 'none') return false;
      if (filterLegendary && v.rarity_tier !== 'legendary' && v.rarity_tier !== 'ultra_rare') return false;

      return true;
    }).slice(0, 48); // performance slice
  }, [searchTerm, filterShiny, filterCostume, filterLegendary]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedVariant) return;
    onSelect(selectedVariant, {
      priority,
      acceptSubstitutes,
      quantity,
      notes
    });
    setSelectedVariant(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {mode === 'want' ? (
                <>
                  <span className="text-blue-400">Add to Want List</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">Looking For</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-400">Add to Give List</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">Available to Trade</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Select Pokémon with exact form, shiny status, and costume.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Pokémon name, Dex # (e.g. Charizard, 150, Rayquaza)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterShiny(!filterShiny)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterShiny ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shiny Only</span>
            </button>

            <button
              onClick={() => setFilterCostume(!filterCostume)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterCostume ? 'bg-purple-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Costumes / Event Hats</span>
            </button>

            <button
              onClick={() => setFilterLegendary(!filterLegendary)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterLegendary ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Legendary / Mythical</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredVariants.map((v) => {
            const isSelected = selectedVariant?.variant_key === v.variant_key;
            return (
              <div
                key={v.variant_key}
                onClick={() => setSelectedVariant(v)}
                className={`relative flex flex-col items-center p-3 rounded-xl border text-center cursor-pointer transition select-none ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60'
                }`}
              >
                {/* Shiny Badge */}
                {v.shiny && (
                  <span className="absolute top-2 left-2 flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" /> SHINY
                  </span>
                )}

                {/* Rarity Pill */}
                <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                  {v.rarity_score} pts
                </span>

                {/* Sprite */}
                <div className="w-20 h-20 flex items-center justify-center my-1">
                  <img
                    src={v.sprite_path}
                    alt={v.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition duration-150"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="w-full mt-1">
                  <div className="text-xs font-bold text-white truncate">{v.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    #{v.dex} {v.form !== 'normal' ? `• ${v.form}` : ''} {v.costume !== 'none' ? `• ${v.costume}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Options Bar (when a variant is chosen) */}
        {selectedVariant && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={selectedVariant.sprite_path} alt={selectedVariant.name} className="w-12 h-12 object-contain" />
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{selectedVariant.name}</span>
                  {selectedVariant.shiny && <span className="text-xs text-amber-400">✨ Shiny</span>}
                  <span className="text-xs text-slate-400">({selectedVariant.rarity_tier})</span>
                </div>
                <div className="text-xs text-slate-400">
                  Key: <code className="text-slate-300 font-mono">{selectedVariant.variant_key}</code>
                </div>
              </div>
            </div>

            {/* Config depending on Want vs Give */}
            <div className="flex items-center gap-4">
              {mode === 'want' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium">Priority:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setPriority(star)}
                          className={`p-1 rounded ${star <= priority ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptSubstitutes}
                      onChange={(e) => setAcceptSubstitutes(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Accept Substitutes</span>
                  </label>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium">Quantity:</span>
                    <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Confirm & Add</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
