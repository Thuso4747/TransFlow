import React, { useState } from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check, ChevronDown, Info } from 'lucide-react';

interface AccessibilityScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppAccessibilitySettings;
  onUpdateSettings: (params: Partial<AppAccessibilitySettings>) => void;
  savedCount?: number;
}

export const AccessibilityScreen: React.FC<AccessibilityScreenProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
  savedCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'accessibility' | 'appearance' | 'language'>('accessibility');

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

          {/* Sub-navigation tabs matching PDF Screen 14 & 15 */}
          <div className="flex items-center gap-2 border-b border-[#dedad0] pb-2 mb-5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('accessibility')}
              className={`pb-1 px-1 transition-colors relative ${
                activeTab === 'accessibility'
                  ? 'text-[#0d1747] border-b-2 border-[#0d1747]'
                  : 'text-[#798090] hover:text-[#0d1747]'
              }`}
            >
              Accessibility
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`pb-1 px-1 transition-colors relative ${
                activeTab === 'appearance'
                  ? 'text-[#0d1747] border-b-2 border-[#0d1747]'
                  : 'text-[#798090] hover:text-[#0d1747]'
              }`}
            >
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`pb-1 px-1 transition-colors relative ${
                activeTab === 'language'
                  ? 'text-[#0d1747] border-b-2 border-[#0d1747]'
                  : 'text-[#798090] hover:text-[#0d1747]'
              }`}
            >
              Language
            </button>
          </div>

          {/* TAB 1: Accessibility */}
          {activeTab === 'accessibility' && (
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold text-[#0d1747]">
                Accessibility
              </h3>

              {/* Text size selector */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#798090] mb-2">
                  Text size
                </label>
                <div className="relative mb-3">
                  <select
                    value={settings.textSize}
                    onChange={(e) => onUpdateSettings({ textSize: e.target.value as any })}
                    className="w-full bg-[#f7f6f2] rounded-2xl border border-[#dedad0] px-3.5 py-2.5 text-xs font-bold text-[#0d1747] appearance-none pr-8 focus:outline-hidden cursor-pointer"
                  >
                    <option value="100%">Standard · 100%</option>
                    <option value="115%">Large · 115%</option>
                    <option value="130%">Extra Large · 130%</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#798090] absolute right-3 top-3.5 pointer-events-none" />
                </div>

                {/* Preview Box matching Screen 14 */}
                <div className="bg-[#edeae2] p-4 rounded-2xl border border-[#dedad0]">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#798090] block mb-1">
                    Preview
                  </span>
                  <h4 className="font-extrabold text-[#0d1747] mb-1" style={{ fontSize: settings.textSize === '130%' ? '1.25rem' : settings.textSize === '115%' ? '1.1rem' : '0.95rem' }}>
                    Your next journey
                  </h4>
                  <p className="text-[#555d71] leading-relaxed" style={{ fontSize: settings.textSize === '130%' ? '1rem' : settings.textSize === '115%' ? '0.875rem' : '0.75rem' }}>
                    Clear directions, readable fares and helpful labels.
                  </p>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0d1747]">High contrast</h4>
                  <p className="text-[11px] text-[#555d71]">
                    Strengthen text and component boundaries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    settings.highContrast ? 'bg-[#84ad32]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.highContrast ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reduce Motion Toggle */}
              <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0d1747]">Reduce motion</h4>
                  <p className="text-[11px] text-[#555d71]">
                    Minimize transition animations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ reduceMotion: !settings.reduceMotion })}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    settings.reduceMotion ? 'bg-[#84ad32]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.reduceMotion ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vehicle disclaimer */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71]">
                <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Interface preferences do not confirm vehicle or route accessibility. Check with the operator.
                </p>
              </div>

              <div className="text-[11px] text-[#456d17] font-bold flex items-center gap-1.5 pt-1">
                <Check className="w-3.5 h-3.5" />
                <span>Changes save automatically on this device.</span>
              </div>
            </div>
          )}

          {/* TAB 2: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#0d1747]">Appearance</h3>
              <div className="bg-white rounded-3xl p-5 border border-[#e5e1d7] shadow-xs space-y-3">
                <p className="text-xs text-[#555d71] leading-relaxed">
                  TransFlow adapts to daytime and evening visibility automatically using high-contrast paper tones and deep navy corridors.
                </p>
                <div className="p-3 bg-[#edeae2] rounded-2xl text-xs font-bold text-[#0d1747]">
                  Theme: Sand &amp; Joburg Navy (Active)
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Language matching Screen 15 */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#0d1747]">Language</h3>
              <div className="bg-white rounded-3xl border border-[#e5e1d7] overflow-hidden shadow-xs divide-y divide-[#f0eee6]">
                {/* English */}
                <div className="p-4 flex items-center justify-between bg-[#f0f6e6]/60">
                  <div>
                    <h4 className="text-xs font-bold text-[#0d1747]">English</h4>
                    <p className="text-[11px] text-[#555d71]">Complete available interface</p>
                  </div>
                  <Check className="w-4 h-4 text-[#84ad32] stroke-[3]" />
                </div>

                {/* Afrikaans */}
                <div className="p-4 flex items-center justify-between text-slate-400">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500">Afrikaans</h4>
                    <p className="text-[11px] text-slate-400">Coming later</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#edeae2] px-2 py-0.5 rounded text-slate-500">
                    Coming later
                  </span>
                </div>

                {/* isiZulu */}
                <div className="p-4 flex items-center justify-between text-slate-400">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500">isiZulu</h4>
                    <p className="text-[11px] text-slate-400">Coming later</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#edeae2] px-2 py-0.5 rounded text-slate-500">
                    Coming later
                  </span>
                </div>

                {/* Sesotho */}
                <div className="p-4 flex items-center justify-between text-slate-400">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500">Sesotho</h4>
                    <p className="text-[11px] text-slate-400">Coming later</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#edeae2] px-2 py-0.5 rounded text-slate-500">
                    Coming later
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#dedad0] flex items-start gap-2.5 text-xs text-[#555d71]">
                <Info className="w-4 h-4 text-[#798090] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Other languages need a complete reviewed translation set before they can be selected. No partial translation is shown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav currentScreen="accessibility" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
