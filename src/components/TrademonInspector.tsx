'use client';

import React from 'react';
import { TradeMatch } from '../types';
import { useTrade } from '../lib/trade-store';
import {
  Sparkles,
  Info,
  Users,
  MessageCircle,
  ArrowLeftRight,
  Star,
  CheckCircle2,
  Clock,
  Coins,
  MapPin,
  Plane
} from 'lucide-react';

interface TrademonInspectorProps {
  selectedMatch: TradeMatch | null;
  onOpenChat: (match: TradeMatch) => void;
  onViewProfile: (match: TradeMatch) => void;
}

export const TrademonInspector: React.FC<TrademonInspectorProps> = ({
  selectedMatch,
  onOpenChat,
  onViewProfile
}) => {
  const { proposeTrade, acceptTrade, completeTrade } = useTrade();

  if (!selectedMatch) {
    return (
      <aside className="w-80 bg-[#0c1322] border-l border-[#1b253b] p-5 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
        <ArrowLeftRight className="w-8 h-8 text-slate-600 mb-2" />
        <p>Select any trade match from the center feed to inspect full details and readiness.</p>
      </aside>
    );
  }

  const pokemon = selectedMatch.a_receives; // What you get
  const isSpecial = selectedMatch.breakdown.special_trade;
  const isSameCity = selectedMatch.breakdown.proximity >= 80;
  const canFly = selectedMatch.partner.can_fly;

  return (
    <aside className="w-80 bg-[#0c1322] border-l border-[#1b253b] p-4 flex flex-col justify-between h-full overflow-y-auto space-y-4 select-none">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white">Trade Details</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Selected
          </span>
        </div>

        {/* Selected Pokémon Card */}
        <div className="bg-[#111a2d] border border-[#1e2a42] rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="w-20 h-20 rounded-xl bg-[#090e18] border border-slate-800 p-2 flex items-center justify-center shrink-0 relative">
              {pokemon.shiny && (
                <span className="absolute top-1 left-1 text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                  ✨
                </span>
              )}
              <img src={pokemon.sprite_path} alt={pokemon.name} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-white truncate">{pokemon.name}</h4>
                <Star className="w-4 h-4 text-amber-400 fill-current" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Dex #{pokemon.dex.toString().padStart(3, '0')} • {pokemon.form !== 'normal' ? pokemon.form : 'Form'}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {pokemon.shiny && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Shiny
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {pokemon.costume !== 'none' ? pokemon.costume : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Readiness Card */}
        <div className="bg-[#111a2d] border border-[#1e2a42] rounded-2xl p-4 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white">Trade Readiness</h4>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-2 text-xs">
            {/* Friendship */}
            <div className="flex items-center justify-between text-slate-300 text-[11px]">
              <div className="flex items-center gap-2">
                <span>🤝</span>
                <span>Friendship</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-200">
                <span>Good Friends (≥ 7 days)</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Special Trade */}
            <div className="flex items-center justify-between text-slate-300 text-[11px]">
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Special trade</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-200">
                <span>{isSpecial ? 'Yes (1 daily limit)' : 'No (regular trade)'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center justify-between text-slate-300 text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Distance</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-200">
                <span>{isSameCity ? `Same city (${selectedMatch.partner.city})` : 'Different city'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Can Fly */}
            <div className="flex items-center justify-between text-slate-300 text-[11px]">
              <div className="flex items-center gap-2">
                <Plane className="w-3 h-3 text-slate-400" />
                <span>Can fly</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-slate-200">
                <span>{canFly ? 'Yes' : 'Local only'}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Demand Insight Card */}
        <div className="bg-[#111a2d] border border-[#1e2a42] rounded-2xl p-4 space-y-2 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demand Insight</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">14 trainers want this</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                High demand • Rarity score: <span className="text-amber-400 font-bold">{(pokemon.rarity_score / 10).toFixed(1)} / 10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action CTAs */}
      <div className="space-y-2 pt-2 border-t border-[#1b253b]">
        <div className="flex items-center gap-2">
          {/* Propose Trade Button */}
          <button
            onClick={() => proposeTrade(selectedMatch.id)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{selectedMatch.status === 'proposed' ? 'Trade Proposed' : 'Propose Trade'}</span>
          </button>

          {/* Chat Icon Button */}
          <button
            onClick={() => onOpenChat(selectedMatch)}
            className="p-3 rounded-xl bg-[#141f33] hover:bg-[#1a2944] border border-[#233554] text-slate-300 hover:text-white transition shadow-sm"
            title={`Chat with ${selectedMatch.partner.username}`}
          >
            <MessageCircle className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
