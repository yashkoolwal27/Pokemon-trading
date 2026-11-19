'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { TradeMatch } from '../types';
import { TrademonMatchCard } from './TrademonMatchCard';
import { Search, SlidersHorizontal, ChevronDown, Sparkles, X, MapPin } from 'lucide-react';

interface TrademonMainFeedProps {
  selectedMatch: TradeMatch | null;
  onSelectMatch: (match: TradeMatch) => void;
  onViewProfile: (match: TradeMatch) => void;
}

export const TrademonMainFeed: React.FC<TrademonMainFeedProps> = ({
  selectedMatch,
  onSelectMatch,
  onViewProfile
}) => {
  const { matches, currentUser } = useTrade();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'perfect' | 'partial'>('perfect');
  const [locationFilter, setLocationFilter] = useState(currentUser.city);
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'rarity'>('score');

  const filteredMatches = matches.filter(m => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchGive = m.b_receives.name.toLowerCase().includes(q);
      const matchGet = m.a_receives.name.toLowerCase().includes(q);
      const matchPartner = m.partner.username.toLowerCase().includes(q);
      if (!matchGive && !matchGet && !matchPartner) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0b111e]">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#171f38] via-[#1a2342] to-[#252849] border border-[#233152] p-6 sm:p-7 shadow-xl">
        {/* Decorative Trainer Graphic / Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 sm:opacity-70 pointer-events-none overflow-hidden flex items-end justify-end">
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-500/20 via-cyan-400/20 to-transparent blur-2xl" />
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png"
            alt="Trainer looking at horizon"
            className="w-48 h-48 object-contain filter drop-shadow-2xl translate-x-4 translate-y-4"
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Find your next <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">perfect trade</span> ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-1.5 leading-relaxed">
            Match with nearby trainers, swap the Pokémon you want, and grow your collection.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Pokémon (e.g. "Charizard", "shiny", "costume")'
            className="w-full bg-[#111a2d] border border-[#1e2a42] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00d2ff]"
          />
        </div>

        {/* Filters Button */}
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#111a2d] hover:bg-[#15233c] border border-[#1e2a42] text-xs font-bold text-slate-300 transition">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
        </button>

        {/* Location Tag */}
        {locationFilter && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111a2d] border border-[#1e2a42] text-xs font-bold text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{locationFilter}, US</span>
            <button onClick={() => setLocationFilter('')} className="text-slate-500 hover:text-slate-300 ml-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* All Variants Dropdown */}
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#111a2d] hover:bg-[#15233c] border border-[#1e2a42] text-xs font-bold text-slate-300 transition">
          <span>All Variants</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* Tabs and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('perfect')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'perfect'
                ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-[#10192b]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfect Matches ({filteredMatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('partial')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'partial'
                ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-[#10192b]'
            }`}
          >
            <span>⇄ Partial Matches (8)</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Sort by:</span>
          <button className="flex items-center gap-1 font-bold text-slate-300 bg-[#111a2d] border border-[#1e2a42] px-3 py-1.5 rounded-lg">
            <span>Match Score</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3.5">
        {filteredMatches.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs bg-[#10192b] border border-dashed border-[#1d2940] rounded-2xl p-6">
            No matches found for "{searchTerm}". Try clearing search filters or adding more Pokémon.
          </div>
        ) : (
          filteredMatches.map((match, idx) => (
            <TrademonMatchCard
              key={match.id}
              match={match}
              isFeatured={idx === 0}
              isSelected={selectedMatch?.id === match.id}
              onSelect={() => onSelectMatch(match)}
              onViewProfile={() => onViewProfile(match)}
            />
          ))
        )}
      </div>
    </div>
  );
};
