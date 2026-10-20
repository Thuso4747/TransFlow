import React from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { Check } from 'lucide-react';

interface AccessibilityScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: AppAccessibilitySettings;
  onUpdateSettings: (params: Partial<AppAccessibilitySettings>) => void;
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

export const AccessibilityScreen: React.FC<AccessibilityScreenProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
  savedCount = 0,
}) => {
  const sizes = [
    { id: '100%', label: 'Standard' },
    { id: '115%', label: 'Large' },
    { id: '130%', label: 'Extra large' },
  ] as const;

  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Accessibility.
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
          Adjust the experience to work for you. Changes save on this device.
        </p>

        <h2 className="text-lg font-bold text-[#0d1747] mb-1">Text size</h2>
        {sizes.map((size) => {
          const active = settings.textSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onUpdateSettings({ textSize: size.id })}
              className="w-full flex items-center gap-3 py-3.5 border-b border-[#ece9e0] text-left"
            >
              <span
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? 'border-[#96BD47]' : 'border-[#c5c9d4]'
                }`}
              >
                {active ? <span className="h-2 w-2 rounded-full bg-[#96BD47]" /> : null}
              </span>
              <span className="flex-1 text-[15px] font-semibold text-[#0d1747]">{size.label}</span>
              <span className="text-sm text-[#555d71]">{size.id}</span>
            </button>
          );
        })}

        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0] mt-4">
          <div>
            <p className="text-[15px] font-semibold text-[#0d1747]">High contrast</p>
            <p className="text-sm text-[#555d71]">Stronger text and edges</p>
          </div>
          <Toggle on={settings.highContrast} onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })} />
        </div>
        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
          <div>
            <p className="text-[15px] font-semibold text-[#0d1747]">Reduce motion</p>
            <p className="text-sm text-[#555d71]">Fewer animations</p>
          </div>
          <Toggle on={settings.reduceMotion} onClick={() => onUpdateSettings({ reduceMotion: !settings.reduceMotion })} />
        </div>
        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
          <div>
            <p className="text-[15px] font-semibold text-[#0d1747]">Dark mode</p>
            <p className="text-sm text-[#555d71]">Navy background with white text</p>
          </div>
          <Toggle on={settings.darkMode} onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })} />
        </div>

        <h2 className="text-lg font-bold text-[#0d1747] mt-8 mb-1">Language</h2>
        <div className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
          <div>
            <p className="text-[15px] font-semibold text-[#0d1747]">English</p>
            <p className="text-sm text-[#555d71]">Current language</p>
          </div>
          <Check className="w-4 h-4 text-[#96BD47]" strokeWidth={2.5} />
        </div>
        {['Afrikaans', 'isiZulu', 'Sesotho'].map((lang) => (
          <div key={lang} className="flex items-center justify-between gap-3 py-3.5 border-b border-[#ece9e0]">
            <p className="text-[15px] font-semibold text-[#81899e]">{lang}</p>
            <span className="text-sm text-[#687085]">Coming later</span>
          </div>
        ))}
      </div>

      <BottomNav currentScreen="accessibility" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
