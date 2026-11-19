'use client';

import React from 'react';
import { useTrade } from '../lib/trade-store';
import { RefreshCw, ArrowRight, Sparkles, MessageSquare, MapPin } from 'lucide-react';

export const ThreeWayFeedView: React.FC = () => {
  const { currentUser, threeWayMatches } = useTrade();

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/60 border border-purple-800/40 p-6 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">3-Way Group Trade Cycles</h2>
            <p className="text-xs text-purple-300/80 mt-0.5">
              Unique engine capability: unlocks trades when no direct 2-way match exists by forming a 3-trainer circular exchange.
            </p>
          </div>
        </div>
      </div>

      {threeWayMatches.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-6">
          <RefreshCw className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No 3-Way Cycles Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            3-Way cycles are discovered automatically as more trainers update their lists and add wanted Pokémon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {threeWayMatches.map((cycle) => (
            <div
              key={cycle.id}
              className="bg-slate-900/80 border border-purple-800/30 rounded-2xl p-6 shadow-xl space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Triangular Trade Chain
                  </span>
                  <span className="text-xs text-slate-400">3 Players Connected</span>
                </div>
                <div className="text-sm font-extrabold text-amber-400">
                  Cycle Match Score: {cycle.score}%
                </div>
              </div>

              {/* 3 Step Visual Circle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1: You give to Trainer B */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Step 1: Your Trade</span>
                      <span className="text-[10px] text-slate-400">Pair A ➔ B</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={cycle.b_receives.sprite_path} alt={cycle.b_receives.name} className="w-14 h-14 object-contain" />
                      <div>
                        <div className="text-xs text-slate-400">You trade to:</div>
                        <div className="font-bold text-white text-sm">{cycle.user_b_profile.username}</div>
                        <div className="text-xs text-emerald-400 font-semibold mt-1">
                          You give: {cycle.b_receives.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Trainer B gives to Trainer C */}
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Step 2: Second Pair</span>
                      <span className="text-[10px] text-slate-400">Pair B ➔ C</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={cycle.c_receives.sprite_path} alt={cycle.c_receives.name} className="w-14 h-14 object-contain" />
                      <div>
                        <div className="text-xs text-slate-400">{cycle.user_b_profile.username} trades to:</div>
                        <div className="font-bold text-white text-sm">{cycle.user_c_profile.username}</div>
                        <div className="text-xs text-purple-300 font-semibold mt-1">
                          Receives: {cycle.c_receives.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Trainer C gives to You */}
                <div className="bg-slate-950/70 border border-emerald-900/30 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Step 3: Completing Cycle</span>
                      <span className="text-[10px] text-slate-400">Pair C ➔ A</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={cycle.a_receives.sprite_path} alt={cycle.a_receives.name} className="w-14 h-14 object-contain" />
                      <div>
                        <div className="text-xs text-slate-400">{cycle.user_c_profile.username} trades to:</div>
                        <div className="font-bold text-white text-sm">YOU ({currentUser.username})</div>
                        <div className="text-xs text-amber-400 font-bold mt-1">
                          You receive: {cycle.a_receives.name} ✨
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation & Action Note */}
              <div className="bg-slate-950/50 border border-slate-800/80 p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-300">
                  <span className="font-bold text-purple-400">How this works: </span>
                  {cycle.explanation}. Each trade occurs in-game pairwise between the players.
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-md transition">
                    Start Group Coordination
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
