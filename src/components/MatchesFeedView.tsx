'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { TradeMatch, Team } from '../types';
import { Sparkles, MessageCircle, ArrowLeftRight, CheckCircle2, MapPin, Plane, Star, Coins, AlertCircle, ShieldCheck, User } from 'lucide-react';

interface MatchesFeedViewProps {
  onOpenRating: (match: TradeMatch) => void;
}

const TEAM_BADGES: Record<Team, string> = {
  valor: 'bg-red-500/20 text-red-400 border-red-500/30',
  mystic: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  instinct: 'bg-amber-500/20 text-amber-300 border-yellow-500/30',
  harmony: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
};

export const MatchesFeedView: React.FC<MatchesFeedViewProps> = ({ onOpenRating }) => {
  const { matches, currentUser, proposeTrade, acceptTrade, completeTrade, openChat, openUserProfile } = useTrade();
  const [filterNearbyOnly, setFilterNearbyOnly] = useState(false);

  const displayedMatches = matches.filter((m) => {
    if (filterNearbyOnly && m.proximity_score < 70) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Insights */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/60 to-purple-900/30 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-lg font-extrabold text-white">Direct Trade Matches</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Engine evaluated your Want & Give lists against all active trainers. Ranked by compatibility, distance & rarity fairness.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterNearbyOnly(!filterNearbyOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              filterNearbyOnly
                ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Same City / Can Fly Only</span>
          </button>
        </div>
      </div>

      {/* Matches List */}
      {displayedMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6">
          <ArrowLeftRight className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Direct Matches Right Now</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Try adding more Pokémon to your Give list or turning on "Accept Substitutes" for your desired species.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedMatches.map((m) => {
            const isSpecialTrade = m.breakdown.special_trade;
            return (
              <div
                key={m.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition space-y-4"
              >
                {/* Header: Partner Profile & Match Score */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  {/* Partner Info */}
                  <div
                    onClick={() => openUserProfile(m.partner)}
                    className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition"
                    title={`Click to view ${m.partner.username}'s full profile`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0 group-hover:border-blue-400 transition">
                      {m.partner.avatar_url && (
                        <img src={m.partner.avatar_url} alt={m.partner.username} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm group-hover:text-blue-400 transition flex items-center gap-1">
                          {m.partner.username}
                          <span className="text-[10px] text-slate-500 font-normal">(View Profile)</span>
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${TEAM_BADGES[m.partner.team]}`}>
                          {m.partner.team} • Lv.{m.partner.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {m.partner.city}, {m.partner.country}
                        </span>
                        {m.partner.can_fly && (
                          <span className="flex items-center gap-0.5 text-blue-400 font-semibold text-[11px]">
                            <Plane className="w-3 h-3" /> Can Fly
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" /> {m.partner.rating_avg} ({m.partner.trades_completed} trades)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score Pill */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Compatibility</div>
                      <div className="text-xl font-black text-amber-400 leading-none mt-0.5">
                        {m.score}%
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-blue-400 text-sm">
                      {m.score >= 85 ? '🔥 High' : m.score >= 70 ? '✨ Good' : '⚡ Fair'}
                    </div>
                  </div>
                </div>

                {/* Trade Visualizer: You Give <---> You Receive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl">
                  {/* You Give */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 relative">
                      {m.b_receives.shiny && (
                        <span className="absolute top-1 left-1 text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                          ✨
                        </span>
                      )}
                      <img src={m.b_receives.sprite_path} alt={m.b_receives.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">You Give</div>
                      <div className="font-extrabold text-sm text-white truncate">{m.b_receives.name}</div>
                      <div className="text-xs text-slate-400">
                        {m.b_receives.shiny ? 'Shiny • ' : ''}
                        {m.b_receives.form !== 'normal' ? `${m.b_receives.form} • ` : ''}
                        {m.b_receives.costume !== 'none' ? `${m.b_receives.costume} • ` : ''}
                        <span className="text-slate-300 font-medium">{m.b_receives.rarity_score} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* You Receive */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-blue-900/30">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 relative">
                      {m.a_receives.shiny && (
                        <span className="absolute top-1 left-1 text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                          ✨
                        </span>
                      )}
                      <img src={m.a_receives.sprite_path} alt={m.a_receives.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">You Receive</div>
                      <div className="font-extrabold text-sm text-white truncate">{m.a_receives.name}</div>
                      <div className="text-xs text-slate-400">
                        {m.a_receives.shiny ? 'Shiny • ' : ''}
                        {m.a_receives.form !== 'normal' ? `${m.a_receives.form} • ` : ''}
                        {m.a_receives.costume !== 'none' ? `${m.a_receives.costume} • ` : ''}
                        <span className="text-slate-300 font-medium">{m.a_receives.rarity_score} pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engine Explanation & Feasibility Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                      💡 {m.explanation}
                    </span>

                    {isSpecialTrade && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/60 font-medium">
                        <Coins className="w-3.5 h-3.5 text-purple-400" />
                        <span>Special Trade (~{m.stardust_cost.toLocaleString()} Stardust)</span>
                      </span>
                    )}

                    {m.breakdown.substitute_used && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[11px]">
                        Substitute Matched
                      </span>
                    )}
                  </div>

                  {/* Score breakdown tags */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span>Fairness: {m.breakdown.fairness}%</span>
                    <span>•</span>
                    <span>Proximity: {m.breakdown.proximity}%</span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Status:</span>
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : m.status === 'accepted'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : m.status === 'proposed'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openUserProfile(m.partner)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => openChat(m)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 text-xs font-bold border border-blue-800/60 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                      <span>Chat ({m.partner.username})</span>
                    </button>

                    {m.status === 'suggested' && (
                      <button
                        onClick={() => proposeTrade(m.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        <span>Propose Trade</span>
                      </button>
                    )}

                    {m.status === 'proposed' && (
                      <button
                        onClick={() => acceptTrade(m.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Trade</span>
                      </button>
                    )}

                    {m.status === 'accepted' && (
                      <button
                        onClick={() => {
                          completeTrade(m.id);
                          onOpenRating(m);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/30 transition"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        <span>Mark Done & Review</span>
                      </button>
                    )}

                    {m.status === 'completed' && (
                      <button
                        onClick={() => onOpenRating(m)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-bold border border-slate-700"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rate Partner</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
