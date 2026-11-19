'use client';

import React, { useState } from 'react';
import { useTrade } from '../lib/trade-store';
import { TradeMatch } from '../types';
import { X, Star, Check, Award } from 'lucide-react';

interface RatingModalProps {
  match: TradeMatch | null;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  "Fair Trader",
  "Fast Responder",
  "Punctual / On Time",
  "Great Communication",
  "High IV / Lucky Trade",
  "Recommended Trainer"
];

export const RatingModal: React.FC<RatingModalProps> = ({ match, onClose }) => {
  const { submitRating } = useTrade();
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Fair Trader", "Fast Responder"]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!match) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    submitRating(match.id, match.partner.id, stars, selectedTags, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Rate Trade Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-bold text-white text-base">Review Submitted!</h4>
            <p className="text-xs text-slate-400">Thank you for keeping the Pokémon GO trading community safe and reliable.</p>
          </div>
        ) : (
          <>
            {/* Partner Info */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 mx-auto mb-2">
                {match.partner.avatar_url && (
                  <img src={match.partner.avatar_url} alt={match.partner.username} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="font-bold text-white text-sm">{match.partner.username}</div>
              <p className="text-xs text-slate-400">How was your trade for {match.a_receives.name}?</p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStars(star)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= stars ? 'text-amber-400 fill-current' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Praise Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Highlight Positive Traits:</label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                          : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Comment (Optional):</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a brief note about the trade..."
                rows={2}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition"
            >
              Submit Review & Rating
            </button>
          </>
        )}
      </div>
    </div>
  );
};
