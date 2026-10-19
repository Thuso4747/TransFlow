import React from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Info, ArrowRight } from 'lucide-react';

interface DataPreferencesProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppAccessibilitySettings;
  onUpdateSettings: (params: Partial<AppAccessibilitySettings>) => void;
  offlineCount?: number;
  savedCount?: number;
}

export const DataPreferencesScreen: React.FC<DataPreferencesProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
  offlineCount = 1,
  savedCount = 0,
}) => {
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
            Make yourself at home.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-4">
            Adjust the experience to work for you.
          </p>

          {/* Sub-nav tabs */}
          <div className="flex items-center gap-2 border-b border-[#dedad0] pb-2 mb-5 text-xs font-bold">
            <button
              onClick={() => onNavigate('accessibility')}
              className="pb-1 px-1 text-[#798090] hover:text-[#0d1747]"
            >
              Accessibility
            </button>
            <button
              onClick={() => onNavigate('accessibility')}
              className="pb-1 px-1 text-[#798090] hover:text-[#0d1747]"
            >
              Appearance
            </button>
            <button
              onClick={() => onNavigate('accessibility')}
              className="pb-1 px-1 text-[#798090] hover:text-[#0d1747]"
            >
              Language
            </button>
          </div>

          <h3 className="text-sm font-extrabold text-[#0d1747] mb-3">
            Data &amp; offline
          </h3>

          {/* Low-data mode toggle */}
          <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs flex items-center justify-between mb-3.5">
            <div className="pr-3">
              <h4 className="text-xs font-bold text-[#0d1747]">Low-data mode</h4>
              <p className="text-[11px] text-[#555d71] leading-relaxed mt-0.5">
                Hide optional maps until requested and avoid automatic refreshes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ lowDataMode: !settings.lowDataMode })}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.lowDataMode ? 'bg-[#84ad32]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.lowDataMode ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Download only on Wi-Fi toggle */}
          <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs flex items-center justify-between mb-4">
            <div className="pr-3">
              <h4 className="text-xs font-bold text-[#0d1747]">Download only on Wi-Fi</h4>
              <p className="text-[11px] text-[#555d71] leading-relaxed mt-0.5">
                Ask before preparing a download when connection type is unknown.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ downloadOnlyWifi: !settings.downloadOnlyWifi })}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                settings.downloadOnlyWifi ? 'bg-[#84ad32]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.downloadOnlyWifi ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Connection note */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71] mb-5 shadow-2xs">
            <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Connection type unavailable. This browser cannot reliably distinguish Wi-Fi, so we ask before downloads instead of claiming to enforce it.
            </p>
          </div>

          {/* Manage offline copies link */}
          <div className="pt-1">
            <button
              onClick={() => onNavigate('offline-downloads')}
              className="text-xs font-bold text-[#0d1747] hover:underline flex items-center gap-1.5"
            >
              <span>Manage {offlineCount} offline copies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="data-preferences" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
