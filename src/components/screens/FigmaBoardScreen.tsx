import React from 'react';
import {
  CommuterUser,
  JourneyOption,
  JourneySearchParams,
  ScreenId,
} from '../../types/transit';
import { HomeDashboardScreen } from './HomeDashboardScreen';
import { JourneyMapScreen } from './JourneyMapScreen';

const noop = () => undefined;
const go = (_screen: ScreenId) => undefined;

const USER: CommuterUser = {
  fullName: 'Lebo Mokoena',
  mobileNumber: '082 555 0147',
  metroCardNumber: 'MB-104928',
  isLoggedIn: true,
  cardBalance: 124.5,
  savedRoutes: [],
  loadSheddingAlerts: true,
};

const FILLED_SEARCH: JourneySearchParams = {
  fromLocation: 'Gandhi Square',
  toLocation: 'Highlands North',
  leaveDate: '2026-10-20',
  leaveTime: '07:15',
  whenType: 'Depart at',
  preferences: 'Bus + walking · fewest transfers',
};

const SAMPLE_JOURNEY: JourneyOption = {
  id: 'figma-4',
  departureTime: '07:15',
  arrivalTime: '07:40',
  durationMinutes: 25,
  fare: 'R16.50',
  fareType: 'Single',
  crowding: 'Seats available',
  crowdingColor: 'text-[#2e7d32]',
  origin: 'Gandhi Square',
  destination: 'Highlands North',
  transfersCount: 0,
  transferDetails: 'direct',
  busLine: '4',
  walkingMinutesBefore: 4,
  walkingMinutesAfter: 3,
  isDirect: true,
  steps: [
    {
      type: 'walk',
      title: 'Walk to Gandhi Square',
      duration: '4 min',
      instruction: 'Bay A',
      time: '07:11',
    },
    {
      type: 'bus',
      title: 'Route 4 to Highlands North',
      duration: '25 min',
      instruction: 'via Louis Botha',
      time: '07:15',
    },
    {
      type: 'walk',
      title: 'Walk from Highlands North',
      duration: '3 min',
      instruction: 'To destination',
      time: '07:40',
    },
  ],
};

function Phone({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <p className="text-[13px] font-bold text-[#0d1747] px-1">{title}</p>
      <div
        className="w-[390px] h-[844px] overflow-hidden bg-[#f7f6f2] relative shadow-sm"
        style={{ transform: 'translateZ(0)' }}
      >
        {children}
      </div>
    </div>
  );
}

export const FigmaBoardScreen: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#ece9e0] px-8 py-8">
      <h1 className="text-[28px] font-extrabold text-[#0d1747] tracking-tight">TransFlow screens</h1>
      <p className="mt-1 mb-8 text-sm text-[#555d71] max-w-xl">
        Import this page in html.to.design with Full page capture.
      </p>

      <div className="flex flex-wrap gap-10 pb-16">
        <Phone title="Plan · Start trip">
          <HomeDashboardScreen
            onNavigate={go}
            searchParams={FILLED_SEARCH}
            onUpdateSearchParams={noop}
            commuter={USER}
            onOpenProfile={noop}
            onStartTrip={noop}
            savedCount={1}
          />
        </Phone>
        <Phone title="Trip · passed stops">
          <JourneyMapScreen
            onNavigate={go}
            selectedJourney={SAMPLE_JOURNEY}
            searchParams={FILLED_SEARCH}
            savedCount={1}
            onEndTrip={noop}
            onDownloadOffline={noop}
            initialCheckedTo={2}
          />
        </Phone>
        <Phone title="Trip · Share live trip">
          <JourneyMapScreen
            onNavigate={go}
            selectedJourney={SAMPLE_JOURNEY}
            searchParams={FILLED_SEARCH}
            savedCount={1}
            onEndTrip={noop}
            onDownloadOffline={noop}
            initialCheckedTo={2}
            initialShareOpen
          />
        </Phone>
      </div>
    </div>
  );
};
