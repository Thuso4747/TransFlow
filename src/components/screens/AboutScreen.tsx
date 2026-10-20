import React from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';

interface AboutScreenProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate, savedCount = 0 }) => {
  return (
    <div className="min-h-full pb-20 bg-[#f7f6f2] max-w-md mx-auto">
      <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

      <div className="pt-5 px-4">
        <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight">
          About TransFlow.
        </h1>
        <p className="mt-2 mb-6 text-sm text-[#555d71] leading-relaxed">
          A Johannesburg Metrobus planner for everyday trips.
        </p>

        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">Network</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">City of Johannesburg Metrobus</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">Routes</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">4, 13A, 13B, 13C</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[#ece9e0]">
          <span className="text-[12px] text-[#687085]">Storage</span>
          <span className="text-[15px] font-semibold text-[#0d1747] text-right">This device</span>
        </div>

        <p className="mt-6 text-sm text-[#555d71] leading-relaxed">
          Fares are estimates. Sharing a live trip is optional and only lasts until you stop sharing or end the trip. This is not an emergency service.
        </p>
      </div>

      <BottomNav currentScreen="about" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
