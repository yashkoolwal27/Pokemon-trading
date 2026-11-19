'use client';

import React from 'react';
import { useTrade } from '../lib/trade-store';
import { Star, Award, ShieldCheck, ThumbsUp, Heart, CheckCircle2 } from 'lucide-react';

export const RatingsReputationView: React.FC = () => {
  const { currentUser, ratings } = useTrade();

  const badges = [
    { title: "Fair Trader", desc: "Never lowballs or alters trade terms", count: 42, icon: "⚖️" },
    { title: "Fast Responder", desc: "Replies to trade chats within 10 minutes", count: 38, icon: "⚡" },
    { title: "Punctual / On Time", desc: "Always shows up on time for local trades", count: 29, icon: "⏱️" },
    { title: "High IV / Lucky Friends", desc: "Coordinates Lucky Trade triggers", count: 18, icon: "🍀" },
  ];

  const recentReviews = [
    {
      author: "Misty_WaterGym",
      stars: 5,
      date: "Yesterday",
      comment: "Super smooth trade! We met up in Central Park. The Shiny Charizard had amazing stats. Definitely trading again!",
      tags: ["Fair Trader", "Fast Responder", "Punctual / On Time"]
    },
    {
      author: "Brock_RockSolid",
      stars: 5,
      date: "3 days ago",
      comment: "Coordinated coordinates perfectly. Instant response and very patient while Stardust was calculated.",
      tags: ["Fast Responder", "High IV / Lucky Trade"]
    },
    {
      author: "Dawn_SinnohStar",
      stars: 5,
      date: "1 week ago",
      comment: "Legitimate collector! Helped me finish my Sinnoh Pokédex with a clean Shiny Dialga trade.",
      tags: ["Fair Trader", "Recommended Trainer"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Reputation Card */}
      <div className="bg-[#111a2d] border border-[#1e2a42] p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border-2 border-amber-400 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
            <span className="text-2xl font-black text-amber-400 leading-none">
              {currentUser.rating_avg}
            </span>
            <div className="flex items-center gap-0.5 mt-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-2.5 h-2.5 fill-current" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white">Trainer Reputation Score</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Trader
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Based on <span className="text-white font-bold">{currentUser.trades_completed} verified trades</span> across the Pokémon GO community.
            </p>
          </div>
        </div>

        {/* Rating Breakdown Bar */}
        <div className="w-full md:w-64 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>5 ★</span>
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-full w-[95%]" />
            </div>
            <span>95%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>4 ★</span>
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-full w-[5%]" />
            </div>
            <span>5%</span>
          </div>
        </div>
      </div>

      {/* Community Praise Badges */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Community Badges Earned
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.title}
              className="bg-[#10192b] border border-[#1e2a42] p-4 rounded-xl flex items-start gap-3 shadow-md"
            >
              <div className="text-2xl p-2 rounded-xl bg-slate-800/80 shrink-0">
                {b.icon}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-xs text-white truncate">{b.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{b.desc}</div>
                <div className="text-[10px] font-bold text-cyan-400 mt-2">
                  Awarded {b.count} times
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Reviews */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Recent Partner Testimonials
        </h3>

        <div className="space-y-3">
          {recentReviews.map((r, i) => (
            <div
              key={i}
              className="bg-[#10192b] border border-[#1e2a42] p-5 rounded-xl space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <span>{r.author}</span>
                  <span className="text-slate-500 font-normal">• {r.date}</span>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0c1322] p-3 rounded-lg border border-[#172238]">
                "{r.comment}"
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700/60 font-medium"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
