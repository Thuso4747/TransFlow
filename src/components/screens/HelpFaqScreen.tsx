import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Search, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react';

interface HelpFaqProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const HelpFaqScreen: React.FC<HelpFaqProps> = ({ onNavigate, savedCount = 0 }) => {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First expanded matching Screen 24

  const FAQS = [
    {
      q: 'How do I plan a journey?',
      a: 'Choose a suggested planner, or travel date and Leave now, Depart at or Arrive by. Open a result to see boarding and drop-off instructions.',
      hasAction: true,
      actionText: 'Plan a journey →',
      actionScreen: 'journey-planner' as ScreenId,
    },
    {
      q: 'What is the difference between saved and downloaded?',
      a: 'Saved journeys store a quick shortcut on your device for fast access. Downloading creates an offline copy including full text directions, fares, and schematic diagrams for use when you have no data or signal.',
    },
    {
      q: 'Are these fares guaranteed?',
      a: 'No. Fares displayed in TransFlow are indicative estimates based on regular published corridor schedules and recent rank reviews. Minibus taxi and peak bus fares should always be confirmed with the driver or rank marshall before boarding.',
    },
    {
      q: 'What happens if a report fails?',
      a: 'Your report draft is safely preserved on your local device. Once connection returns or local review is available, you can submit the saved draft.',
    },
    {
      q: 'Can I use a larger text size?',
      a: 'Yes. Visit More → Accessibility to select between 100%, 115%, and 130% text scaling, as well as high-contrast border mode.',
      hasAction: true,
      actionText: 'Open Accessibility →',
      actionScreen: 'accessibility' as ScreenId,
    },
  ];

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            A LITTLE GUIDANCE
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            We&apos;ll help you find your way.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
            Practical answers for planning, saving, offline use and sharing.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-[#dedad0] p-3 flex items-center gap-2.5 mb-5 shadow-2xs">
            <Search className="w-4 h-4 text-[#798090] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help topics"
              className="w-full bg-transparent text-xs font-semibold text-[#0d1747] placeholder-[#798090] focus:outline-hidden"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* FAQ Accordions matching Screen 24 */}
          <div className="space-y-3 mb-6">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-[#0d1747]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#798090] shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#798090] shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-[#f0eee6] text-xs text-[#555d71] leading-relaxed space-y-3">
                      <p>{faq.a}</p>
                      {faq.hasAction && (
                        <div>
                          <button
                            onClick={() => onNavigate(faq.actionScreen!)}
                            className="font-bold text-[#0d1747] hover:underline flex items-center gap-1"
                          >
                            <span>{faq.actionText}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav currentScreen="help-faq" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
