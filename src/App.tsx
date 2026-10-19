import React, { useState } from 'react';
import {
  ScreenId,
  CommuterUser,
  JourneySearchParams,
  JourneyOption,
  MetroRoute,
  TaxiRank,
  SavedJourney,
  OfflinePackage,
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
import { TaxiDirectoryScreen } from './components/screens/TaxiDirectoryScreen';
import { TaxiRankDetailsScreen } from './components/screens/TaxiRankDetailsScreen';
import { RouteDirectoryScreen } from './components/screens/RouteDirectoryScreen';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('onboarding-1');
  const [isDeviceFrame] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Commuter Profile State (starts clean so user can insert information)
  const [commuter, setCommuter] = useState<CommuterUser>({
    fullName: '',
    mobileNumber: '',
    metroCardNumber: '',
    isLoggedIn: false,
    cardBalance: 124.5,
    savedRoutes: [],
    loadSheddingAlerts: true,
  });

  // Active Journey Search Parameters (flowing seamlessly across screens)
  const [searchParams, setSearchParams] = useState<JourneySearchParams>({
    fromLocation: 'Park Station',
    toLocation: 'Rosebank Mall',
    leaveDate: '2026-10-19',
    leaveTime: 'Wed, 14 Oct · 08:10',
    whenType: 'Depart at',
    preferences: 'Bus + walking · fewest transfers',
  });

  // Selected Journey Itinerary for Map
  const [selectedJourney, setSelectedJourney] = useState<JourneyOption | null>(null);

  // Selected Taxi Rank for Details / Reporting
  const [selectedRank, setSelectedRank] = useState<TaxiRank | null>(null);

  // Saved Journeys State
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>([
    {
      id: 'sj-1',
      title: 'Morning Work Commute',
      origin: 'Park Station',
      destination: 'Rosebank Mall',
      fare: 'R18.00',
      durationMinutes: 46,
      dateSaved: '14 Oct 2026',
      scheduledTime: '08:10 – 08:56',
      isOfflineDownloaded: true,
    },
  ]);

  // Offline Download Packages State
  const [offlinePackages, setOfflinePackages] = useState<OfflinePackage[]>([
    {
      id: 'pkg-1',
      title: 'Corridor A: Park Station to Rosebank',
      sizeKb: 840,
      downloadDate: '14 Oct 2026',
      origin: 'Park Station',
      destination: 'Rosebank Mall',
      fare: 'R18.00',
      durationMinutes: 46,
    },
  ]);

  // Accessibility & Preferences State
  const [accessibilitySettings, setAccessibilitySettings] = useState<AppAccessibilitySettings>({
    textSize: '100%',
    highContrast: false,
    reduceMotion: false,
    language: 'English',
    lowDataMode: false,
    downloadOnlyWifi: true,
  });

  const handleUpdateSearchParams = (params: Partial<JourneySearchParams>) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
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
    setCurrentScreen('onboarding-1');
  };

  const handleSelectRouteForPlan = (route: MetroRoute) => {
    setSearchParams((prev) => ({
      ...prev,
      fromLocation: 'Park Station',
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
      setAccessibilitySettings({
        textSize: '100%',
        highContrast: false,
        reduceMotion: false,
        language: 'English',
        lowDataMode: false,
        downloadOnlyWifi: true,
      });
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
          />
        );
      case 'journey-map':
        return (
          <JourneyMapScreen
            onNavigate={setCurrentScreen}
            searchParams={searchParams}
            selectedJourney={selectedJourney}
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
            onUpdatePackage={handleUpdatePackage}
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
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex flex-col font-sans">
      {/* Main App Container */}
      <div className="flex-1 flex justify-center items-start">
        <main className="w-full max-w-md bg-[#f7f6f2] min-h-screen relative shadow-sm">
          {/* Simulated Mobile Status Bar if in Device Frame */}
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

          {/* Active Screen Content */}
          <div className="w-full">{renderActiveScreen()}</div>
        </main>
      </div>

      {/* Profile & MetroCard Top-up Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        commuter={commuter}
        onUpdateCommuter={handleUpdateCommuter}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
