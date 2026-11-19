'use client';

import React from 'react';
import { TradeMatch } from '../types';
import { TrademonInspector } from './TrademonInspector';
import { X } from 'lucide-react';

interface MobileInspectorDrawerProps {
  isOpen: boolean;
  match: TradeMatch | null;
  onClose: () => void;
  onOpenChat: (match: TradeMatch) => void;
  onViewProfile: (match: TradeMatch) => void;
}

export const MobileInspectorDrawer: React.FC<MobileInspectorDrawerProps> = ({
  isOpen,
  match,
  onClose,
  onOpenChat,
  onViewProfile,
}) => {
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 xl:hidden">
      <div className="bg-[#0c1322] border-t sm:border border-[#1b253b] rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Handle / Header */}
        <div className="px-5 py-3 border-b border-[#1b253b] flex items-center justify-between bg-[#111a2d]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-slate-600 mx-auto block sm:hidden" />
            <h3 className="text-sm font-extrabold text-white">Trade Readiness & Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <TrademonInspector
            selectedMatch={match}
            onOpenChat={(m) => {
              onClose();
              onOpenChat(m);
            }}
            onViewProfile={(m) => {
              onClose();
              onViewProfile(m);
            }}
          />
        </div>
      </div>
    </div>
  );
};
