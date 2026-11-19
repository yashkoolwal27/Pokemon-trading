'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import {
  LayoutDashboard,
  Layers,
  Heart,
  Package,
  Users,
  ArrowLeftRight,
  MessageCircle,
  History,
  Star,
  Plus,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Shield,
  Edit3
} from 'lucide-react';

interface TrademonSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onAddPokemon: () => void;
  onEditProfile: () => void;
}

export const TrademonSidebar: React.FC<TrademonSidebarProps> = ({
  activeView,
  setActiveView,
  onAddPokemon,
  onEditProfile
}) => {
  const { currentUser, wants, gives, matches } = useTrade();
  const [listsExpanded, setListsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const myWants = wants.filter(w => w.user_id === currentUser.id);
  const myGives = gives.filter(g => g.user_id === currentUser.id);

  const copyFriendCode = () => {
    navigator.clipboard.writeText(currentUser.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-64 bg-[#0c1322] border-r border-[#1b253b] flex flex-col justify-between p-4 h-full overflow-y-auto select-none">
      {/* Top Nav Items */}
      <div className="space-y-4">
        {/* Main Menu Links */}
        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'dashboard'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* My Lists Header */}
          <div>
            <button
              onClick={() => setListsExpanded(!listsExpanded)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>My Lists</span>
              </div>
              {listsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            {/* Sub Items: Want List & Give List */}
            {listsExpanded && (
              <div className="pl-6 pr-1 space-y-1 mt-1">
                <button
                  onClick={() => setActiveView('wants')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeView === 'wants'
                      ? 'bg-blue-600/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-blue-400" />
                    <span>Want List</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">({myWants.length})</span>
                </button>

                <button
                  onClick={() => setActiveView('gives')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeView === 'gives'
                      ? 'bg-emerald-600/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Give List</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">({myGives.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Matches */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'dashboard' || activeView === 'matches'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Matches</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600/40 text-purple-300">
              {matches.length}
            </span>
          </button>

          {/* Trades */}
          <button
            onClick={() => setActiveView('trades')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'trades'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-4 h-4" />
              <span>Trades</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600/40 text-purple-300">
              3
            </span>
          </button>

          {/* Chat */}
          <button
            onClick={() => setActiveView('chat')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'chat'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600/40 text-purple-300">
              5
            </span>
          </button>

          {/* Trade History */}
          <button
            onClick={() => setActiveView('history')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'history'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Trade History</span>
          </button>

          {/* Ratings */}
          <button
            onClick={() => setActiveView('ratings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeView === 'ratings'
                ? 'bg-[#152a3f] text-[#00d2ff] border border-[#00d2ff]/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span>Ratings</span>
            </div>
            <span className="text-xs text-amber-400 font-bold">
              ★ {currentUser.rating_avg} ({currentUser.trades_completed})
            </span>
          </button>
        </div>

        {/* Big "+ Add Pokémon" Button */}
        <button
          onClick={onAddPokemon}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Pokémon</span>
        </button>
      </div>

      {/* Bottom Profile Card */}
      <div className="bg-[#111a2d] border border-[#1e2a42] rounded-2xl p-3.5 mt-4 space-y-2.5 shadow-md">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          My Trading Profile
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0">
            {currentUser.avatar_url && (
              <img src={currentUser.avatar_url} alt={currentUser.username} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-400 font-medium">Friend Code</div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-white truncate">{currentUser.friend_code}</span>
              <button onClick={copyFriendCode} className="text-slate-400 hover:text-blue-400 transition ml-1" title="Copy code">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1b253b] space-y-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{currentUser.city}, {currentUser.country}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="capitalize text-blue-400 font-medium">Team {currentUser.team}</span>
            <span className="font-bold text-slate-300">Lv. {currentUser.level}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{currentUser.rating_avg} ({currentUser.trades_completed} trades)</span>
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="w-full py-1.5 rounded-lg bg-[#16233b] hover:bg-[#1b2b48] border border-slate-700/60 text-slate-300 hover:text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit Profile</span>
        </button>
      </div>
    </aside>
  );
};
