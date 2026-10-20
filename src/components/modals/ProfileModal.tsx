import React from 'react';
import { CommuterUser, ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';

const SignOutIcon: React.FC<{ className?: string }> = ({ className }) => (
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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  commuter: CommuterUser;
  onUpdateCommuter: (data: Partial<CommuterUser>) => void;
  onSignOut: () => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  commuter,
  onSignOut,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const name = commuter.isLoggedIn && commuter.fullName ? commuter.fullName : 'Guest';
  const mobile = commuter.isLoggedIn && commuter.mobileNumber ? commuter.mobileNumber : 'Not signed in';
  const card = commuter.metroCardNumber?.trim() || 'Not added';

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto bg-[#f7f6f2]">
      <TransFlowHeader showBack onBack={onClose} onNavigate={onNavigate} />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          Profile.
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
          Your details on this device.
        </p>

        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">Name</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">{name}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">Mobile</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">{mobile}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">MetroCard</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">{card}</span>
        </div>

        {commuter.isLoggedIn ? (
          <button
            type="button"
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#c62828]"
          >
            <SignOutIcon className="w-[18px] h-[18px]" />
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate?.('sign-in');
            }}
            className="mt-8 w-full bg-[#0d1747] hover:bg-[#142161] text-white py-4 px-6 rounded-2xl font-bold text-base"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
