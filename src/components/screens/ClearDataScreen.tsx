import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check, Trash2, Info, AlertTriangle } from 'lucide-react';

interface ClearDataProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount: number;
  offlineCount: number;
  onClearData: (types: string[]) => void;
}

export const ClearDataScreen: React.FC<ClearDataProps> = ({
  onNavigate,
  savedCount,
  offlineCount,
  onClearData,
}) => {
  const [clearSaved, setClearSaved] = useState(false);
  const [clearOffline, setClearOffline] = useState(false);
  const [clearPreferences, setClearPreferences] = useState(false);
  const [clearDrafts, setClearDrafts] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleClear = () => {
    const toClear: string[] = [];
    if (clearSaved) toClear.push('saved');
    if (clearOffline) toClear.push('offline');
    if (clearPreferences) toClear.push('preferences');
    if (clearDrafts) toClear.push('drafts');

    if (toClear.length === 0) {
      setErrorMsg('Please select at least one item to clear.');
      return;
    }

    setErrorMsg('');
    onClearData(toClear);
    setSuccessToast('Selected local data cleared from this device.');
    setTimeout(() => {
      setSuccessToast('');
      onNavigate('more');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            YOUR JOURNEY, YOUR PREFERENCES
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            Clear data on this device
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Choose exactly what to remove. Server records and administrator history are separate.
          </p>

          {successToast && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
              {successToast}
            </div>
          )}

          {/* Checkbox Options Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs space-y-4 mb-5">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-xs font-bold text-[#0d1747]">
                Saved journey shortcuts ({savedCount})
              </span>
              <div
                onClick={() => setClearSaved(!clearSaved)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  clearSaved ? 'bg-red-600 text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {clearSaved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 border-t border-[#f0eee6]">
              <span className="text-xs font-bold text-[#0d1747]">
                Offline downloads ({offlineCount})
              </span>
              <div
                onClick={() => setClearOffline(!clearOffline)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  clearOffline ? 'bg-red-600 text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {clearOffline && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 border-t border-[#f0eee6]">
              <span className="text-xs font-bold text-[#0d1747]">
                Preferences and appearance
              </span>
              <div
                onClick={() => setClearPreferences(!clearPreferences)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  clearPreferences ? 'bg-red-600 text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {clearPreferences && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 border-t border-[#f0eee6]">
              <span className="text-xs font-bold text-[#0d1747]">
                Unsent report draft
              </span>
              <div
                onClick={() => setClearDrafts(!clearDrafts)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  clearDrafts ? 'bg-red-600 text-white' : 'border-2 border-[#b5bac7] bg-white'
                }`}
              >
                {clearDrafts && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>
          </div>

          {/* Session notice */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71] mb-5">
            <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Stop or revoke active sharing separately. Clearing local data does not end a server session.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Red Review / Clear Button */}
          <button
            onClick={handleClear}
            className="w-full bg-[#c53030] hover:bg-[#9b2c2c] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Review selected data</span>
          </button>
        </div>
      </div>

      <BottomNav currentScreen="clear-data" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
