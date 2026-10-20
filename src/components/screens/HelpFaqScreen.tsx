import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ChevronDown, Search, X } from 'lucide-react';

interface HelpFaqProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
  initialOpenIndex?: number | null;
}

const FAQS = [
  {
    q: 'How do I plan a journey?',
    a: 'On Plan, choose From, To and a leave time. Pick a bus, then tap Start trip.',
    actionText: 'Plan a trip',
    actionScreen: 'home-dashboard' as ScreenId,
  },
  {
    q: 'What is the difference between saved and downloaded?',
    a: 'Saved journeys are shortcuts on this device. Download for offline also stores the trip so you can track stops without data.',
  },
  {
    q: 'Are these fares guaranteed?',
    a: 'No. Fares are estimates. Confirm with the driver or rank marshal before you board.',
  },
  {
    q: 'Can I use a larger text size?',
    a: 'Yes. Open Accessibility from the menu and choose Large or Extra large.',
    actionText: 'Open Accessibility',
    actionScreen: 'accessibility' as ScreenId,
  },
];

export const HelpFaqScreen: React.FC<HelpFaqProps> = ({
  onNavigate,
  savedCount = 0,
  initialOpenIndex = 0,
}) => {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(query.toLowerCase()) ||
      item.a.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Help.
        </h1>
        <p className="mt-2 mb-5 text-sm text-[#555d71] leading-relaxed">
          Answers for planning, saving and offline use.
        </p>

        <label className="flex items-center gap-3 py-2.5">
          <Search className="w-4 h-4 text-[#0d1747] shrink-0" />
          <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help"
              className="w-full bg-transparent text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden"
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')} className="p-1 text-[#0d1747]" aria-label="Clear">
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </span>
        </label>

        <div className="mt-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className="border-b border-[#ece9e0]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-3.5 flex items-start gap-3 text-left"
                >
                  <p className="flex-1 text-[15px] font-semibold text-[#0d1747]">{faq.q}</p>
                  <ChevronDown
                    className={`w-4 h-4 mt-1 shrink-0 text-[#687085] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-4">
                    <p className="text-sm text-[#555d71] leading-relaxed">{faq.a}</p>
                    {faq.actionScreen && (
                      <button
                        type="button"
                        onClick={() => onNavigate(faq.actionScreen)}
                        className="mt-3 text-sm font-semibold text-[#0d1747]"
                      >
                        {faq.actionText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filteredFaqs.length === 0 && (
            <p className="py-6 text-sm text-[#555d71]">No topics match.</p>
          )}
        </div>
      </div>

      <BottomNav currentScreen="help-faq" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
