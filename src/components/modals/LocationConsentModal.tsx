import React from 'react';
import { X, MapPin } from 'lucide-react';

interface LocationConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LocationConsentModal: React.FC<LocationConsentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#dedad0] animate-fadeIn">
        <div className="flex items-center justify-between pb-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1b3a6b] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-[#0d1747]">
              Use your location?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6b7280] hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#4b5563] leading-relaxed mb-3">
          Only when you ask. We&apos;ll find a supported demo stop near your device, or let you confirm a stop manually. No location is sent to the server for planning.
        </p>

        <p className="text-[11px] text-[#6b7280] leading-relaxed mb-5 bg-[#f7f6f2] p-3 rounded-2xl border border-[#edeae2]">
          Family sharing needs separate consent. There is no background tracking for journey planning.
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#dedad0] rounded-2xl text-xs font-bold text-[#555d71] hover:bg-slate-50 transition-colors"
          >
            Not now
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 bg-[#0d1747] hover:bg-[#19276d] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
          >
            Use location once
          </button>
        </div>
      </div>
    </div>
  );
};
