import React from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { ArrowRight } from 'lucide-react';

interface DataPreferencesProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppAccessibilitySettings;
  onUpdateSettings: (params: Partial<AppAccessibilitySettings>) => void;
  offlineCount?: number;
  savedCount?: number;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${on ? 'bg-[#96BD47]' : 'bg-[#c5c9d4]'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}

export const DataPreferencesScreen: React.FC<DataPreferencesProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
  offlineCount = 0,
  savedCount = 0,
}) => {
  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Data preferences.
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
          Control how TransFlow uses mobile data on this device.
        </p>

        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
          <div className="pr-3">
            <p className="text-[15px] font-semibold text-[#0d1747]">Low-data mode</p>
            <p className="text-sm text-[#555d71]">Skip optional maps and auto-refresh</p>
          </div>
          <Toggle on={settings.lowDataMode} onClick={() => onUpdateSettings({ lowDataMode: !settings.lowDataMode })} />
        </div>
        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
          <div className="pr-3">
            <p className="text-[15px] font-semibold text-[#0d1747]">Download on Wi-Fi only</p>
            <p className="text-sm text-[#555d71]">Ask before downloading on unknown connections</p>
          </div>
          <Toggle
            on={settings.downloadOnlyWifi}
            onClick={() => onUpdateSettings({ downloadOnlyWifi: !settings.downloadOnlyWifi })}
          />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('offline-downloads')}
          className="mt-6 w-full flex items-center justify-between py-3.5 text-left"
        >
          <span className="text-[15px] font-semibold text-[#0d1747]">
            Offline copies{offlineCount ? ` · ${offlineCount}` : ''}
          </span>
          <ArrowRight className="w-4 h-4 text-[#687085]" />
        </button>
      </div>

      <BottomNav currentScreen="data-preferences" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
