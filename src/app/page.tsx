'use client';

import React, { useState, useEffect } from 'react';
import { TradeProvider, useTrade } from '../lib/trade-store';
import { TrademonHeader } from '../components/TrademonHeader';
import { TrademonSidebar } from '../components/TrademonSidebar';
import { TrademonMainFeed } from '../components/TrademonMainFeed';
import { TrademonInspector } from '../components/TrademonInspector';
import { MyListsView } from '../components/MyListsView';
import { TradesView } from '../components/TradesView';
import { ChatInboxView } from '../components/ChatInboxView';
import { TradeHistoryView } from '../components/TradeHistoryView';
import { RatingsReputationView } from '../components/RatingsReputationView';
import { ProfileSettingsView } from '../components/ProfileSettingsView';
import { ChatModal } from '../components/ChatModal';
import { RatingModal } from '../components/RatingModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { CreateAccountModal } from '../components/CreateAccountModal';
import { VariantPickerModal } from '../components/VariantPickerModal';
import { TradeMatch, Variant } from '../types';
import { Layers, ArrowLeftRight, Users, User, MessageCircle } from 'lucide-react';

function TrademonAppContent() {
  const { matches, currentUser, viewingProfile, closeUserProfile, openUserProfile, openChat, addWant, addGive } = useTrade();

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedMatch, setSelectedMatch] = useState<TradeMatch | null>(null);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'want' | 'give'>('want');
  const [ratingTargetMatch, setRatingTargetMatch] = useState<TradeMatch | null>(null);

  // Default select first match on load
  useEffect(() => {
    if (matches.length > 0 && !selectedMatch) {
      setSelectedMatch(matches[0]);
    }
  }, [matches, selectedMatch]);

  const handleOpenAddPokemon = () => {
    setPickerMode('want');
    setPickerOpen(true);
  };

  const handleVariantPicked = (
    variant: Variant,
    config: { priority: number; acceptSubstitutes: boolean; quantity: number; notes: string }
  ) => {
    if (pickerMode === 'want') {
      addWant(variant.variant_key, config.priority, config.acceptSubstitutes, config.notes);
    } else {
      addGive(variant.variant_key, config.quantity, config.notes);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden bg-[#0b111e] text-slate-100 font-sans">
      {/* CSS Grid Row 1: Top Navigation Header */}
      <div className="row-start-1 col-span-full">
        <TrademonHeader
          activeNav={activeView}
          setActiveNav={(view) => setActiveView(view)}
          onOpenCreateAccount={() => setCreateAccountOpen(true)}
        />
      </div>

      {/* CSS Grid Row 2: 3-Column Responsive Grid Layout */}
      <div className="row-start-2 grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_340px] h-[calc(100vh-64px)] overflow-hidden">
        {/* Grid Column 1: Left Navigation Sidebar */}
        <div className="hidden md:block h-full overflow-hidden border-r border-[#1b253b]">
          <TrademonSidebar
            activeView={activeView}
            setActiveView={(view) => setActiveView(view)}
            onAddPokemon={handleOpenAddPokemon}
            onEditProfile={() => setActiveView('profile')}
          />
        </div>

        {/* Grid Column 2: Center Main Content Area */}
        <div className="h-full overflow-y-auto">
          {(activeView === 'dashboard' || activeView === 'matches') && (
            <TrademonMainFeed
              selectedMatch={selectedMatch}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onViewProfile={(m) => openUserProfile(m.partner)}
            />
          )}

          {(activeView === 'lists' || activeView === 'wants' || activeView === 'gives') && (
            <div className="p-6 max-w-5xl mx-auto">
              <MyListsView onFindMatches={() => setActiveView('dashboard')} />
            </div>
          )}

          {activeView === 'trades' && (
            <div className="p-6 max-w-5xl mx-auto">
              <TradesView onOpenRating={(m) => setRatingTargetMatch(m)} />
            </div>
          )}

          {activeView === 'chat' && (
            <div className="p-4 max-w-6xl mx-auto h-full">
              <ChatInboxView />
            </div>
          )}

          {activeView === 'history' && (
            <div className="p-6 max-w-4xl mx-auto">
              <TradeHistoryView />
            </div>
          )}

          {activeView === 'ratings' && (
            <div className="p-6 max-w-5xl mx-auto">
              <RatingsReputationView />
            </div>
          )}

          {activeView === 'profile' && (
            <div className="p-6 max-w-4xl mx-auto">
              <ProfileSettingsView />
            </div>
          )}
        </div>

        {/* Grid Column 3: Right Inspector (Trade Details Panel) */}
        <div className="hidden xl:block h-full overflow-hidden border-l border-[#1b253b]">
          <TrademonInspector
            selectedMatch={selectedMatch}
            onOpenChat={(m) => openChat(m)}
            onViewProfile={(m) => openUserProfile(m.partner)}
          />
        </div>
      </div>

      {/* Floating Modals & Overlays */}
      <ChatModal />

      <UserProfileModal
        profile={viewingProfile}
        onClose={closeUserProfile}
      />

      <CreateAccountModal
        isOpen={createAccountOpen}
        onClose={() => setCreateAccountOpen(false)}
        onAccountCreated={() => setActiveView('dashboard')}
      />

      <VariantPickerModal
        mode={pickerMode}
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleVariantPicked}
      />

      <RatingModal
        match={ratingTargetMatch}
        onClose={() => setRatingTargetMatch(null)}
      />

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0c1322]/95 backdrop-blur-lg border-t border-[#1b253b] md:hidden z-40 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeView === 'dashboard' ? 'text-[#00d2ff]' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => setActiveView('lists')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeView === 'lists' ? 'text-amber-400' : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>My Lists</span>
        </button>

        <button
          onClick={() => setActiveView('chat')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeView === 'chat' ? 'text-blue-400' : 'text-slate-500'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setActiveView('profile')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeView === 'profile' ? 'text-white' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <TradeProvider>
      <TrademonAppContent />
    </TradeProvider>
  );
}
