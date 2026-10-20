import React from 'react';
import { CommuterUser, ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';

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
            className="mt-8 text-sm font-semibold text-[#c62828]"
          >
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
