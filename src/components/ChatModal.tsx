'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTrade } from '../lib/trade-store';
import { X, Send, Copy, Check, ShieldCheck, MapPin, AlertTriangle } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { activeConversation, closeChat, sendMessage, currentUser } = useTrade();
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (!activeConversation) return null;

  const { matchId, messages, partner } = activeConversation;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(matchId, inputText);
    setInputText('');
  };

  const copyPartnerCode = () => {
    navigator.clipboard.writeText(partner.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {partner.avatar_url && (
                <img src={partner.avatar_url} alt={partner.username} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{partner.username}</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Lv.{partner.level}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{partner.city}, {partner.country}</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friend Code & In-Game Trade Banner */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-purple-950/60 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Friend Code:</span>
            <span className="font-mono font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {partner.friend_code}
            </span>
          </div>

          <button
            onClick={copyPartnerCode}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white transition text-xs shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Safety & Game Rules Notice */}
        <div className="px-5 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Reminder: Only 1 Special Trade allowed per day in Pokémon GO. Coordinate location and time safely.</span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No messages yet. Say hello and suggest a time or place for the trade!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    {msg.body}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partner.username}...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
