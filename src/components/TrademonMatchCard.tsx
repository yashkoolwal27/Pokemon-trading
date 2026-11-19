'use client';

import React from 'react';
import { TradeMatch } from '../types';
import { Sparkles, MapPin, Star, CheckCircle2, Info, ArrowLeftRight } from 'lucide-react';

interface TrademonMatchCardProps {
  match: TradeMatch;
  isFeatured?: boolean;
  isSelected?: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  Fire: 'bg-red-500/20 text-red-300 border-red-500/30',
  Water: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Grass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Electric: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Dragon: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Psychic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Rock: 'bg-amber-600/20 text-amber-300 border-amber-600/30',
  Ghost: 'bg-violet-600/20 text-violet-300 border-violet-600/30',
  Steel: 'bg-slate-400/20 text-slate-200 border-slate-400/30',
  Ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Default: 'bg-slate-700/20 text-slate-300 border-slate-700/30',
};

export const TrademonMatchCard: React.FC<TrademonMatchCardProps> = ({
  match,
  isFeatured = false,
  isSelected = false,
  onSelect,
  onViewProfile,
}) => {
  const isExactVariant = !match.breakdown.substitute_used;
  const isSameCity = match.breakdown.proximity >= 80;
  const isSameRegion = match.breakdown.proximity >= 50;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl p-5 cursor-pointer transition select-none ${
        isFeatured
          ? 'bg-[#131d31] border-2 border-[#eab308] shadow-lg shadow-amber-500/10 hover:border-amber-400'
          : isSelected
          ? 'bg-[#15233c] border-2 border-[#00d2ff] shadow-md shadow-cyan-500/10'
          : 'bg-[#10192b] border border-[#1d2940] hover:border-slate-700/80 hover:bg-[#121c30]'
      }`}
    >
      {/* Featured Ribbon */}
      {isFeatured && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wider">
          <span>★ FEATURED MATCH</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mt-1">
        {/* Left: Trainer Profile */}
        <div className="flex items-center gap-3.5 min-w-[190px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile();
            }}
            className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 hover:border-blue-400 transition cursor-pointer shrink-0"
            title="View Full Profile"
          >
            {match.partner.avatar_url && (
              <img src={match.partner.avatar_url} alt={match.partner.username} className="w-full h-full object-cover" />
            )}
          </div>

          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile();
              }}
              className="font-extrabold text-white text-sm hover:text-blue-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{match.partner.username}</span>
            </div>
            <div className="text-[11px] text-slate-400">Lv. {match.partner.level}</div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-0.5">
              <Star className="w-3 h-3 fill-current" />
              <span>{match.partner.rating_avg} ({match.partner.trades_completed})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{match.partner.city}, {match.partner.country}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Center: "You Get" <---> "They Get" Cards */}
        <div className="flex-1 flex items-center justify-center gap-3 w-full max-w-xl">
          {/* You Get */}
          <div className="flex-1 bg-[#0b1220]/80 border border-[#1b253b] p-3 rounded-xl flex items-center gap-3 relative overflow-hidden group">
            <div className="w-16 h-16 rounded-xl bg-slate-900/90 border border-slate-800 p-1 flex items-center justify-center shrink-0 relative">
              <img
                src={match.a_receives.sprite_path}
                alt={match.a_receives.name}
                className="max-w-full max-h-full object-contain filter drop-shadow group-hover:scale-105 transition"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">You get</div>
              <div className="font-extrabold text-sm text-white truncate">{match.a_receives.name}</div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {match.a_receives.shiny && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Shiny
                  </span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {match.a_receives.form !== 'normal' ? match.a_receives.form : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="p-2 rounded-full bg-[#18263e] border border-[#233554] text-slate-400 shrink-0 shadow-sm">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          {/* They Get */}
          <div className="flex-1 bg-[#0b1220]/80 border border-[#1b253b] p-3 rounded-xl flex items-center gap-3 relative overflow-hidden group">
            <div className="w-16 h-16 rounded-xl bg-slate-900/90 border border-slate-800 p-1 flex items-center justify-center shrink-0 relative">
              <img
                src={match.b_receives.sprite_path}
                alt={match.b_receives.name}
                className="max-w-full max-h-full object-contain filter drop-shadow group-hover:scale-105 transition"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">They get</div>
              <div className="font-extrabold text-sm text-white truncate">{match.b_receives.name}</div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {match.b_receives.shiny && (
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Shiny
                  </span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {match.b_receives.form !== 'normal' ? match.b_receives.form : 'Regular'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Match Score Laurel & Checklist */}
        <div className="flex items-center gap-5 min-w-[210px] justify-between lg:justify-end">
          {/* Match Score */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <span className="text-2xl font-black text-amber-400 leading-none">
                {match.score}%
              </span>
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">
              Match Score
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isExactVariant ? 'Exact variant' : 'Close substitute'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Similar rarity</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              {isSameCity ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Same city</span>
                </>
              ) : isSameRegion ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Same region</span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Different city</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
