'use client';

import React from 'react';
import { useTrade } from '../lib/trade-store';
import { LayoutDashboard, Layers, Users, ArrowLeftRight, Bell } from 'lucide-react';

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

  return (
    <header className="h-16 bg-[#0c1322] border-b border-[#1b253b] px-5 flex items-center justify-between z-30 select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav('dashboard')}>
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md shadow-red-500/20 flex flex-col">
          <div className="bg-[#ea2f2f] flex-1 w-full" />
          <div className="bg-white flex-1 w-full" />
          <div className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-900 rounded-full" />
          </div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-900" />
        </div>
        <span className="font-black text-lg tracking-wider text-white">
          TRADEMON
        </span>
      </div>

      {/* Center Nav Pills */}
      <nav className="hidden md:flex items-center gap-2">
        <button
          onClick={() => setActiveNav('dashboard')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeNav === 'dashboard'
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
            activeNav === 'lists'
              ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm shadow-[#00d2ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>My Lists</span>
        </button>

        <button
          onClick={() => setActiveNav('matches')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeNav === 'matches'
              ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm shadow-[#00d2ff]/20'
              : 'text-slate-400 hover:text-white hover:bg-[#131d31]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Matches</span>
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

      {/* Right Controls: Notifications & Trainer Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141e33] transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0c1322]" />
        </button>

        {/* User Card */}
        <div
          onClick={onOpenCreateAccount}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl hover:bg-[#141e33] cursor-pointer transition"
          title="Click to Switch or Create Trainer Profile"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
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
