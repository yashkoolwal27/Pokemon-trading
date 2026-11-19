'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { UserProfile, ChatMessage } from '../types';
import { MessageCircle, Send, Copy, Check, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export const ChatInboxView: React.FC = () => {
  const { allUsers, currentUser, sendMessage } = useTrade();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(allUsers.find(u => u.id !== currentUser.id)?.id || '');
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter partners
  const partners = allUsers.filter(u => u.id !== currentUser.id);
  const selectedPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const threadId = selectedPartner ? `chat-${currentUser.id}-${selectedPartner.id}` : '';

  // Local state messages for this thread
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    [`chat-${currentUser.id}-user-misty-002`]: [
      {
        id: "msg-1",
        conversation_id: "conv-1",
        sender_id: "user-misty-002",
        body: "Hey! Ready to swap my Armored Mewtwo for your Shiny Charizard in NYC?",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: "msg-2",
        conversation_id: "conv-1",
        sender_id: currentUser.id,
        body: "Yes! I added your friend code. Central Park this weekend works great for me.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      }
    ],
    [`chat-${currentUser.id}-user-brock-003`]: [
      {
        id: "msg-3",
        conversation_id: "conv-2",
        sender_id: "user-brock-003",
        body: "Hey there! I can fly over for your Shiny Rayquaza. Let me know your coordinates!",
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      }
    ]
  });

  const activeMessages = selectedPartner ? (messages[`chat-${currentUser.id}-${selectedPartner.id}`] || []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedPartner) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: threadId,
      sender_id: currentUser.id,
      body: inputText.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [`chat-${currentUser.id}-${selectedPartner.id}`]: [...(prev[`chat-${currentUser.id}-${selectedPartner.id}`] || []), newMsg]
    }));

    setInputText('');
  };

  const copyCode = () => {
    if (!selectedPartner) return;
    navigator.clipboard.writeText(selectedPartner.friend_code.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#10192b] border border-[#1e2a42] rounded-2xl h-[calc(100vh-140px)] flex flex-col md:flex-row overflow-hidden shadow-2xl">
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-r border-[#1b253b] flex flex-col bg-[#0c1322]">
        <div className="p-4 border-b border-[#1b253b] flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span>Trading Inbox</span>
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
            {partners.length} trainers
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#162238]">
          {partners.map((partner) => {
            const isSelected = selectedPartner?.id === partner.id;
            return (
              <button
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className={`w-full text-left p-3.5 flex items-center gap-3 transition ${
                  isSelected ? 'bg-[#15233c] text-white' : 'hover:bg-[#121c30] text-slate-400'
                }`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  {partner.avatar_url && (
                    <img src={partner.avatar_url} alt={partner.username} className="w-full h-full object-cover" />
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c1322]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{partner.username}</span>
                    <span className="text-[10px] text-slate-500">Lv. {partner.level}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {partner.city} • <span className="capitalize">{partner.team}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Conversation Window */}
      {selectedPartner ? (
        <div className="flex-1 flex flex-col justify-between bg-[#0b111e]">
          {/* Header */}
          <div className="p-4 border-b border-[#1b253b] bg-[#0e1626] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                {selectedPartner.avatar_url && (
                  <img src={selectedPartner.avatar_url} alt={selectedPartner.username} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>{selectedPartner.username}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                    Lv. {selectedPartner.level}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{selectedPartner.city}, {selectedPartner.country}</span>
                  <span>•</span>
                  <span>FC: {selectedPartner.friend_code}</span>
                </div>
              </div>
            </div>

            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Friend Code'}</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {activeMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                Start a trade conversation with {selectedPartner.username}! Exchange friend codes and arrange a meetup time.
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                          : 'bg-[#15233c] text-slate-200 border border-[#213559] rounded-bl-none'
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
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#1b253b] bg-[#0c1322] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${selectedPartner.username}...`}
              className="flex-1 bg-[#131d31] border border-[#1e2a42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2ff]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Select a trainer to start chatting.
        </div>
      )}
    </div>
  );
};
