import React from 'react';
import { ScreenId } from '../../types/transit';
import {
  ChevronRight,
  Eye,
  Flag,
  HelpCircle,
  Info,
  Sliders,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useMoreMenu } from './MoreMenuContext';

const SignOutIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m17 16l4-4m0 0l-4-4m4 4H7m4 9H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3H11"
    />
  </svg>
);

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

type MenuItem = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
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

export const MoreDrawer: React.FC<MoreDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { openProfile, signOut } = useMoreMenu();

  const handleItem = (item: MenuItem) => {
    if (item.action === 'profile') {
      openProfile();
      return;
    }
    if (item.screen) {
      onClose();
      onNavigate(item.screen);
    }
  };

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto overflow-hidden" aria-hidden={!isOpen}>
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0d1747]/45 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close menu"
      />

      <aside
        className={`absolute top-0 right-0 h-full w-[86%] max-w-sm bg-[#f7f6f2] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="More"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-[22px] font-extrabold text-[#0d1747] tracking-tight">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-[#0d1747] hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 pb-4">
          {GROUPS.map((group) => (
            <section key={group.label} className="mt-5 first:mt-1">
              <p className="text-[12px] text-[#687085] mb-1 px-0.5">{group.label}</p>
              <ul>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleItem(item)}
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
        </nav>

        <div className="px-5 pb-8 pt-2">
          <button
            type="button"
            onClick={signOut}
            className="w-full bg-[#c62828] hover:bg-[#b71c1c] text-white py-3.5 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2"
          >
            <SignOutIcon className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );
};
