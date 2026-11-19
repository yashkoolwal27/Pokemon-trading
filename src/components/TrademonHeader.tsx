'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { LayoutDashboard, Layers, Users, ArrowLeftRight, Bell, Copy, Check } from 'lucide-react';

interface TrademonHeaderProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenCreateAccount?: () => void;
}

export const TrademonHeader: React.FC<TrademonHeaderProps> = ({
  activeNav,
  setActiveNav,
  onOpenCreateAccount
}) => {
  const { currentUser, matches, wants, gives } = useTrade();
  const [copied, setCopied] = useState(false);

  const copyFriendCode = () => {
    navigator.clipboard.writeText(currentUser.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-14 sm:h-16 bg-[#0c1322] border-b border-[#1b253b] px-3.5 sm:px-5 flex items-center justify-between z-30 select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveNav('dashboard')}>
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-white shadow-md shadow-red-500/20 flex flex-col shrink-0">
          <div className="bg-[#ea2f2f] flex-1 w-full" />
          <div className="bg-white flex-1 w-full" />
          <div className="absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-900 rounded-full" />
          </div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900" />
        </div>
        <span className="font-black text-base sm:text-lg tracking-wider text-white">
          TRADEMON
        </span>
      </div>

      {/* Center Nav Pills (Desktop) */}
      <nav className="hidden md:flex items-center gap-2">
        <button
          onClick={() => setActiveNav('dashboard')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeNav === 'dashboard' || activeNav === 'matches'
              ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm shadow-[#00d2ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveNav('lists')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeNav === 'lists' || activeNav === 'wants' || activeNav === 'gives'
              ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm shadow-[#00d2ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>My Lists</span>
        </button>

        <button
          onClick={() => setActiveNav('trades')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeNav === 'trades'
              ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm shadow-[#00d2ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Trades</span>
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Friend Code (Mobile friendly) */}
        <button
          onClick={copyFriendCode}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141e33] border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-mono transition"
          title="Click to copy your Pokémon GO Friend Code"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
          <span className="hidden sm:inline">FC: {currentUser.friend_code}</span>
          <span className="inline sm:hidden">{copied ? 'Copied' : 'FC'}</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141e33] transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0c1322]" />
        </button>

        {/* User Avatar */}
        <div
          onClick={onOpenCreateAccount}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#141e33] cursor-pointer transition shrink-0"
          title="Click to Switch or Create Trainer Profile"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
            {currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt={currentUser.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {currentUser.username[0]}
              </div>
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">{currentUser.username}</div>
            <div className="text-[10px] text-slate-400">Lv. {currentUser.level}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
