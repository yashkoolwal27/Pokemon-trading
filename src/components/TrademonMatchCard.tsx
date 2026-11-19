'use client';

import React from 'react';
import { TradeMatch } from '../types';
import { Sparkles, MapPin, Star, CheckCircle2, Info, ArrowLeftRight, MessageCircle, ChevronRight } from 'lucide-react';

interface TrademonMatchCardProps {
  match: TradeMatch;
  isFeatured?: boolean;
  isSelected?: boolean;
  onSelect: () => void;
  onViewProfile: () => void;
  onOpenDetails?: () => void;
  onOpenChat?: () => void;
}

export const TrademonMatchCard: React.FC<TrademonMatchCardProps> = ({
  match,
  isFeatured = false,
  isSelected = false,
  onSelect,
  onViewProfile,
  onOpenDetails,
  onOpenChat,
}) => {
  const isExactVariant = !match.breakdown.substitute_used;
  const isSameCity = match.breakdown.proximity >= 80;
  const isSameRegion = match.breakdown.proximity >= 50;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-2xl p-4 sm:p-5 cursor-pointer transition select-none ${
        isFeatured
          ? 'bg-[#131d31] border-2 border-[#eab308] shadow-lg shadow-amber-500/10 hover:border-amber-400'
          : isSelected
          ? 'bg-[#15233c] border-2 border-[#00d2ff] shadow-md shadow-cyan-500/10'
          : 'bg-[#10192b] border border-[#1d2940] hover:border-slate-700/80 hover:bg-[#121c30]'
      }`}
    >
      {/* Featured Ribbon */}
      {isFeatured && (
        <div className="absolute -top-3 left-4 sm:left-6 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase px-2.5 sm:px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 tracking-wider">
          <span>★ FEATURED MATCH</span>
        </div>
      )}

      {/* Main Card Content Container */}
      <div className="space-y-4 mt-0.5">
        {/* Top Row: Trainer Header & Match Score (CSS Grid on Mobile) */}
        <div className="flex items-center justify-between gap-3">
          {/* Trainer Info */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile();
              }}
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 hover:border-blue-400 transition cursor-pointer shrink-0"
              title="View Full Profile"
            >
              {match.partner.avatar_url && (
                <img src={match.partner.avatar_url} alt={match.partner.username} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="min-w-0">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile();
                }}
                className="font-extrabold text-white text-xs sm:text-sm hover:text-blue-400 transition cursor-pointer flex items-center gap-1.5 truncate"
              >
                <span className="truncate">{match.partner.username}</span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Lv. {match.partner.level}</span>
                <span>•</span>
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                  <span>{match.partner.rating_avg} ({match.partner.trades_completed})</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500 shrink-0" />
                <span className="truncate">{match.partner.city}, {match.partner.country}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
              {match.score}%
            </div>
            <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mt-0.5">
              Match Score
            </div>
          </div>
        </div>

        {/* Center: "You Get" <---> "They Get" Visual Grid */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 bg-[#0b1220]/80 border border-[#1b253b] p-2.5 sm:p-3 rounded-xl">
          {/* You Get Card */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-900/90 border border-slate-800 p-1 flex items-center justify-center shrink-0 relative">
              <img
                src={match.a_receives.sprite_path}
                alt={match.a_receives.name}
                className="max-w-full max-h-full object-contain filter drop-shadow"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">You get</div>
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">{match.a_receives.name}</div>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                {match.a_receives.shiny && (
                  <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" /> Shiny
                  </span>
                )}
                <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                  {match.a_receives.form !== 'normal' ? match.a_receives.form : 'Form'}
                </span>
              </div>
            </div>
          </div>

          {/* Swap Arrow Icon */}
          <div className="p-1.5 sm:p-2 rounded-full bg-[#18263e] border border-[#233554] text-slate-400 shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>

          {/* They Get Card */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-900/90 border border-slate-800 p-1 flex items-center justify-center shrink-0 relative">
              <img
                src={match.b_receives.sprite_path}
                alt={match.b_receives.name}
                className="max-w-full max-h-full object-contain filter drop-shadow"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-purple-400">They get</div>
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">{match.b_receives.name}</div>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                {match.b_receives.shiny && (
                  <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" /> Shiny
                  </span>
                )}
                <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                  {match.b_receives.form !== 'normal' ? match.b_receives.form : 'Regular'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] sm:text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{isExactVariant ? 'Exact variant' : 'Close substitute'}</span>
          </div>

          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Similar rarity</span>
          </div>

          <div className="flex items-center gap-1">
            {isSameCity ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Same city</span>
              </>
            ) : isSameRegion ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Same region</span>
              </>
            ) : (
              <>
                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-slate-400">Different city</span>
              </>
            )}
          </div>
        </div>

        {/* Mobile Action Buttons (Visible on Mobile & Tablet, hidden on desktop XL where Inspector is visible) */}
        <div className="xl:hidden pt-2 border-t border-[#1b253b] grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetails) onOpenDetails();
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#141f33] hover:bg-[#1a2944] border border-[#233554] text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Trade Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat();
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
