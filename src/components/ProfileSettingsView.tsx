'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { Team } from '../types';
import { User, MapPin, Plane, Shield, Star, Check, Award, Save } from 'lucide-react';

const TEAMS: { id: Team; label: string; color: string }[] = [
  { id: 'instinct', label: 'Team Instinct (Zapdos)', color: 'border-yellow-500 bg-yellow-500/10 text-yellow-300' },
  { id: 'mystic', label: 'Team Mystic (Articuno)', color: 'border-blue-500 bg-blue-500/10 text-blue-300' },
  { id: 'valor', label: 'Team Valor (Moltres)', color: 'border-red-500 bg-red-500/10 text-red-300' },
  { id: 'harmony', label: 'Team Harmony (Lugia)', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300' }
];

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, updateProfile, ratings } = useTrade();

  const [username, setUsername] = useState(currentUser.username);
  const [friendCode, setFriendCode] = useState(currentUser.friend_code);
  const [team, setTeam] = useState<Team>(currentUser.team);
  const [level, setLevel] = useState(currentUser.level);
  const [city, setCity] = useState(currentUser.city);
  const [country, setCountry] = useState(currentUser.country);
  const [canFly, setCanFly] = useState(currentUser.can_fly);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username,
      friend_code: friendCode,
      team,
      level,
      city,
      country,
      can_fly: canFly,
      bio
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 shadow-md">
          {currentUser.avatar_url ? (
            <img src={currentUser.avatar_url} alt={currentUser.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-white">{currentUser.username}</h2>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Level {currentUser.level}
            </span>
            {currentUser.can_fly && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Plane className="w-3 h-3" /> Can Fly / Remote
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {currentUser.city}, {currentUser.country}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              {currentUser.rating_avg} ({currentUser.trades_completed} Completed Trades)
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span>Trainer Settings & Trade Profile</span>
        </h3>

        {/* Username & Friend Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Trainer Nickname</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">12-Digit Friend Code</label>
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="e.g. 1234 5678 9012"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Team Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Pokémon GO Team</label>
          <div className="grid grid-cols-2 gap-2">
            {TEAMS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTeam(t.id)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                  team === t.id ? t.color : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{t.label}</span>
                {team === t.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Trainer Level (1-50)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Can Fly Flag */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-blue-400" />
              <span>"Can Fly" (Remote Trade Capability)</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Turn on if you travel or can coordinate coordinates with remote traders. Increases your match reach worldwide.
            </p>
          </div>
          <input
            type="checkbox"
            checked={canFly}
            onChange={(e) => setCanFly(e.target.checked)}
            className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Trade Bio / Rules</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Tell other trainers what you are focusing on (e.g. PvP IVs, lucky friends, Go Fest shinies)..."
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile updated successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
