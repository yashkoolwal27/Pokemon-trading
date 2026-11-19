'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { getVariant } from '../lib/engine/matcher';
import { UserProfile, Team } from '../types';
import { X, MapPin, Plane, Star, Copy, Check, MessageCircle, Layers, Sparkles, Award } from 'lucide-react';

interface UserProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
}

const TEAM_COLORS: Record<Team, string> = {
  valor: 'bg-red-500/20 text-red-300 border-red-500/40',
  mystic: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  instinct: 'bg-amber-500/20 text-amber-300 border-yellow-500/40',
  harmony: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ profile, onClose }) => {
  const { getUserLists, openChatWithUser } = useTrade();
  const [copied, setCopied] = useState(false);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'gives' | 'wants'>('gives');

  if (!profile) return null;

  const { wants: theirWants, gives: theirGives } = getUserLists(profile.id);

  const copyFriendCode = () => {
    navigator.clipboard.writeText(profile.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-600 shrink-0 shadow-lg">
              {profile.avatar_url && (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black text-white">{profile.username}</h2>
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${TEAM_COLORS[profile.team]}`}>
                  {profile.team} • Lv.{profile.level}
                </span>
                {profile.can_fly && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Plane className="w-3 h-3" /> Can Fly
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profile.city}, {profile.country}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {profile.rating_avg} ({profile.trades_completed} Trades Completed)
                </span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-300 italic mt-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                  "{profile.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Friend Code Banner */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Pokémon GO Friend Code:</span>
              <span className="font-mono font-bold text-white text-sm">{profile.friend_code}</span>
            </div>
            <button
              onClick={copyFriendCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-400 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Catalog Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCatalogTab('gives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeCatalogTab === 'gives'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Available to Trade (Give)</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px]">{theirGives.length}</span>
            </button>

            <button
              onClick={() => setActiveCatalogTab('wants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeCatalogTab === 'wants'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Looking For (Wants)</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px]">{theirWants.length}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeCatalogTab === 'gives' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {theirGives.length === 0 ? (
                <div className="col-span-full py-10 text-center text-slate-500 text-xs">
                  This trainer has not added any tradeable Pokémon yet.
                </div>
              ) : (
                theirGives.map((g) => {
                  const variant = getVariant(g.variant_key);
                  if (!variant) return null;
                  return (
                    <div
                      key={g.id}
                      className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3"
                    >
                      <div className="w-14 h-14 rounded-lg bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-800 relative">
                        {variant.shiny && (
                          <span className="absolute top-1 left-1 text-[8px] font-black px-1 rounded bg-amber-400 text-slate-950">
                            ✨
                          </span>
                        )}
                        <img src={variant.sprite_path} alt={variant.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{variant.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {variant.form !== 'normal' && `${variant.form} • `}
                          {variant.costume !== 'none' && `${variant.costume} • `}
                          Qty: <span className="text-emerald-400 font-bold">{g.quantity}</span>
                        </div>
                        {g.notes && <div className="text-[10px] text-slate-400 italic truncate mt-0.5">"{g.notes}"</div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeCatalogTab === 'wants' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {theirWants.length === 0 ? (
                <div className="col-span-full py-10 text-center text-slate-500 text-xs">
                  This trainer has not added any wanted Pokémon yet.
                </div>
              ) : (
                theirWants.map((w) => {
                  const variant = getVariant(w.variant_key);
                  if (!variant) return null;
                  return (
                    <div
                      key={w.id}
                      className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-center gap-3"
                    >
                      <div className="w-14 h-14 rounded-lg bg-slate-900 p-1 flex items-center justify-center shrink-0 border border-slate-800 relative">
                        {variant.shiny && (
                          <span className="absolute top-1 left-1 text-[8px] font-black px-1 rounded bg-amber-400 text-slate-950">
                            ✨
                          </span>
                        )}
                        <img src={variant.sprite_path} alt={variant.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{variant.name}</div>
                        <div className="text-[11px] text-amber-400 font-medium">
                          Priority: {w.priority}/5 ⭐
                        </div>
                        {w.notes && <div className="text-[10px] text-slate-400 italic truncate mt-0.5">"{w.notes}"</div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer Chat Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={() => openChatWithUser(profile)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-extrabold text-sm text-white shadow-lg shadow-blue-600/30 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with {profile.username}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
