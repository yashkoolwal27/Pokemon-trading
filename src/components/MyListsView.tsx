'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { getVariant } from '../lib/engine/matcher';
import { VariantPickerModal } from './VariantPickerModal';
import { Plus, Trash2, Star, Sparkles, Layers, ShieldCheck, Info } from 'lucide-react';
import { Variant } from '../types';

interface MyListsViewProps {
  onFindMatches?: () => void;
}

export const MyListsView: React.FC<MyListsViewProps> = ({ onFindMatches }) => {
  const { currentUser, wants, gives, addWant, removeWant, addGive, removeGive, updateGiveQuantity } = useTrade();
  const [activeSubTab, setActiveSubTab] = useState<'wants' | 'gives'>('wants');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const myWants = wants.filter((w) => w.user_id === currentUser.id);
  const myGives = gives.filter((g) => g.user_id === currentUser.id);

  const handleFindMatchesClick = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (onFindMatches) onFindMatches();
    }, 800);
  };

  const handleVariantSelected = (
    variant: Variant,
    config: { priority: number; acceptSubstitutes: boolean; quantity: number; notes: string }
  ) => {
    if (activeSubTab === 'wants') {
      addWant(variant.variant_key, config.priority, config.acceptSubstitutes, config.notes);
    } else {
      addGive(variant.variant_key, config.quantity, config.notes);
    }
  };

  return (
    <div className="space-y-6">
      {/* "Find Matches" Action Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-600/10 to-purple-600/10 border-2 border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            ⚡
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Ready to find trading partners?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              You have <span className="text-blue-400 font-bold">{myWants.length} Wanted</span> and{' '}
              <span className="text-emerald-400 font-bold">{myGives.length} Available</span> Pokémon listed.
            </p>
          </div>
        </div>

        <button
          onClick={handleFindMatchesClick}
          disabled={isSearching}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
        >
          {isSearching ? (
            <>
              <span className="animate-spin text-base">◓</span>
              <span>Scanning Trainers...</span>
            </>
          ) : (
            <>
              <span>🔍 Find Compatible Matches</span>
            </>
          )}
        </button>
      </div>

      {/* Sub Tabs and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('wants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeSubTab === 'wants'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>What I WANT</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 font-mono">
              {myWants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('gives')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              activeSubTab === 'gives'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>What I CAN GIVE</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/60 font-mono">
              {myGives.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 font-extrabold text-sm text-slate-950 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add to {activeSubTab === 'wants' ? 'Want' : 'Give'} List</span>
        </button>
      </div>

      {/* Wants List View */}
      {activeSubTab === 'wants' && (
        <div>
          {myWants.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">Your Want List is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Add Pokémon you are actively looking for. The matching engine compares your wants against what other trainers have.
              </p>
              <button
                onClick={() => setPickerOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition"
              >
                + Add First Pokémon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myWants.map((want) => {
                const variant = getVariant(want.variant_key);
                if (!variant) return null;

                return (
                  <div
                    key={want.id}
                    className="relative bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex gap-4 items-center group transition shadow-sm"
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => removeWant(want.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Remove from Want list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Sprite Box */}
                    <div className="w-20 h-20 rounded-xl bg-slate-950/60 border border-slate-800/80 p-1 flex items-center justify-center shrink-0 relative">
                      {variant.shiny && (
                        <span className="absolute top-1 left-1 text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                          ✨
                        </span>
                      )}
                      <img src={variant.sprite_path} alt={variant.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">{variant.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          #{variant.dex}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {variant.form !== 'normal' && <span className="capitalize">{variant.form} • </span>}
                        {variant.costume !== 'none' && <span className="capitalize">{variant.costume}</span>}
                        {variant.form === 'normal' && variant.costume === 'none' && 'Standard Form'}
                      </div>

                      {/* Priority Stars */}
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= want.priority ? 'text-amber-400 fill-current' : 'text-slate-700'}`}
                          />
                        ))}
                        {want.accept_substitutes && (
                          <span className="text-[10px] text-blue-400 font-medium ml-1.5">Substitutes OK</span>
                        )}
                      </div>

                      {want.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1 truncate">"{want.notes}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Gives List View */}
      {activeSubTab === 'gives' && (
        <div>
          {myGives.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6">
              <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">Your Give List is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                List the duplicate shinies, legendaries, or costumes you are ready to trade away.
              </p>
              <button
                onClick={() => setPickerOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition"
              >
                + Add First Pokémon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myGives.map((give) => {
                const variant = getVariant(give.variant_key);
                if (!variant) return null;

                return (
                  <div
                    key={give.id}
                    className="relative bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex gap-4 items-center group transition shadow-sm"
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => removeGive(give.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Remove from Give list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Sprite Box */}
                    <div className="w-20 h-20 rounded-xl bg-slate-950/60 border border-slate-800/80 p-1 flex items-center justify-center shrink-0 relative">
                      {variant.shiny && (
                        <span className="absolute top-1 left-1 text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                          ✨
                        </span>
                      )}
                      <img src={variant.sprite_path} alt={variant.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">{variant.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          #{variant.dex}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5 truncate">
                        {variant.form !== 'normal' && <span className="capitalize">{variant.form} • </span>}
                        {variant.costume !== 'none' && <span className="capitalize">{variant.costume}</span>}
                        {variant.form === 'normal' && variant.costume === 'none' && 'Standard Form'}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                        <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                          <button
                            onClick={() => updateGiveQuantity(give.id, -1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-bold text-emerald-400">{give.quantity}</span>
                          <button
                            onClick={() => updateGiveQuantity(give.id, 1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {give.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1 truncate">"{give.notes}"</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal Picker */}
      <VariantPickerModal
        mode={activeSubTab === 'wants' ? 'want' : 'give'}
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleVariantSelected}
      />
    </div>
  );
};
