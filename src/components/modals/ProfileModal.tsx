import React, { useState } from 'react';
import { CommuterUser } from '../../types/transit';
import {
  X,
  CreditCard,
  User,
  Phone,
  Bell,
  Zap,
  Plus,
  CheckCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  commuter: CommuterUser;
  onUpdateCommuter: (data: Partial<CommuterUser>) => void;
  onSignOut: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  commuter,
  onUpdateCommuter,
  onSignOut,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(commuter.loadSheddingAlerts);

  if (!isOpen) return null;

  const handleTopUp = (amount: number) => {
    const newBalance = commuter.cardBalance + amount;
    onUpdateCommuter({ cardBalance: newBalance });
    setSuccessToast(`Successfully loaded +R${amount}.00 onto MetroCard!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleToggleAlerts = () => {
    const updated = !alertsEnabled;
    setAlertsEnabled(updated);
    onUpdateCommuter({ loadSheddingAlerts: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl border border-[#dedad0]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eeebe3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0d1747] text-white flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0d1747]">
                {commuter.isLoggedIn ? commuter.fullName : 'Guest Commuter'}
              </h3>
              <p className="text-xs text-[#555d71]">
                {commuter.isLoggedIn ? commuter.mobileNumber : 'Not signed in'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-[#555d71]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successToast && (
          <div className="my-3 p-3 bg-[#e8f3d6] border border-[#84ad32] text-[#3e6815] text-xs rounded-xl font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#84ad32]" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="py-4 space-y-5">
          {/* MetroCard Digital Wallet Card */}
          <div className="bg-[#0d1747] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#84ad32]/20 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#84ad32]">
                Joburg MetroCard Smart Tap
              </span>
              <CreditCard className="w-5 h-5 text-white/80" />
            </div>

            <p className="text-xs font-mono tracking-widest text-white/70 mb-3">
              {commuter.metroCardNumber || '9400 1209 8432 0192'}
            </p>

            <div className="flex items-end justify-between pt-2 border-t border-white/10">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/60">
                  Available Tap Balance
                </p>
                <p className="text-2xl font-black text-white">
                  R {commuter.cardBalance.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84ad32] animate-pulse" />
                <span className="text-[11px] font-bold text-[#84ad32]">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Top Up */}
          <div>
            <h4 className="text-xs font-extrabold text-[#0d1747] uppercase tracking-wider mb-2">
              Instant Card Top-Up
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {[50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="py-2.5 px-3 bg-[#f2f7e8] hover:bg-[#e4eed2] border border-[#d6e5be] rounded-2xl text-xs font-bold text-[#3e6815] transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+R{amt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Load Shedding & Traffic Alert Toggle */}
          <div className="bg-[#fff9eb] border border-[#f5e6be] p-4 rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-[#78350f]">
                    Joburg Load Shedding &amp; Corridor Alerts
                  </h4>
                  <p className="text-[11px] text-[#92400e] leading-relaxed mt-0.5">
                    WhatsApp &amp; SMS alerts when traffic lights are impacted on Jan Smuts, Empire, or Oxford corridors.
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleAlerts}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
                  alertsEnabled ? 'bg-[#84ad32]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    alertsEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Commuter Actions */}
          <div className="space-y-2 pt-1 border-t border-[#eeebe3]">
            {commuter.isLoggedIn ? (
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of TransFlow</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-[#0d1747] text-white hover:bg-[#142161] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue Using TransFlow</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
