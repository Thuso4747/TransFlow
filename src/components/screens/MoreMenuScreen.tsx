import React, { useState } from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import {
  ChevronRight,
  Eye,
  Download,
  Users,
  Sliders,
  Sun,
  Trash2,
  HelpCircle,
  Info,
  Lock,
} from 'lucide-react';

interface MoreMenuProps {
  onNavigate: (screen: ScreenId) => void;
  accessibilitySettings: AppAccessibilitySettings;
  offlineCount?: number;
  savedCount?: number;
}

export const MoreMenuScreen: React.FC<MoreMenuProps> = ({
  onNavigate,
  accessibilitySettings,
  offlineCount = 1,
  savedCount = 0,
}) => {
  const [showStaffNotice, setShowStaffNotice] = useState(false);
  const MENU_ITEMS = [
    {
      id: 'accessibility',
      screen: 'accessibility' as ScreenId,
      title: 'Accessibility',
      subtitle: `${accessibilitySettings.textSize} text · ${accessibilitySettings.highContrast ? 'High contrast' : 'Standard contrast'}`,
      icon: Eye,
    },
    {
      id: 'offline',
      screen: 'offline-downloads' as ScreenId,
      title: 'Offline downloads',
      subtitle: `${offlineCount} ${offlineCount === 1 ? 'copy' : 'copies'} on this device`,
      icon: Download,
    },
    {
      id: 'family',
      screen: 'family-sharing' as ScreenId,
      title: 'Family sharing',
      subtitle: 'Approved viewers and linked sessions',
      icon: Users,
    },
    {
      id: 'data',
      screen: 'data-preferences' as ScreenId,
      title: 'Data preferences',
      subtitle: accessibilitySettings.lowDataMode ? 'Low-data mode active' : 'Standard data mode',
      icon: Sliders,
    },
    {
      id: 'appearance',
      screen: 'accessibility' as ScreenId,
      title: 'Appearance',
      subtitle: 'Based on hours and background',
      icon: Sun,
    },
    {
      id: 'clear-data',
      screen: 'clear-data' as ScreenId,
      title: 'Saved data',
      subtitle: 'Choose what to clear from this device',
      icon: Trash2,
    },
    {
      id: 'help',
      screen: 'help-faq' as ScreenId,
      title: 'Help & FAQs',
      subtitle: 'Find your next step',
      icon: HelpCircle,
    },
    {
      id: 'about',
      screen: 'about' as ScreenId,
      title: 'About TransFlow',
      subtitle: 'Project and build information',
      icon: Info,
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} />

        <div className="px-5 pt-5 pb-2">
          {/* Tag */}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#717b94] mb-1.5">
            YOUR JOURNEY, YOUR PREFERENCES
          </p>

          {/* Title */}
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            A little more TransFlow.
          </h1>

          {/* Subtitle */}
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Adjust the experience to work for you.
          </p>

          {/* Menu Items List */}
          <div className="bg-white rounded-3xl border border-[#e5e1d7] overflow-hidden shadow-xs divide-y divide-[#f0eee6] mb-5">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.screen)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#edeae2] flex items-center justify-center text-[#0d1747] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0d1747]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#798090]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#798090]" />
                </div>
              );
            })}
          </div>

          {/* Staff Workspace button & notice */}
          <div className="mb-4">
            <button
              onClick={() => setShowStaffNotice(true)}
              className="w-full bg-[#edeae2] hover:bg-[#e2ded5] text-[#0d1747] py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#dedad0]"
            >
              <Lock className="w-3.5 h-3.5 text-[#0d1747]" />
              <span>Staff workspace 🔒</span>
            </button>
            {showStaffNotice && (
              <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start justify-between">
                <span>Staff workspace is restricted to authorized transit dispatch marshalls.</span>
                <button onClick={() => setShowStaffNotice(false)} className="font-bold ml-2">✕</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav currentScreen="more" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
