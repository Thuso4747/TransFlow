import React, { useEffect, useState } from 'react';
import {
  ScreenId,
  CommuterUser,
  JourneySearchParams,
  JourneyOption,
  MetroRoute,
  TaxiRank,
  SavedJourney,
  OfflinePackage,
  PastTrip,
  AppAccessibilitySettings,
} from './types/transit';

import { Onboarding1Screen } from './components/screens/Onboarding1Screen';
import { Onboarding2Screen } from './components/screens/Onboarding2Screen';
import { Onboarding3Screen } from './components/screens/Onboarding3Screen';
import { SignInScreen } from './components/screens/SignInScreen';
import { CreateProfileScreen } from './components/screens/CreateProfileScreen';
import { HomeDashboardScreen } from './components/screens/HomeDashboardScreen';
import { JourneyMapScreen } from './components/screens/JourneyMapScreen';
import { JourneyFilterScreen } from './components/screens/JourneyFilterScreen';
import { JourneyStepsScreen } from './components/screens/JourneyStepsScreen';
import { TaxiDirectoryScreen } from './components/screens/TaxiDirectoryScreen';
import { TaxiRankDetailsScreen } from './components/screens/TaxiRankDetailsScreen';
import { RouteDirectoryScreen } from './components/screens/RouteDirectoryScreen';
import { RouteMapScreen } from './components/screens/RouteMapScreen';
import { SavedJourneysScreen } from './components/screens/SavedJourneysScreen';
import { MoreMenuScreen } from './components/screens/MoreMenuScreen';
import { AccessibilityScreen } from './components/screens/AccessibilityScreen';
import { OfflineDownloadsScreen } from './components/screens/OfflineDownloadsScreen';
import { DataPreferencesScreen } from './components/screens/DataPreferencesScreen';
import { ReportIssueScreen } from './components/screens/ReportIssueScreen';
import { HelpFaqScreen } from './components/screens/HelpFaqScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { SourcesDataScreen } from './components/screens/SourcesDataScreen';
import { ClearDataScreen } from './components/screens/ClearDataScreen';

import { ProfileModal } from './components/modals/ProfileModal';
import { MoreMenuProvider } from './components/common/MoreMenuContext';
import {
  loadA11y,
  loadActiveTrip,
  loadOfflinePackages,
  loadPastTrips,
  loadSavedJourneys,
  saveA11y,
  saveActiveTrip,
  saveOfflinePackages,
  savePastTrips,
  saveSavedJourneys,
} from './lib/offlineStore';

const DEFAULT_A11Y: AppAccessibilitySettings = {
  textSize: '100%',
  highContrast: false,
  reduceMotion: false,
  darkMode: false,
  language: 'English',
  lowDataMode: false,
  downloadOnlyWifi: true,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('onboarding-1');
  const [isDeviceFrame] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [commuter, setCommuter] = useState<CommuterUser>({
    fullName: '',
    mobileNumber: '',
    metroCardNumber: '',
    isLoggedIn: false,
    cardBalance: 124.5,
    savedRoutes: [],
    loadSheddingAlerts: true,
  });

  const [searchParams, setSearchParams] = useState<JourneySearchParams>({
    fromLocation: '',
    toLocation: '',
    leaveDate: '2026-10-19',
    leaveTime: '',
    whenType: 'Depart at',
    preferences: 'Bus + walking · fewest transfers',
  });

  const [selectedJourney, setSelectedJourney] = useState<JourneyOption | null>(() =>
    loadActiveTrip<JourneyOption | null>(null),
  );
  const [tripReturnScreen, setTripReturnScreen] = useState<ScreenId>('home-dashboard');

  const [selectedRank, setSelectedRank] = useState<TaxiRank | null>(null);

  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>(() =>
    loadSavedJourneys<SavedJourney[]>([]),
  );

  const [offlinePackages, setOfflinePackages] = useState<OfflinePackage[]>(() =>
    loadOfflinePackages<OfflinePackage[]>([]),
  );

  const [pastTrips, setPastTrips] = useState<PastTrip[]>(() => loadPastTrips<PastTrip[]>([]));

  const [accessibilitySettings, setAccessibilitySettings] = useState<AppAccessibilitySettings>(() => {
    const loaded = { ...DEFAULT_A11Y, ...loadA11y<Partial<AppAccessibilitySettings>>({}) };
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('tf-dark', Boolean(loaded.darkMode));
    }
    return loaded;
  });

  const handleUpdateSearchParams = (params: Partial<JourneySearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentScreen]);

  useEffect(() => {
    saveSavedJourneys(savedJourneys);
  }, [savedJourneys]);

  useEffect(() => {
    saveOfflinePackages(offlinePackages);
  }, [offlinePackages]);

  useEffect(() => {
    saveActiveTrip(selectedJourney);
  }, [selectedJourney]);

  useEffect(() => {
    savePastTrips(pastTrips);
  }, [pastTrips]);

  useEffect(() => {
    saveA11y(accessibilitySettings);
    document.documentElement.classList.toggle('tf-dark', accessibilitySettings.darkMode);
    document.body.classList.toggle('tf-dark', accessibilitySettings.darkMode);
  }, [accessibilitySettings]);

  const handleStartTrip = (journey: JourneyOption) => {
    setSelectedJourney(journey);
    setTripReturnScreen('home-dashboard');
    setSearchParams((prev) => ({
      ...prev,
      fromLocation: journey.origin,
      toLocation: journey.destination,
      leaveTime: `${journey.departureTime} → ${journey.arrivalTime}`,
    }));
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setCurrentScreen('journey-map');
  };

  const handleUpdateCommuter = (data: Partial<CommuterUser>) => {
    setCommuter((prev) => ({ ...prev, ...data }));
  };

  const handleSignOut = () => {
    setCommuter({
      fullName: '',
      mobileNumber: '',
      metroCardNumber: '',
      isLoggedIn: false,
      cardBalance: 50.0,
      savedRoutes: [],
      loadSheddingAlerts: true,
    });
    setCurrentScreen('sign-in');
  };

  const handleSelectRouteForPlan = (route: MetroRoute) => {
    setSearchParams((prev) => ({
      ...prev,
      fromLocation: route.origin,
      toLocation: route.destination,
    }));
    setCurrentScreen('home-dashboard');
  };

  const handleSelectDestination = (dest: string) => {
    setSearchParams((prev) => ({
      ...prev,
      toLocation: dest,
    }));
    setCurrentScreen('home-dashboard');
  };

  const handleRemoveSaved = (id: string) => {
    setSavedJourneys((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRenameSaved = (id: string, newTitle: string) => {
    setSavedJourneys((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleDownloadJourney = (journey: JourneyOption) => {
    const dateSaved = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
    const scheduledTime = `${journey.departureTime} – ${journey.arrivalTime}`;
    const title = `${journey.origin} → ${journey.destination}`;

    setSavedJourneys((prev) => {
      const match = prev.find(
        (item) =>
          item.snapshot?.id === journey.id ||
          (item.origin === journey.origin &&
            item.destination === journey.destination &&
            item.snapshot?.departureTime === journey.departureTime),
      );
      if (match) {
        return prev.map((item) =>
          item.id === match.id
            ? { ...item, isOfflineDownloaded: true, snapshot: journey, scheduledTime, fare: journey.fare }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: `sj-${Date.now()}`,
          title,
          origin: journey.origin,
          destination: journey.destination,
          fare: journey.fare,
          durationMinutes: journey.durationMinutes,
          dateSaved,
          scheduledTime,
          isOfflineDownloaded: true,
          snapshot: journey,
        },
      ];
    });

    setOfflinePackages((prev) => {
      const exists = prev.some(
        (pkg) =>
          pkg.snapshot?.id === journey.id ||
          (pkg.origin === journey.origin &&
            pkg.destination === journey.destination &&
            pkg.snapshot?.departureTime === journey.departureTime),
      );
      if (exists) {
        return prev.map((pkg) =>
          pkg.origin === journey.origin && pkg.destination === journey.destination
            ? { ...pkg, snapshot: journey, fare: journey.fare, downloadDate: dateSaved }
            : pkg,
        );
      }
      return [
        ...prev,
        {
          id: `pkg-${Date.now()}`,
          title,
          sizeKb: 650,
          downloadDate: dateSaved,
          origin: journey.origin,
          destination: journey.destination,
          fare: journey.fare,
          durationMinutes: journey.durationMinutes,
          snapshot: journey,
        },
      ];
    });
  };

  const handleOpenSaved = (item: SavedJourney) => {
    if (!item.snapshot) return;
    setSelectedJourney(item.snapshot);
    setTripReturnScreen('saved-journeys');
    setCurrentScreen('journey-map');
  };

  const handleOpenOffline = (pkg: OfflinePackage) => {
    if (!pkg.snapshot) return;
    setSelectedJourney(pkg.snapshot);
    setTripReturnScreen('saved-journeys');
    setCurrentScreen('journey-map');
  };

  const handleEndTrip = () => {
    if (selectedJourney) {
      const now = new Date();
      const endedDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-');
      setPastTrips((prev) => [
        {
          id: `pt-${Date.now()}`,
          origin: selectedJourney.origin,
          destination: selectedJourney.destination,
          fare: selectedJourney.fare,
          durationMinutes: selectedJourney.durationMinutes,
          scheduledTime: `${selectedJourney.departureTime} – ${selectedJourney.arrivalTime}`,
          busLine: selectedJourney.busLine,
          endedAt: now.toISOString(),
          endedDate,
        },
        ...prev,
      ]);
    }
    setSelectedJourney(null);
    setCurrentScreen('journey-map');
  };

  const handleDownloadOffline = (id: string) => {
    const journey = savedJourneys.find((j) => j.id === id);
    if (!journey) return;
    setSavedJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isOfflineDownloaded: true } : j))
    );
    if (!offlinePackages.some((p) => p.origin === journey.origin && p.destination === journey.destination)) {
      setOfflinePackages((prev) => [
        ...prev,
        {
          id: `pkg-${Date.now()}`,
          title: journey.title,
          sizeKb: 650,
          downloadDate: 'Today',
          origin: journey.origin,
          destination: journey.destination,
          fare: journey.fare,
          durationMinutes: journey.durationMinutes,
        },
      ]);
    }
  };

  const handleRemovePackage = (id: string) => {
    setOfflinePackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdatePackage = (id: string) => {
    setOfflinePackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, downloadDate: 'Just now' } : p))
    );
  };

  const handleClearData = (types: string[]) => {
    if (types.includes('saved')) setSavedJourneys([]);
    if (types.includes('offline')) setOfflinePackages([]);
    if (types.includes('preferences')) {
      setAccessibilitySettings({ ...DEFAULT_A11Y });
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'onboarding-1':
        return <Onboarding1Screen onNavigate={setCurrentScreen} />;
      case 'onboarding-2':
        return <Onboarding2Screen onNavigate={setCurrentScreen} />;
      case 'onboarding-3':
        return <Onboarding3Screen onNavigate={setCurrentScreen} />;
      case 'sign-in':
        return (
          <SignInScreen
            onNavigate={setCurrentScreen}
            commuter={commuter}
            onLoginSuccess={handleUpdateCommuter}
          />
        );
      case 'create-profile':
        return (
          <CreateProfileScreen
            onNavigate={setCurrentScreen}
            commuter={commuter}
            onProfileCreated={handleUpdateCommuter}
          />
        );
      case 'home-dashboard':
      case 'journey-planner':
        return (
          <HomeDashboardScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            onUpdateSearchParams={handleUpdateSearchParams}
            commuter={commuter}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onStartTrip={handleStartTrip}
            savedCount={savedJourneys.length}
          />
        );
      case 'journey-map':
        return (
          <JourneyMapScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            selectedJourney={selectedJourney}
            onDownloadOffline={() => {
              if (selectedJourney) handleDownloadJourney(selectedJourney);
            }}
            isOfflineDownloaded={Boolean(
              selectedJourney &&
                (offlinePackages.some(
                  (pkg) =>
                    pkg.origin === selectedJourney.origin &&
                    pkg.destination === selectedJourney.destination,
                ) ||
                  savedJourneys.some(
                    (item) =>
                      item.isOfflineDownloaded &&
                      item.origin === selectedJourney.origin &&
                      item.destination === selectedJourney.destination,
                  )),
            )}
            savedCount={savedJourneys.length}
            backTo={tripReturnScreen}
            pastTrips={pastTrips}
            onEndTrip={handleEndTrip}
            onDeletePastTrip={(id) => setPastTrips((prev) => prev.filter((trip) => trip.id !== id))}
          />
        );
      case 'journey-steps': {
        const origin = selectedJourney?.origin || searchParams.fromLocation;
        const destination = selectedJourney?.destination || searchParams.toLocation;
        const matchingSaved = savedJourneys.find(
          (j) => j.origin === origin && j.destination === destination
        );
        return (
          <JourneyStepsScreen
            onNavigate={setCurrentScreen}
            selectedJourney={selectedJourney}
            searchParams={searchParams}
            isSaved={Boolean(matchingSaved)}
            onToggleSave={() => {
              if (matchingSaved) {
                handleRemoveSaved(matchingSaved.id);
                return;
              }
              setSavedJourneys((prev) => [
                ...prev,
                {
                  id: `sj-${Date.now()}`,
                  title: `${origin} to ${destination}`,
                  origin,
                  destination,
                  fare: selectedJourney?.fare || 'R18.00',
                  durationMinutes: selectedJourney?.durationMinutes || 46,
                  dateSaved: 'Today',
                  scheduledTime: selectedJourney
                    ? `${selectedJourney.departureTime} – ${selectedJourney.arrivalTime}`
                    : searchParams.leaveTime,
                  isOfflineDownloaded: false,
                },
              ]);
            }}
            isDownloaded={Boolean(matchingSaved?.isOfflineDownloaded)}
            onDownloadOffline={() => {
              if (matchingSaved) handleDownloadOffline(matchingSaved.id);
            }}
            savedCount={savedJourneys.length}
          />
        );
      }
      case 'route-map':
        return (
          <RouteMapScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            selectedJourney={selectedJourney}
            savedCount={savedJourneys.length}
          />
        );
      case 'journey-filter':
      case 'journey-results':
        return (
          <JourneyFilterScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            onSelectJourneyForMap={setSelectedJourney}
          />
        );
      case 'taxi-directory':
        return (
          <TaxiDirectoryScreen
            onNavigate={setCurrentScreen}
            onSelectRank={(rank) => {
              setSelectedRank(rank);
              setCurrentScreen('taxi-details');
            }}
            onSelectDestination={handleSelectDestination}
            savedCount={savedJourneys.length}
          />
        );
      case 'taxi-details':
        return (
          <TaxiRankDetailsScreen
            onNavigate={setCurrentScreen}
            selectedRank={selectedRank}
            savedCount={savedJourneys.length}
          />
        );
      case 'route-directory':
        return (
          <RouteDirectoryScreen
            onNavigate={setCurrentScreen}
            onSelectRouteForPlan={handleSelectRouteForPlan}
            savedCount={savedJourneys.length}
          />
        );
      case 'saved-journeys':
        return (
          <SavedJourneysScreen
            onNavigate={setCurrentScreen}
            savedJourneys={savedJourneys}
            onRemoveSaved={handleRemoveSaved}
            onRenameSaved={handleRenameSaved}
            onDownloadOffline={handleDownloadOffline}
            onOpenSaved={handleOpenSaved}
          />
        );
      case 'more':
      case 'settings':
        return (
          <MoreMenuScreen
            onNavigate={setCurrentScreen}
            accessibilitySettings={accessibilitySettings}
            offlineCount={offlinePackages.length}
            savedCount={savedJourneys.length}
          />
        );
      case 'accessibility':
      case 'language':
        return (
          <AccessibilityScreen
            onNavigate={setCurrentScreen}
            settings={accessibilitySettings}
            onUpdateSettings={(newSettings) =>
              setAccessibilitySettings((prev) => ({ ...prev, ...newSettings }))
            }
            savedCount={savedJourneys.length}
          />
        );
      case 'offline-downloads':
      case 'offline-journey':
        return (
          <OfflineDownloadsScreen
            onNavigate={setCurrentScreen}
            packages={offlinePackages}
            onRemovePackage={handleRemovePackage}
            onOpenPackage={handleOpenOffline}
            savedCount={savedJourneys.length}
          />
        );
      case 'data-preferences':
        return (
          <DataPreferencesScreen
            onNavigate={setCurrentScreen}
            settings={accessibilitySettings}
            onUpdateSettings={(newSettings) =>
              setAccessibilitySettings((prev) => ({ ...prev, ...newSettings }))
            }
            offlineCount={offlinePackages.length}
            savedCount={savedJourneys.length}
          />
        );
      case 'report-issue':
      case 'report-received':
        return (
          <ReportIssueScreen
            onNavigate={setCurrentScreen}
            selectedRank={selectedRank}
            savedCount={savedJourneys.length}
          />
        );
      case 'help-faq':
        return (
          <HelpFaqScreen
            onNavigate={setCurrentScreen}
            savedCount={savedJourneys.length}
          />
        );
      case 'about':
        return (
          <AboutScreen
            onNavigate={setCurrentScreen}
            savedCount={savedJourneys.length}
          />
        );
      case 'sources-data':
        return (
          <SourcesDataScreen
            onNavigate={setCurrentScreen}
            savedCount={savedJourneys.length}
          />
        );
      case 'clear-data':
        return (
          <ClearDataScreen
            onNavigate={setCurrentScreen}
            savedCount={savedJourneys.length}
            offlineCount={offlinePackages.length}
            onClearData={handleClearData}
          />
        );
      default:
        return (
          <HomeDashboardScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            onUpdateSearchParams={handleUpdateSearchParams}
            commuter={commuter}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onStartTrip={handleStartTrip}
            savedCount={savedJourneys.length}
          />
        );
    }
  };

  return (
    <MoreMenuProvider
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      onOpenProfile={() => setIsProfileModalOpen(true)}
      onSignOut={handleSignOut}
    >
    <div className="min-h-[100dvh] bg-[#f7f6f2] flex flex-col font-sans overflow-x-hidden">
      
      <div className="flex-1 flex justify-center items-start">
        <main className="w-full max-w-md bg-[#f7f6f2] min-h-[100dvh] relative shadow-sm overflow-x-hidden">
          
          {isDeviceFrame && (
            <div className="pt-3 px-6 flex items-center justify-between text-xs font-semibold text-[#0d1747] select-none bg-[#f7f6f2]">
              <span>08:10</span>
              <div className="w-20 h-4 bg-[#1e2337] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <span className="w-4 h-2 border border-[#0d1747] rounded-xs inline-block relative before:absolute before:inset-0.5 before:bg-[#0d1747]" />
              </div>
            </div>
          )}

          
          <div className="w-full min-h-[100dvh]">{renderActiveScreen()}</div>
        </main>
      </div>

      
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        commuter={commuter}
        onUpdateCommuter={handleUpdateCommuter}
        onSignOut={handleSignOut}
        onNavigate={setCurrentScreen}
      />
    </div>
    </MoreMenuProvider>
  );
}
