import React from 'react';
import {
  AppAccessibilitySettings,
  CommuterUser,
  JourneyOption,
  JourneySearchParams,
  PastTrip,
  SavedJourney,
  ScreenId,
} from '../../types/transit';
import { Onboarding1Screen } from './Onboarding1Screen';
import { Onboarding2Screen } from './Onboarding2Screen';
import { Onboarding3Screen } from './Onboarding3Screen';
import { SignInScreen } from './SignInScreen';
import { CreateProfileScreen } from './CreateProfileScreen';
import { HomeDashboardScreen } from './HomeDashboardScreen';
import { JourneyMapScreen } from './JourneyMapScreen';
import { RouteDirectoryScreen } from './RouteDirectoryScreen';
import { SavedJourneysScreen } from './SavedJourneysScreen';
import { AccessibilityScreen } from './AccessibilityScreen';
import { AboutScreen } from './AboutScreen';
import { HelpFaqScreen } from './HelpFaqScreen';
import { ReportIssueScreen } from './ReportIssueScreen';
import { DataPreferencesScreen } from './DataPreferencesScreen';
import { ProfileModal } from '../modals/ProfileModal';
import { MoreDrawer } from '../common/MoreDrawer';

const noop = () => undefined;
const go = (_screen: ScreenId) => undefined;

const A11Y: AppAccessibilitySettings = {
  textSize: '100%',
  highContrast: false,
  reduceMotion: false,
  darkMode: false,
  language: 'English',
  lowDataMode: false,
  downloadOnlyWifi: true,
};

const GUEST: CommuterUser = {
  fullName: '',
  mobileNumber: '',
  metroCardNumber: '',
  isLoggedIn: false,
  cardBalance: 50,
  savedRoutes: [],
  loadSheddingAlerts: true,
};

const USER: CommuterUser = {
  fullName: 'Lebo Mokoena',
  mobileNumber: '082 555 0147',
  metroCardNumber: 'MB-104928',
  isLoggedIn: true,
  cardBalance: 124.5,
  savedRoutes: [],
  loadSheddingAlerts: true,
};

const EMPTY_SEARCH: JourneySearchParams = {
  fromLocation: '',
  toLocation: '',
  leaveDate: '2026-10-20',
  leaveTime: '',
  whenType: 'Depart at',
  preferences: 'Bus + walking · fewest transfers',
};

const FILLED_SEARCH: JourneySearchParams = {
  ...EMPTY_SEARCH,
  fromLocation: 'Gandhi Square',
  toLocation: 'Highlands North',
  leaveTime: '07:15',
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

const todayKey = () => {
  const value = new Date();
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-');
};

const PAST: PastTrip[] = [
  {
    id: 'pt-1',
    origin: 'Gandhi Square',
    destination: 'Highlands North',
    fare: 'R16.50',
    durationMinutes: 25,
    scheduledTime: '07:15 – 07:40',
    busLine: '4',
    endedAt: new Date().toISOString(),
    endedDate: todayKey(),
  },
];

const SAVED: SavedJourney[] = [
  {
    id: 'sv-1',
    title: 'Gandhi Square → Highlands North',
    origin: 'Gandhi Square',
    destination: 'Highlands North',
    fare: 'R16.50',
    durationMinutes: 25,
    dateSaved: '20 Oct 2026',
    scheduledTime: '07:15 – 07:40',
    isOfflineDownloaded: true,
    snapshot: SAMPLE_JOURNEY,
  },
];

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
        Import this page in html.to.design with Full page capture. Each block is one phone frame.
      </p>

      <div className="flex flex-wrap gap-10 pb-16">
        <Phone title="Onboarding 1">
          <Onboarding1Screen onNavigate={go} />
        </Phone>
        <Phone title="Onboarding 2">
          <Onboarding2Screen onNavigate={go} />
        </Phone>
        <Phone title="Onboarding 3">
          <Onboarding3Screen onNavigate={go} />
        </Phone>
        <Phone title="Sign in">
          <SignInScreen onNavigate={go} commuter={GUEST} onLoginSuccess={noop} />
        </Phone>
        <Phone title="Create profile">
          <CreateProfileScreen onNavigate={go} commuter={GUEST} onProfileCreated={noop} />
        </Phone>
        <Phone title="Plan · empty">
          <HomeDashboardScreen
            onNavigate={go}
            searchParams={EMPTY_SEARCH}
            onUpdateSearchParams={noop}
            commuter={GUEST}
            onOpenProfile={noop}
            onStartTrip={noop}
          />
        </Phone>
        <Phone title="Plan · buses">
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
        <Phone title="Trip · empty">
          <JourneyMapScreen onNavigate={go} pastTrips={PAST} savedCount={1} />
        </Phone>
        <Phone title="Trip · breakdown">
          <JourneyMapScreen
            onNavigate={go}
            selectedJourney={SAMPLE_JOURNEY}
            searchParams={FILLED_SEARCH}
            savedCount={1}
            onEndTrip={noop}
            onDownloadOffline={noop}
          />
        </Phone>
        <Phone title="Trip · live map">
          <JourneyMapScreen
            onNavigate={go}
            selectedJourney={SAMPLE_JOURNEY}
            searchParams={FILLED_SEARCH}
            savedCount={1}
            onEndTrip={noop}
            initialLivePreview
          />
        </Phone>
        <Phone title="Routes · bus">
          <RouteDirectoryScreen onNavigate={go} savedCount={1} />
        </Phone>
        <Phone title="Routes · taxi">
          <RouteDirectoryScreen onNavigate={go} savedCount={1} initialMode="taxi" />
        </Phone>
        <Phone title="Saved · empty">
          <SavedJourneysScreen
            onNavigate={go}
            savedJourneys={[]}
            onRemoveSaved={noop}
            onRenameSaved={noop}
            onDownloadOffline={noop}
            onOpenSaved={noop}
          />
        </Phone>
        <Phone title="Saved · journeys">
          <SavedJourneysScreen
            onNavigate={go}
            savedJourneys={SAVED}
            onRemoveSaved={noop}
            onRenameSaved={noop}
            onDownloadOffline={noop}
            onOpenSaved={noop}
          />
        </Phone>
        <Phone title="Menu">
          <HomeDashboardScreen
            onNavigate={go}
            searchParams={EMPTY_SEARCH}
            onUpdateSearchParams={noop}
            commuter={USER}
            onOpenProfile={noop}
            onStartTrip={noop}
            savedCount={1}
          />
          <MoreDrawer isOpen onClose={noop} onNavigate={go} />
        </Phone>
        <Phone title="Profile">
          <ProfileModal
            isOpen
            onClose={noop}
            commuter={USER}
            onUpdateCommuter={noop}
            onSignOut={noop}
            onNavigate={go}
          />
        </Phone>
        <Phone title="Accessibility">
          <AccessibilityScreen onNavigate={go} settings={A11Y} onUpdateSettings={noop} savedCount={1} />
        </Phone>
        <Phone title="Data preferences">
          <DataPreferencesScreen
            onNavigate={go}
            settings={A11Y}
            onUpdateSettings={noop}
            offlineCount={1}
            savedCount={1}
          />
        </Phone>
        <Phone title="Reports">
          <ReportIssueScreen onNavigate={go} selectedRank={null} savedCount={1} />
        </Phone>
        <Phone title="Help">
          <HelpFaqScreen onNavigate={go} savedCount={1} />
        </Phone>
        <Phone title="About">
          <AboutScreen onNavigate={go} savedCount={1} />
        </Phone>
      </div>
    </div>
  );
};
