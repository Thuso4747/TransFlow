import React, { useState } from 'react';
import { ScreenId, TaxiRank, ReportItem } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ChevronDown } from 'lucide-react';

interface ReportIssueProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRank: TaxiRank | null;
  onSaveReport?: (report: ReportItem) => void;
  savedCount?: number;
}

const REASONS = [
  'Wrong fare',
  'Stop or rank issue',
  'Incorrect route',
  'Safety concern',
  'Other',
];

export const ReportIssueScreen: React.FC<ReportIssueProps> = ({
  onNavigate,
  selectedRank,
  onSaveReport,
  savedCount = 0,
}) => {
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState('');
  const [reasonOpen, setReasonOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const subject = selectedRank ? selectedRank.name : 'TransFlow';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `TF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefCode(generatedRef);
    onSaveReport?.({
      id: `rep-${Date.now()}`,
      rankName: subject,
      reason,
      note,
      timestamp: new Date().toLocaleString('en-GB'),
      referenceNumber: generatedRef,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        {isSubmitted ? (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              Report received.
            </h1>
            <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
              Thank you. This is stored on this device until it is reviewed.
            </p>
            <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
              <span className="text-[12px] text-[#687085]">Reference</span>
              <span className="text-[15px] font-semibold tabular-nums text-[#0d1747]">{refCode}</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('home-dashboard')}
              className="mt-8 w-full bg-[#0d1747] hover:bg-[#142161] text-white py-4 px-6 rounded-2xl font-bold text-base"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
              Reports.
            </h1>
            <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
              Tell us what needs correcting. No contact details are needed.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
                <span className="text-[12px] text-[#687085]">About</span>
                <span className="text-[15px] font-semibold text-[#0d1747] text-right">{subject}</span>
              </div>

              <button
                type="button"
                onClick={() => setReasonOpen((open) => !open)}
                className="w-full py-2.5 flex items-center gap-3 text-left"
              >
                <span className="min-w-0 flex-1 border-b border-[#ece9e0] pb-2.5">
                  <span className="block text-[12px] text-[#687085]">What needs correcting</span>
                  <span className="block font-semibold text-[15px] text-[#0d1747]">{reason}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-[#555d71] shrink-0 transition-transform ${reasonOpen ? 'rotate-180' : ''}`} />
              </button>
              {reasonOpen && (
                <div className="ml-0 pb-2">
                  {REASONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setReason(item);
                        setReasonOpen(false);
                      }}
                      className="w-full py-2.5 text-left text-[15px] font-medium text-[#0d1747] border-b border-[#ece9e0]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <label className="block py-2.5">
                <span className="block text-[12px] text-[#687085] mb-1">Short note</span>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional. Leave out personal details."
                  className="w-full bg-transparent border-b border-[#ece9e0] pb-2.5 text-[15px] font-semibold text-[#0d1747] placeholder-[#81899e] focus:outline-hidden resize-none"
                />
              </label>

              <p className="mt-2 text-sm text-[#555d71] leading-relaxed">
                For information corrections, not emergencies.
              </p>

              <button
                type="submit"
                className="mt-8 w-full bg-[#0d1747] hover:bg-[#142161] text-white py-4 px-6 rounded-2xl font-bold text-base"
              >
                Submit report
              </button>
            </form>
          </>
        )}
      </div>

      <BottomNav currentScreen="report-issue" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
