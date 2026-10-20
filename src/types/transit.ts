export type ScreenId =
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'sign-in'
  | 'create-profile'
  | 'home-dashboard'
  | 'journey-map'
  | 'journey-filter'
  | 'route-directory'
  | 'welcome'
  | 'journey-planner'
  | 'journey-results'
  | 'journey-steps'
  | 'route-map'
  | 'taxi-directory'
  | 'taxi-details'
  | 'report-issue'
  | 'report-received'
  | 'saved-journeys'
  | 'settings'
  | 'accessibility'
  | 'language'
  | 'clear-data'
  | 'more'
  | 'about'
  | 'offline-downloads'
  | 'offline-journey'
  | 'data-preferences'
  | 'sources-data'
  | 'help-faq'
  | 'family-sharing'
  | 'pair-viewer'
  | 'sharing-consent'
  | 'sharing-active'
  | 'approved-viewer'
  | 'updates-paused';

export interface CommuterUser {
  fullName: string;
  mobileNumber: string;
  metroCardNumber: string;
  isLoggedIn: boolean;
  cardBalance: number;
  savedRoutes: string[];
  loadSheddingAlerts: boolean;
  email?: string;
}

export interface RouteStop {
  id: string;
  name: string;
  time?: string;
  isTerminal?: boolean;
  lat?: number;
  lng?: number;
}

export interface MetroRoute {
  id: string;
  letter: string;
  title: string;
  origin: string;
  destination: string;
  via: string;
  direction: 'northbound' | 'southbound' | 'west' | 'east';
  interval: string;
  fare: string;
  serviceWindow: string;
  stopsCount: number;
  stops: RouteStop[];
  color: string;
  distanceKm: number;
  durationMinutes: number;
  nearbyTaxis: { stop: string; ranks: string }[];
}

export interface JourneyOption {
  id: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  fare: string;
  fareType: string;
  crowding: 'Seats available' | 'Moderate standing' | 'Low' | 'High';
  crowdingColor: string;
  badge?: 'RECOMMENDED' | 'NEXT DEPARTURE' | 'LATER OPTION' | 'DIRECT BUS (NO TRANSFER)';
  badgeStyle?: string;
  origin: string;
  destination: string;
  transfersCount: number;
  transferDetails: string;
  busLine: string;
  walkingMinutesBefore: number;
  walkingMinutesAfter: number;
  isDirect?: boolean;
  steps: {
    type: 'walk' | 'bus' | 'taxi';
    title: string;
    duration: string;
    instruction: string;
    time?: string;
    distance?: string;
    details?: string;
  }[];
}

export interface TaxiRank {
  id: string;
  name: string;
  destination: string;
  fareStatus: 'indicative' | 'unconfirmed';
  fareRange: string;
  source: string;
  lastReviewed: string;
  isDemo: boolean;
  description?: string;
  popularDestinations: string[];
  boardingTips: string;
  connectingBus: string;
}

export interface SavedJourney {
  id: string;
  title: string;
  origin: string;
  destination: string;
  fare: string;
  durationMinutes: number;
  dateSaved: string;
  scheduledTime: string;
  isOfflineDownloaded: boolean;
  snapshot?: JourneyOption;
}

export interface OfflinePackage {
  id: string;
  title: string;
  sizeKb: number;
  downloadDate: string;
  origin: string;
  destination: string;
  fare: string;
  durationMinutes: number;
  snapshot?: JourneyOption;
}

export interface PastTrip {
  id: string;
  origin: string;
  destination: string;
  fare: string;
  durationMinutes: number;
  scheduledTime: string;
  busLine?: string;
  endedAt: string;
  endedDate: string;
}

export interface ReportItem {
  id: string;
  rankName: string;
  reason: string;
  note: string;
  timestamp: string;
  referenceNumber: string;
}

export interface JourneySearchParams {
  fromLocation: string;
  toLocation: string;
  leaveDate: string;
  leaveTime: string;
  whenType: 'Depart at' | 'Arrive by';
  preferences: string;
  maxTransfers?: string;
  walkingPreference?: string;
  includeBusCorridors?: boolean;
}

export interface AppAccessibilitySettings {
  textSize: '100%' | '115%' | '130%';
  highContrast: boolean;
  reduceMotion: boolean;
  darkMode: boolean;
  language: 'English' | 'Afrikaans' | 'isiZulu' | 'Sesotho';
  lowDataMode: boolean;
  downloadOnlyWifi: boolean;
}

export interface FamilySharingState {
  isSharingActive: boolean;
  activeViewer: string;
  secondsRemaining: number;
  journeyTitle: string;
  lastUpdated: string;
  locationStatus: 'Connected' | 'Paused' | 'Off';
  accuracy: string;
  simulatedCoords: string;
}
