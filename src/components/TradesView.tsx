'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { TradeMatch } from '../types';
import { ArrowLeftRight, CheckCircle2, MessageCircle, Star, XCircle, RefreshCw, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { ThreeWayFeedView } from './ThreeWayFeedView';

interface TradesViewProps {
  onOpenRating: (match: TradeMatch) => void;
}

export const TradesView: React.FC<TradesViewProps> = ({ onOpenRating }) => {
  const { matches, acceptTrade, completeTrade, cancelTrade, openChat, openUserProfile } = useTrade();
  const [tradeSubTab, setTradeSubTab] = useState<'active' | 'cycles'>('active');

  const activeTrades = matches.filter(m => m.status === 'proposed' || m.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111a2d] border border-[#1e2a42] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTradeSubTab('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tradeSubTab === 'active'
                ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Active Proposals</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-900 font-mono">
              {activeTrades.length}
            </span>
          </button>

          <button
            onClick={() => setTradeSubTab('cycles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tradeSubTab === 'cycles'
                ? 'bg-[#15273d] text-[#00d2ff] border border-[#00d2ff]/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>3-Way Group Cycles</span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Pokémon GO Rule: <span className="text-amber-400 font-semibold">1 Special Trade max per day</span>
        </div>
      </div>

      {tradeSubTab === 'cycles' ? (
        <ThreeWayFeedView />
      ) : (
        <div>
          {activeTrades.length === 0 ? (
            <div className="py-20 text-center bg-[#10192b] border border-dashed border-[#1d2940] rounded-2xl p-6 space-y-3">
              <Clock className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Active Proposals Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you or another trainer clicks "Propose Trade" from the matches feed, it will appear here for coordination.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="bg-[#111a2d] border border-[#1e2a42] rounded-2xl p-5 space-y-4 shadow-lg"
                >
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b253b] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                          trade.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {trade.status === 'accepted' ? 'Trade Accepted & In Progress' : 'Trade Proposed — Awaiting Confirmation'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Match Score: <span className="text-amber-400 font-bold">{trade.score}%</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openUserProfile(trade.partner)}
                        className="text-xs font-bold text-slate-300 hover:text-white"
                      >
                        View {trade.partner.username}'s Profile
                      </button>
                    </div>
                  </div>

                  {/* Visual Exchange */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0c1220] p-4 rounded-xl border border-[#1b253b]">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-800">
                        <img src={trade.b_receives.sprite_path} alt={trade.b_receives.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-red-400 uppercase">You give</div>
                        <div className="font-bold text-white text-sm">{trade.b_receives.name}</div>
                        <div className="text-xs text-slate-400">
                          {trade.b_receives.shiny && '✨ Shiny • '}{trade.b_receives.form}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-800">
                        <img src={trade.a_receives.sprite_path} alt={trade.a_receives.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase">You receive</div>
                        <div className="font-bold text-white text-sm">{trade.a_receives.name}</div>
                        <div className="text-xs text-slate-400">
                          {trade.a_receives.shiny && '✨ Shiny • '}{trade.a_receives.form}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => openChat(trade)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17253d] hover:bg-[#1c2e4c] border border-blue-900/40 text-blue-300 text-xs font-bold transition"
                    >
                      <MessageCircle className="w-4 h-4 text-cyan-400" />
                      <span>Chat with {trade.partner.username}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {trade.status === 'proposed' && (
                        <button
                          onClick={() => acceptTrade(trade.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs shadow-md transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Proposal</span>
                        </button>
                      )}

                      {trade.status === 'accepted' && (
                        <button
                          onClick={() => {
                            completeTrade(trade.id);
                            onOpenRating(trade);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-black text-slate-950 text-xs shadow-md transition"
                        >
                          <Star className="w-4 h-4 fill-current" />
                          <span>Mark Trade Completed</span>
                        </button>
                      )}

                      <button
                        onClick={() => cancelTrade(trade.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 text-xs font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
