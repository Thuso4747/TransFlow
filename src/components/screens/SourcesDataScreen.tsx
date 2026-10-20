import React from 'react';
import { ScreenId } from '../../types/transit';
import { TransFlowHeader } from '../common/TransFlowHeader';
import { BottomNav } from '../common/BottomNav';

interface SourcesDataProps {
  onNavigate: (screen: ScreenId) => void;
  savedCount?: number;
}

export const SourcesDataScreen: React.FC<SourcesDataProps> = ({ onNavigate, savedCount = 0 }) => {
  return (
    <div className="min-h-screen pb-24 bg-[#f7f6f2] flex flex-col justify-between max-w-md mx-auto">
      <div>
        <TransFlowHeader onNavigate={onNavigate} showBack backTo="more" />

        <div className="px-5 pt-5 pb-2">
          
          <h1 className="text-[32px] font-extrabold text-[#0d1747] tracking-tight leading-tight mb-1">
            A clearer view of the information.
          </h1>

          
          <p className="text-[13px] text-[#555d71] leading-relaxed mb-5">
            Read each label in context. Different terms imply clear, different things.
          </p>

          
          <div className="space-y-3.5 mb-5">
            
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Community reported</h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                Commuter-submitted rank facilities, local taxi fares, and queue tips shared to help other travellers navigate everyday routes.
              </p>
            </div>

            
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Indicative</h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                An estimate to help compare options. Confirm the amount, payment method and boarding point before travel.
              </p>
            </div>

            
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Reviewed</h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                When a fare or record was checked. It does not say that a vehicle is currently available.
              </p>
            </div>

            
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Last location update</h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                The captured and received times for a consenting traveller&apos;s device point. More than 60 seconds without an update is stale.
              </p>
            </div>

            
            <div className="bg-white rounded-3xl p-4.5 border border-[#e5e1d7] shadow-xs">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Unknown</h4>
              <p className="text-xs text-[#555d71] leading-relaxed">
                No confirmed value is available. Unknown fares are null, never zero or ranked cheapest.
              </p>
            </div>

            
            <div className="bg-[#edeae2] rounded-3xl p-4.5 border border-[#dedad0]">
              <h4 className="text-xs font-extrabold text-[#0d1747] mb-1">Configured providers</h4>
              <p className="text-xs text-[#555d71] leading-relaxed mb-2">
                TransFlow fictional seed network: effective 16 October 2026. The seed timetable is calculated for your selected date, day and time. No live route, fare or geographic map provider is configured.
              </p>
              <p className="text-[10px] text-[#798090] leading-relaxed font-mono">
                Source adapters live in shared/domains.ts and src/services.ts. Approved external sources must include a reference, review time and effective date.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav currentScreen="sources-data" onNavigate={onNavigate} savedCount={savedCount} />
    </div>
  );
};
