import React, { useState } from 'react';
import { ScreenId, TaxiRank, ReportItem } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check, ArrowRight, ShieldAlert, Flag } from 'lucide-react';

interface ReportIssueProps {
  onNavigate: (screen: ScreenId) => void;
  selectedRank: TaxiRank | null;
  onSaveReport?: (report: ReportItem) => void;
  savedCount?: number;
}

export const ReportIssueScreen: React.FC<ReportIssueProps> = ({
  onNavigate,
  selectedRank,
  onSaveReport,
  savedCount = 0,
}) => {
  const [reason, setReason] = useState('Wrong fare');
  const [note, setNote] = useState('The fare displayed at the rank may have changed. Please verify the current range.');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('TF-2026-1042');

  const rankName = selectedRank ? selectedRank.name : 'Central taxi rank';
  const rankDest = selectedRank ? selectedRank.destination.replace('To ', '') : 'Northside terminal';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `TF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefCode(generatedRef);
    if (onSaveReport) {
      onSaveReport({
        id: `rep-${Date.now()}`,
        rankName: `${rankName} – ${rankDest}`,
        reason,
        note,
        timestamp: '18 Oct 2026, 09:00 SAST',
        referenceNumber: generatedRef,
      });
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    // Screen 10: Report received
    return (
      <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
        <div>
          <TransFlowHeader onNavigate={onNavigate} />

          <div className="px-5 pt-10 pb-6 text-center">
            {/* Green checkmark circle */}
            <div className="w-16 h-16 rounded-full bg-[#f0f6e6] border-2 border-[#84ad32] flex items-center justify-center mx-auto mb-4 text-[#84ad32]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h1 className="text-3xl font-extrabold text-[#0d1747] mb-2 tracking-tight">
              Report received. Thank you.
            </h1>
            <p className="text-xs text-[#555d71] max-w-xs mx-auto mb-6 leading-relaxed">
              Your report has been successfully recorded and queued for transit review.
            </p>

            {/* Reference box matching PDF */}
            <div className="bg-white rounded-2xl p-4 border border-[#dedad0] max-w-xs mx-auto text-center mb-5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-[#798090] block mb-1">
                Report reference
              </span>
              <p className="text-lg font-mono font-black text-[#0d1747]">
                {refCode}
              </p>
              <span className="text-[10px] text-[#798090] mt-1 block">
                Received 18 Oct 2026, 09:00 SAST
              </span>
            </div>

            <p className="text-[11px] text-[#798090] max-w-xs mx-auto mb-8 leading-relaxed">
              Published records remain unchanged until reviewed and explicitly saved by an administrator.
            </p>

            <button
              onClick={() => onNavigate('taxi-details')}
              className="w-full bg-[#0d1747] hover:bg-[#15236b] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Return to taxi record</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <BottomNav currentScreen="taxi-details" onNavigate={onNavigate} savedCount={savedCount} />
      </div>
    );
  }

  // Screen 09: Report form
  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="taxi-details" />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#798090] mb-1.5">
            HELP KEEP INFORMATION USEFUL
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Report an issue
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
            Tell us what needs correcting. No contact details are needed.
          </p>

          {/* You are reporting context card */}
          <div className="bg-[#edeae2] p-3.5 rounded-2xl border border-[#dedad0] mb-5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#798090] block mb-1">
              You are reporting
            </span>
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0d1747]">
              <svg className="w-4 h-4 stroke-current fill-none shrink-0" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="4" width="18" height="13" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              <span>{rankName} – {rankDest}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* What needs correcting */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-1.5">
                What needs correcting? *
              </label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white rounded-2xl border border-[#dedad0] p-3 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden"
                >
                  <option value="Wrong fare">Wrong fare</option>
                  <option value="Rank moved or closed">Rank moved or closed</option>
                  <option value="Incorrect route or destination">Incorrect route or destination</option>
                  <option value="Safety or operational concern">Safety or operational concern</option>
                  <option value="Other">Other correction</option>
                </select>
              </div>
            </div>

            {/* Short note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#798090]">
                  Short note (optional)
                </label>
                <span className="text-[10px] text-[#798090] font-mono">
                  {note.length} / 300
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave out personal contact details."
                className="w-full bg-white rounded-2xl border border-[#dedad0] p-3 text-xs text-[#0d1747] focus:outline-hidden resize-none leading-relaxed"
              />
              <span className="text-[10px] text-[#798090] block mt-0.5">
                Leave out personal contact details.
              </span>
            </div>

            {/* Non-emergency notice */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-[11px] text-[#555d71] shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                This form is for information corrections, not urgent emergencies. Nothing is sent automatically while offline.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0d1747] hover:bg-[#15236b] active:scale-[0.99] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Save draft on this device</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNav currentScreen="taxi-details" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
