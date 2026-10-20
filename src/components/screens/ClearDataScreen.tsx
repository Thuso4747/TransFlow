import React, { useState } from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check } from 'lucide-react';

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
  const [errorMsg, setErrorMsg] = useState('');
  const [done, setDone] = useState(false);

  const handleClear = () => {
    const toClear: string[] = [];
    if (clearSaved) toClear.push('saved');
    if (clearOffline) toClear.push('offline');
    if (clearPreferences) toClear.push('preferences');

    if (toClear.length === 0) {
      setErrorMsg('Select at least one item.');
      return;
    }

    setErrorMsg('');
    onClearData(toClear);
    setDone(true);
  };

  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Saved data.
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
          Choose what to remove from this device.
        </p>

        {done ? (
          <p className="text-sm font-semibold text-[#6a8a2e]">Selected data was cleared.</p>
        ) : (
          <>
            {[
              { on: clearSaved, set: setClearSaved, label: 'Saved journeys', detail: `${savedCount}` },
              { on: clearOffline, set: setClearOffline, label: 'Offline downloads', detail: `${offlineCount}` },
              { on: clearPreferences, set: setClearPreferences, label: 'Preferences', detail: '' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.set(!item.on)}
                className="w-full flex items-center gap-3 py-3.5 border-b border-[#ece9e0] text-left"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    item.on ? 'border-[#c62828] bg-[#c62828]' : 'border-[#c5c9d4] bg-transparent'
                  }`}
                >
                  {item.on ? <Check className="w-3 h-3 text-white" strokeWidth={3} /> : null}
                </span>
                <span className="flex-1 text-[15px] font-semibold text-[#0d1747]">{item.label}</span>
                {item.detail ? <span className="text-sm text-[#555d71]">{item.detail}</span> : null}
              </button>
            ))}

            {errorMsg ? <p className="mt-4 text-sm font-medium text-[#c62828]">{errorMsg}</p> : null}

            <button
              type="button"
              onClick={handleClear}
              className="mt-8 w-full h-12 rounded-2xl bg-[#c62828] hover:bg-[#b71c1c] text-white text-sm font-bold"
            >
              Clear selected
            </button>
          </>
        )}
      </div>

      <BottomNav currentScreen="clear-data" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
