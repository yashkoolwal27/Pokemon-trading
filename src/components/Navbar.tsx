'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { Shield, MapPin, Plane, Copy, Check, ChevronDown, User, Star, UserPlus } from 'lucide-react';
import { Team } from '../types';

interface NavbarProps {
  activeTab: 'matches' | 'threeway' | 'lists' | 'profile';
  setActiveTab: (tab: 'matches' | 'threeway' | 'lists' | 'profile') => void;
  onOpenCreateAccount?: () => void;
}

const TEAM_COLORS: Record<Team, string> = {
  valor: 'bg-red-600 text-white border-red-500',
  mystic: 'bg-blue-600 text-white border-blue-500',
  instinct: 'bg-amber-500 text-slate-900 border-yellow-400',
  harmony: 'bg-emerald-600 text-white border-emerald-500'
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCreateAccount }) => {
  const { currentUser, allUsers, setCurrentUserById, matches, threeWayMatches } = useTrade();
  const [copied, setCopied] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const copyFriendCode = () => {
    navigator.clipboard.writeText(currentUser.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('matches')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-500 to-blue-600 p-0.5 shadow-lg shadow-blue-900/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg">
                ◓
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                  PoGo Trade Central
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  PWA
                </span>
              </div>
              <p className="text-xs text-slate-400">Smart Pokémon GO Matching Engine</p>
            </div>
          </div>

          {/* Active Trainer Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition shadow-sm text-left"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border border-slate-600">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">{currentUser.username}</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 rounded border ${TEAM_COLORS[currentUser.team]}`}>
                    Lv.{currentUser.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {currentUser.city}</span>
                  {currentUser.can_fly && (
                    <span className="flex items-center gap-0.5 text-blue-400 font-medium">
                      <Plane className="w-3 h-3" /> Can Fly
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {/* Profile Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Test Trainer</p>
                    <p className="text-xs text-slate-500">Test matches as different players</p>
                  </div>
                  {onOpenCreateAccount && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenCreateAccount();
                      }}
                      className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition"
                      title="Create New Trainer Account"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUserById(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800 text-left transition ${
                        u.id === currentUser.id ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                          {u.avatar_url && <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{u.username}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5">
                            <span>{u.city}</span>
                            <span>•</span>
                            <span className="capitalize">{u.team}</span>
                          </div>
                        </div>
                      </div>
                      {u.id === currentUser.id && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Friend Code Bar & Nav Tabs */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'matches'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Direct Matches</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'matches' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {matches.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('threeway')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'threeway'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>3-Way Cycles</span>
              {threeWayMatches.length > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${activeTab === 'threeway' ? 'bg-purple-800 text-white' : 'bg-purple-900/60 text-purple-300'}`}>
                  {threeWayMatches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('lists')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'lists'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Lists (Want & Give)
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Profile & Settings
            </button>
          </nav>

          {/* Quick Friend Code Copy */}
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-lg">
            <span className="text-xs text-slate-400 font-mono">FC: {currentUser.friend_code}</span>
            <button
              onClick={copyFriendCode}
              className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
              title="Copy Pokémon GO Friend Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
