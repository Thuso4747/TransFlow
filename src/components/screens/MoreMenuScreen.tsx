import React from 'react';
import { ScreenId, AppAccessibilitySettings } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';
import { useMoreMenu } from '../common/MoreMenuContext';
import {
  ChevronRight,
  Eye,
  Sliders,
  Trash2,
  HelpCircle,
  Info,
  User,
  Flag,
} from 'lucide-react';

interface MoreMenuProps {
  onNavigate: (screen: ScreenId) => void;
  accessibilitySettings: AppAccessibilitySettings;
  offlineCount?: number;
  savedCount?: number;
}

type MenuItem = {
  id: string;
  title: string;
  icon: typeof Eye;
  screen?: ScreenId;
  action?: 'profile';
};

const GROUPS: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Account',
    items: [{ id: 'profile', title: 'Profile', icon: User, action: 'profile' }],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'accessibility', screen: 'accessibility', title: 'Accessibility', icon: Eye },
      { id: 'data', screen: 'data-preferences', title: 'Data preferences', icon: Sliders },
      { id: 'clear-data', screen: 'clear-data', title: 'Saved data', icon: Trash2 },
    ],
  },
  {
    label: 'Support',
    items: [
      { id: 'reports', screen: 'report-issue', title: 'Reports', icon: Flag },
      { id: 'help', screen: 'help-faq', title: 'Help & FAQs', icon: HelpCircle },
      { id: 'about', screen: 'about', title: 'About TransFlow', icon: Info },
    ],
  },
];

export const MoreMenuScreen: React.FC<MoreMenuProps> = ({
  onNavigate,
  savedCount = 0,
}) => {
  const { openProfile } = useMoreMenu();

  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} />

      <div className="px-5 pt-6">
        <h1 className="text-[28px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
          Menu
        </h1>
        <p className="text-[13px] text-[#555d71] mb-2">
          Account, travel tools, and support.
        </p>

        {GROUPS.map((group) => (
          <section key={group.label} className="mt-6">
            <p className="text-[12px] text-[#687085] mb-1">{group.label}</p>
            <ul>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.action === 'profile') {
                          openProfile();
                          return;
                        }
                        if (item.screen) onNavigate(item.screen);
                      }}
                      className="w-full flex items-center gap-3.5 py-3.5 text-left group"
                    >
                      <Icon className="w-[18px] h-[18px] text-[#0d1747] shrink-0" strokeWidth={2} />
                      <span className="flex-1 text-[15px] font-semibold text-[#0d1747]">{item.title}</span>
                      <ChevronRight className="w-4 h-4 text-[#c3c7d4] group-hover:text-[#0d1747] transition-colors" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <BottomNav currentScreen="more" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
