'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserWant, UserGive, TradeMatch, ThreeWayTradeMatch, ChatMessage, TradeRating, Variant } from '../types';
import { INITIAL_PROFILES, INITIAL_WANTS, INITIAL_GIVES } from '../data/mock-users';
import { RecommendationEngine, getVariant } from './engine/matcher';
import rawVariants from '../data/variants.json';

interface TradeContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  wants: UserWant[];
  gives: UserGive[];
  matches: TradeMatch[];
  threeWayMatches: ThreeWayTradeMatch[];
  activeConversation: { matchId: string; messages: ChatMessage[]; partner: UserProfile } | null;
  viewingProfile: UserProfile | null;
  tradeStatuses: Record<string, TradeMatch['status']>;
  ratings: TradeRating[];
  setCurrentUserById: (id: string) => void;
  createAccount: (data: Omit<UserProfile, 'id' | 'trades_completed' | 'rating_avg' | 'rating_count' | 'last_active_at'>) => UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  openUserProfile: (profile: UserProfile) => void;
  closeUserProfile: () => void;
  getUserLists: (userId: string) => { wants: UserWant[]; gives: UserGive[] };
  addWant: (variantKey: string, priority: number, acceptSubstitutes: boolean, notes?: string) => void;
  removeWant: (wantId: string) => void;
  addGive: (variantKey: string, quantity: number, notes?: string) => void;
  removeGive: (giveId: string) => void;
  updateGiveQuantity: (giveId: string, delta: number) => void;
  proposeTrade: (matchId: string) => void;
  acceptTrade: (matchId: string) => void;
  completeTrade: (matchId: string) => void;
  cancelTrade: (matchId: string) => void;
  openChat: (match: TradeMatch) => void;
  openChatWithUser: (partner: UserProfile, matchId?: string) => void;
  closeChat: () => void;
  sendMessage: (matchId: string, text: string) => void;
  submitRating: (matchId: string, ratedId: string, stars: number, tags: string[], comment?: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const STORAGE_KEY_PROFILES = 'pogo_profiles_v1';
const STORAGE_KEY_WANTS = 'pogo_wants_v1';
const STORAGE_KEY_GIVES = 'pogo_gives_v1';
const STORAGE_KEY_CHATS = 'pogo_chats_v1';
const STORAGE_KEY_STATUSES = 'pogo_statuses_v1';
const STORAGE_KEY_RATINGS = 'pogo_ratings_v1';
const STORAGE_KEY_CURRENT_USER = 'pogo_current_user_v1';

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_PROFILES[0]);
  const [wants, setWants] = useState<UserWant[]>(INITIAL_WANTS);
  const [gives, setGives] = useState<UserGive[]>(INITIAL_GIVES);
  const [tradeStatuses, setTradeStatuses] = useState<Record<string, TradeMatch['status']>>({});
  const [viewingProfile, setViewingProfile] = useState<UserProfile | null>(null);
  const [messagesByMatch, setMessagesByMatch] = useState<Record<string, ChatMessage[]>>({
    "match-user-ash-001-user-misty-002-150:armored:none:0:any:none-6:normal:none:1:any:none": [
      {
        id: "msg-1",
        conversation_id: "conv-1",
        sender_id: "user-misty-002",
        body: "Hey Ash! I saw you have Shiny Charizard. I can definitely trade you my Armored Mewtwo for it!",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: "msg-2",
        conversation_id: "conv-1",
        sender_id: "user-ash-001",
        body: "Awesome! I'm in NYC today around Central Park. Are you free this afternoon?",
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
      }
    ]
  });
  const [activeConversation, setActiveConversation] = useState<{ matchId: string; messages: ChatMessage[]; partner: UserProfile } | null>(null);
  const [ratings, setRatings] = useState<TradeRating[]>([]);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(STORAGE_KEY_PROFILES);
      const savedWants = localStorage.getItem(STORAGE_KEY_WANTS);
      const savedGives = localStorage.getItem(STORAGE_KEY_GIVES);
      const savedChats = localStorage.getItem(STORAGE_KEY_CHATS);
      const savedStatuses = localStorage.getItem(STORAGE_KEY_STATUSES);
      const savedRatings = localStorage.getItem(STORAGE_KEY_RATINGS);
      const savedCurrentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);

      if (savedProfiles) setAllUsers(JSON.parse(savedProfiles));
      if (savedWants) setWants(JSON.parse(savedWants));
      if (savedGives) setGives(JSON.parse(savedGives));
      if (savedChats) setMessagesByMatch(JSON.parse(savedChats));
      if (savedStatuses) setTradeStatuses(JSON.parse(savedStatuses));
      if (savedRatings) setRatings(JSON.parse(savedRatings));
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
    } catch (err) {
      console.warn("Storage load error:", err);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(allUsers));
      localStorage.setItem(STORAGE_KEY_WANTS, JSON.stringify(wants));
      localStorage.setItem(STORAGE_KEY_GIVES, JSON.stringify(gives));
      localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(messagesByMatch));
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(tradeStatuses));
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratings));
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    } catch (err) {
      console.warn("Storage save error:", err);
    }
  }, [allUsers, wants, gives, messagesByMatch, tradeStatuses, ratings, currentUser]);

  // Recalculate matches whenever user, wants, or gives change
  const engine = new RecommendationEngine(allUsers, wants, gives);
  const rawMatches = engine.findMatchesForUser(currentUser.id);
  const threeWayMatches = engine.findThreeWayMatches(currentUser.id);

  // Apply custom statuses to matches
  const matches = rawMatches.map(m => ({
    ...m,
    status: tradeStatuses[m.id] || m.status
  }));

  const setCurrentUserById = (id: string) => {
    const user = allUsers.find(u => u.id === id);
    if (user) {
      setCurrentUser(user);
      setActiveConversation(null);
    }
  };

  const createAccount = (data: Omit<UserProfile, 'id' | 'trades_completed' | 'rating_avg' | 'rating_count' | 'last_active_at'>): UserProfile => {
    const newId = `user-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newId,
      ...data,
      trades_completed: 0,
      rating_avg: 5.0,
      rating_count: 0,
      last_active_at: new Date().toISOString()
    };

    setAllUsers(prev => [newProfile, ...prev]);
    setCurrentUser(newProfile);
    return newProfile;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const openUserProfile = (profile: UserProfile) => {
    setViewingProfile(profile);
  };

  const closeUserProfile = () => {
    setViewingProfile(null);
  };

  const getUserLists = (userId: string) => {
    return {
      wants: wants.filter(w => w.user_id === userId),
      gives: gives.filter(g => g.user_id === userId)
    };
  };

  const addWant = (variantKey: string, priority: number, acceptSubstitutes: boolean, notes?: string) => {
    const variant = getVariant(variantKey);
    if (!variant) return;

    if (wants.some(w => w.user_id === currentUser.id && w.variant_key === variantKey)) {
      return;
    }

    const newWant: UserWant = {
      id: `w-${Date.now()}`,
      user_id: currentUser.id,
      variant_key: variantKey,
      dex: variant.dex,
      priority,
      accept_substitutes: acceptSubstitutes,
      notes,
      created_at: new Date().toISOString()
    };

    setWants(prev => [newWant, ...prev]);
  };

  const removeWant = (wantId: string) => {
    setWants(prev => prev.filter(w => w.id !== wantId));
  };

  const addGive = (variantKey: string, quantity: number, notes?: string) => {
    const variant = getVariant(variantKey);
    if (!variant) return;

    const existing = gives.find(g => g.user_id === currentUser.id && g.variant_key === variantKey);
    if (existing) {
      setGives(prev => prev.map(g => g.id === existing.id ? { ...g, quantity: g.quantity + quantity } : g));
      return;
    }

    const newGive: UserGive = {
      id: `g-${Date.now()}`,
      user_id: currentUser.id,
      variant_key: variantKey,
      dex: variant.dex,
      quantity,
      notes,
      created_at: new Date().toISOString()
    };

    setGives(prev => [newGive, ...prev]);
  };

  const removeGive = (giveId: string) => {
    setGives(prev => prev.filter(g => g.id !== giveId));
  };

  const updateGiveQuantity = (giveId: string, delta: number) => {
    setGives(prev => prev.map(g => {
      if (g.id === giveId) {
        const nextQty = Math.max(1, g.quantity + delta);
        return { ...g, quantity: nextQty };
      }
      return g;
    }));
  };

  const proposeTrade = (matchId: string) => {
    setTradeStatuses(prev => ({ ...prev, [matchId]: 'proposed' }));
  };

  const acceptTrade = (matchId: string) => {
    setTradeStatuses(prev => ({ ...prev, [matchId]: 'accepted' }));
  };

  const completeTrade = (matchId: string) => {
    setTradeStatuses(prev => ({ ...prev, [matchId]: 'completed' }));
  };

  const cancelTrade = (matchId: string) => {
    setTradeStatuses(prev => ({ ...prev, [matchId]: 'cancelled' }));
  };

  const openChat = (match: TradeMatch) => {
    const messages = messagesByMatch[match.id] || [];
    setActiveConversation({
      matchId: match.id,
      messages,
      partner: match.partner
    });
  };

  const openChatWithUser = (partner: UserProfile, matchId?: string) => {
    const effectiveMatchId = matchId || `chat-${currentUser.id}-${partner.id}`;
    const messages = messagesByMatch[effectiveMatchId] || [];
    setActiveConversation({
      matchId: effectiveMatchId,
      messages,
      partner
    });
    setViewingProfile(null);
  };

  const closeChat = () => {
    setActiveConversation(null);
  };

  const sendMessage = (matchId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: matchId,
      sender_id: currentUser.id,
      body: text.trim(),
      created_at: new Date().toISOString()
    };

    setMessagesByMatch(prev => {
      const existing = prev[matchId] || [];
      const updated = [...existing, newMsg];
      if (activeConversation && activeConversation.matchId === matchId) {
        setActiveConversation(ac => ac ? { ...ac, messages: updated } : null);
      }
      return { ...prev, [matchId]: updated };
    });
  };

  const submitRating = (matchId: string, ratedId: string, stars: number, tags: string[], comment?: string) => {
    const newRating: TradeRating = {
      id: `rat-${Date.now()}`,
      match_id: matchId,
      rater_id: currentUser.id,
      rated_id: ratedId,
      stars,
      tags,
      comment,
      created_at: new Date().toISOString()
    };

    setRatings(prev => [newRating, ...prev]);

    setAllUsers(prev => prev.map(u => {
      if (u.id === ratedId) {
        const newCount = u.rating_count + 1;
        const newAvg = ((u.rating_avg * u.rating_count) + stars) / newCount;
        return {
          ...u,
          rating_count: newCount,
          rating_avg: parseFloat(newAvg.toFixed(2)),
          trades_completed: u.trades_completed + 1
        };
      }
      return u;
    }));
  };

  return (
    <TradeContext.Provider
      value={{
        currentUser,
        allUsers,
        wants,
        gives,
        matches,
        threeWayMatches,
        activeConversation,
        viewingProfile,
        tradeStatuses,
        ratings,
        setCurrentUserById,
        createAccount,
        updateProfile,
        openUserProfile,
        closeUserProfile,
        getUserLists,
        addWant,
        removeWant,
        addGive,
        removeGive,
        updateGiveQuantity,
        proposeTrade,
        acceptTrade,
        completeTrade,
        cancelTrade,
        openChat,
        openChatWithUser,
        closeChat,
        sendMessage,
        submitRating
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
}
