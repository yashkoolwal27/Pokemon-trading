'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { Team } from '../types';
import { X, Sparkles, Check, UserPlus, Shield } from 'lucide-react';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: () => void;
}

const TEAMS: { id: Team; label: string; color: string }[] = [
  { id: 'valor', label: 'Team Valor (Red)', color: 'border-red-500 bg-red-600/20 text-red-300' },
  { id: 'mystic', label: 'Team Mystic (Blue)', color: 'border-blue-500 bg-blue-600/20 text-blue-300' },
  { id: 'instinct', label: 'Team Instinct (Yellow)', color: 'border-yellow-500 bg-yellow-500/20 text-yellow-300' },
  { id: 'harmony', label: 'Team Harmony (Green)', color: 'border-emerald-500 bg-emerald-600/20 text-emerald-300' },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
}) => {
  const { createAccount } = useTrade();

  const [username, setUsername] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [team, setTeam] = useState<Team>('mystic');
  const [level, setLevel] = useState(35);
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [canFly, setCanFly] = useState(false);
  const [bio, setBio] = useState('Active trader looking for shinies and legendaries!');

  if (!isOpen) return null;

  // Format friend code as 4-4-4
  const handleFriendCodeChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    setFriendCode(parts.join(' '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !friendCode.trim()) return;

    createAccount({
      username: username.trim(),
      friend_code: friendCode.trim(),
      team,
      level,
      city: city.trim(),
      country: country.trim(),
      can_fly: canFly,
      bio: bio.trim(),
      avatar_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/${Math.floor(Math.random() * 8) + 1}.png`
    });

    onAccountCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Create Trainer Profile</h2>
              <p className="text-xs text-slate-400">Join the trading network and start matching</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trainer Nickname *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. RedMaster_99"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">12-Digit Friend Code *</label>
              <input
                type="text"
                value={friendCode}
                onChange={(e) => handleFriendCodeChange(e.target.value)}
                placeholder="0000 0000 0000"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Your Pokémon GO Team</label>
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

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trainer Level</label>
              <input
                type="number"
                min={1}
                max={50}
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
            <div>
              <div className="text-xs font-bold text-white">Can Fly / Coordinate Remote Trades</div>
              <div className="text-[11px] text-slate-400">Enables matching with trainers across other cities</div>
            </div>
            <input
              type="checkbox"
              checked={canFly}
              onChange={(e) => setCanFly(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-extrabold text-sm text-white shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Profile & Start Adding Pokémon</span>
          </button>
        </form>
      </div>
    </div>
  );
};
