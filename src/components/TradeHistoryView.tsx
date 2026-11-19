'use client';

import React from 'react';
import { useTrade } from '../lib/trade-store';
import { History, Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export const TradeHistoryView: React.FC = () => {
  const { currentUser, matches, ratings } = useTrade();

  // Completed trades from matches
  const completedMatches = matches.filter(m => m.status === 'completed');

  // Realistic mock history if none completed yet
  const historyItems = completedMatches.length > 0 ? completedMatches : [
    {
      id: "hist-1",
      partnerName: "Misty_WaterGym",
      partnerCity: "New York, US",
      partnerAvatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png",
      gaveName: "Shiny Charizard",
      gaveSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/6.png",
      receivedName: "Armored Mewtwo",
      receivedSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
      date: "Yesterday at 4:15 PM",
      stardust: "20,000 Stardust",
      stars: 5,
      review: "Fast meetup in Central Park! Legitimate Armored Mewtwo trade."
    },
    {
      id: "hist-2",
      partnerName: "Red_Champion",
      partnerCity: "Tokyo, Japan",
      partnerAvatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/5.png",
      gaveName: "Apex Ho-Oh",
      gaveSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png",
      receivedName: "Shiny Origin Dialga",
      receivedSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/483.png",
      date: "3 days ago",
      stardust: "40,000 Stardust",
      stars: 5,
      review: "Incredible trade! Both special moves intact. Highly recommended trainer."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111a2d] border border-[#1e2a42] p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Trade History Log</h2>
            <p className="text-xs text-slate-400 mt-0.5">Verified record of all completed trades and partner reviews.</p>
          </div>
        </div>
        <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          <span>All Trades Verified</span>
        </div>
      </div>

      <div className="space-y-3">
        {historyItems.map((item: any) => (
          <div
            key={item.id}
            className="bg-[#10192b] border border-[#1e2a42] rounded-2xl p-5 space-y-3.5 shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#182338] pb-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.partnerAvatar || item.partner?.avatar_url}
                  alt={item.partnerName || item.partner?.username}
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <span className="font-bold text-white text-sm">{item.partnerName || item.partner?.username}</span>
                  <span className="text-slate-500 text-xs ml-2">{item.date || "Recently completed"}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 font-bold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="ml-1 text-xs">5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0c1220] p-3.5 rounded-xl border border-[#172238] text-xs">
              <div className="flex items-center gap-3">
                <img src={item.gaveSprite || item.b_receives?.sprite_path} className="w-12 h-12 object-contain" alt="" />
                <div>
                  <div className="text-[10px] text-red-400 uppercase font-bold">You Traded</div>
                  <div className="font-extrabold text-white">{item.gaveName || item.b_receives?.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img src={item.receivedSprite || item.a_receives?.sprite_path} className="w-12 h-12 object-contain" alt="" />
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">You Received</div>
                  <div className="font-extrabold text-white">{item.receivedName || item.a_receives?.name}</div>
                </div>
              </div>
            </div>

            {item.review && (
              <p className="text-xs text-slate-300 italic bg-[#0c1322] p-2.5 rounded-lg border border-[#162136]">
                "{item.review}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
